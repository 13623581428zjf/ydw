<template>
  <el-dialog
    :title="'新增'"
    :close-on-click-modal="false"
    width="570px"
    :visible.sync="visible">
    <el-form :model="dataForm"  :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="选择日期" prop="fromDate">
       <el-date-picker type="date"    value-format="yyyy-MM-dd" placeholder="选择日期" v-model="dataForm.fromDate" style="width: 100%;"></el-date-picker>
      </el-form-item>
      <el-form-item label="接诊时间" prop="fromTime" >
	      <el-select v-model="dataForm.fromTime" placeholder="请选择" class='width450'>
			    <el-option
			      v-for="item in options"
			      :key="item.value"
			      :label="item.label"
			      :value="item.value">
			    </el-option>
			  </el-select>
      </el-form-item>
      
      <el-form-item  label="医院" prop="hospital" >
				<el-select style='width:450px' placeholder="---请选择---" v-model="dataForm.hospital">
        		<el-option  value=''>---请选择---</el-option>
						<el-option :label='hisJob' :value='hisJob' v-for='(hisJob,index) in hisInfo' :key='index' ></el-option>
				</el-select>
			</el-form-item>
      
      <el-form-item label="接诊人数" prop="visitsNum">
        <el-input v-model="dataForm.visitsNum" type="number" placeholder="接诊人数"></el-input>
      </el-form-item>
      <el-form-item label="价格" prop="price">
        <el-input v-model="dataForm.price" type="number" :min="0" placeholder="价格"></el-input>
      </el-form-item>
       <el-form-item >
          <el-checkbox v-model="dataForm.checked" label="开启循环（开启后将在每周同一时间自动生成排班）"></el-checkbox>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
       var validateNum = (rule,value,callback)=>{
          if(value < 0){
               callback(new Error('价格不可以小于0'));
          }else{
            callback();
          }
      }
      return {
      	hospitalText:false,
      	options: [{
          value: '08:00',
          label: '上午'
        }, {
          value: '14:00',
          label: '下午'
        }, {
          value: '20:00',
          label: '晚上'
        }],
        value: '',
        visible: false,
        dataForm: {
          isLoop:'N',
          checked: false,
          fromDate: '',
          fromTime:'',
          schedulingType:'register',
          visitsNum:'',
          price:'',
          hospital:'',
        },
        hisInfo: [],
        dataRule: {
          fromDate: [
            { required: true, message: '参数名不能为空', trigger: 'blur' }
          ],
          fromTime: [
            { required: true, message: '参数值不能为空', trigger: 'blur' }
          ],
          hospital: [
            { required: true, message: '参数值不能为空', trigger: 'change' }
          ],
          visitsNum: [
            { required: true, message: '参数值不能为空', trigger: 'blur' }
          ],
           price: [
            { required: true, message: '参数值不能为空', trigger: 'blur' },
            { validator: validateNum, trigger: 'blur' }
          ]
        },
      }
    },
    methods: {
      init (addPrice) {
        this.visible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          this.dataForm.price = addPrice;
          this.getDataList();
        })
      },
      getDataList(){
      	this.$http({
					url: this.$http.adornUrl('/doctor/getDoctorHisInfoList'),
					method: 'post',
					data: this.$http.adornData({})
				}).then(({
					data
				}) => {
					console.log(data)
					if(data && data.code === 0) {
						this.hisInfo = data.hisInfoList;
					} else {
						this.$message.error(data.msg)
					}
				})
     },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if(this.dataForm.checked){
                this.dataForm.isLoop = 'Y'
            }else {
              this.dataForm.isLoop = 'N'
            }
            this.$http.postRequest('/schedulingDate/createdScheduling',{
              isLoop: this.dataForm.isLoop,
              fromDate: `${this.dataForm.fromDate} 00:00:00`,
              schedulingEntity: {
              fromTime:`${this.dataForm.fromTime}:00`,
              schedulingType:this.dataForm.schedulingType,
              visitsNum:this.dataForm.visitsNum,
              price:this.dataForm.price,
              hospital:this.dataForm.hospital
            },
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
<style scoped>
.el-date-editor.el-input, .el-date-editor.el-input__inner{
  width: 100%;
}
.width450{width: 450px;}
</style>
