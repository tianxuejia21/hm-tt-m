import axios from 'axios'

import jsonbigint from 'json-bigint'
import store from '@/store'
import router from '@/router'

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
  if (store.state.user.token) {
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
}, async err => {
  if (err.response && err.response.status === 401) {
    const loginConfig = {
      path: '/login',
      query: {
        redirectUrl: router.currentRouter.path
      }
    }
    // 用户信息
    const user = store.state.user
    // 没登录
    if (!user || !user.token || !user.refresh_token) {
      return router.push(loginConfig)
    }
    try {
      // 发刷新token的请求
      const {
        data: {
          data
        }
      } = await axios({
        url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
        method: 'put',
        headers: {
          Authorization: `Bearer ${user.refresh_token}`
        }
      })
      // 更新Vuex和本地token
      store.commit('setUser', {
        token: data.token,
        refresh_token: user.refresh_token
      })
      return instance(err.config)
    } catch (e) {
      // 刷新token失败
      store.commit('delUser')
      return router.push(loginConfig)
    }
  }
  return Promise.reject(err)
})

// 调用接口
export default (url, method, data) => {
  // params 选项是 get传参
  // data 选项是 其他请求方式的传参
  return instance({
    url,
    method,
    // js表达式运行的结果必须是字符串（params|data）
    // 严谨处理  get Get GET 都认为是get
    [method.toLowerCase() === 'get' ? 'params' : 'data']: data
  })
}
