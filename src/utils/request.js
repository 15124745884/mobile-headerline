import axios from 'axios'
import JSONBIGINT from 'json-bigint'
import store from '@/store'
import router from '@/router'
// 1. 处理js最大安全数值
// 2. 在每次请求头中携带token
// 3. 处理响应数据（剥离无效数据）
// 4. 自动刷新token
// 5. 导出一个调用配置好的axios发请求的函数

// 创建一个新的axios实例，拥有独立的公共根地址，以及各种配置
const instance = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/',
  transformResponse: [
    data => {
      try {
        return JSONBIGINT.parse(data)
      } catch (error) {
        return data
      }
    }
  ]
})

// 配置请求拦截器，在请求前携带token请求
instance.interceptors.request.use(
  config => {
    if (store.state.user.token) {
      // 在请求头中添加authorization值
      config.headers.Authorization = `Bearer ${store.state.user.token}`
    }
    return config
  },
  err => Promise.reject(err)
)

// 配置响应拦截器，过滤数据，返回一个剥离后的data
instance.interceptors.response.use(config => {
  try {
    return config.data.data
  } catch (error) {
    return Promise.reject(error)
  }
},
// 当响应错误时，可能为token失效，也可能为未登录
async error => {
  // 判断响应状态码，分别是否为想要的错误
  const loginConfig = {
    path: '/login',
    query: { rederect: router.currentRoute.path }
  }
  try {
    // 第一种情况，判断是否是登录状态
    if (error.response && error.response.status === 401) {
      const { user } = store.state
      if (!user.token || !user.refresh_token) {
        router.push(loginConfig)
        return Promise.reject(error)
      }
      // 第二种情况，token失效了，重新请求，获取token，刷新token
      const res = await axios({
        url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
        method: 'put',
        headers: {
          Authorization: `Bearer ${user.refresh_token}`
        }
      })
      store.commit('setUser', {
        token: res.data.data.token,
        refresh_token: user.refresh_token
      })
      return instance(error.config)
    }
  } catch (error) {
    // 响应错误
    router.push(loginConfig)
    return Promise.reject(error)
  }
  Promise.reject(error)
}
)

// 导入匿名函数，返回值为instance方法，有三个形参，支持传入地址，方法，请求配置
export default (url, method, data) => {
  return instance({
    url,
    method,
    [method.toLowerCase() === 'get' ? 'params' : 'data']: data
  })
}
