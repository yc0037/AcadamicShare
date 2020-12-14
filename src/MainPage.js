import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Empty, List, Divider, Button, Avatar } from 'antd';
import { UserOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import { conf } from './conf.js';
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
    fetch('/data/discussion.json')
      .then(response => response.json())
      .then(data => {
        this.setState({
          nDiscuss: data.nDiscuss,
          discussList: data.discussionList,
          discussLoading: false,
        });
      });
      fetch('/data/hotDiscussion.json')
        .then(response => response.json())
        .then(data => {
          this.setState({
            hotDiscussList: data,
            hotDiscussLoading: false,
        });
      });
      fetch('/data/starList.json')
        .then(response => response.json())
        .then(data => {
          this.setState({
            starList: data,
            starLoading: false,
        });
      });
    this.onLoadMore = this.onLoadMore.bind(this);
  }
  onLoadMore() {
    const newDiscussList = this.state.discussList;
    newDiscussList.push({
      "id": 6,
      "tag": "数据库",
      "title": "Asynchronous memory access chaining",
      "numOfReply": 3,
      "lastReply": {
        "user": "test1",
        "time": "2020-11-02T13:22:15+08:00"
      }
    });
    this.setState({
      discussList: newDiscussList
    });
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
    const { lastVisit } = starList;
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
                      dataSource={starList.list?.slice(0, 5).sort((a, b) => moment(b.lastReply).diff(moment(a.lastReply)))}
                      renderItem={item => (
                        <List.Item className="dash-board-item" key={item.id}>
                          <List.Item.Meta
                            title={
                            <div className="flex">
                              <div className={`dot-${moment(item.lastReply, moment.ISO_8601).diff(moment(lastVisit, moment.ISO_8601)) > 0}`}><Link to={`/paper?id=${item.id}`}>{wordTrunc(item.title, 45)}</Link></div>
                              <div className="flex-push time-info">
                                {moment.duration(moment(item.lastReply, moment.ISO_8601).diff(moment())).locale('zh-cn').humanize(true)}
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
                            <span><Link to={`/paper?id=${value.id}`}>{wordTrunc(value.title, 55)}</Link></span>
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
                              <div className="discuss-item-nreply">{value.numOfReply}</div>
                              <div className="discuss-item-title"><Link to={`/paper?id=${value.id}`}><span>{`[ ${value.tag} ]`}</span>{` ${value.title}`}</Link></div>
                              <div className="discuss-item-reply flex-push">
                                <div className="discuss-item-reply-user"><UserOutlined style={{ fontSize: "12px" }} /> {value.lastReply.user}</div>
                                <div className="discuss-item-reply-time time-info">{moment(value.lastReply.time, moment.ISO_8601).format('YYYY-MM-DD HH:mm')}</div>
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

function wordTrunc(s, length) {
  return s.slice(0, length) + (s.length > length ? '...' : null)
}
