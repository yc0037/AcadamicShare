import { Switch } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import './styles/NavBar.css';

export default class NavBar extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      login: false,
    }

    this.openDropdown = this.openDropdown.bind(this);
    this.closeDropdown = this.closeDropdown.bind(this);
  }

  openDropdown(e) {
    const dropdown = document.querySelector('.nav-dropdown');
    dropdown.style.display = 'block';
  }

  closeDropdown(e) {
    const dropdown = document.querySelector('.nav-dropdown');
    dropdown.style.display = 'none';
  }

  render() {
    const userInfo = this.props.userInfo;
    return (
      <div className="nav-bar flex">
        <Link to="/" className="nav-logo">LOGO</Link>
        <div className="flex-push" style={{width: "30px", marginRight: "30px"}}>
          <Switch checked={this.state.login} onChange={(checked) => {
            this.setState({ login: checked });
          }} />
        </div>
        <div>
          {
            this.state.login ?
            <>
              <div
                className="nav-item withdropdown"
                onMouseEnter={this.openDropdown}
                onMouseLeave={this.closeDropdown}
              >
                <div>{userInfo?.userName}</div>
                <div className="nav-dropdown">
                  <div>个人主页</div>
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