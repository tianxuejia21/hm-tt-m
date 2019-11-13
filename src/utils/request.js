import axios from 'axios'

import jsonbigint from 'json-bigint'
import store from '@/store'

const instance = axios.create({
  // 基准值
  baseURL: 'http://ttapi.research.itcast.cn/',
  // 转换响应数据格式
  transformResponse: [(data) => {
    try {
      return jsonbigint.parse(data)
    } catch (e) {
      return data
    }
  }]
})

// 请求拦截器
instance.interceptors.request.use(config => {
  if (store.state.users.token) {
    config.headers.Authorization = `Bearer ${store.state.user.token}`
  }
  return config
}, err => Promise.reject(err))

// 响应拦截器
instance.interceptors.response.use(res => {
  try {
    return res.data.data
  } catch (e) {
    return res
  }
})

// 调用接口
export default (url, method, data) => {
  // params 选项是 get传参
  // data 选项是 其他请求方式的传参
  instance({
    url,
    method,
    // js表达式运行的结果必须是字符串（params|data）
    // 严谨处理  get Get GET 都认为是get
    [method.toLowerCase() === 'get' ? 'params' : 'data']: data
  })
}
