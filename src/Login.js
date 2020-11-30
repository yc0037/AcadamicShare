import React from 'react';
import './styles/Login.css';
import { Card, Form, Input, Button } from 'antd';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(data) {
    console.log(data);
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