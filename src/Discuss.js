import {Comment, Tooltip, Avatar, Input, Button, Card, Tag, Space, Col} from 'antd';
import moment from 'moment';
import {DislikeOutlined, LikeOutlined, DislikeFilled, LikeFilled} from '@ant-design/icons';
import React from 'react';
import {Link} from 'react-router-dom'
import './styles/Discuss.css'

const dis_url = 'http://localhost:8000/discussion/get_dis?id='

export default class Paper extends React.Component {
  state =
    {
      text: '',
      papers: [],
      comment: {},
      title: '',
    };

  like = (id, number) => {
    fetch('http://localhost:8000/discussion/reco_up', {
      method: 'POST', body: JSON.stringify({
        id, number
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: "include"
    }).then(res => {
      this.getComment()
    })
  };

  addComment = (to, text) => {
    fetch('http://localhost:8000/discussion/reply', {
      method: 'POST', body: JSON.stringify({
        to, id: to, text
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: "include"
    }).then(res => {
      this.getComment()
    })
  }


  getComment = () => {
    fetch(dis_url + new URLSearchParams(this.props.location.search).get('id'), {
      credentials: "include"
    }).then(res => res.json()).then(res => {
      this.setState({comment: res || {}, text: '', title: ''})
      const {papers = []} = res
      Promise.all(papers.map(item => fetch('http://localhost:8000/paper/get?id=' + item).then(res => res.json())))
        .then(papers => this.setState({papers}))
    })
  }

  componentDidMount() {
    this.getComment()
  }

  render() {
    const {comment = {}, text, papers = [], title} = this.state;
    const {reply = []} = comment
    const [question = {}, ...replies] = reply
    return (
      <Col span={18} offset={3} style={{padding: 24}}>
        <Card
          className={'card'}
          title={<div><Space>{comment.title} {comment.tags && comment.tags.map(tag => <Link
            to={`/discenter?tag=${tag}`}><Tag
            color={'green'} style={{cursor: 'pointer'}}>{tag}</Tag></Link>)}</Space>
            <Button style={{float: 'right'}} onClick={() => {
              const ele = document.getElementsByTagName("html")[0];
              if (ele && ele.scrollHeight > ele.clientHeight) {
                //设置滚动条到最底部
                ele.scrollTop = ele.scrollHeight - 200;
              }
            }
            }>发布评论</Button></div>}>
          <div className={'dis-question'}>{question.text}</div>
        </Card>

        <Card className={'card'} style={{marginTop: 24}} title={<span>{comment.reply_n} 评论区</span>}>
          <div className={'discuss-content'}>{replies.map((item, index) => (
            <div className={'dis-reply'}>
              <div className={'flex-row'}>
                <Avatar
                  src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                />
                {item.name}
                <div style={{flex: 1}}></div>
                <span style={{color: 'grey'}}>{moment(item.time).format('YYYY-MM-DD HH:mm:ss')}</span>
              </div>
              <div style={{margin: '24px 0', whiteSpace: "pre-wrap"}}>{item.text}</div>
              <div>
                <Tooltip title="Like">
                  {React.createElement(LikeOutlined, {
                    onClick: () => this.like(comment.id, index + 1),
                  })}
                </Tooltip>
                <span className="comment-action">{item.reconumb}</span>
              </div>
            </div>
          ))}
          </div>
        </Card>


        <div className={'card'} style={{marginTop: 24, padding: '16px 16px 60px 16px'}}>
          <div className={'discuss-add'}>
            <Avatar
              src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
            />
            can you contribute to the discuss？
          </div>
          <div style={{marginTop: 16}}>
            <Input.TextArea value={text} onChange={e => this.setState({text: e.target.value})}/><br/>
            <Button type={'primary'} style={{marginTop: 16, float: 'right'}}
                    onClick={() => this.addComment(comment.id, text)}>Add Comment</Button>
          </div>
        </div>
        <Card
          className={'card'}
          style={{marginTop: 24}}
          title='相关论文'>
          {papers.filter(i => i).map(item => <div className={'dis-question'}><Tag>{item.id}</Tag>
            <Link to={`/paper?id=${item.id}`}>{item.name}</Link></div>)}
        </Card>
      </Col>
    );
  }
}
