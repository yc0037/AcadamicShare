import { Switch, Avatar, Input, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import React from 'react';
import { Link } from 'react-router-dom';
import './styles/NavBar.css';

const { Search } = Input;

export default class NavBar extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      login: false,
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
        <div className="flex-push nav-block" style={{width: "30px"}}>
          <Switch checked={this.state.login} onChange={(checked) => {
            this.setState({ login: checked });
          }} />
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
        <div className="nav-block" style={{width: "100px"}}>
          {
            this.state.login ?
            <>
              <div
                className="nav-item withdropdown"
                onMouseEnter={this.openDropdown}
                onMouseLeave={this.closeDropdown}
              >
                <div><Avatar style={{ backgroundColor: '#40a9ff', marginRight: "10px" }} size="small" icon={<UserOutlined />} />{userInfo?.userName}</div>
                <div className="nav-dropdown">
                  <div>退出登录</div>
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