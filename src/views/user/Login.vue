<!-- 登录页 -->
<template>
  <div class="container">
    <van-nav-bar
      left-arrow
      @click-left="$router.back()"
      title="登录"
    ></van-nav-bar>
    <van-cell-group>
      <van-field
        label="手机号"
        v-model.trim="loginForm.mobile"
        :error-message="errMsg.mobile"
        @blur="checkMobile"
        placeholder="请输入手机号"
      />
      <van-field
        label="验证码"
        v-model.trim="loginForm.code"
        :error-message="errMsg.code"
        @blur="checkCode"
        placeholder="请输入验证码"
      >
        <van-button class="p5" slot="button" size="mini" type="primary">
          发送验证码
        </van-button>
      </van-field>
    </van-cell-group>
    <div class="btn_box">
      <van-button type="info" @click="login" block round>登 录</van-button>
    </div>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { login1 } from '@/API/user.js'
import { mapMutations } from 'vuex'
export default {
  name: 'user-chat',
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data () {
    // 这里存放数据
    return {
      loginForm: {
        mobile: '15111111111',
        code: '246810'
      },
      errMsg: {
        mobile: '',
        code: ''
      }
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    checkMobile () {
      // 1. 校验手机号是否为空
      if (!this.loginForm.mobile) {
        this.errMsg.mobile = '请输入手机号'
        return false
      }
      // 2. 校验验证码是否正确
      if (!/^1[3-9]\d{9}$/.test(this.loginForm.mobile)) {
        this.errMsg.mobile = '手机号格式错误'
        return false
      }
      // 校验成功
      this.errMsg.mobile = ''
    },
    checkCode () {
      // 1. 校验手机号是否为空
      if (!this.loginForm.code) {
        this.errMsg.code = '请输入验证码'
        return false
      }
      // 2. 校验验证码是否正确
      if (!/^\d{6}$/.test(this.loginForm.code)) {
        this.errMsg.code = '请输入六位数的验证码'
        return false
      }
      // 校验成功
      this.errMsg.code = ''
    },
    ...mapMutations(['setUser']),
    async login () {
      this.checkMobile()
      this.checkCode()
      if (!this.errMsg.mobile && !this.errMsg.code) {
        try {
          const data = await login1(this.loginForm)
          this.setUser(data)
          this.$router.push(this.$route.query.redirectUrl || '/user')
          this.$toast.success('登录成功')
        } catch (error) {
          this.$toast.fail('登陆失败')
        }
      }
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created () {}
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
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
