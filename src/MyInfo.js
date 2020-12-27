import React from 'react';
import './styles/UserInfo.css';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Input, Button, message, Divider, List } from 'antd';
import { MailOutlined, EditOutlined, CheckOutlined } from '@ant-design/icons';
import { conf } from './conf.js';
import { wordTrunc } from './utils.js';
import { request, LoadingMask } from './utils.js';

export default class MyInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: {
        username: '',
        email: '',
        profile: '',
        follow: [],
        subscribe: []
      },
      loading: false,
      followList: [],
      key: '用户',
      public: true,
      profileValue: '',
      profileEdit: false,
      emailValue: '',
      emailEdit: false
    }
  }

  async componentDidMount() {
    if (this.props.userInfo === null) {
      message.error('请先登录！');
      this.props.history.replace('./login');
      return null;
    }
    const userInfo = await request(`${conf.server}/user_system/get_my_info`);
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
      console.log(followList)
    }
    this.setState({
      userInfo,
      loading: userInfo === null,
      followList,
      profileValue: userInfo.profile,
      emailValue: userInfo.email,
    });
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
      if (this.state.userInfo !== null && Array.isArray(this.state.userInfo.subscribe)) {
        data = this.state.userInfo.subscribe;
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
            <div className="profile">
              {
                this.state.profileEdit ?
                <div className="flex">
                  <Input
                    value={this.state.profileValue}
                    onChange={e => this.setState({
                      profileValue: e.target.value,
                    })}
                  />
                  <Button 
                    type="text"
                    className="text-button"
                    onClick={async e => {
                      const response = await request(`${conf.server}/user_system/set_my_info`, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json;charset=utf-8'
                        },
                        body: JSON.stringify({
                          ...this.state.userInfo,
                          profile: this.state.profileValue,
                        })
                      });
                      if (response?.code === 0) {
                        message.success(response.msg);
                        this.setState(state => ({
                          userInfo: {
                            ...state.userInfo,
                            profile: this.state.profileValue,
                          }
                        }));
                      }
                      this.setState({
                        profileEdit: false,
                      });
                    }}
                  >
                    <CheckOutlined />
                  </Button>
                </div>
                :
                <>
                  {wordTrunc(userInfo.profile, 30)}
                  <Button 
                    type="text"
                    className="text-button"
                    onClick={e => this.setState({profileEdit: true})}
                  >
                    <EditOutlined />
                  </Button>
                </>
              }
            </div>
            <div className="info-item flex-push">
              {
                this.state.emailEdit ?
                <div className="flex">
                  <Input
                    value={this.state.emailValue}
                    onChange={e => this.setState({
                      emailValue: e.target.value,
                    })}
                  />
                  <Button 
                    type="text"
                    className="text-button"
                    onClick={async e => {
                      const response = await request(`${conf.server}/user_system/set_my_info`, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json;charset=utf-8'
                        },
                        body: JSON.stringify({
                          ...this.state.userInfo,
                          email: this.state.emailValue,
                        })
                      });
                      if (response?.code === 0) {
                        message.success(response.msg);
                        this.setState(state => ({
                          userInfo: {
                            ...state.userInfo,
                            email: this.state.emailValue,
                          }
                        }));
                      }
                      this.setState({
                        emailEdit: false,
                      });
                    }}
                  >
                    <CheckOutlined />
                  </Button>
                </div>
                :
                <>
                  <MailOutlined style={{ marginRight: '10px' }} />
                  <a href={`mailto:${userInfo.email}`}>{userInfo.email}</a>
                  <Button 
                    type="text"
                    className="text-button"
                    onClick={e => this.setState({emailEdit: true})}
                  >
                    <EditOutlined />
                  </Button>
                </>
              }
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