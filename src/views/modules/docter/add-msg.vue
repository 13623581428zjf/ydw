<template>
  <el-dialog
    :title="!dataForm.id ? '添加医生帐号 ' : '添加医生帐号 '"
    :close-on-click-modal="false"
     :before-close="handleClose"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="dataForm.phone" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type='password' v-model="dataForm.password" placeholder="请输入密码"></el-input>
      </el-form-item>
       <el-form-item label="确认密码" prop="rePassword">
        <el-input type='password' v-model="dataForm.rePassword" placeholder="请确认密码"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel()">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
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
	   var validatePhone = (rule, value, callback) => {
        	let reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
        	if (!reg.test(this.dataForm.phone)) {
          callback(new Error('请输入正确手机号格式'))
        } else {
          callback()
        }
  	}
      return {
        visible: false,
        dataForm: {
          phone: '',
          password: '',
          rePassword:''
        },
        dataRule: {
          phone: [
            { required: true, message: '手机号不能为空！', trigger: 'blur' },
            { validator:validatePhone, trigger: 'blur' }
          ],
          password: [
            { required: true, message: '密码不能为空！', trigger: 'blur' }
          ],
           rePassword: [
            { required: true, message: '确认密码不能为空！', trigger: 'blur' },
            { validator: validateConfirmPassword, trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.visible = true
      },
      cancel (){
      	this.visible = false
      	this.$refs['dataForm'].resetFields()
      },
      handleClose () {
      	this.visible = false
      	this.$refs['dataForm'].resetFields()
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('/doctor/sysRegister'),
              method: 'post',
              params: this.$http.adornParams({
                'phone': this.dataForm.phone,
                'password': this.dataForm.password,
                'rePassword': this.dataForm.rePassword,
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
//                  this.$router.go({ name: 'docter' });
										this.$refs['dataForm'].resetFields()
                  }
                })
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

