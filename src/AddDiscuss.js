import React from 'react';
import './styles/AddDiscuss.css';
import { Row, Col, Divider, Form, Input, Button } from "antd";

export default class Discuss extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(data) {
    console.log(data);
  }
  render() {
    return (
      <>
      <Row style={{ marginTop: '50px' }}>
        <Col span={18} offset={3}>
          <h1 style={{ margin: 0 }}>发起讨论</h1>
          <Divider className="divider" />
        </Col>
      </Row>
      <Row>
        <Col span={18} offset={3}>
          <Form
            name="login-form"
            wrapperCol={{span: 16, offset: 1}}
            labelCol={{span: 1}}
            onFinish={this.handleSubmit}
          >
            <Form.Item
              label="标题"
              name="title"
              rules={[{
                required: true,
                message: '必须输入标题！'
              }]}
            >
              <Input size="large" placeholder="请输入讨论标题" />
            </Form.Item>
            <Form.Item
              label="内容"
              name="information"
              rules={[{
                required: true,
                message: '内容不能为空！'
              }]}
            >
              <Input.TextArea autoSize={{ minRows: 4 }} />
            </Form.Item>
            <Form.Item
              label="标签"
              name="tag_list"
            >
              <Input placeholder="请输入讨论标签，用半角逗号隔开，如'AI,HCI'" />
            </Form.Item>
          </Form>
          <Form.Item
            wrapperCol={{span: 2, offset: 9}}
            style={{margin: "30px auto 0"}}
          >
            <Button type="primary" htmlType="submit">提交</Button>
          </Form.Item>
        </Col>
      </Row>
      </>
    )
  }
}