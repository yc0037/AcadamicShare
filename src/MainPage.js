import React from 'react';
import { Row, Col, Card, Empty, List, Divider, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import './styles/MainPage.css';

export default class MainPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nDiscuss: 0,
      discussList: [],
      hotDiscussList: [],
      noticeLoading: false,
      discussLoading: true,
      hotDiscussLoading: true
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
  }
  render() {
    const {
      discussList,
      hotDiscussList,
      noticeLoading,
      discussLoading,
      hotDiscussLoading,
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
            <Button onClick={() => onLoadMore()} type="link">加载更多</Button>
          </div>
        ) : <Divider><span style={{ color: "#cccccc", fontSize: "16px" }}>已经到底啦！</span></Divider>
      ) : null;
    function onLoadMore() {
      const newDiscussList = this.state.discussList;
      newDiscussList.push({
        "id": 6,
        "tag": "数据库",
        "title": "Asynchronous memory access chaining",
        "numOfReply": 3,
        "lastReply": {
          "user": "test1",
          "time": "2020-11-02 13:22:15"
        }
      });
      this.setState({
        discussList: newDiscussList
      });
    }
    onLoadMore = onLoadMore.bind(this);
    return (
      <>
        <Row gutter={48} className="main-row" style={{
          marginLeft: 0,
          marginRight: 0,
        }}>
          <Col span={12}>
            <Card
              title="通知公告"
              headStyle={{ fontWeight: "bold", }}
              className="dash-board"
              loading={noticeLoading}
            >
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="暂无公告"
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card
              title="学术讨论"
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
                            <span>{wordTrunc(value.title, 55)}</span>
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
            >
              <List
                loadMore={loadMore}
              >
                {
                  discussList.map(value => {
                    return (
                      <List.Item key={value.id}>
                        <List.Item.Meta 
                          title={
                            <div className="discuss-item flex">
                              <div className="discuss-item-nreply">{value.numOfReply}</div>
                              <div className="discuss-item-title"><span>{`[ ${value.tag} ]`}</span>{` ${value.title}`}</div>
                              <div className="discuss-item-reply flex-push">
                                <div className="discuss-item-reply-user"><UserOutlined style={{ fontSize: "12px" }} /> {value.lastReply.user}</div>
                                <div className="discuss-item-reply-time">{value.lastReply.time}</div>
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
