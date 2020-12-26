import React from 'react'
import { Link } from 'react-router-dom'
import { Table, Input, Button, Space } from 'antd'
import { Form, Select } from 'antd'
import { Spin, Tooltip } from 'antd'
import { Tag } from 'antd'
//import Highlighter from 'react-highlight-words'
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons'
import { PauseCircleOutlined, PlusSquareOutlined, PauseCircleFilled, PlusSquareFilled } from '@ant-design/icons'
import { SearchOutlined, FileTextOutlined, CommentOutlined } from '@ant-design/icons'
import url from 'url'

const backend_url='http://localhost:8000/data/search/papers/?'

const keywordNames = [ "Keywords", "Tags", "Authors" ]
const rangeNames = [ "PublishTime", "UpdateTime" ]

const ShowingResult = (props) => {
  const columns = [
	{
	  title: <MakeResultTypeField/>,
	  dataIndex: 'type',
	  render: text => text==='paper'?
		<div style={{ background: '#5a7' }}>论文</div>:
		<div style={{ background: '#abf' }}>讨论</div>,
	  width: '7%',
	},
	{
	  title: <MakeSearchInputField columnName='Keywords'/>,
	  dataIndex: 'title',
	  render: (text, record) => (
		<Link to={(record.type==='paper'?'/paper':'/discuss')+'?id='+record.id}>
		  {text}<br/>{record['abstract']}
		</Link> ),
	  width: '45%',
	},
	{
	  title: <MakeSearchInputField columnName='Tags'/>,
	  dataIndex: 'tags',
	  render: (text) => text.map( (tag, index) =>
		<Tag color={colorMap.get(tag)} key={index}>
		  <a href={'/search?TagsEntire='+tag}>{tag}</a>
		</Tag> ),
	  width: '14%',
	},
	{
	  title: <MakeSearchInputField columnName='Authors'/>,
	  dataIndex: 'authors',
	  width: '14%'
	},
	{
	  title: <MakeSearchRangeField columnName='PublishTime'
								   display={props.display['PublishTime']}
								   openClose={props.openClose} />,
	  dataIndex: 'publishtime',
	  width: '10%',
	},
	{
	  title: <MakeSearchRangeField columnName='UpdateTime'
								   display={props.display['UpdateTime']}
								   openClose={props.openClose} />,
	  dataIndex: 'updatetime',
	  width: '10%',
	  //sorter: (a,b) => a.age-b.age //排序，默认的有些问题，待实现
	},
  ]
  //console.log(props.display)
  return <Table columns={columns}
				dataSource={props.data}
				scroll={{ y: 430/*646*/ }} />
}

const colorMap = {
  colormap: {},
  colors: ['red','volcano','orange','gold','yellow','lime',
		   'green','cyan','blue','geekblue','purple','magenta'],
  get: function(tag) {
	if(!(tag in this.colormap))
	  this.colormap[tag]=this.colors[(Object.keys(this.colormap).length*7+11)%12]
	//this.colors[Math.floor(Math.random()*12)]
	//'#'+Math.floor(Math.random()*4096).toString(16)
	return this.colormap[tag]
  }
}

//渲染表单输入框：论文还是讨论
const MakeResultTypeField = (props) => (
  <Form.Item name="Type">
	<Select optionLabelProp="label">
	  <Select.Option label={<SearchOutlined />} value="">全部</Select.Option>
	  <Select.Option label={<FileTextOutlined />} value="paper">论文</Select.Option>
	  <Select.Option label={<CommentOutlined />} value="discussion">讨论</Select.Option>
	</Select>
  </Form.Item>
)

//渲染表单输入框：字符串类型的搜索条件
const MakeSearchInputField = (props) => (
  <Form.List name={props.columnName}>
	{(fields, { add, remove }) => (
	  <>
		<Space size='middle' style={{ display: 'flex', marginBottom: 8 }} align="baseline">
		  {/*加号：增加一项*/}
		  <PlusCircleOutlined onClick={() => add({ type: '0' })} />
		  {/*add的参数是Select的初始值，用initialValue或defaultValue都会出错，调了好久*/}
		  {/*搜索条件的名称*/}
		  {props.columnName}
		</Space>
		{/*搜索条件的每一项*/}
		{fields.map(field => 
		  <Space style={{ display: 'flex', marginBottom: 8 }} align="baseline" key={field.key} >
			{/*减号：删除一项*/}
			<MinusCircleOutlined onClick={() => remove(field.name)} />
			{/*keyword：字符串，用于匹配*/}
			<Form.Item {...field}	style={{ marginBottom: 0 }}	name={[field.name, 'keyword']} >
			  <Input style={{ minWidth: '80px' }}/>
			</Form.Item>
			{/*type：0~3，匹配类型*/}
			<Form.Item {...field} style={{ marginBottom: 0 }}	name={[field.name, 'type']}>
			  {/*加载页面时的初始值 initialValue="0" 不能用*/}
			  <Select optionLabelProp="label" style={{ width: '80px' }}>{/*defaultValue="0" 增删一项时的初始值，不能用*/}
				<Select.Option value="0" label={<PauseCircleOutlined />}>搜每个词</Select.Option>
				<Select.Option value="1" label={<PlusSquareOutlined />}>搜整句</Select.Option>
				<Select.Option value="2" label={<PauseCircleFilled />}>避开词</Select.Option>
				<Select.Option value="3" label={<PlusSquareFilled />}>避开整句</Select.Option>
			  </Select>
			</Form.Item>
		  </Space>
		)}
	  </>
	)}
  </Form.List>
)

//字符串处理。把输入的日期转成我的格式
function parseDate(str)
{
  if(!str)return ''
  str=str.trim()
  let match=str.match(/\d{4}(\.\d{1,2}){0,2}/)
  if(!match||str!==match[0])return ''
  str=str.replace(/\.(\d)(?=\.|$)/g,'.0$1')
  if(str.match('00'))return ''
  return str
}

function checkDateRange(start,end)
{
  let len=Math.min(start.length,end.length)
  return start.substr(0,len)<=end.substr(0,len)
}

//渲染表单输入框：范围类型的搜索条件 //目前所有都是日期范围
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
				   rules={[ ({ getFieldValue }) => ({ validator(rule, value) { 
					 if(!value)return Promise.resolve()
					 value=parseDate(value)
					 if(!value)return Promise.reject('请仿照2021.1.1输入时间')
					 let value2=parseDate(getFieldValue(props.columnName+'End'))
					 if(value2&&!checkDateRange(value,value2))return Promise.reject('起始时间晚于截止时间')
					 return Promise.resolve()
				   }, }), ]}>
		  <Input placeholder="不早于"/>
		</Form.Item>
		<Form.Item style={{ marginBottom: 8 }} name={props.columnName+'End'}
				   rules={[ ({ getFieldValue }) => ({ validator(rule, value) {
					 //跟上面的代码很像，我想设法重用代码，但传的参数比较多，不是很懂js =>的用法，没有实现
					 if(!value)return Promise.resolve()//可以为空
					 value=parseDate(value)//不符合格式就返回空字符串
					 if(!value)return Promise.reject('请仿照2021.1.1输入时间')
					 let value2=parseDate(getFieldValue(props.columnName+'Start'))//另一个可以为空
					 if(value2&&!checkDateRange(value2,value))return Promise.reject('起始时间晚于截止时间')
					 return Promise.resolve()//符合要求
				   }, }), ]}>
		  <Input placeholder="不晚于"/>
		</Form.Item>
	  </Tooltip>
	</div>
  </>
)


//字符串处理、表单处理
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
		fetch(backend_url+this.makeHTTPGETstring(event.state))//向后端发送请求
		  .then(response => response.json())
		//必须要上一行因为.json()返回的是一个pending的promise什么的，只能读一次，直接给setstate会出错，要then一下
		  .then(json => this.setState({ loading: false, data: json }))//页面状态变为：加载完成
	  }

	//没有 http get 参数，初始化空的搜索页
	if(!Object.keys(url.parse(this.props.location.search, true).query).length){
	  window.history.replaceState({},'新的搜索')
	}
	else{//如果网址中带有 http get 参数，解析网址。假想用例：用户从收藏夹中打开的网址、分享的网址
	  this.formInitialValues=
		this.parseHTTPGETstring(
		  url.parse(this.props.location.search, true).query)
	  window.history.replaceState(this.formInitialValues,'新的搜索')
	}
  }

  componentDidMount() {
	//因为有setstate和网络请求，所以放在componentDidMount
	if(this.formInitialValues) {
	  this.setState({ loading: true })//页面状态变为：加载中
	  fetch(backend_url+this.makeHTTPGETstring(this.formInitialValues))//向后端发送请求
	  //用自己生成的 get 请求过滤非法参数
		.then(response => response.json())
		.then(json => this.setState({ loading: false, data: json }))//页面状态变为：加载完成
	}
  }

  //按下搜索键
  onFinish = values => {
	console.log('Received values of form:', JSON.stringify(values))
	let query=this.makeHTTPGETstring(values)
	//pushstate：不重新加载页面，但可以更改网址。本代码里所有window.开头的的函数都是用于实现这个功能的
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
	let keywords = str.toString().split(',')
	//toString既可以把数字转成字符串，也可以把列表转成逗号分隔的字符串
	for(let i=0;i<keywords.length;i++)
	  if(keywords[i])
		r.push({ keyword: decodeURIComponent(keywords[i]), type: num+'' })
	return r
  }

  //字符串处理。把 http get 参数转成表单的值
  parseHTTPGETstring = (query) => {
	//console.log(query)
	let r = { Type: '' }
	if(query.Type==='paper'||query.Type==='discussion')
	  r.Type=query.Type
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
		r[name+'Start']=parseDate(ends[0])
		r[name+'End']=parseDate(ends[1])
	  }
	}
	//console.log(r)
	return r
  }

  //字符串处理。把表单的值转成 http get 参数
  makeHTTPGETstring = (values) => {
	let query = ''
	if(values.Type)query+='&Type='+values.Type
	for(let name of keywordNames)
	  if(values[name])
	{
	  //console.log(values[name])
	  let s = ['','','','']
	  for(let x of values[name])
		if(x.keyword)//应该不需要这一行，但不知道为什么有时候会出现undefined，不知道怎么复现，有bug
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
		let display=state.display
		display[name]=true
		return { display: display }
	  })
	}
	//console.log(query.substring(1))
	return query.substring(1)
  }

  //下放给 rangefield 的回调函数，用于显示、折叠输入框
  openClose = (name) => {
	console.log('rangefield按下了按钮',this.state)
	if(this.state.display[name])
	{//已经展开：收起，清空内容
	  this.formRef.current.setFields([
		{ name:name+'Start', value:'' },
		{ name:name+'End', value:'' }
	  ])
	  this.setState((state)=>{
		let display=state.display
		display[name]=false
		return { display: display }
	  })
	}
	else
	{//已经收起：展开
	  this.setState((state)=>{
		let display=state.display
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
			开始搜索
		  </Button>
		  {this.state.loading && <Spin size="large"/>}
		</Space>
		<ShowingResult display={this.state.display} openClose={this.openClose}
					   data={this.state.loading?[]:this.state.data} />
	  </Space>
	</Form>
  )
}
