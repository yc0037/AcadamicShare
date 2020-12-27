import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Empty, List, Divider, Button, Avatar, message } from 'antd';
import { UserOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import _ from "lodash";
import { conf } from './conf.js';
import { request, wordTrunc } from './utils.js';
import DiscussList from './DiscussList.js';
import './styles/MainPage.css';
import "moment/locale/zh-cn";
moment.locale('zh-cn');

export default class MainPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nDiscuss: 0,
      discussList: [],
      hotDiscussList: [],
      noticeLoading: false,
      discussLoading: true,
      discussMoreLoading: false,
      hotDiscussLoading: true,
      starList: [],
      starLoading: true,
    };
    this.onLoadMore = this.onLoadMore.bind(this);
  }

  componentDidMount() {
    request(`${conf.server}/discussion/get_active?offset=0`)
      .then(data => {
        if (data !== null) {
          this.setState({
            nDiscuss: data.ndis,
            discussList: data.dislist,
            discussLoading: false,
          });
        }
      });

    request(`${conf.server}/discussion/get_hot`)
      .then(data => {
        this.setState({
          hotDiscussList: data.dislist,
          hotDiscussLoading: false,
      });
    });
    
    if (this.props.userInfo) {
      Promise.all(this.props.userInfo.subscribe.map(tag => (
        request(`${conf.server}/discussion/get_related?tag=${tag}`)
          .then(result => {
            if (result.hasOwnProperty('code') && result.code === 105) {
              message.error(result.msg);
              return [];
            } else {
              return result.dislist;
            }
          })
      ))).then(arr => {
        arr = _.flatten(arr);
        arr = _.uniqWith(arr, _.isEqual);
        this.setState({
          starList: arr,
          starLoading: false,
        })
      });
    }
  }

  async onLoadMore() {
    this.setState({
      discussMoreLoading: true,
    });
    const newDiscussList = await request(`${conf.server}/discussion/get_active?offset=${this.state.discussList.length}`);
    if (newDiscussList !== null) {
      this.setState(state => ({
        nDiscuss: newDiscussList.ndis,
        discussMoreLoading: false,
        discussList: [...state.discussList, ...newDiscussList.dislist],
      }));
    }
  }

  render() {
    const {
      discussList,
      hotDiscussList,
      noticeLoading,
      discussLoading,
      hotDiscussLoading,
      starList,
      starLoading,
      nDiscuss,
      discussMoreLoading
    } = this.state;
    const loadMore =
      !discussMoreLoading ? (
        discussList.length < nDiscuss ? (
          <div
            style={{
              textAlign: 'center',
              marginTop: 12,
              height: 32,
              lineHeight: '32px',
            }}
          >
            <Button onClick={this.onLoadMore} type="link">加载更多</Button>
          </div>
        ) : <Divider><span style={{ color: "#cccccc", fontSize: "16px" }}>已经到底啦！</span></Divider>
      ) : <Divider><span style={{ color: "#cccccc", fontSize: "16px" }}>加载中……</span></Divider>;
    const { userInfo } = this.props;
    const lastVisit = moment().subtract(1, 'days');
    return (
      <>
        <Row gutter={48} className="main-row" style={{
          marginLeft: 0,
          marginRight: 0,
        }}>
          <Col span={12}>
            <Card
              title="关注动态"
              headStyle={{ fontWeight: "bold", }}
              extra={<>
                { userInfo ? 
                  <>
                    <Avatar
                      style={{ backgroundColor: '#40a9ff', marginRight: "10px" }}
                      size="small"
                      icon={<UserOutlined />}
                    />
                    {userInfo?.userName}
                  </> : 
                  null
                }
              </>}
              className="dash-board"
              loading={noticeLoading}
            >
              {
                userInfo ? 
                <Row>
                  <Col span={24}>
                    {
                      starList.length === 0 ?
                      <div className="flex center" style={{height: "250px"}}>
                        <Empty
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                          description="No data"
                        />
                      </div> :
                      <List
                        loading={starLoading}
                        dataSource={
                          starList
                            .sort((a, b) => 
                              moment(b.lastReply.time, 'YYYY-MM-DD, HH:mm:ss')
                                .diff(moment(a.lastReply.time, 'YYYY-MM-DD, HH:mm:ss')))
                            .slice(0, 5)}
                        renderItem={item => (
                          <List.Item className="dash-board-item" key={item.id}>
                            <List.Item.Meta
                              title={
                              <div className="flex">
                                <div className={`dot-${moment(item.lastReply.time, 'YYYY-MM-DD, HH:mm:ss').diff(lastVisit) > 0}`}>
                                  <Link to={`/discuss?id=${item.id}`}>{wordTrunc(item.title, 45)}</Link>
                                </div>
                                <div className="flex-push time-info">
                                  {moment.duration(moment(item.lastReply.time, 'YYYY-MM-DD, HH:mm:ss').diff(moment())).locale('zh-cn').humanize(true)}
                                </div>
                              </div>
                              }
                            />
                          </List.Item>
                        )}
                      />
                    }
                  </Col>
                </Row>
                :
                <div className="flex center" style={{height: "250px"}}>
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="登录后可以查看收藏的讨论"
                  />
                </div>
              }
            </Card>
          </Col>
          <Col span={12}>
            <Card
              title="热点讨论"
              headStyle={{ fontWeight: "bold", }}
              className="dash-board"
              loading={hotDiscussLoading}
            >
              {
                hotDiscussList.length === 0 ?
                <div className="flex center" style={{height: "250px"}}>
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="No data"
                  />
                </div> :
                <List>
                  {
                    hotDiscussList.map((value, index) => (
                      <List.Item className="dash-board-item" key={value.id}>
                        <List.Item.Meta
                          title={
                            <div>
                              <span className={`dash-board-order rank${index + 1}`}>{index + 1}</span>
                              <span><Link to={`/discuss?id=${value.id}`}>{wordTrunc(value.title, 55)}</Link></span>
                            </div>
                          }
                        />
                      </List.Item>
                    ))
                  }
                </List>
              }
            </Card>
          </Col>
        </Row>
        <Row className="main-row" style={{
          marginLeft: 0,
          marginRight: 0,
          padding: "30px 104px"
        }}>
          <Col span={24}>
            <Card
              loading={discussLoading}
              className="dash-board"
              headStyle={{ fontWeight: "bold", }}
              title="全部讨论"
              extra={[
                <Link to="/adddiscuss"><Button type="primary" style={{ 'margin': 'auto 10px' }}>
                  <span><PlusOutlined /> 发起讨论</span>
                </Button></Link>,
                <Link to="/search"><Button type="primary" style={{ 'margin': 'auto 10px' }}>
                  <span><SearchOutlined /> 搜索讨论</span>
                </Button></Link>
              ]}
            >
              <List
                loadMore={loadMore}
              >
                <DiscussList discussList={discussList} />
              </List>
            </Card>
          </Col>
        </Row>
      </>
    );
  }
}
