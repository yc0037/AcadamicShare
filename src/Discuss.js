<<<<<<< Updated upstream
import { Comment, Tooltip, Avatar } from 'antd';
=======
import { Comment, Tooltip, Avatar , Input,Form,Button} from 'antd';
>>>>>>> Stashed changes
import moment from 'moment';
import { DislikeOutlined, LikeOutlined, DislikeFilled, LikeFilled } from '@ant-design/icons';
import {List } from 'antd';
import React  from 'react';
import { Card } from 'antd';
<<<<<<< Updated upstream

const data = [
  {
    actions: [<span key="comment-list-reply-to-0">Reply to</span>],
    author: 'test',
    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    content: (
      <p>
        test test test test test test test test test test.
        test test test test test test test.
        test test test test test test test test test test.
      </p>
    ),
    datetime: (
      <Tooltip
        title={moment()
          .subtract(1, 'days')
          .format('YYYY-MM-DD HH:mm:ss')}
      >
        <span>
          {moment()
            .subtract(1, 'days')
            .fromNow()}
        </span>
      </Tooltip>
    ),
  },
  {
    actions: [<span key="comment-list-reply-to-0">Reply to</span>],
    author: ' test',
    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    content: (
      <p>
        test test test test test test test test test test.
        test test test test test test test.
        test test test test test test test test test test.
      </p>
    ),
    datetime: (
      <Tooltip
        title={moment()
          .subtract(2, 'days')
          .format('YYYY-MM-DD HH:mm:ss')}
      >
        <span>
          {moment()
            .subtract(2, 'days')
            .fromNow()}
        </span>
      </Tooltip>
    ),
  },
];

export default class Paper extends React.Component 
{  
  
  state = 
  {
    likes: 0,
    dislikes: 0,
    action: null,
  };

  like = () => 
  {
    this.setState(
      {
      likes: 1,
      dislikes: 0,
      action: 'liked',
      });
  };

  dislike = () => {
    this.setState({
      likes: 0,
      dislikes: 1,
      action: 'disliked',
    });
  };

  render() {
    const { likes, dislikes, action } = this.state;
    const actions = [
      <span key="comment-basic-like">
        <Tooltip title="Like">
          {React.createElement(action === 'liked' ? LikeFilled : LikeOutlined, {
            onClick: this.like,
          })}
        </Tooltip>
        <span className="comment-action">{likes}</span>
      </span>,
      <span key=' key="comment-basic-dislike"'>
        <Tooltip title="Dislike">
          {React.createElement(action === 'liked' ? DislikeFilled : DislikeOutlined, {
            onClick: this.dislike,
          })}
        </Tooltip>
        <span className="comment-action">{dislikes}</span>
      </span>,
      <span key="comment-basic-reply-to">Reply to</span>,
    ];
    return (
      <Comment
        actions={actions}
        author={<a>Han Solo</a>}
        avatar={
          <Avatar
            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
            alt="Han Solo"
          />
        }
        content={
          <p>
            We supply a series of design principles, practical patterns and high quality design
            resources (Sketch and Axure), to help people create their product prototypes beautifully
            and efficiently.
          </p>
        }
        datetime={
          <Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
            <span>{moment().fromNow()}</span>
          </Tooltip>
        }
      />
    );
    
=======

const { TextArea } = Input;
const CommentList = ({ comments }) => 
(
  <List
    dataSource={comments}
    header={`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`}
    itemLayout="horizontal"
    renderItem={props => <Comment {...props} />}
  />
);
const Editor = ({ onChange, onSubmit, submitting, value }) => (
  <div>
    <Form.Item>
      <TextArea rows={4} onChange={onChange} value={value} />
    </Form.Item>
    <Form.Item>
      <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
        Add Comment
      </Button>
    </Form.Item>
  </div>
);
export default  class discussion extends React.Component {
  
    constructor(props) {
    super(props);
    this.state = {
      nComment: 0,
      CommentList: [],
      hotDiscussList: [],
      submitting: false,
      nLike: 0,
    };
  }
  
  state = 
  {
    nComment: [],
    submitting: false,
    value: '',
  };
  handleSubmit = () => {
    if (!this.state.value) {
      return;
    }
    this.setState({
      submitting: true,
    });
    setTimeout(() => {
      this.setState({
        submitting: false,
        value: '',
        comments: [
          {
            author: 'Han Solo',
            avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
            content: <p>{this.state.value}</p>,
            datetime: moment().fromNow(),
          },
          ...this.state.comments,
        ],
      });
    }, 1000);
  };
  handleChange = e => {
    this.setState({
      value: e.target.value,
    });
  };
  render() {
    const { comments, submitting, value } = this.state;
    return (
      <div>
        {comments.length > 0 && <CommentList comments={comments} />}
        <Comment
          avatar={
            <Avatar
              src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
              alt="Han Solo"
            />
          }
          content={
            <Editor
              onChange={this.handleChange}
              onSubmit={this.handleSubmit}
              submitting={submitting}
              value={value}
            />
          }
        />
      </div>
    );
>>>>>>> Stashed changes
  }
}
