import React from 'react';
import { Link } from 'react-router-dom';
import './styles/NavBar.css';

export default class NavBar extends React.Component {
  constructor(props) {
    super(props);

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
        <div className="flex-push">
          {
            userInfo ?
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
              <span className="nav-item">注册</span>
              <span className="nav-item">登录</span>
            </>
          }
        </div>
      </div>
    );
  }
}