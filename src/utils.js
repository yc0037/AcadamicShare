import { message, Spin } from 'antd';

async function request(url, options) {
  try {
    const response = await fetch(url, {
      credentials: 'include',
      ...options,
    });
    if (response.ok) {
      return {
        code: 0,
        ...(await response.json())
      };
    } else {
      throw new Error(response.status);
    }
  } catch (error) {
    // message.error(`请求失败${error.message ? `(${error.message})` : ''}，请检查你的网络状态或稍后重试。`);
    return {
      code: -1,
      msg: `请求失败${error.message ? `(${error.message})` : ''}，请检查你的网络状态或稍后重试。`,
    };
  }
}

function LoadingMask() {
  const style = {
    width: '100%',
    height: '80vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  };
  return (
    <div style={style}>
      <Spin size="large" />
    </div>
  )
}

function wordTrunc(s, length) {
  return s.slice(0, length) + (s.length > length ? '...' : '')
}

export {
  request,
  LoadingMask,
  wordTrunc
};