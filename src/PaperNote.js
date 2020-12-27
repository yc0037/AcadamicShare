import React, { createElement } from 'react';
import { Comment, Tooltip } from 'antd';
import { DislikeOutlined, LikeOutlined, DislikeFilled, LikeFilled } from '@ant-design/icons';
//import './sty.css'

const Note = (props) => {
  const like = () => {
    if(props.liked==='liked')
        props.hitLikeButton(props.x,props.y,props.page,props.like-1,props.dislike,null)
    if(props.liked==='disliked')
        props.hitLikeButton(props.x,props.y,props.page,props.like+1,props.dislike-1,'liked')
    if(props.liked===null)
        props.hitLikeButton(props.x,props.y,props.page,props.like+1,props.dislike,'liked')
  };

  const dislike = () => {
    if(props.liked==='disliked')
    props.hitLikeButton(props.x,props.y,props.page,props.like,props.dislike-1,null)
    if(props.liked==='liked')
        props.hitLikeButton(props.x,props.y,props.page,props.like-1,props.dislike+1,'disliked')
    if(props.liked===null)
        props.hitLikeButton(props.x,props.y,props.page,props.like,props.dislike+1,'disliked')
  };

  const actions = [
    <Tooltip key="comment-basic-like" title="Like">
      <span onClick={props.status===0?like:null}>
        {createElement(props.liked === 'liked' ? LikeFilled : LikeOutlined)}
        <span className="comment-action">{props.like}</span>
      </span>
    </Tooltip>,
    <Tooltip key="comment-basic-dislike" title="Dislike">
      <span onClick={props.status===0?dislike:null}>
        {React.createElement(props.liked === 'disliked' ? DislikeFilled : DislikeOutlined)}
        <span className="comment-action">{props.dislike}</span>
      </span>
    </Tooltip>,
  ];

  return (
    <Comment
      actions={actions}
      author={<a>{props.id}</a>}
      content={
        <p>
          {props.comment} 
        </p>
      }
      datetime={
        <Tooltip >
          <span>{props.time}</span>
        </Tooltip>
      }
    />
  );
};
export default Note
