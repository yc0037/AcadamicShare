import React from 'react'
import { Table, Input, Button, Space } from 'antd'
import { Form, Select } from 'antd'
import { Spin, Tooltip } from 'antd'
//import Highlighter from 'react-highlight-words'
//import { SearchOutlined } from '@ant-design/icons'
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons'
import url from 'url'

const backend_url='http://localhost:8000/data/search/papers/?'

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

const keywordNames = [ "Name", "Address" ]//global ?
const rangeNames = [ "Age" ]

const ShowingResult = (props) => {
  console.log(props.display)
  const tmp=<MakeSearchRangeField columnName='Age'
								   display={props.display['Age']}
								   openClose={props.openClose}/>
  const columns = [
	{
	  title: <MakeSearchInputField columnName='Name'/>,
	  dataIndex: 'name',
	  width: '30%',
	},
	{
	  title: <MakeSearchInputField columnName='Address'/>,
	  dataIndex: 'address',
	},
	{
	  title: tmp,
	  dataIndex: 'age',
	  width: '15%',
	  //sorter: (a,b) => a.age-b.age
	},
  ]
  return <Table columns={columns}
				dataSource={props.data}
				scroll={{ y: 300/*646*/ }} />
}

//字符串处理。把输入的日期转成我的格式
function parseDate(str)
{
  if(!str)return ''
  str=str.trim()
  var match=str.match(/\d{4}(\.\d{1,2}){0,2}/)
  if(!match||str!==match[0])return ''
  str=str.replace(/\.(\d)(?=\.|$)/g,'.0$1')
  if(str.match('00'))return ''
  return str
}

function compareDate(start,end)
{
  var len=start.length<end.length?start.length:end.length
  return start.substr(0,len)<=end.substr(0,len)
}



//渲染表单输入框：字符串类型的搜索条件
const MakeSearchInputField = (props) => (
  <Form.List name={props.columnName}>
	{(fields, { add, remove }) => (
	  <>
		<Space style={{ display: 'flex', marginBottom: 8 }} align="baseline">
		  {/*搜索条件的名称*/}
		  {props.columnName}
		  {/*加号：增加一项*/}
		  <PlusCircleOutlined onClick={() => add()} />
		</Space>
		{/*搜索条件的每一项*/}
		{fields.map(field => 
		  <Space style={{ display: 'flex', marginBottom: 8 }} align="baseline">
			{/*keyword：字符串，用于匹配*/}
			<Form.Item {...field}	style={{ marginBottom: 0 }}	name={[field.name, 'keyword']} >
			  <Input/>
			</Form.Item>
			{/*type：0~3，匹配类型*/}
			<Form.Item {...field} style={{ marginBottom: 0 }}	name={[field.name, 'type']}
					   >{/*加载页面时的初始值 initialValue="0" 有个bug但我想不起来了*/}
			  <Select defaultValue="0">{/*增删一项时的初始值*/}
				<Select value="0">搜索关键词</Select>
				<Select value="1">搜索整句</Select>
				<Select value="2">避开关键词</Select>
				<Select value="3">避开整句</Select>
			  </Select>
			</Form.Item>
			{/*减号：删除一项*/}
			<MinusCircleOutlined onClick={() => remove(field.name)} />
		  </Space>
		)}
	  </>
	)}
  </Form.List>
)

//渲染表单输入框：范围类型的搜索条件
const MakeSearchRangeField = (props) => (
  <>
	<Space style={{ display: 'flex', marginBottom: 8 }} align="baseline">
	  {props.columnName}
	  <PlusCircleOutlined style={props.display?{transform:'rotate(45deg)'}:{}}
						  onClick={() => props.openClose(props.columnName)} />
	</Space>
	<div style={{ display: props.display ? 'flex' : 'none' }}>
	  <Tooltip title="时间格式：2021.1.1" placement="bottomLeft">
		<Form.Item style={{ marginBottom: 8 }} name={props.columnName+'Start'}
				   rules={[
					 ({ getFieldValue }) => ({
					   validator(rule, value) {
						 if(!value)return Promise.resolve()
						 value=parseDate(value)
						 if(!value)return Promise.reject('请仿照2021.1.1输入时间')
						 var value2=parseDate(getFieldValue(props.columnName+'End'))
						 if(value2&&!compareDate(value,value2))
						   return Promise.reject('起始时间晚于截止时间')
						 return Promise.resolve()
					   },
					 }),
				   ]}>
		  <Input placeholder="不早于"/>
		</Form.Item>
		<Form.Item style={{ marginBottom: 8 }} name={props.columnName+'End'}
				   rules={[
					 ({ getFieldValue }) => ({
					   validator(rule, value) {
						 if(!value)return Promise.resolve()
						 value=parseDate(value)
						 if(!value)return Promise.reject('请仿照2021.1.1输入时间')
						 var value2=parseDate(getFieldValue(props.columnName+'Start'))
						 if(value2&&!compareDate(value2,value))
						   return Promise.reject('起始时间晚于截止时间')
						 return Promise.resolve()
					   },
					 }),
				   ]}>
		  <Input placeholder="不晚于"/>
		</Form.Item>
	  </Tooltip>
	</div>
  </>
)

export default class Search extends React.Component {

  //一开始进入页面
  constructor(props) {
    super(props)
	this.state = { loading: false, display: {} }

	//设置 htmlDOM 的函数，可以在浏览器 前进、回退 的时候自动填充表单
	if(!window.onpopstate)
	  window.onpopstate = event => {
		//console.log(event)
		if(this.formRef.current)
		  this.formRef.current.setFieldsValue(event.state)
		this.setState({ loading: true })//页面状态变为：加载中
		fetch(backend_url+this.makeHTMLGETstring(event.state))//向后端发送请求
		  .then(response => response.json())
		//必须要上一行因为.json()返回的是一个pending的promise什么的，只能读一次，直接给setstate会出错，要then一下
		  .then(json => this.setState({ loading: false, data: json }))//页面状态变为：加载完成
	  }

	//没有 html get 参数，初始化空的搜索页
	if(!Object.keys(url.parse(this.props.location.search, true).query).length){
	  window.history.replaceState({},'新的搜索')
	}
	else{//如果网址中带有 html get 参数，解析网址。假想用例：用户从收藏夹中打开的网址、分享的网址
	  this.formInitialValues=
		this.parseHTMLGETstring(
		  url.parse(this.props.location.search, true).query)
	  window.history.replaceState(this.formInitialValues,'新的搜索')
	}
  }

  componentDidMount() {
	if(this.formInitialValues) {
	  this.setState({ loading: true })//页面状态变为：加载中
	  fetch(backend_url+this.makeHTMLGETstring(this.formInitialValues))//向后端发送请求
	  //用自己生成的 get 请求过滤非法参数
		.then(response => response.json())
		.then(json => this.setState({ loading: false, data: json }))//页面状态变为：加载完成
	}
  }

  //按下搜索键
  onFinish = values => {
	console.log('Received values of form:', JSON.stringify(values))
	let query=this.makeHTMLGETstring(values)
	//pushstate：不重新加载页面，但可以更改网址。本代码里所有window.开头的的函数都是实现这个功能的
	window.history.pushState(values,'新的搜索','?'+query)
	this.setState({ loading: true })//页面状态变为：加载中
	fetch(backend_url+query)					//向后端发送请求
	  .then(response => response.json())
	  .then(json => this.setState({ loading: false, data: json }))//页面状态变为：加载完成
  }

  formRef = React.createRef()

  //字符串处理。把用逗号隔开的字符串转成数组
  split = (str,num) => {
	if(!str)return []
	let r = []
	let keywords = str.split(',')
	for(let i=0;i<keywords.length;i++)
	  if(keywords[i])
		r.push({keyword:decodeURIComponent(keywords[i]),type:num+''})
	return r
  }

  //字符串处理。把 html get 参数转成表单的值
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
	  if(ends.length===2)
	  {
		r[name+'Start']=ends[0]
		r[name+'End']=ends[1]
	  }
	}
	//console.log(r)
	return r
  }

  //字符串处理。把表单的值转成 html get 参数
  makeHTMLGETstring = (values) => {
	let query = ''
	for(let name of keywordNames)
	  if(values[name])
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
	  if(values[name+'Start']||values[name+'End'])
	{
	  query+='&'+name+'='+
		(values[name+'Start']?values[name+'Start']:'')+'-'+
		(values[name+'End']?values[name+'End']:'');
	  this.setState((state) => {
		console.log('parsehtml',this.state)
		let display=state.display
		display[name]=true
		return { display: display }
	  },()=>	  console.log('parsehtml',this.state))
	  console.log('parsehtml',this.state)
	}
	console.log(query.substring(1))
	return query.substring(1)
  }

  //下放给 rangefield 的回调函数
  openClose = (name) => {
	console.log(this.state)
	if(this.state.display[name])
	{
	  this.formRef.current.setFields([
		{ name:name+'Start', value:'' },
		{ name:name+'End', value:'' }
	  ])
	  this.setState((state)=>{
		var display=state.display
		display[name]=false
		return { display: display }
	  })
	}
	else
	{
	  this.setState((state)=>{
		var display=state.display
		display[name]=true
		return { display: display }
	  })
	}
  }

  render = () => (
	<Form ref={this.formRef}
		  name="dynamic_form_nest_item" onFinish={this.onFinish}
		  initialValues={this.formInitialValues} autoComplete="off">
	  <Space direction="vertical" style={{padding:"10px 10%"}}>
		<Space>
		  <Button type="primary" htmlType="submit">
			Submit
		  </Button>
		  {this.state.loading && <Spin size="large"/>}
		</Space>
		<ShowingResult display={this.state.display} openClose={this.openClose}
					   data={this.state.loading?[]:this.state.data} />
	  </Space>
	</Form>
  )
}
