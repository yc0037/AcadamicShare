import React from 'react';
import './styles/Login.css';
import { Card, Form, Input, Button, message } from 'antd';
import { withRouter } from 'react-router-dom';
import md5 from 'md5';
import { conf } from './conf.js';
import { request } from './utils.js';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(data) {
    const LOGIN_SUCCESS = 0;
    const LOGIN_FAILED = 1;
    request(`${conf.server}/user_system/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({
        username: data.username,
        password: data.password,
      })
    }).then(result => {
      if (result?.code === LOGIN_FAILED) {
        message.error(result.msg);
      } else if (result?.code === LOGIN_SUCCESS) {
        message.success(result.msg);
        this.props.updateLogin();
        setTimeout(() => { 
          this.props.history.replace('/');
        }, 1000);
      }
    });
  }
  handleFailed(error) {
    console.log(error);
  }
  render() {
    return (
      <Card
        title="登录"
        className="middle-card"
      >
        <Form
          name="login-form"
          wrapperCol={{span: 16, offset: 1}}
          labelCol={{span: 5}}
          requiredMark={false}
          onFinish={this.handleSubmit}
          onFinishFailed={this.handleFailed}
        >
          <Form.Item
            label="账号"
            name="username"
            rules={[{
              required: true,
              message: '请输入用户名！'
            }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            rules={[{
              required: true,
              message: '请输入密码！'
            }]}
          >
            <Input placeholder="请输入密码" type="password" />
          </Form.Item>
          <Form.Item
            wrapperCol={{span: 2, offset: 9}}
            style={{margin: "30px auto 0"}}
          >
            <Button type="primary" htmlType="submit">登录</Button>
          </Form.Item>
        </Form>
      </Card>
    )
  }
}

export default withRouter(Login);