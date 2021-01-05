<template>
  <el-dialog
    title="历史病例"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm"  ref="dataForm" class='dateForm'>
      <el-form-item label="就诊时间">
         <el-select v-model="dataForm.createTime" placeholder="请选择"  @change='getHistory()'>
			    <el-option
			      v-for="item in hciList"
			      :key="item.createTime"
			      :label="item.createTime"
			      :value="item.createTime"
			      >
			    </el-option>
			  </el-select>
			  <span class='textStyle'>科室：{{dataForm.deptName}}</span>
			  <span class='textStyle'>就诊医生：{{dataForm.doctorName}}</span>
      </el-form-item>
        <el-form-item>
	 						<p class='msgTitle'>主诉</p>
	 						<p v-if='dataForm.caseTitle'>{{dataForm.caseTitle}}</p>
	 						<p v-else>无</p>
				</el-form-item>
				<el-form-item>
	 					  <p class='msgTitle'>个人史</p>
	 					  <p v-if='dataForm.personalInfo'>{{dataForm.personalInfo}}</p>
	 					  <p v-else>无</p>
				</el-form-item>
				<el-form-item>
	 					  <p class='msgTitle'>过敏史</p>
	 					  <p v-if='dataForm.anaphylaxis'>{{dataForm.anaphylaxis}}</p>
	 					  <p v-else>无</p>
				</el-form-item>
				<el-form-item>
	 					  <p class='msgTitle'>家族史</p>
	 					  <p v-if='dataForm.familyInfo'>{{dataForm.familyInfo}}</p>
	 					  <p v-else>无</p>
				</el-form-item>
				<el-form-item>
	 					<p class='msgTitle'>诊断详情</p>
	 					<p v-if='dataForm.caseResult'>{{dataForm.caseResult}}</p>
	 					<p v-else>无</p>
				</el-form-item>
				<el-form-item>
	 					  <p class='msgTitle'>治疗建议</p>
	 					  <p v-if='dataForm.doctorTips'>{{dataForm.doctorTips}}</p>
	 					  <p v-else>无</p>
				</el-form-item>
    </el-form>
    	<span slot="footer" class="dialog-footer">
      		<el-button type="primary" @click="dataFormSubmit()">导出</el-button>
    		</span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        hciList: [],
        dataForm: {
          createTime:'',
          caseTitle:null,
	    		caseResult:null,
	    		doctorTips:null,
					personalInfo:null,
					anaphylaxis:null,
					familyInfo:null,
					patientId:null
        }
      }
    },
    methods: {
      init (patientId) {
        this.dataListLoading = false;
        this.visible = true
        this.$nextTick(() => {
        this.$http
          .getRequest("/case/getHisCaseInfoByPatient/"+patientId)
          .then(({ data }) => {
          	if (data && data.code === 0) {
          		console.log(data)
          		this.hciList=data.hciList;
          		this.dataForm=data.hisCaseInfo;
          	}else{
          		this.$message.error(data.msg);
          	}
            this.dataListLoading = false;
          });
        })
      },
      //历史病例
      getHistory(){
      	this.dataListLoading = false;
        this.$http
          .postRequest("/case/getHisCaseInfoByTime",{
          	createTime:this.dataForm.createTime,
          	patientId:this.dataForm.patientId
          })
          .then(({ data }) => {
          	if (data && data.code === 0) {
								console.log(data)
								this.dataForm=data.hisCaseInfo;
          	}else{
          		this.$message.error(data.msg);
          	}
            this.dataListLoading = false;
          });
      },
      // 导出
      dataFormSubmit (){
      	this.$emit('refreshDataList',this.dataForm)
   			this.visible = false
      }
    }
  }
</script>
<style scoped>
	.msgTitle{font-size: 16px;margin: 0;}
	.dateForm{height: 550px;width:100%;overflow-y: auto;}
	.dateForm p{margin: 0;}
	.textStyle{display:inline-block;width: 30%;text-align: center;}
	.el-dialog__footer{text-align: center !important;}
</style>
