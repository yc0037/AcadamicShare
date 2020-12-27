import React from 'react';
import { Row, Col, List, Divider } from 'antd';
import moment from 'moment';
import { conf } from './conf.js';
import { request } from './utils.js';
import './styles/MainPage.css';
import "moment/locale/zh-cn";
import DiscussList from './DiscussList.js';
moment.locale('zh-cn');

export default class DisCenter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      discussList: [],
    };
  }

  async componentDidMount() {
    const tag = new URLSearchParams(this.props.location.search).get('tag');
    request(`${conf.server}/discussion/get_related?tag=${tag}`)
      .then(result => {
        this.setState({
          loading: false,
          discussList: result.dislist
        });
      });
  }

  render() {
    const tag = new URLSearchParams(this.props.location.search).get('tag');
    return (
      <Col span={18} offset={3} style={{ marginTop: '50px' }}>
        <Row>
          <h1>标签：{tag}</h1>
          <Divider className="divider" />
        </Row>
        <Row>
          <Col span={24}>
            <List>
              <DiscussList discussList={this.state.discussList} />
            </List>
          </Col>
        </Row>
      </Col>
    )
  }
}