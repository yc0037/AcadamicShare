import React from 'react';
import './styles/AddDiscuss.css';
import { Row, Col, Divider, Form, Input, Button, Select, message, Modal } from "antd";
import { withRouter } from 'react-router-dom';
import { request } from './utils.js';
import { conf } from './conf.js';

class AddDiscuss extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      paperList: [],
      modalOpen: false,
      modalButtonLoading: false,
      modalButtonDisabled: false,
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.requestPaperList = this.requestPaperList.bind(this);
  }
  componentDidMount() {
    this.requestPaperList();
  }
  requestPaperList() {
    request(`${conf.server}/paper/get_all`)
      .then(result => this.setState({
        paperList: result === null ? [] : result.paperlist
      }));
  }
  async handleOk(data) {
    this.setState({
      modalButtonLoading: true,
    });
    const paper = await request(`${conf.server}/paper/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({
        name: data.name,
        year: data.year,
        author: data.authors.split(','),
        information: data.information,
      })
    });
    if (paper === null || paper.code !== 0) {
      return null;
    }
    request(`${conf.server}/paper/add_tag`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({
        id: paper.id,
        tag: data.tags.split(','),
      }),
    }).then((response) => {
      message.success(response.msg);
      this.setState({ modalButtonLoading: false, modalOpen: false });
      this.requestPaperList();
    });
  }
  async handleSubmit(data) {
    const discuss = await request(`${conf.server}/discussion/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({
        title: data.title,
        text: data.information,
        paperlist: [data.paper] || []
      }),
    });
    if (discuss === null || discuss.code !== 0) {
      return;
    }
    const tags = data.tag_list.split(',');
    request(`${conf.server}/discussion/add_tag`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({
        id: discuss.id,
        tag: tags,
      }),
    }).then(response => {
      if (response.code === 0) {
        message.success(response.msg);
        setTimeout(() => { 
          this.props.history.replace(`/discuss?id=${discuss.id}`);
        }, 1000);
      } else {
        message.error(response.msg);
      }
    });

  }
  render() {
    const {modalOpen, modalButtonDisabled, modalButtonLoading} = this.state;
    return (
      <>
      <Row>
        <Modal
          title="添加论文"
          visible={modalOpen}
          footer={null}
          width="40%"
          onCancel={() => this.setState({ modalOpen: false })}
        >
          <Form
            name="add-paper-form"
            wrapperCol={{span: 16, offset: 1}}
            labelCol={{span: 5}}
            onFinish={this.handleOk}
            onFinishFailed={this.handleFailed}
            initialValues={{
              name: '',
              authors: '',
              year: 2020,
              tags: '',
              information: '',
              file: null
            }}
          >
            <Form.Item
              label="标题"
              name="name"
              rules={[
                { required: true, message: '请输入论文标题！' },
                { max: 128, message: '标题字数不能超过128个字符！' }
              ]}
            >
              <Input placeholder="请输入论文标题" />
            </Form.Item>
            <Form.Item
              label="发表年份"
              name="year"
              rules={[
                { required: true, message: '请选择论文发表年份！' }
              ]}
            >
              <Select placeholder="请选择论文发表年份" defaultValue={2020}>
                {
                  (() => {
                    const options = [];
                    for (let year = 1940; year <= 2021; ++year) {
                      options.push(<Select.Option value={year}>{year}</Select.Option> )
                    }
                    return options;
                  })()
                }
              </Select>
            </Form.Item>
            <Form.Item
              label="作者"
              name="authors"
              rules={[
                { required: true, message: '请输入论文作者！' }
              ]}
            >
              <Input placeholder="请输入论文作者，多个作者请用半角逗号隔开" />
            </Form.Item>
            <Form.Item
              label="标签"
              name="tags"
            >
              <Input placeholder="请输入标签，多个标签请用半角逗号隔开" />
            </Form.Item>
            <Form.Item
              label="简介"
              name="information"
            >
              <Input.TextArea placeholder="请输入论文简介" />
            </Form.Item>
            <Form.Item
              label="文件"
              name="file"
            >
              <Uploader
                changeLoading={val => this.setState({modalButtonLoading: val})}
                changeDisabled={val => this.setState({modalButtonDisabled: val})}
              />
            </Form.Item>
            <Form.Item
              wrapperCol={{ span: 2, offset: 11 }}
            >
              <Button
                htmlType="submit"
                type="primary"
                loading={modalButtonLoading}
                disabled={modalButtonDisabled}
              >提交</Button>
            </Form.Item>
          </Form>
        </Modal>
      </Row>
      <Row style={{ marginTop: '50px' }}>
        <Col span={18} offset={3}>
          <h1>发起讨论</h1>
          <Divider className="divider" />
        </Col>
      </Row>
      <Row>
        <Col span={18} offset={3}>
          <Form
            name="login-form"
            wrapperCol={{span: 16, offset: 1}}
            labelCol={{span: 2}}
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
            <Form.Item
              label="相关论文"
              name="paper"
            >
              <Select
                showSearch
                placeholder="选择讨论相关的论文"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                style={{ width: '75%' }}
              >
                {
                  this.state.paperList.map(v => (
                    <Select.Option value={v.id}>{v.name}</Select.Option>
                  ))
                }
              </Select>
              <span style={{ margin: '0 5%', color: '#aaaaaa' }}>或者</span>
              <Button
                type="primary"
                onClick={() => this.setState({ modalOpen: true })}
              >添加论文</Button>
            </Form.Item>
            <Form.Item
              wrapperCol={{span: 2, offset: 9}}
              style={{margin: "30px auto 0"}}
            >
              <Button type="primary" htmlType="submit">提交</Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
      </>
    )
  }
}

function Uploader({value = '', onChange, ...props}) {
  const triggerChange = (changedValue) => {
    if (onChange) {
      onChange(changedValue || value);
    }
  };
  const { changeDisabled, changeLoading } = props;
  return (
    <input
      type="file"
      id="file"
      accept=".pdf"
      onChange={(e) => {
        const input = document.querySelector('#file');
        const fileList = input.files;
        if (fileList.length === 0) {
          triggerChange('');
        } else {
          const file = fileList[0];
          if (file.size > 200 * 1024 * 1024) {
            message.error('文件大小不能超过200MB！');
            triggerChange('');
            return null;
          }
          let reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onloadstart = function() {
            changeDisabled(true);
            changeLoading(true);
          }
          reader.onload = function() {
            triggerChange(reader.result);
          }
          reader.onerror = function() {
            message.error('文件读取失败！');
            changeDisabled(false);
            changeLoading(false);
          }
          reader.onloadend = function() {
            changeDisabled(false);
            changeLoading(false);
          }
        }
      }}
    />
  );
}

export default withRouter(AddDiscuss);