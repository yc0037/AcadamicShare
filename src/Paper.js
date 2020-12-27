import React from 'react'
import { Link } from 'react-router-dom';
import { Layout, Switch,Button,List,Space} from 'antd';
import {
  EditOutlined,UserOutlined,FieldTimeOutlined,MessageOutlined
} from '@ant-design/icons';
import './styles/paper.css'
import Demo from './PaperRoot.js' 
import moment from 'moment';
import "moment/locale/zh-cn";
import { conf } from './conf.js';
import { request } from './utils.js';
moment.locale('zh-cn');

const { Header, Content, Footer, Sider } = Layout;
let width = document.body.clientWidth;
let siderWidth=width/8;
const IconText = ({ icon, text }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);
function GetRequest(search) { 
  var url = search; //获取url中"?"符后的字串 
  var theRequest = new Object(); 
  if (url.indexOf("?") != -1) { 
     var str = url.substr(1); 
     var strs = str.split("&"); 
     for(var i = 0; i < strs.length; i ++) { 
        theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]); 
     } 
  } 
  return theRequest; 
}
class Paper extends React.Component{
  constructor(props){
    super(props);

    this.state={
    globalState:-1,
    addDisable:true,
    start:false,
    name:null,
    url:null,
    len:0,
    discussionList:[],
    list:[]
    /*[{x:0.5,y:0.5,page:1,status:0,id:"HanHan",comment:"abc",like:3,dislike:2,liked:null,time:'2010-1-23'},
    {x:0.4,y:0.4,page:1,status:0,id:"JanHan",comment:"abc",like:5,dislike:2,liked:null,time:'2010-12-3'},
    {x:0.6,y:0.6,page:1,status:0,id:"KanKan",comment:"abc",like:4,dislike:2,liked:null,time:'2010-12-3'}]*/
    }
  }
  componentWillMount() {
    var id=GetRequest(this.props.location.search)['id'];
    request(`${conf.server}/paper/get?id=${id}`)
      .then(data => {
        if (data !== null) {
          let file=data.file.replace('\\','/')
          //console.log(file);
          this.setState({
            url: file,
            name:data.name
          });
          //console.log(this.state.name);
          request(`${conf.server}/discussion/get_related?tag=${this.state.name}`)
          .then(data => {
            if (data !== null) {
              this.setState({
                discussionList: data.dislist,
                len:data.ndis
              });
              //console.log(this.state.discussionList);
            }
          });
        }
      });
  }
  render(){
  const data = this.state.discussionList
  let buttonColor=['#1890ff','#096dd9']
  let iconColor=['white','yellow']
  let sty={
    background:buttonColor[this.state.globalState]
  }
  let sty2={
    color:iconColor[this.state.globalState],
    fontSize:'20px'
  } 
  //console.log(GetRequest(this.props.location.search)['id'])
  let len=this.state.len;
  return(
    
  <Layout style={{background:'black' }}>
    <Sider
      width={siderWidth+'px'}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
      }}
    >
    <Button type="primary" block='ture' 
    onClick={this.startRead.bind(this)}  
    >{this.state.start==false?'开始阅读':'返回'}
    </Button>
    {this.state.start==true&&
    <><Switch checkedChildren="开启" unCheckedChildren="关闭" defaultChecked ={false}
    onClick={this.clickShow.bind(this)} style={{margin:'10px 0'}}/>
    <Button type="primary" block='ture' style={sty}
    onClick={this.clickAdd.bind(this)} disabled={this.state.addDisable} icon={<EditOutlined style={sty2}/>}
    ></Button>
    </>}
    </Sider>
    <Layout className="site-layout" style={{ marginLeft: siderWidth ,minHeight:'90vh'}}>
      
      <Content style={{  overflow: 'initial' }}>
      {this.state.start==false?<><div style={{textAlign:'center',background:'#f0f0f0',fontSize:'30px'}}>{this.state.name}</div>
      <div style={{marginTop:'20px', background:'#f0f0f0',fontSize:'20px',textAlign:'center'}}>相关讨论</div>
      <List 
      pagination={{
      pageSize: 8
      }}
      itemLayout="horizontal"
      style={{top:'20px',left:siderWidth+'px',width:5*siderWidth+'px'}}
      dataSource={data}
      itemLayout="vertical"
      renderItem={item => (
        <List.Item
        style={{fontSize:'20px'}}
        key={item.title}
        actions={[
          <IconText icon={UserOutlined } text={item.creator} key="list-vertical-star-o" />,
          <IconText icon={FieldTimeOutlined} text={item.creatTime} key="list-vertical-like-o" />,
          <IconText icon={MessageOutlined} text={item.replyNumber} key="list-vertical-message" />,
        ]}>
          <List.Item.Meta
            title={<Link to={`/discuss?id=${item.id}`}>{item.title}</Link>}
          />
        </List.Item>
      )}
      /></>:<Demo width={width} globalState={this.state.globalState} changeState={this.changeState.bind(this)}
          url={this.state.url} list={this.state.list} record={this.record.bind(this)}/>
      }
      </Content>
      <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
    </Layout>
  </Layout>
  );
  }
  clickAdd(){
    if(this.state.globalState===0){
      this.setState({globalState:1})
    }
    else if(this.state.globalState===1){
      this.setState({globalState:0})
    }
  }
  clickShow(c,e){
    if(c===true){
      this.setState({globalState:0,addDisable:false})
    }
    else
    this.setState({globalState:-1,addDisable:true}) 
  }
  changeState(i){
    this.setState({globalState:i})
  }

  startRead(){
    if(this.state.start===true){
      this.setState({globalState:-1,addDisable:true})
    }
    this.setState({start:!this.state.start})
  }

  record(temList){
    this.setState({list:temList})
  }
}
export default Paper 
