import Vue from 'vue'
import Vuex from 'vuex'

import * as auth from '@/utils/auth'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 用户信息
    user: auth.getUser()
  },
  mutations: {
    // 存储用户信息
    setUser (state, user) {
      // 更新state
      state.user = user
      // 更新本地存储
      auth.setUser(user)
    },

    delUser (state) {
      state.user = {}
      auth.delUser()
    }

  },
  actions: {}
})
