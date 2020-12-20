import { Switch, Avatar, Input, Button, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import React from 'react';
import { Link } from 'react-router-dom';
import './styles/NavBar.css';
import { conf } from './conf.js';
import { request } from './utils.js';

const { Search } = Input;

export default class NavBar extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      searchKeyword: "",
    }

    this.openDropdown = this.openDropdown.bind(this);
    this.closeDropdown = this.closeDropdown.bind(this);
    this.changeSearchKeyword = this.changeSearchKeyword.bind(this);
  }

  openDropdown(e) {
    const dropdown = document.querySelector('.nav-dropdown');
    dropdown.style.display = 'block';
  }

  closeDropdown(e) {
    const dropdown = document.querySelector('.nav-dropdown');
    dropdown.style.display = 'none';
  }

  changeSearchKeyword(e) {
    this.setState({
      searchKeyword: e.target.value,
    });
  }

  render() {
    const userInfo = this.props.userInfo;
    const searchKeyword = this.state.searchKeyword;
    return (
      <div className="nav-bar flex">
        <Link to="/" className="nav-logo">LOGO</Link>
        <div className="flex-push nav-block">
          <Switch checked={this.props.login} onChange={this.props.handleSwitch} />
        </div>
        <div className="nav-block">
          <Search
            placeholder="请输入搜索关键词"
            value={searchKeyword}
            onChange={this.changeSearchKeyword}
            allowClear
            enterButton={
              <Button type="primary">
                <Link to={`/search?keyword=${searchKeyword}`} >搜索</Link>
              </Button>
            }
            size="default"
          />
        </div>
        <div className="nav-block" style={{minWidth: "100px"}}>
          {
            userInfo ?
            <>
              <div
                className="nav-item withdropdown"
                onMouseEnter={this.openDropdown}
                onMouseLeave={this.closeDropdown}
              >
                <div>
                  <Avatar
                    style={{ backgroundColor: '#40a9ff', marginRight: "10px" }}
                    size="small"
                    icon={<UserOutlined />}
                  />
                  {userInfo?.userName}
                </div>
                <div className="nav-dropdown">
                  <Button
                    type='text'
                    style={{ margin: 0, width: '100%' }}
                  >
                    <Link to="/myinfo">个人主页</Link>
                  </Button>
                  <Button
                    type='text'
                    style={{ margin: 0, width: '100%' }}
                    onClick={() => {
                      request(`${conf.server}/user_system/logout`)
                        .then(result => {
                          message.success(result.msg);
                          this.props.updateLogin();
                        });
                    }}
                  >退出登录</Button>
                </div>
              </div>
            </>
            :
            <>
              <Link to="/register"><span className="nav-item">注册</span></Link>
              <Link to="/login"><span className="nav-item">登录</span></Link>
            </>
          }
        </div>
      </div>
    );
  }
}