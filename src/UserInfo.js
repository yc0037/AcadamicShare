import React from 'react';
import './styles/UserInfo.css';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Divider, List, message } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { conf } from './conf.js';
import { wordTrunc } from './utils.js';
import { request, LoadingMask } from './utils.js';

export default class UserInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: {
        username: '',
        email: '',
        profile: '',
        follow: [],
        like: []
      },
      loading: false,
      followList: [],
      key: '用户',
    }
  }
  async componentDidMount() {
    const username = new URLSearchParams(this.props.location.search).get('username');
    const userInfo = await request(`${conf.server}/user_system/get_others_info?username=${username}`);
    let followList = [];
    if (userInfo !== null && Array.isArray(userInfo.follow)) { 
      followList = await Promise.all(userInfo.follow.map(v => (
        request(`${conf.server}/user_system/get_others_info?username=${v}`)
          .then(response => {
            if (response.hasOwnProperty('code') && response.code === 1) {
              return {
                username: v,
                exist: false
              };
            }
            return {
              exist: true,
              ...response
            };
          })
      )));
      this.setState({
        userInfo,
        loading: userInfo === null,
        followList: followList.filter(v => (v !== null)),
      });
    } else {
      message.error('用户不存在！');
      this.props.history.replace('/');
    }
  }

  onTabChange = (key) => {
    this.setState({ key });
  };

  render() {
    const { userInfo, loading } = this.state;
    const tabList = [
      {
        key: '用户',
        tab: '用户',
      },
      {
        key: '标签',
        tab: '标签',
      },
    ];

    const UserList = () => {
      return (
        <List
          itemLayout="horizontal"
          dataSource={this.state.followList}
          renderItem={item => (
            <List.Item>
              {
                item.exist ?
                <List.Item.Meta
                  title={<Link to={`/userinfo?username=${item.username}`}>{item.username}</Link>}
                  description={wordTrunc(item.profile, 30)}
                /> : 
                <List.Item.Meta
                  title={<span style={{ color: '#aaaaaa' }}>用户不存在</span>}
                />
              }
            </List.Item>
          )}
        />
      );
    }

    const TagList = () => {
      let data = [];
      if (this.state.userInfo !== null && Array.isArray(this.state.userInfo.like)) {
        data = this.state.userInfo.like;
      }
      return (
        <List
          itemLayout="horizontal"
          dataSource={data}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                title={item}
              />
            </List.Item>
          )}
        />
      );
    }
    
    const contentList = {
      用户: <UserList />,
      标签: <TagList />,
    };

    return (
      loading
      ? <LoadingMask />
      : (
        <Col span={18} offset={3} style={{ marginTop: '30px' }}>
          <Row className="flex">
            <h1>{userInfo.username}</h1>
            <div className="profile">{wordTrunc(userInfo.profile, 30)}</div>
            <div className="info-item flex-push">
              <MailOutlined style={{ marginRight: '10px' }} />
              <a href={`mailto:${userInfo.email}`}>{userInfo.email}</a>
            </div>
          </Row>
          <Divider style={{ margin: '0 0 30px' }} />
          <Row>
            <Card
              style={{ width: '100%' }}
              title={
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  margin: '10px 0'
                }} >关注</div>
              }
              tabList={tabList}
              activeTabKey={this.state.key}
              onTabChange={key => {
                this.onTabChange(key);
              }}
            >
              {contentList[this.state.key]}
            </Card>
          </Row>
        </Col>
      )
    )
  }
}