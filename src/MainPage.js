import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Empty, List, Divider, Button, Avatar, message } from 'antd';
import { UserOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import _ from "lodash";
import { conf } from './conf.js';
import { request, wordTrunc } from './utils.js';
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
      hotDiscussLoading: true,
      starList: [],
      starLoading: true,
    };
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
    this.onLoadMore = this.onLoadMore.bind(this);
  }
  async onLoadMore() {
    const newDiscussList = await request(`${conf.server}/discussion/get_active?offset=${this.state.discussList.length}`);
    if (newDiscussList != null) {
      this.setState(state => ({
        nDiscuss: newDiscussList.ndis,
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
      nDiscuss
    } = this.state;
    const loadMore =
      !discussLoading ? (
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
      ) : null;
    const { userInfo } = this.props;
    const lastVisit = moment().subtract(1, 'days');
    // const userInfo = null;
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
                {userInfo ? <><Avatar style={{ backgroundColor: '#40a9ff', marginRight: "10px" }} size="small" icon={<UserOutlined />} />{userInfo?.userName}</> : null}
              </>}
              className="dash-board"
              loading={noticeLoading}
            >
              {
                userInfo ? 
                <Row>
                  <Col span={24}>
                    <List
                      loading={starLoading}
                      dataSource={starList.slice(0, 5).sort((a, b) => moment(b.lastReply.time, 'YYYY-MM-DD, HH:mm:ss').diff(moment(a.lastReply.time, 'YYYY-MM-DD, HH:mm:ss')))}
                      renderItem={item => (
                        <List.Item className="dash-board-item" key={item.id}>
                          <List.Item.Meta
                            title={
                            <div className="flex">
                              <div className={`dot-${moment(item.lastReply.time, 'YYYY-MM-DD, HH:mm:ss').diff(lastVisit) > 0}`}><Link to={`/discuss?id=${item.id}`}>{wordTrunc(item.title, 45)}</Link></div>
                              <div className="flex-push time-info">
                                {moment.duration(moment(item.lastReply.time, 'YYYY-MM-DD, HH:mm:ss').diff(moment())).locale('zh-cn').humanize(true)}
                              </div>
                            </div>
                            }
                          />
                        </List.Item>
                      )}
                    />
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
                <Link to="/adddiscuss"><Button type="primary">
                  <span><PlusOutlined /> 发起讨论</span>
                </Button></Link>
              ]}
            >
              <List
                loadMore={loadMore}
              >
                {
                  discussList.map(value => {
                    return (
                      <List.Item className="dash-board-item" key={value.id}>
                        <List.Item.Meta 
                          title={
                            <div className="discuss-item flex">
                              <div className="discuss-item-nreply">{value.replyNumber}</div>
                              <div className="discuss-item-title"><Link to={`/discuss?id=${value.id}`}>{` ${value.title}`}</Link></div>
                              <div className="discuss-item-reply flex-push">
                                <div className="discuss-item-reply-user"><UserOutlined style={{ fontSize: "12px" }} /> {value.lastReply.name}</div>
                                <div className="discuss-item-reply-time time-info">{moment(value.lastReply.time, 'YYYY-MM-DD, HH:mm:ss').format('YYYY-MM-DD HH:mm')}</div>
                              </div>
                            </div>
                          }
                        />
                      </List.Item>
                    );
                  })
                }
              </List>
            </Card>
          </Col>
        </Row>
      </>
    );
  }
}
