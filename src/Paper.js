import ReactDOM from 'react-dom';
import React from 'react'
import { Link } from 'react-router-dom';
import { Layout, Switch,Button,List,Space} from 'antd';
import {
  EditOutlined,UserOutlined,FieldTimeOutlined,MessageOutlined
} from '@ant-design/icons';
import './styles/paper.css'
import Demo from './paperRoot.js' 
import moment from 'moment';
import "moment/locale/zh-cn";
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
    url:'./Speech.pdf',
    id:null,
    discussionList:[
      {id:3,creater:'Tom',title:' is required for an anchor to be keyboard accessible. Provide a valid, navigable address as the href value. If you cannot provide an href, but still need the element to resemble a link, use a button and change it with appropriate styles. Learn more:',creatTime:"2020-11-08T12:12:12+08:00",replyNumber:30},
      {id:3,creater:'Tom',title:'rrrrrrrr',creatTime:"2020-11-08T12:12:12+08:00",replyNumber:30},
      {id:3,creater:'Tom',title:'ssible. Provide a v',creatTime:"2020-11-08T12:12:12+08:00",replyNumber:30},
      {id:3,creater:'Tom',title:'f attribute is required for an',creatTime:"2020-11-08T12:12:12+08:00",replyNumber:30},
      {id:3,creater:'Tom',title:'//github.com/evcohen/esl',creatTime:"2020-11-08T12:12:12+08:00",replyNumber:30}
    ],
    list:[{x:0.5,y:0.5,page:1,status:0,id:"HanHan",comment:"abc",like:3,dislike:2,liked:null,time:'2010-1-23'},
    {x:0.4,y:0.4,page:1,status:0,id:"JanHan",comment:"abc",like:5,dislike:2,liked:null,time:'2010-12-3'},
    {x:0.6,y:0.6,page:1,status:0,id:"KanKan",comment:"abc",like:4,dislike:2,liked:null,time:'2010-12-3'}]
    }
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
  console.log(GetRequest(this.props.location.search)['id'])
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
    <Layout className="site-layout" style={{ marginLeft: siderWidth ,minHeight:'100vh'}}>
      
    <Content style={{  overflow: 'initial' }}>
    {this.state.start==false?<><div style={{background:'#f0f0f0',fontSize:'20px'}}>The href attribute is required for an anchor to be keyboard accessible.</div>
    <div style={{background:'#f0f0f0',fontSize:'20px',textAlign:'center'}}>相关讨论</div>
    <List 
    
    pagination={{
    onChange: page => {
      console.log(page);
    },
    pageSize: 1
    }}
    itemLayout="horizontal"
    style={{top:'20px',left:siderWidth/2+'px',width:5*siderWidth+'px'}}
    dataSource={data}
    itemLayout="vertical"
    renderItem={item => (
      <List.Item
      key={item.title}
      actions={[
        <IconText icon={UserOutlined } text={item.creater} key="list-vertical-star-o" />,
        <IconText icon={FieldTimeOutlined} text={moment(item.creatTime, 'YYYY-MM-DD, HH:mm:ss').format('YYYY-MM-DD HH:mm')} key="list-vertical-like-o" />,
        <IconText icon={MessageOutlined} text={item.replyNumber} key="list-vertical-message" />,
      ]}>
        <List.Item.Meta
         
          title={<Link to={`/discuss?id=${this.state.id}`}>{item.title}</Link>}
          
        />
        </List.Item>
    )}
  /></>:<Demo width={width} globalState={this.state.globalState} changeState={this.changeState.bind(this)}
        url={this.state.url} list={this.state.list} record={this.record.bind(this)}/>}
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
/*ReactDOM.render( <PaperLayout/>,
document.getElementById('root')
)*/
