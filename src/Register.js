import React from 'react';
import './styles/Login.css';
import { Card, Form, Input, Button, message } from 'antd';
import md5 from 'md5';
import { withRouter } from 'react-router-dom';
import { conf } from './conf.js';

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  async handleSubmit(data) {
    const REGISTER_SUCCESS = 0;
    const REGISTER_FAILED = 1;
    let result = await fetch(`${conf.server}/user_system/register`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({
        username: data.username,
        password: md5(data.password),
      })
    }).then(response => response.json());
    if (result.code === REGISTER_FAILED) {
      message.error(result.msg);
    } else if (result.code === REGISTER_SUCCESS) {
      message.success(result.msg);
      setTimeout(() => { this.props.history.push('/login'); }, 1000);
    }
  }
  handleFailed(error) {
    console.log(error);
  }
  render() {
    return (
      <Card
        title="注册"
        className="middle-card"
      >
        <Form
          name="register-form"
          wrapperCol={{span: 16, offset: 1}}
          labelCol={{span: 5}}
          onFinish={this.handleSubmit}
          onFinishFailed={this.handleFailed}
        >
          <Form.Item
            key="username"
            label="账号"
            name="username"
            rules={[
              {
                required: true,
                message: '请输入用户名！'
              },
              {
                type: "string"
              }
            ]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item
            key="password"
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
            key="confirmPassword"
            label="确认密码"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              {
                required: true,
                message: '请输入密码！'
              },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject('两次输入的密码不一致！');
                },
              }),
            ]}
          >
            <Input placeholder="请再次输入密码" type="password" />
          </Form.Item>
          <Form.Item
            wrapperCol={{span: 2, offset: 9}}
            style={{margin: "30px auto 0"}}
          >
            <Button type="primary" htmlType="submit">注册</Button>
          </Form.Item>
        </Form>
      </Card>
    )
  }
}

export default withRouter(Register);