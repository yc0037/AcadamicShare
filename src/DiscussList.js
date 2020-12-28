import { Link } from 'react-router-dom';
import { List, Empty } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import moment from 'moment';
import "moment/locale/zh-cn";
import UserTooltip from './UserTooltip';
moment.locale('zh-cn');

export default function DiscussList(props) {
  const { discussList } = props;
  if (discussList.length === 0) {
    return (
      <div className="flex center" style={{height: "250px"}}>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No data"
        />
      </div>
    )
  }
  const { userInfo, updateLogin } = props;
  return (
    discussList.map(value => {
      return (
        <List.Item className="dash-board-item" key={value.id}>
          <List.Item.Meta 
            title={
              <div className="discuss-item flex">
                <div className="discuss-item-nreply">{value.replyNumber}</div>
                <div className="discuss-item-title">
                  <Link to={`/discuss?id=${value.id}`}>{` ${value.title}`}</Link>
                </div>
                <div className="discuss-item-reply flex-push">
                  <div className="discuss-item-reply-user">
                    <UserTooltip
                      userInfo={userInfo}
                      otherInfo={value.lastReply.name}
                      updateLogin={updateLogin}
                    >
                      <Link to={`/userinfo?username=${value.lastReply.name}`}>
                        <UserOutlined style={{ fontSize: "12px", marginRight: '5px' }} />
                        {value.lastReply.name}
                      </Link>
                    </UserTooltip>
                  </div>
                  <div className="discuss-item-reply-time time-info">
                    {moment(value.lastReply.time, 'YYYY-MM-DD, HH:mm:ss').format('YYYY-MM-DD HH:mm')}
                  </div>
                </div>
              </div>
            }
          />
        </List.Item>
      );
    })
  );
}