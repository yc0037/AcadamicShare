import React from 'react';
import {
  Document,
  Page
} from 'react-pdf';
import { pdfjs } from 'react-pdf';
//import Pd from './Speech.pdf'

import CommentButton from './PaperButton'
import NoteWriting from './NoteWriting'
//import './sty.css'
import moment from 'moment';
import { conf } from './conf.js';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

let width = document.body.clientWidth;
    let pageWidth=width*2/3
class Demo extends React.Component {
  constructor(props){
    super(props);
    
    this.state = {
      page: 1,
      current: 1,
      total: 1,
      id:"   ",
      list:this.props.list,
      editIndex:0,
      cHeight:0
      
    }
  }
  onLoadSuccess= ({numPages}) => {
    
    this.setState({ total:numPages });
  };
  
  nextPage() {
    const page = this.state.page + 1;
    this.setState({
      page: page,
      current: page
    });
  }
  onChange(page) {
    this.setState({
      page: page,
    });
  }
  pdfChange = page => {
    this.setState({
      page: page,
      current: page
    });
  };
  componentWillUnmount(){
    this.props.record(this.state.list)
  }
  render() {
    let url=this.props.url.split(/[/.]/)[1]
    let Pd=require("../../as/file/"+url+".pdf").default
    let paperLeft=(7/8-2/3)/2;
    let sty={
      backgroundcolor:"black",
      width:pageWidth+'px',
      left:paperLeft*100-1+'%',
      position:"relative",
      margin:'5px 5px 5px 5px',
      cursor:this.props.globalState==1?'pointer':null
    }
    let sty2={
      width:width*7/8+'px',
      backgroundColor:'rgb(49, 46, 46)',
      position: 'relative', 
      overflow:'hidden',
      fontSize: 'xx-small'
    }
    const item=[];
    let i=1;
    //console.log(this.props.globalState)
    if(document.getElementById('div1')!=null){this.state.cHeight=document.getElementById('div1').clientHeight;}
    while(i<=this.state.total)
    {
      {let j=i;
      item.push(<div   style={sty} id={'div'+j} key={j} onClick={(e)=>this.addButton(j,e)}> 
      <Page className='test4' pageNumber={j} renderTextLayer={false} renderAnnotationLayer={false}width={pageWidth} />
      {
        this.props.globalState!==-1&&
        this.state.list.map((item,index)=>{
          if(item.status!==-1&&item.page===i) 
          return(<CommentButton x={item.x*pageWidth} y={item.y*this.state.cHeight} status={item.status} page={item.page} id={item.id}
            comment={item.comment} like={item.like} dislike={item.dislike} liked={item.liked} time={item.time}
            iditIndex={this.state.editIndex} edit={this.edit.bind(this)} globalState={this.props.globalState}
            deleteButton={this.deleteButton.bind(this)}
            addComment = {this.addComment.bind(this)}
            changeComment={this.changeComment.bind(this)}
            finishComment={this.finishComment.bind(this)}
            hitLikeButton={this.hitLikeButton.bind(this)}
            />
          );else return null;
        })
      }
      </div>)
      }
      i++;
    }
    
    return (
    < div className="test2" id='test2' style={sty2} onClick={()=>this.stopAdd()}>
     {this.props.globalState===2&&<NoteWriting editIndex={this.state.editIndex} changeComment={this.changeComment.bind(this)}
     comment={this.state.comment} deleteButton={this.deleteButton.bind(this)} finishComment={this.finishComment.bind(this)}
     closeComment={this.closeComment.bind(this)}/>}
      <Document
        file={Pd}
        onLoadSuccess={this.onLoadSuccess}
      > 
      { item}
      </Document>        
    </div>
    )
  }

  addButton(i,e){
    if(this.props.globalState===1&&e.target.className==='react-pdf__Page__canvas'){
      this.setState(
      {list:[...this.state.list,{x:e.nativeEvent.offsetX/pageWidth,y:e.nativeEvent.offsetY/this.state.cHeight,status:2,page:i ,
        id:this.state.id ,comment:'',like:0,dislike:0,liked:null,time:moment().format('YYYY-MM-DD')}]}
    )}
  }

  deleteButton(index){
    let temList=this.state.list
    temList[index].status=-1;//temList.splice(index,1)
    this.setState(
      {list:temList}
    )
    this.props.changeState(0);
  }

  addComment(x,y,page){
    let temList=this.state.list
    this.state.list.forEach((item,index)=>{
      if(item.x===x/pageWidth&&item.y===y/this.state.cHeight&&item.page===page)
      temList[index].status=2;
    })
    this.setState(
      {list:temList}
    )
  }

  finishComment(index){
    let temList=this.state.list
    temList[index].status=1
    this.setState(
      {list:temList}
    )
    this.props.changeState(0);
  }

  closeComment(){
    this.props.changeState(0);
  }

  changeComment(e,index){
    let temList=this.state.list
    temList[index].comment=e.target.value
    this.setState(
      {list:temList,comment:e.target.value}
    )
  }

  hitLikeButton(x,y,page,like,dislike,liked){
    let temList=this.state.list
    this.state.list.forEach((item,index)=>{
      if(item.x===x/pageWidth&&item.y===y/this.state.cHeight&&item.page===page){
      temList[index].like=like;
      temList[index].dislike=dislike;
      temList[index].liked=liked;
      }
    })
    this.setState(
      {list:temList}
    )
  }

  edit(x,y,page){
    this.state.list.forEach((item,index)=>{
      if(item.x===x/pageWidth&&item.y===y/this.state.cHeight&&item.page===page)
    this.setState({editIndex:index,comment:item.comment})
      })
    this.props.changeState(2);
  }

  stopAdd(){
    if(this.props.globalState===1)
    this.props.changeState(0)
  }
}

export default Demo;
