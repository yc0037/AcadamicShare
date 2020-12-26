import {  Button ,Input} from 'antd';
import {
    CloseOutlined 
  } from '@ant-design/icons';
import Draggable from 'react-draggable';
import React from 'react'

let sTop,cWidth,cHeight
class NoteWriting extends React.Component {
  
  componentWillMount(){
     sTop=document.documentElement.scrollTop
     cWidth=document.body.clientWidth
     cHeight = document.body.clientHeight
  }
  render() {
    
    console.log(document.getElementById('test2'))
    
    const { TextArea } = Input;
    let style={
      position:'absolute',
      top:sTop,
      left: cWidth/4,
      background: '#fff',
      borderRadius: '3px',
      fontSize:'2em',
      width:'200px',
      zIndex:50 ,
      boxShadow:'2px 2px 2px 2px #888888'  
    }
    let cursorStyle={
      width:'200px',
      height:'20px',
      margin:0,
      padding:0,
      background: '#F2F2F2',
      borderRadius: '3px'
    }
    let clickStyle={
      float:'right',
      background:'red',
      width:20,
      height:20,
      
    }
    return (
      <Draggable
      axis="both"
      handle="strong"
      bounds=".site-layout"
      >
      <div className="handle" style={style}>
      <strong className="cursor" >
          <div style={cursorStyle}></div>
      </strong>
      <TextArea style={{margin:'3px 5px 5px 5px',fontsize: 'x-small'}}showCount maxLength={100} value={this.props.comment}
      onChange={(e)=>this.props.changeComment(e,this.props.editIndex)}/>
      <Button size='small' style={{float:'right'}} onClick={()=>this.props.deleteButton(this.props.editIndex)}>取消</Button>
      <Button size='small' type="primary" style={{float:'right'}} onClick={()=>this.props.finishComment(this.props.editIndex)}>确定</Button>       
      </div>
      </Draggable> 
    );
  }
  func(e){
      console.log(e) 
      //this.handleDrag(e)
  }
  }
export default NoteWriting