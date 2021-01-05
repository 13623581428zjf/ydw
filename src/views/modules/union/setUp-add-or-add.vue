<template>
  <el-dialog
    :title="!dataForm.id ? '团队介绍' : '团队介绍'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm"  ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="68px">     
      <el-form-item >
	      	<el-input	      				
	           		type ="textarea"
								:rows ="7"
								placeholder ="请输入内容"
								v-model='dataForm.text'
								style ="width:800px;">
					</el-input>
      </el-form-item>
</el-form-item>
    </el-form>
	    <span slot="footer" class="dialog-footer">
		    <el-button @click="visible = false">取 消</el-button>
		    <el-button type="primary" @click="dataFormSubmit() ">确 定</el-button>
      </span>
</el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        item_id:'',
        dataForm: {         
          text:''
        }
      }
    },
    methods: {
      init () {
      	this.visible =true
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
           this.$http.postRequest("/team/addTeam",{
           		 text:this.dataForm.text
           }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
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
