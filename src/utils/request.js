// 设置基础 URL
// const BASE_URL = 'https://tea.qingnian8.com/api/bizhi'
// const BASE_URL = 'https://zj.v.api.aa1.cn/api/Age-calculation' //生肖
// const BASE_URL = 'http://192.168.0.118:86/api/WisdomVisit'
// const DEFAULT_BASE_URL = 'http://23.84.152.249:90/api/WisdomVisit'
let BASE_URL = uni.getStorageSync('BASE_URL') || '192.168.0.118:86'
// 设置新的 BASE_URL 并保存到本地存储
export const setBaseUrl = (newUrl) => {
  BASE_URL = newUrl;
  uni.setStorageSync('BASE_URL', newUrl);  // 持久化保存新的 BASE_URL
}

// 获取当前的 BASE_URL
export const getBaseUrl = () => {
  return BASE_URL;
}
// 请求拦截器
function requestInterceptor(options) {
  // 从本地存储获取 token
  const token = uni.getStorageSync('token');
  // 如果存在 token，将其添加到请求头
  if (token) {
    options.header = {
      ...options.header, // 展开原有的请求头部，保留已有字段
      Authorization: `Bearer ${token}` // 添加 Authorization 字段，值为 `Bearer <token>`
    };
  }
  // 打印请求日志
  // console.log('Request Interceptor:', options);
  // 返回处理后的请求配置
  return options;
}
// 响应拦截器
function responseInterceptor(response) {
  // 打印响应日志
  // console.log('Response Interceptor:', response);
  // 检查响应状态码
  if (response.statusCode === 200) {
    // 如果状态码是 200，表示请求成功,返回数据
    return { success: true, data: response.data };
  } else {
    // 其他状态码表示请求失败,返回错误信息
    return {
      success: false,
      error: {
        statusCode: response.statusCode,
        message: response.data.message || '请求失败'
      }
    };
  }
}
// 错误拦截器
function errorInterceptor(error) {
  // 打印错误日志
  console.error('Error Interceptor:', error);

  // 返回处理后的错误信息
  return {
    message: error.errMsg || '网络请求失败'
  };
}
// 封装网络请求函数
function request({ url, method = 'GET', data = {}, header = {} }) {
  // 返回一个 Promise 实例，方便链式调用
  return new Promise((resolve, reject) => {
    /*
        // 设置默认请求头
        const defaultHeaders = {
          'Content-Type': 'application/json' // 默认的 Content-Type
        };
    */
    // 创建 options 对象,解构赋值
    let options = {
      url,    // 接口地址
      method, // 请求方法
      data,   // 请求数据
      header
      // header: { ...defaultHeaders, ...header }// 合并默认请求头和传入的请求头
    }
    // // 尝试从本地存储获取 BASE_URL
    // let baseUrl = uni.getStorageSync('BASE_URL') || DEFAULT_BASE_URL;
    options = requestInterceptor(options); // 调用请求拦截器
    // 发起请求
    uni.request({
      ...options, // 展开请求配置对象，将 options 对象中的所有属性展开到新的对象中
      url: 'http://' + getBaseUrl() + '/api/WisdomVisit' + options.url, // 将 BASE_URL 与 options.url 拼接成完整的请求 URL
      success: (response) => {
        const processedResponse = responseInterceptor(response); // 调用响应拦截器处理响应
        if (processedResponse.success) {
          resolve(processedResponse.data); // 请求成功，解析数据
        } else {
          reject(processedResponse.error); // 请求失败，解析错误
        }
      },
      fail: (error) => {
        const processedError = errorInterceptor(error); // 调用错误拦截器处理错误
        reject(processedError); // 请求失败，解析错误
      }
    });
  });
}
export default request; // 导出封装的请求函数

//-----------------------------
/*
// 使用示例
// GET 请求示例
request('https://api.example.com/data')
  .then(data => {
    console.log('GET 请求成功', data);
    // 处理获取到的数据
  })
  .catch(err => {
    console.error('请求失败', err);
    // 处理错误
    if (err.statusCode === 401) {
      console.log('未授权，请重新登录');
      // 处理未授权的情况，例如跳转到登录页
    } else {
      console.log('请求错误', err.data);
      // 处理其他错误情况
    }
  });

// POST 请求示例
request('https://api.example.com/submit', 'POST', { username: 'user', password: 'pass' })
  .then(data => {
    console.log('POST 请求成功', data);
    // 处理提交后的返回数据
  })
  .catch(err => {
    console.error('请求失败', err);
    // 处理错误
    if (err.statusCode === 400) {
      console.log('参数错误', err.data);
      // 处理请求参数错误的情况
    } else {
      console.log('请求错误', err.data);
      // 处理其他错误情况
    }
  });
  //-------------------
  */