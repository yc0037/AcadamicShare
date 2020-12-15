import React from 'react'
import { Table, Input, Button, Space } from 'antd';
import { Form, Select } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { Spin } from 'antd';
//import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import url from 'url'

const data = [];
for (let i = 10; i < 406; i++) {
//for (let i = 0; i < 1000000; i++) {
  data.push({
    key: i,
    name: `Edward King ${i}`,
    age: 32+0.1*i,
    address: `London, Park Lane no. ${i}`,
  });
}

const keywordNames = [ "Name", "Address" ];//global ?
const rangeNames = [ "Age" ];


export default class Search extends React.Component {
  constructor(props) {
    super(props);

	if(!window.onpopstate)
	  window.onpopstate = event => {
		console.log(event)
		//console.log(this.formRef)
		//暂时不能修改form中的值，待修复//已修复！！
		if(this.formRef.current)
		  this.formRef.current.setFieldsValue(event.state)
		this.setState({ loading: true })
		fetch('data/Search?'+this.makeHTMLGETstring(event.state)).
		  then(response => {
			console.log(response)
			setTimeout(()=>{this.setState({ loading: false, data: data })},3000)
		  })
	  }

	console.log(url.parse(this.props.location.search, true).query)
	if(!Object.keys(url.parse(this.props.location.search, true).query).length){
	  window.history.replaceState({},'新的搜索')
	  this.state = { loading: false }
	}
	else{
	  this.formInitialValues=
		this.parseHTMLGETstring(
		  url.parse(this.props.location.search, true).query)
	  window.history.replaceState(this.formInitialValues,'新的搜索')
	  this.state = { loading: true }
	  fetch('data/Search?'+this.makeHTMLGETstring(this.formInitialValues)).
		then(response => {
		  console.log(response)
		  //this.state.data=response.json()
		  setTimeout(()=>{
			this.setState({ loading: false, data: [] })
		  },3000)
		})
	}
  }

  onFinish = values => {
	console.log('Received values of form:', JSON.stringify(values));
	let query=this.makeHTMLGETstring(values)
	window.history.pushState(values,'新的搜索','?'+query)
	this.setState({ loading: true })
	fetch('data/Search?'+query).
	  then(response => {
		console.log(response)
		setTimeout(()=>{
		  this.setState({ loading: false, data: data.slice(100) })
		},3000)
	  })
  }

  formRef = React.createRef();

  split = (str,num) => {
	if(!str)return []
	let r = []
	let keywords = str.split(',')
	for(let i=0;i<keywords.length;i++)
	  if(keywords[i])
		r.push({keyword:decodeURIComponent(keywords[i]),type:num+''})
	return r
  }

  parseHTMLGETstring = (query) => {
	let r = {}
	for(let name of keywordNames)
	{
	  r[name]=[]
	  r[name].push(...this.split(query[name],0))
	  r[name].push(...this.split(query[name+'Entire'],1))
	  r[name].push(...this.split(query[name+'Avoid'],2))
	  r[name].push(...this.split(query[name+'AvoidEntire'],3))
	}
	for(let name of rangeNames)
	  if(query[name])
	{
	  let ends=query[name].split('-')
	  if(ends.length==2)
	  {
		r[name]={}
		r[name][name+'Start']=ends[0]
		r[name][name+'End']=ends[1]
	  }
	}
	// console.log(query)
	console.log(r)
	return r
  }

  makeHTMLGETstring = (values) => {
	let query = ''
	for(let name of keywordNames)
	{
	  let s = ['','','','']
	  for(let x of values[name])
		s[parseInt(x.type)]+=','+encodeURIComponent(x.keyword)
	  if(s[0])query+='&'+name+'='+s[0].substring(1)
	  if(s[1])query+='&'+name+'Entire='+s[1].substring(1)
	  if(s[2])query+='&'+name+'Avoid='+s[2].substring(1)
	  if(s[3])query+='&'+name+'AvoidEntire='+s[3].substring(1)
	}
	for(let name of rangeNames)
	  if(values[name])
		query+='&'+name+'='+
	  (values[name][name+'Start']?values[name][name+'Start']:'')+'-'+
	  (values[name][name+'End']?values[name][name+'End']:'');
	console.log(query.substring(1))
	return query.substring(1)
  }

  makeSearchInputField = columnName => (
	<Form.List name={columnName}>
	  {(fields, { add, remove }) => (
		<>
		  <Space style={{ display: 'flex', marginBottom: 8 }} align="baseline">
			{columnName}
			<PlusCircleOutlined onClick={() => add()} />
		  </Space>
		  {fields.map(field =>
			<Space style={{ display: 'flex', marginBottom: 8 }} align="baseline">
			  <Form.Item
				{...field}
				style={{ marginBottom: 0 }}
				name={[field.name, 'keyword']}
			  >
				<Input/>
			  </Form.Item>
			  <Form.Item
				{...field}
				style={{ marginBottom: 0 }}
				name={[field.name, 'type']}
			  >
				<Select defaultValue="0">
				  <Select value="0">搜索关键词</Select>
				  <Select value="1">搜索整句</Select>
				  <Select value="2">避开关键词</Select>
				  <Select value="3">避开整句</Select>
				</Select>
			  </Form.Item>
			  <MinusCircleOutlined onClick={() => remove(field.name)} />
			</Space>
		  )}
		</>
	  )}
	</Form.List>
  )

  makeSearchRangeField = columnName => (
	<Form.List name={columnName}>
	  {(fields, { add, remove }) => (
		<>
		  <Space style={{ display: 'flex', marginBottom: 8 }} align="baseline">
			{columnName}
			<PlusCircleOutlined onClick={() => add()} />
		  </Space>
		  {fields.map(field =>
			<Space style={{ display: 'flex', marginBottom: 8 }} align="baseline">
			  <Form.Item
				{...field}
				style={{ marginBottom: 0 }}
				name={[field.name, 'keyword']}
			  >
				<Input/>
			  </Form.Item>
			  <Form.Item
				{...field}
				style={{ marginBottom: 0 }}
				name={[field.name, 'type']}
			  >
				<Select defaultValue="0">
				  <Select value="0">搜索关键词</Select>
				  <Select value="1">搜索整句</Select>
				  <Select value="2">避开关键词</Select>
				  <Select value="3">避开整句</Select>
				</Select>
			  </Form.Item>
			  <MinusCircleOutlined onClick={() => remove(field.name)} />
			</Space>
		  )}
		</>
	  )}
	</Form.List>
  )

  render() {
	const columns = [
	  {
		title: this.makeSearchInputField('Name'),
		dataIndex: 'name',
		width: '30%',
	  },
	  {
		title: this.makeSearchRangeField('Age'),
		dataIndex: 'age',
		width: '20%',
		sorter: (a,b) => a.age-b.age
	  },
	  {
		title: this.makeSearchInputField('Address'),
		dataIndex: 'address',
	  },
	];

	return<Form ref={this.formRef}
				name="dynamic_form_nest_item" onFinish={this.onFinish}
				initialValues={this.formInitialValues} autoComplete="off">
			<Table columns={columns}
				   dataSource={this.state.loading?[]:this.state.data}
				   scroll={{ y: 646 }}
				   style={{padding:"0px 10%"}}/>
			{this.state.loading?<Spin size="large"/>:<></>}
			<Button type="primary" htmlType="submit">
			  Submit
			</Button>
		  </Form>;
  }
}
