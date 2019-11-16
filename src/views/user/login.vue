<template>
  <div class="page-user-login">
    <van-nav-bar left-arrow
                 @click-left="$router.back()"
                 title="登录"></van-nav-bar>
    <van-cell-group>
      <van-field @blur="checkMobile"
                 :error-message="errMsg.mobile"
                 v-model='userForm.mobile'
                 label="手机号"
                 placeholder="请输入手机号" />
      <van-field @blur="checkCode"
                 :error-message="errMsg.code"
                 v-model='userForm.code'
                 label="验证码"
                 placeholder="请输入验证码">
        <van-button class="p5"
                    slot="button"
                    size="mini"
                    type="primary">
          发送验证码
        </van-button>
      </van-field>
    </van-cell-group>
    <div class="btn_box">
      <van-button type="info"
                  @click="login"
                  block
                  round>登 录</van-button>
    </div>
  </div>
</template>

<script>
import { login } from '@/api/user'
import { mapMutations } from 'vuex'
export default {
  name: 'user-login',
  data () {
    return {
      userForm: {
        mobile: '',
        code: ''
      },
      errMsg: {
        mobile: '',
        code: ''
      }
    }
  },
  methods: {
    checkMobile () {
      if (!this.userForm.mobile) {
        this.errMsg.mobile = '请输入手机号'
        return false
      }
      if (!/^1[3-9]\d{9}$/.test(this.userForm.mobile)) {
        this.errMsg.mobile = '请输入正确手机号'
        return false
      }
      // 成功
      this.errMsg.mobile = ''
    },
    checkCode () {
      if (!this.userForm.code) {
        this.errMsg.code = '请输入验证码'
        return false
      }
      if (!/^\d{6}$/.test(this.userForm.code)) {
        this.errMsg.code = '请输入正确验证码'
        return false
      }
      this.errMsg.code = ''
    },
    async login () {
      this.checkMobile()
      this.checkCode()
      // 判断errMsg对象中是否有错误信息
      if (this.errMsg.mobile || this.errMsg.code) {
        return false
      }
      // 校验成功进行登录
      try {
        const data = await login(this.userForm)
        this.setUser(data)
        const { redirectUrl } = this.$route.query
        this.$router.push(redirectUrl || '/user')
      } catch (e) {
        // 登录失败
        this.$toast.fail('手机号或验证码错误')
      }
    },
    ...mapMutations(['setUser'])

  }
}
</script>

<style scoped lang='less'>
.p5 {
  padding: 0 5px;
}
.btn_box {
  padding: 10px;
  .van-button {
    height: 32px;
    line-height: 30px;
  }
}
</style>
