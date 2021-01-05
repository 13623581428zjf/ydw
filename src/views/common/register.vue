<template>
  <div class="site-wrapper site-page--login">
    <div class="site-content__wrapper">
      <div class="site-content">
        <div class="brand-info">
         <h2 class="brand-info__text brand-info__text1">慧疗名医联盟</h2>
          <h2 class="brand-info__text">远程会诊平台</h2>
<!--          <p class="brand-info__intro">。</p>-->
        </div>
        <div class="login-main" style='line-height: 18px;'>
          <h3 class="login-title">
						注册账号          	
          	<a class='hasNum' @click='toDl'>已有账号，直接登录</a>
          </h3>
          <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="registerFormSubmit()" status-icon>
            <el-form-item prop="phone">
              <el-input v-model="dataForm.phone" placeholder="手机号"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="dataForm.password" type="password" placeholder="密码"></el-input>
            </el-form-item>
             <el-form-item prop="rePassword">
              <el-input v-model="dataForm.rePassword" type="password" placeholder="确认密码"></el-input>
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
            <el-form-item prop='checked'>
              <el-checkbox  v-model="dataForm.checked" :checked='isChecked' @change='chooseChexkbox()' >我已阅读并同意《注册协议》</el-checkbox>
							<div  v-if='errorMsg' class='errormsg'>请选择阅读注册协议</div>
            </el-form-item>
            <el-form-item >
              <el-button class="login-btn-submit" type="primary" @click="registerFormSubmit()">确定</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
	import { isMobile } from '@/utils/validate'
  export default {
    data () {
      var validateConfirmPassword = (rule, value, callback) => {
        if (this.dataForm.rePassword !== value) {
          callback(new Error('确认密码与新密码不一致'))
        } else {
          callback()
        }
      }
//    var validatecheckbox = (rule, value, callback) => {
//      if (!this.dataForm.checked) {
//        callback(new Error('请选择阅读注册协议'))
//      } else {
//        callback()
//      }
//    }
      return {
        dataForm: {
          password: '',
          rePassword: '',
          code: '',
          phone: ''
        },
        errorMsg:false,
        content: '发送验证码',
        isDisabled: false,
        isChecked: false,
        dataRule: {
          phone: [
            { required: true, message: '手机号不能为空', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '密码不能为空', trigger: 'blur' }
          ],
          rePassword: [
            { required: true, message: '确认密码不能为空', trigger: 'blur' },
            { validator: validateConfirmPassword, trigger: 'blur' }
          ],
          code: [
            { required: true, message: '验证码不能为空', trigger: 'blur' }
          ],
          checked: [
//          { required: true,message: '请选择阅读注册协议',trigger: 'blur' }
//          { validator: validatecheckbox, trigger: 'blur' }
          ]
        },
        captchaPath: ''
      }
    },
    methods: {
       // 注册
      registerFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
        	if(this.isChecked==false){
		      		this.errorMsg=true
		      		return false;
		      	}else{
		      		this.errorMsg=false
		      	}
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('/doctor/register'),
              method: 'post',
              params: this.$http.adornParams({
                'phone': this.dataForm.phone,
                'password': this.dataForm.password,
                'rePassword': this.dataForm.rePassword,
                'code': this.dataForm.code
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
              	this.$message.success('注册成功！')
//              this.$router.replace({ name: 'personalCenter-fill' })
//              this.$router.replace({ name: 'login' })
								this.$cookie.set('token', data.token)
                this.$cookie.set('userName', this.dataForm.userName)
                this.$cookie.set('isOver', data.isOver)
                this.$router.replace({ name: 'personalCenter-fill' })
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
		          url: this.$http.adornUrl('/doctor/registerSendSMS'),
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
		            this.$cookie.set('token', data.token)
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
    },
    chooseChexkbox (){
    	if(this.isChecked==false){
 				this.errorMsg = false
 				this.isChecked=true
    	}else{
    		this.errorMsg = true
    		this.isChecked=false
    	}
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
  .errormsg{color: #f56c6c;font-size: 12px;position: absolute;top: 18px;}
  .brand-info__text1{font-size: 38px !important;position: relative;left: 20px;}
</style>
