import React from 'react';
import './styles/Login.css';
import { Card, Form, Input, Button } from 'antd';

export default class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userNameMsg: false,
    };
  }
  componentDidMount() {
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