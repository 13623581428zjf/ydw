<template>
  <div class="mod-config">
  	
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1">病例</el-menu-item>
      <el-menu-item index="2">处方</el-menu-item>
      <el-menu-item index="3">检查单</el-menu-item>
       <el-button class='save' @click='saveForm()'>保存</el-button>
       <el-button class='record'  @click='historyCase(personal.patientId)'>历史病例</el-button>
    </el-menu>
     <el-form :inline="false"  :model="dataForm" ref="dataForm"  v-if='tempIndex=="1"'>
	     	<el-form-item class='personalMsg'>
	     		<h3>患者信息</h3>
	     		<span>姓名：{{personal.patientName}}</span>
	     		<span>性别：{{personal.patientSex}}</span>
	     		<span>年龄：{{personal.patientAge}}</span>
	     		<span>手机号：{{personal.patientPhoneNum}}</span>
    		</el-form-item>
    		<h3>病历信息</h3>
	 			<el-form-item>
	 				<el-col :span="11">
	 						<p class='msgTitle'>主诉</p>
				    	<el-input type="textarea" placeholder='最多500字' v-model='dataForm.caseTitle' :autosize="{ minRows: 3}" :maxlength='500'></el-input>
	 				</el-col>
				</el-form-item>
				<el-form-item>
	 				<el-col :span="11">
	 					  <p class='msgTitle'>个人史</p>
				    	<el-input type="textarea" placeholder='最多500字' v-model='dataForm.personalInfo' :autosize="{ minRows: 3}" :maxlength='500'></el-input>
	 				</el-col>
				</el-form-item>
				<el-form-item>
	 				<el-col :span="11">
	 					  <p class='msgTitle'>过敏史</p>
				    	<el-input type="textarea" placeholder='最多500字' v-model='dataForm.anaphylaxis' :autosize="{ minRows: 3}" :maxlength='500'></el-input>
	 				</el-col>
				</el-form-item>
				<el-form-item>
	 				<el-col :span="11">
	 					  <p class='msgTitle'>家族史</p>
				    	<el-input type="textarea" placeholder='最多500字' v-model='dataForm.familyInfo' :autosize="{ minRows: 3}" :maxlength='500'></el-input>
	 				</el-col>
				</el-form-item>
				<el-form-item>
	 				<el-col :span="11">
	 					<p class='msgTitle'>诊断详情</p>
				    	<el-input type="textarea" placeholder='最多500字' v-model='dataForm.caseResult' :autosize="{ minRows: 3}" :maxlength='500'></el-input>
	 				</el-col>
				</el-form-item>
				<el-form-item>
	 				<el-col :span="11">
	 					  <p class='msgTitle'>治疗建议</p>
				    	<el-input type="textarea" placeholder='最多500字' v-model='dataForm.doctorTips' :autosize="{ minRows: 3}" :maxlength='500'></el-input>
	 				</el-col>
				</el-form-item>
	  </el-form>
	 		<edit-case v-if="editCase" ref="editCase" @refreshDataList="getMsg"></edit-case>
		 	<recipel v-if="tempIndex=='2'" ref="recipel" :recipleList='recipleList'></recipel>
		 	<inspection-list v-if="tempIndex=='3'" ref="inspectionList"></inspection-list>
	</div>
</template>
<script>
import EditCase from "./editCase-add-or-update";
import Recipel from "./recipel";
import InspectionList from "./inspectionList";
export default {
  data() {
    return {
    	patientId:'',
    	activeIndex:'1',
    	editCase:false,
      dialogTableVisible:false,
    	tempIndex:'1',
    	consultation_id:this.$route.query.consultation_id,
      recipleList:[],
   
      doctorInfo:{
      	hospital:'',
      	id:'',
      	name:'',
      	deparment:''
      	
      },

    	personal:{
    		patientName:'',
    		patientSex:'',
    		patientAge:'',
    		patientPhoneNum:'',
    		patient_id:''
    	},
    	dataForm:{
    		caseTitle:null,
    		caseResult:null,
    		doctorTips:null,
				personalInfo:null,
				anaphylaxis:null,
				familyInfo:null
    	}
    }
  },
  components: {
    EditCase,Recipel,InspectionList
  },
  mounted(){
		this.getDataList();
		//this.patientId=this.$route.query.patient_id;
		//this.getPatientId(this.patientId);
		//	console.log(this.patientId)
  },
  methods: {
		getDataList(){
			console.log(this.consultation_id)
				this.dataListLoading = true;
        this.$http
          .getRequest("/case/getHisCaseInfo/"+this.consultation_id)
          .then(({ data }) => {
          	if (data && data.code === 0) {
          		this.personal=data.patient
          		this.doctorInfo=data.doctorInfo
          		if(data.hisCaseInfo){
        				this.dataForm=data.hisCaseInfo
          		}
          	}else{
          		this.$message.error(data.msg);
          	}
            this.dataListLoading = false;
          });
		},
		//保存
		saveForm (){
			this.$refs['dataForm'].validate((valid) => {
				console.log(this.dataForm.id)
				if(valid) {
					this.$http
          .postRequest("/case/saveOrUpdate",{
        			id:this.dataForm.id?this.dataForm.id:0,
      			  hisName:this.doctorInfo.hospital,
	    				doctorId:this.doctorInfo.id,
	    				doctorName:this.doctorInfo.name,
	    				patientId:this.personal.patientId,
	    				deptName:this.doctorInfo.deparment,
	    				caseCode:this.consultation_id,
	    				caseTitle:this.dataForm.caseTitle,
	    				caseResult:this.dataForm.caseResult,
	    				doctorTips:this.dataForm.doctorTips,
	    				personalInfo:this.dataForm.personalInfo,
	    				anaphylaxis:this.dataForm.anaphylaxis,
	    				familyInfo:this.dataForm.familyInfo
          })
          .then(({ data }) => {
          		if (data && data.code === 0) {
                this.$message.success('保存成功');
                this.getDataList();
              } else {
                this.$message.error(data.msg);
              }
            this.dataListLoading = false;
          });
				}
			})
		},
		historyCase (patientId){
			this.editCase = true;
      this.$nextTick(() => {
        this.$refs.editCase.init(patientId);
      });
		},
		 // 获取处方列表
      getRecipel () {
       this.dataListLoading = true
        this.$http
          .getRequest("/case/getHisCaseInfo/"+this.consultation_id)
          .then(({ data }) => {
          	if (data && data.code === 0) {
          		this.recipleList=data.patient
          	}else{
          		this.$message.error(data.msg);
          	}
            this.dataListLoading = false;
          });
      },
  	handleSelect(key) {
      this.activeIndex = key;
      this.tempIndex = key;
      if(key==2){
      	this.getRecipel()
      }
   	},
   getMsg(msg){
   		this.dataForm.caseTitle=msg.caseTitle;
   		this.dataForm.caseResult=msg.caseResult;
   		this.dataForm.doctorTips=msg.doctorTips;
   		this.dataForm.personalInfo=msg.personalInfo;
   		this.dataForm.anaphylaxis=msg.anaphylaxis;
   		this.dataForm.familyInfo=msg.familyInfo;
   }
	}
};
</script>
<style scoped>
.el-menu--horizontal {
  margin-bottom: 20px;
}
.el-menu--horizontal > .el-menu-item {
  height: 36px;
  line-height: 35px;
  border-radius: 10px 10px 0 0;
}
.el-menu--horizontal > .el-menu-item.is-active {
  background: #17b3a3;
  color: #ffffff;
}
.msgTitle{font-size: 16px;margin: 0;}
.personalMsg span{display: inline-block;width: 200px;}
.save{margin-left: 420px;position: relative;bottom: 5px;}
.record{position: relative;bottom: 5px;}


</style>

