import { Popover, Button } from 'antd';
import React, { Fragment } from 'react'
import {
    EnvironmentOutlined
  } from '@ant-design/icons';
//import './sty.css'
import Note from './paperNote'

class CommentButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          visible:false,
          x:this.props.x
        }
    }

  hide() {
    if(this.props.status!==2){
    this.setState({
      visible: !this.state.visible,
    });}
  };
  
  handleVisibleChange = visible => {
    this.setState({ visible });
  };
  
  render() {
    let sty={
      position:'absolute',
      left:this.props.x-10+'px',
      top:this.props.y-10+'px', color:'blue',
      opacity:0.5,
      color:this.props.status==2?'red':'blue'
    }
    
    
    return (
      
    <Fragment>{
      <Popover className="test3"
        content={
          <Fragment>
          <Note  x={this.props.x} y={this.props.y} page={this.props.page}status={this.props.status}
           comment={this.props.comment} id={this.props.id} time={this.props.time}
            like={this.props.like} dislike={this.props.dislike} liked={this.props.liked} hitLikeButton={this.props.hitLikeButton}
          />
          </Fragment>
        }
        trigger='contextMenu'
        visible={this.props.globalState===2?false:this.state.visible}
        onVisibleChange={this.handleVisibleChange}
      >
        <Button style={sty} type="dashed"  size="small" shape="circle" icon={<EnvironmentOutlined />}
        onClick={this.props.globalState===2?null:(
        this.props.status===2?()=>this.props.edit(this.props.x,this.props.y,this.props.page):(e)=>this.hide(e))}
        >
        </Button>
      </Popover>
    }
    </Fragment>
    );
  } 
}
export default CommentButton;
