<template>
  <el-dialog
    :title="title"
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
        <el-input type='password' v-model="dataForm.rePassword" placeholder="请输入确认密码"></el-input>
      </el-form-item>
    </el-form>
    <span  class="dialog-footer" style="float: right;margin-bottom: 20px;">
      <el-button @click="cancel()">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
     <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%;">
      <el-table-column
        prop="username"
        header-align="center"
        align="center"
        label="用户">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
         <el-button type="warning"  size='small' @click="updateStatus(scope.row.userId)" v-if='scope.row.status==1'>禁用</el-button>
        	<el-button type="primary"  size='small' @click="updateStatus(scope.row.userId)" v-if='scope.row.status==0'>开启</el-button>
        	<el-button type="danger"  size='small' @click="deleteHandle(scope.row.userId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>
<script>
  export default {
    data () {
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
        title:'添加医生助手',
        dataList:[],
        dataListLoading: false,
        partyId:'',
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
            { required: true, message: '确认密码不能为空！', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (partyId) {
      	console.log(partyId)
        this.visible = true
      	this.partyId=partyId
        this.getDataList();
      },
      cancel (){
      	this.visible = false
      	this.$refs['dataForm'].resetFields()
      },
      handleClose () {
      	this.visible = false
      	this.$refs['dataForm'].resetFields()
      },
      // 获取数据列表
      getDataList() {
      this.dataListLoading = true;
        this.$http
          .getRequest("/doctorAssistant/findDoctorAssistantlist/"+this.partyId)
          .then(({ data }) => {
          	if (data && data.code === 0) {
                console.log(data)
                this.dataList=data.list
              } else {
                this.$message.error(data.msg)
              }
            this.dataListLoading = false;
          });
    },
      // 添加医生助手
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
          	 this.$http.postRequest("/doctorAssistant/doctorAssistantRegister",{
          	 		phone:this.dataForm.phone,
          	 		password:this.dataForm.password,
          	 		rePassword:this.dataForm.rePassword,
          	 		partyId:this.partyId
          	 })
          	.then(({ data }) => {
	          	if (data && data.code === 0) {
	                this.$message.success('医生助手注册成功！')
	                this.getDataList()
	                this.dataForm={
          						phone: '',
          						password: ''
        					}
                this.$emit("refreshDataList");
	              } else {
	                this.$message.error(data.msg)
	              }
	            this.dataListLoading = false;
	          });
          }
        })
      },
       // 禁止用户登录/开启用户登录
	    updateStatus(userId) {
	    	 this.dataListLoading = true;
	    	 this.$http.getRequest(`/sys/user/updateStatus/`+userId)
          	.then(({ data }) => {
	          	if(data && data.code === 0) {
	    					this.getDataList () ;
	    				}
	            this.dataListLoading = false;
	          });	 
	     },
	     //删除医生助手
       deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定对该医生助手进行删除?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/user/delete'),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
              this.$emit("refreshDataList");
            } else {
              this.$message.error(data.msg)
            }
          })
        }).catch(() => {})
      },
    }
  }
</script>

