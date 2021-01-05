<template>
  <div class="site-wrapper site-page--login">
    <div class="site-content__wrapper">
      <div class="site-content">
        <div class="brand-info">
          <h2 class="brand-info__text brand-info__text1">慧疗名医联盟</h2>
          <h2 class="brand-info__text">远程会诊平台</h2>
<!--          <p class="brand-info__intro">。</p>-->
        </div>
        <div class="login-main">
          <h3 class="login-title">确认密码</h3>
          <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="surePasswordForm()" status-icon>
            <el-form-item label="账号">
	       			 <span>{{ showPhone }}</span>
	      		</el-form-item>
            <el-form-item prop="password">
              <el-input v-model="dataForm.password" type="password" placeholder="密码"></el-input>
            </el-form-item>
             <el-form-item prop="rePassword">
              <el-input v-model="dataForm.rePassword" type="password" placeholder="确认密码"></el-input>
            </el-form-item>
            <el-form-item >
              <el-button class="login-btn-submit" type="primary" @click="surePasswordForm()">确定</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      var validateConfirmPassword = (rule, value, callback) => {
        if (this.dataForm.rePassword !== value) {
          callback(new Error('确认密码与新密码不一致'))
        } else {
          callback()
        }
      }
      return {
        dataForm: {
          password: '',
          rePassword: '',
          phone: '',
        },
        sms: '发送验证码',
        isDisabled: false,
        showPhone:this.$cookie.get('phone'),
        dataRule: {
          password: [
            { required: true, message: '密码不能为空', trigger: 'blur' }
          ],
          rePassword: [
            { required: true, message: '确认密码不能为空', trigger: 'blur' },
            { validator: validateConfirmPassword, trigger: 'blur' }
          ]
        },
        captchaPath: ''
      }
    },
    methods: {
       // 忘记密码-确认密码
      surePasswordForm () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('/doctor/updatePassword'),
              method: 'post',
              params: this.$http.adornParams({
                'phone': this.showPhone,
                'password': this.dataForm.password,
                'rePassword': this.dataForm.rePassword,
                'smsToken': this.$cookie.get('token')
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
              	this.$message.success('设置成功!')
                this.$router.replace({ name: 'login' })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .site-wrapper.site-page--login {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    /*background-color: rgba(38, 50, 56, .6);*/
    overflow: hidden;
    &:before {
      position: fixed;
      top: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      content: "";
      background-image: url(~@/assets/img/banner1.jpg);
      background-size: cover;
      background-repeat: no-repeat;
    }
    .site-content__wrapper {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      padding: 0;
      margin: 0;
      overflow-x: hidden;
      overflow-y: auto;
      background-color: transparent;
    }
    .site-content {
      min-height: 100%;
      padding: 30px 500px 30px 30px;
    }
    .brand-info {
      margin: 220px 100px 0 150px;
      color: #fff;
    }
    .brand-info__text {
      margin:  0 0 22px 0;
      font-size: 48px;
      font-weight: 400;
      text-transform : uppercase;
      padding-left: 60%;
      position: relative;
      top: -70px;
      width: 1200px;
    }
    .brand-info__intro {
      margin: 10px 0;
      font-size: 16px;
      line-height: 1.58;
      opacity: .6;
    }
    .login-main {
      position: absolute;
      top: 0;
      right: 0;
      padding: 150px 60px 180px;
      width: 470px;
      min-height: 100%;
      background-color: #fff;
    }
    .login-title {
      font-size: 16px;
    }
    .login-captcha {
      overflow: hidden;
      > img {
        width: 100%;
        cursor: pointer;
      }
    }
    .login-btn-submit {
      width: 100%;
      margin-top: 38px;
    }
  }
  .registered{float: left;}
  .forgotPassword{float: right;}
  .site-wrapper.site-page--login .login-btn-submit{margin-top: 0;}
   .brand-info__text1{font-size: 38px !important;position: relative;left: 20px;}
</style>
