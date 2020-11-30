# 前端 API
## 1 App
### 1.1 获取当前登录的用户信息

方法：`GET`

参数：无

说明：在页面初次加载时获取当前登录的用户信息。后端通过检查 cookie 来判断当前访问的用户身份，并返回对应的用户基本信息。

返回值：

``` json
{
  "uid": 1,
  "userName": "Alice"
}
```

## 2 MainPage
### 2.1 获取全部讨论列表

方法： `GET`

参数：`offset`

说明：按照最后回复时间倒序排列全部讨论列表，每次请求返回从`offset`开始的10个讨论项。

返回值：

``` json
{
  "nDiscuss": 6,          // 讨论总数
  "discussionList": [     // 请求新增的讨论列表，每次10个条目
    {
      "id": 1,
      "tag": "数据库",
      "title": "A Seven-Dimensional Analysis of Hashing Methods and its Implications on Query Processing",
      "numOfReply": 17,
      "lastReply": {
        "user": "test1",
        "time": "2020-11-18T13:14:15+08:00"
      }
    },
    {
      "id": 2,
      "tag": "数据库",
      "title": "Access Path Selection in Main-Memory Optimized Data Systems: Should I Scan or Should I Probe?",
      "numOfReply": 28,
      "lastReply": {
        "user": "user755",
        "time": "2020-11-15T10:12:59+08:00"
      }
    },
    ...
  ]
}
```

### 2.2 获取热点讨论列表

方法：`GET`

参数：无

说明：获取当月新增回复数前五的讨论

返回值：

``` json
[
  {
    "id": 4,
    "tag": "数据库",
    // 讨论标题
    "title": "AI Meets AI: Leveraging Query Executions to Improve Index Recommendations",
    "numOfReply": 65,
    "lastReply": {
      "user": "mememe",
      // 时间以 ISO-8601 格式表示
      "time": "2020-11-08T12:12:12+08:00"
    }
  },
  {
    "id": 2,
    "tag": "数据库",
    "title": "Access Path Selection in Main-Memory Optimized Data Systems: Should I Scan or Should I Probe?",
    "numOfReply": 28,
    "lastReply": {
      "user": "user755",
      "time": "2020-11-15T10:12:59+08:00"
    }
  },
  {
    "id": 1,
    "tag": "数据库",
    "title": "A Seven-Dimensional Analysis of Hashing Methods and its Implications on Query Processing",
    "numOfReply": 17,
    "lastReply": {
      "user": "test1",
      "time": "2020-11-18T13:14:15+08:00"
    }
  },
  {
    "id": 5,
    "tag": "数据库",
    "title": "An Experimental Comparison of Thirteen Relational Equi-Joins in Main Memory",
    "numOfReply": 12,
    "lastReply": {
      "user": "dber",
      "time": "2020-11-05T15:02:00+08:00"
    }
  },
  {
    "id": 3,
    "tag": "数据库",
    "title": "Efficiently Searching In-Memory Sorted Arrays: Revenge of the Interpolation Search?",
    "numOfReply": 5,
    "lastReply": {
      "user": "no_one",
      "time": "2020-11-09T02:58:01+08:00"
    }
  }
]
```

### 2.3 获取用户关注的讨论列表

方法：`GET`

参数：`uid`

说明：获取 id 为 `uid` 的用户关注的讨论列表，按照最后回复的时间倒序排列。

返回值：

``` json
{
  // 用户上次访问网站的时间，用于判断哪些讨论在用户两次访问之间发生了更新
  "lastVisit": "2020-11-12T12:12:12+08:00",
  "list": [
    {
      "id": 4,
      "tag": "数据库",
      "title": "AI Meets AI: Leveraging Query Executions to Improve Index Recommendations",
      "lastReply": "2020-11-08T12:12:12+08:00"
    },
    {
      "id": 2,
      "tag": "数据库",
      "title": "Access Path Selection in Main-Memory Optimized Data Systems: Should I Scan or Should I Probe?",
      "lastReply": "2020-11-15T10:12:59+08:00"
    },
    {
      "id": 1,
      "tag": "数据库",
      "title": "A Seven-Dimensional Analysis of Hashing Methods and its Implications on Query Processing",
      "lastReply": "2020-11-18T13:14:15+08:00"
    }
  ]
}
```

## 3 Register

### 3.1 验证用户名是否已被注册

方法：`GET`

参数：`username`

说明：检查是否已存在用户名为 `username` 的用户。

返回值：`true` 或 `false`。

### 3.2 提交注册请求

方法：`POST`

请求体：

```json
{
  "username": "Alice",
  "password": "dahfUDSFHUE"  // 加密后的密码字符串
}
```

说明：提交用户注册请求。

返回值：描述注册是否成功。可能的方式：

``` json
{
  "status": "success" | "failed",
  "msg": "blablabla"
}
```

## 4 Login

### 4.1 提交登录请求

方法：`POST`

请求体：

``` json
{
  "username": "Alice",
  "password": "sdhofgusdfhie"   // 加密后的密码字符串
}
```

说明：提交登录请求。

返回值：描述登录是否成功的信息。可能的方式：

``` json
{
  "status": "success" | "failed",
  "msg": "用户不存在！"
}
```

登录请求提交成功后，要求服务端维护与客户端连接的 session，并将 session id 通过 cookie 传递给客户端，用来识别客户端的身份。
