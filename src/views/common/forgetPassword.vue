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
          <h3 class="login-title">忘记密码
          <a class='hasNum' @click='toDl'>返回登录</a>
          </h3>
          <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="forgotSureFormSubmit()" status-icon>
            <el-form-item prop="phone">
              <el-input v-model="dataForm.phone" placeholder="手机号"></el-input>
            </el-form-item>
            <el-form-item prop="code">
              <el-row :gutter="20">
                <el-col :span="14">
                  <el-input v-model="dataForm.code" placeholder="验证码">
                  </el-input>
                </el-col>
                <el-col :span="10" class="login-captcha">
                   <el-button @click='sendSms()' v-text='content' :disabled='isDisabled'></el-button>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item >
              <el-button class="login-btn-submit" type="primary" @click="forgotSureFormSubmit()">确定</el-button>
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
      return {
        dataForm: {
          code: '',
          phone: ''
        },
        content: '发送验证码',
        isDisabled: false,
        dataRule: {
          phone: [
            { required: true, message: '手机号不能为空', trigger: 'blur' }
          ],
          code: [
            { required: true, message: '验证码不能为空', trigger: 'blur' }
          ]
        },
        captchaPath: ''
      }
    },
    methods: {
       // 忘记密码-发验证码
      forgotSureFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('/doctor/checkSMS'),
              method: 'post',
              params: this.$http.adornParams({
                'phone': this.dataForm.phone,
                'code': this.dataForm.code
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
		            this.$cookie.set('token', data.smsToken)
		            this.$cookie.set('phone', data.phone)
                this.$router.replace({ name: 'surePassword' })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
      sendSms () {
        const reg1 = /^1[3|4|5|7|8][0-9]\d{8}$/;
        if(this.dataForm.phone){
        	if (reg1.test(this.dataForm.phone)) {
        		this.isDisabled = true
		        this.$http({
		          url: this.$http.adornUrl('/doctor/passwordSendSMS'),
		          method: 'post',
		          params: this.$http.adornParams({
		            'phone': this.dataForm.phone
		          })
		        }).then(({data}) => {
		          if (data && data.code === 0) {
			          this.totalTime = 120
			          this.content = this.totalTime + 's后重新发送'
			          let clock = window.setInterval(() => {
			            this.totalTime--
			            this.content = this.totalTime + 's后重新发送'
			            if (this.totalTime < 0) {
			              window.clearInterval(clock)
			              this.content = '重新发送验证码'
			              this.isDisabled = false
			            }
			          }, 1000) 
		          } else {
		            this.$message.error(data.msg)
		             this.isDisabled = false
		          }
		        })
		      }else{
		    	   this.$message.error('请输入正确的手机号')
		      }
        }else{
        	 this.$message.error('手机号不能为空')
        }
    },
    toDl () {
    	 this.$router.replace({ name: 'login' })
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
   .hasNum{font-size: 12px;float: right;color: #e9473a;}
    .brand-info__text1{font-size: 38px !important;position: relative;left: 20px;}
</style>
