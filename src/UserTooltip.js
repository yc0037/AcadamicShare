import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Empty, List, Divider, Button, Avatar, message, Popover } from 'antd';
import { UserOutlined, PlusOutlined, SearchOutlined, CheckOutlined } from '@ant-design/icons';
import { conf } from './conf.js';
import { request, wordTrunc } from './utils.js';

export default class UserTooltip extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      otherInfo: {
        username: '',
        email: '',
        profile: '',
        follow: [],
        like: []
      },
      buttonType: 'primary',
      buttonWord: <><PlusOutlined />关注</>,
      handleClick: () => {},
    };
    
    this.followUser = this.followUser.bind(this);
    this.delFollow = this.delFollow.bind(this);
  }
  async componentDidMount() {
    const { otherInfo: username, userInfo } = this.props;
    const res = await request(`${conf.server}/user_system/get_others_info?username=${username}`);
    if (res.code === 0) {
      this.setState({otherInfo: res});
    } else {
      message.error(res.message);
    }
    const otherInfo = this.state.otherInfo;
    let buttonType = 'primary';
    let buttonWord = <><PlusOutlined />关注</>;
    let handleClick;
    handleClick = this.followUser;
    if (userInfo?.follow.includes(otherInfo.username)) {
      buttonType = 'default';
      buttonWord = <><CheckOutlined />已关注</>;
      handleClick = this.delFollow;
    }
    this.setState({
      buttonType,
      buttonWord,
      handleClick,
    });
  }
  async followUser() {
    const res = await request(`${conf.server}/user_system/add_fo`, {
      method: 'POST',
      header: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({
        follow: this.state.otherInfo.username
      })
    });
    if (res.code === 0) {
      message.success(res.msg);
      this.setState({
        buttonType: 'default',
        buttonWord: <><CheckOutlined />已关注</>,
        handleClick: this.delFollow,  
      });
      this.props.updateLogin();
    } else {
      message.error(res.msg);
    }
  }
  async delFollow() {
    const res = await request(`${conf.server}/user_system/delete_fo`, {
      method: 'POST',
      header: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({
        follow: this.state.otherInfo.username
      })
    });
    if (res.code === 0) {
      message.success(res.msg);
      this.setState({
        buttonType: 'primary',
        buttonWord: <><PlusOutlined />关注</>,
        handleClick: this.followUser,
      });
      this.props.updateLogin();
    } else {
      message.error(res.msg);
    }
  }
  render() {
    const { userInfo, children } = this.props;
    const { otherInfo, buttonType, buttonWord, handleClick } = this.state;
    const styles = {
      div: {
        width: '300px',
      },
      title: {
        fontSize: '20px',
        fontWeight: 'bold'
      },
      profile: {
        color: '#aaaaaa'
      },
      flexBottom: {
        display: 'flex',
        alignItems: 'flex-start'
      }
    }
    const content = (
      <div style={styles.div}>
        <Row style={styles.flexBottom}>
          <Col span={14}>
            <Row>
              <Link
                to={`/userinfo?username=${otherInfo.username}`}
                style={styles.title}
              >
                {otherInfo.username}
              </Link>
            </Row>
            <Row>
              <span style={styles.profile}>{wordTrunc(otherInfo.profile, 20)}</span>
            </Row>
          </Col>
          <Col className="flex-push">
            {
              function() {
                if (userInfo === null) {
                  return null;
                }
                if (userInfo.username === otherInfo.username) {
                  return null;
                }
                return(
                  <Button
                    type={buttonType}
                    onClick={handleClick}
                  >{buttonWord}</Button>
                );
              }()
            }
          </Col>
        </Row>
      </div>
    )
    return (
      <Popover content={content}>
        { children }
      </Popover>
    );
  }
}