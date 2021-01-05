<template>
	<el-form ref="dataForm"  :model="form" :rules="dataRule"  label-width="110px">
		<el-form-item>
			<el-steps :space="400" :active="active" finish-status="success">
				<el-step title="待提交"></el-step>
				<el-step title="审核中"></el-step>
				<el-step title="审核结果"></el-step>
			</el-steps>
		</el-form-item>
		<el-form-item label="头像">
			<!--<el-upload class="avatar-uploader" :action="this.$http.adornUrl(`/common/fileupload/?token=${this.$cookie.get('token')}`)" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
				<img v-if="imageUrl" :src="imageUrl" class="avatar">
				<i v-else class="el-icon-plus avatar-uploader-icon"></i>
			</el-upload>-->
			<div class='uploadPhoto' @click="getPic()">
				<img v-if="imageUrl" :src="imageUrl" class="avatar1">
				<i v-else class="el-icon-plus avatar-uploader-icon1"></i>
			</div>
		</el-form-item>
		<el-form-item label="姓名" prop='name'>
			<el-col class='width606'>
				<el-input v-model="form.name" :maxlength='20'></el-input>
			</el-col>
		</el-form-item>
		<el-form-item label="地区" prop='area' style='position: relative;'>
			<span class='star'>*</span>
			<el-select placeholder="---请选择---" v-model="form.province" @change='getCity()'  class='width200'>
				<el-option :label='province.name' :value='province.provCode' v-for='(province,index) in provinceList' :key='province.name'></el-option>
			</el-select>
			<el-select placeholder="---请选择---" v-model="form.city" @change='getCounty()'  class='width200'>
				<el-option :label='city.name' :value='city.provCode' v-for='(city,index) in cityList' :key='city.name'></el-option>
			</el-select>
			<el-select placeholder="---请选择---" v-model="form.county"  class='width200'>
				<el-option :label='county.name' :value='county.provCode' v-for='(county,index) in countyList' :key='county.name'></el-option>
			</el-select>
		</el-form-item>
		<el-row>
			<el-col :span='5'> 
				<span class='star1'>*</span>
				<el-form-item  label="第一执业点" prop='hospital' >
					<el-autocomplete :maxlength='40' class='width200' v-model="form.hospital" @blur='getHospital()' :fetch-suggestions="querySearchHisInfo" placeholder="请输入内容" @select="handleSelect"></el-autocomplete>
					<div  v-if='hospitalText' class='errormsg'>第一执业点不能为空</div>
					<span @click='addHospital()' class='addBtn'>
						<el-button type="danger" size='small' v-if='status!=2'>增加</el-button>
		    		</span>
				</el-form-item>
			</el-col>
			<el-col :span='5'>
				<span class='star3'>*</span>
				<el-form-item label="科室" prop='deparment' style='position: absolute;left: 298px;'>
					<el-autocomplete :maxlength='40' class='width200' @blur='getDeparment()' v-model="form.deparment" :fetch-suggestions="querySearchHisDeparment" placeholder="请输入内容" @select="handleSelect1"></el-autocomplete>
					<div  v-if='deparmentText' class='errormsg'>科室不能为空</div>
				</el-form-item>
			</el-col>
		</el-row>
		<el-row  v-for='(hoh,index) in hohList' :key='hoh.index'>
			<el-col :span='5'>
				<el-form-item label="其他执业点" prop='otherHospital' >
					<el-autocomplete :maxlength='40' class='width200' v-model="hohList[index].otherHospital" :fetch-suggestions="querySearchHisInfo" placeholder="请输入内容" ></el-autocomplete>
				</el-form-item>
			</el-col>
			<el-col :span='7'>
				<el-form-item label="科室" prop='otherDeparment' class='otherDeparment' style='position: absolute;left: 298px;'>
					<el-autocomplete :maxlength='40' class='width200' v-model="hohList[index].otherDeparment" :fetch-suggestions="querySearchHisDeparment" placeholder="请输入内容" ></el-autocomplete>
					<el-col>
	  					<i class='el-icon-delete del delBtn' @click="delBtn(hoh.otherId,index)" v-if='status!=2&&hohList!=""'></i>
					</el-col>
				</el-form-item>
			</el-col>
		</el-row>
		<el-form-item label="职称" prop='background'>
			<el-select placeholder="---请选择---" v-model="form.background" class='width200'>
				<el-option :label='hisJob.name' :value='hisJob.id' v-for='(hisJob,index) in hisJobList' :key='index'></el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="擅长" prop='strong'>
			<el-col class='width606' style='position: relative;'>
				<el-input type="textarea" :maxlength='200' v-model="form.strong" @input="descInput()" :autosize="{ minRows: 2, maxRows: 10}"></el-input>
				<span style='color: #666;position: absolute;right: 0;bottom: -30px;'>{{strongLenth}}/200</span>
			</el-col>
		</el-form-item>
		<!--<el-form-item label="证书" prop='doctorCertificate'>-->
		<el-form-item label="证书">
			<!--<span class='star2'>*</span>-->
			<span class='text'>上传资格证或执业证的第一、二两页，请确保证书上姓名、照片、编号等信息清晰可见</span>
			<el-row style='margin-top: 20px;'>
				<el-col :span="3">
					<el-upload class="avatar-uploader" :action="this.$http.adornUrl(`/common/fileupload/?token=${this.$cookie.get('token')}&watermarke=true`)" :show-file-list="false" :on-success="handleAvatarSuccess1" :on-error="uploaderr" :before-upload="beforeAvatarUpload">
						<img v-if="imageUrl2" :src="imageUrl2" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-col>
				<el-col  :span="3" >
					<el-upload  v-if='zsPic' class="avatar-uploader" :action="this.$http.adornUrl(`/common/fileupload/?token=${this.$cookie.get('token')}&watermarke=true`)" :on-error="uploaderr" :show-file-list="false" :on-success="handleAvatarSuccess2" :before-upload="beforeAvatarUpload">
						<img v-if="imageUrl3" :src="imageUrl3" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-col>
			</el-row>
		</el-form-item>
		<!--<el-form-item label="状态">
			<span v-text='statusText'></span>
		</el-form-item>-->
		<el-form-item v-if='form.status==0' style='position: relative;'>
			<label for=""  class='reasonText'>未通过原因</label>
			<el-col class='width606'>
				<el-input type="textarea" v-model="form.comments" :readonly='true'></el-input>
			</el-col>
		</el-form-item>
		<el-form-item v-if='status==0||status==1||status==3'>
			<el-button type="primary" @click="dataFormSubmit()" v-text='textBtn'></el-button>
		</el-form-item>
		<add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getUploaPhoto"></add-or-update>
	</el-form>
</template>
<script>
	import AddOrUpdate from './fill-add-or-update'
	export default {
		data() {
			var areaProvince = (rule, value, callback) => {
				if(this.form.province == '') {
					callback(new Error('地区不能为空'))
				} else {
					callback()
				}
			}
			/*var validPic = (rule, value, callback) => {
				if(this.imageUrl2 == '') {
					callback(new Error('医生职业证书不能为空'))
				} else {
					callback()
				}
			}*/
			return {
				form: {
					name: '',
					province: '',
					province1: '',
					city: '',
					city1: '',
					county: '',
					county1: '',
					hospital: '',
					otherHospital: '',
					background: '',
					deparment: '',
					strong: '',
					comments: ''
				},
				strongLenth:0,
//				statusText:'',
				hospitalText:false,
				deparmentText:false,
				addOrUpdateVisible:false,
				visible: false,
				zsPic: false,
				textBtn: '提交',
				dialogVisible: false,
				fileList: [],
				status: 1,
				active:1,
				imageUrl: '',
				imageUrl2: '',
				imageUrl3: '',
				provinceList: [],
				cityList: [],
				countyList: [],
				hohList: [],
				hisJobList: [],
				hisInfo: [],
				hisDept: [],
				dataRule: {
					name: [{
						required: true,
						message: '名字不能为空',
						trigger: 'blur'
					}],
					area: [
						{
							validator: areaProvince,
							trigger: 'change'
						}
					],
					background: [{
						required: true,
						message: '职称不能为空',
						trigger: 'change'
					}]/*,
			         doctorCertificate: [
			          {validator: validPic,trigger: 'blur'}
			        ]*/
				}
			}
		},
		 components: {
      		AddOrUpdate
   		 },
		activated() {
			this.getDataList()
			this.getInfo()
			this.getInfo2()
		},
		methods: {
			getHospital () {
				if(!this.form.hospital){
					this.hospitalText=true;
				}else{
					this.hospitalText=false
				}
			},
			getDeparment () {
				if(!this.form.deparment){
					this.deparmentText=true;
				}else{
					this.deparmentText=false
				}
			},
			getUploaPhoto (img) {
				this.imageUrl=img
				console.log(this.imageUrl)
			},
			getPic (){
				this.addOrUpdateVisible = true
				  this.$nextTick(() => {
			          this.$refs.addOrUpdate.init()
			       })
			},
			handleAvatarSuccess(res, file) {
				this.imageUrl = file.response.url;
			},
			beforeAvatarUpload(file) {
				 if (file.type !== 'image/jpg' && file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/gif') {
		          this.$message.error('只支持jpg、png、gif格式的图片！')
		          return false
		        }
				if(file.size / 1024 / 1024 > 4){
				 	this.$message.error('上传图片大小不能超过 4MB!');
				 	return false
				}
			},
			uploaderr (){
				this.$message.error('文件上传失败！');
			},
			submitUpload() {
				this.$refs.upload.submit();
			},
			handleAvatarSuccess1(res, file) {
				this.imageUrl2 = file.response.url;
				this.zsPic = true
			},
			handleAvatarSuccess2(res, file) {
				this.imageUrl3 = file.response.url;
			},
			addHospital() {
				let obj = {};
				obj.otherHospital = null;
				obj.otherDeparment = null;
				this.hohList.push(obj)
				if(this.hohList.length > 10) {
					this.$message.error('其他执业点最多添加10条！');
					this.hohList.splice(10)
				}
			},
			delBtn(otherId, index) {
				if(otherId) {
					this.$confirm('确认删除这条信息么？', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						this.$http({
							url: this.$http.adornUrl('/doctor/deleteOtherHospital/' + otherId),
							method: 'post',
							params: this.$http.adornParams({})
						}).then(({
							data
						}) => {
							if(data && data.code === 0) {
								this.$message({
									message: '操作成功',
									type: 'success',
									duration: 1500,
									onClose: () => {
										this.getInfo2()
									}
								})
							} else {
								this.$message.error(data.msg)
							}
						})
					}).catch(() => {})
				} else {
					this.hohList.splice(index, 1)
				}
			},
			getInfo() {
				this.dataListLoading = true
				this.$http({
					url: this.$http.adornUrl('/doctor/info'),
					method: 'post',
					params: this.$http.adornParams({})
				}).then(({
					data
				}) => {
					console.log(data)
					this.hisJobList = data.result.hisJobList;
					if(data.result.doctor!=null){
						if(data.result.hisJob){
							this.form.background = data.result.hisJob.id;
						}
						if(data && data.code === 0) {
//							if(data.result.doctor.status == 3){
//								this.statusText='审核通过'
//							}else if(data.result.doctor.status == 2){
//								this.statusText='待审核'
//							}else if(data.result.doctor.status == 0){
//								this.statusText='审核未通过'
//							}else if(data.result.doctor.status == 1){
//								this.statusText='待提交'
//							}
							if(data.result.doctor.status == 3 || data.result.doctor.status == 0) {
								this.textBtn = '修改'
							}
							this.status = parseInt(data.result.doctor.status);
							this.form.name = data.result.doctor.name;
							this.form.id = data.result.doctor.id;
							this.form.hospital = data.result.doctor.hospital;
							this.form.deparment = data.result.doctor.deparment;
	//						this.form.background = data.result.doctor.background;
							this.form.comments = data.result.doctor.comments;
							this.form.strong = data.result.doctor.strong;
							if(data.result.doctor.strong){
								this.strongLenth = data.result.doctor.strong.length;
							}
							this.form.status = data.result.doctor.status;
							this.active = data.result.doctor.status;
							this.active = parseInt(this.active)
							if(this.active == 0){
								this.active = 3
							}
							this.imageUrl = data.result.doctor.picture;
							this.imageUrl2 = data.result.doctor.doctorCertificate;
							this.imageUrl3 = data.result.doctor.doctorCertificate2;
							if(data.result.doctor.doctorCertificate){
								this.zsPic = true;
							}else{
								this.zsPic = false
							}
							this.items = data.result.otherHospital;
							if(data.result.hpc1){
								this.form.province = data.result.hpc1.provCode;
							}
							if(data.result.hpc2){
								this.cityList= data.result.hpc2List
								this.form.city = data.result.hpc2.provCode;
							}else{
								this.cityList= data.result.hpc2List
							}
							if(data.result.hpc3){
								this.countyList= data.result.hpc3List
								this.form.county= data.result.hpc3.provCode;
							}else{
								this.countyList= data.result.hpc3List
							}
						}
					} 
					this.dataListLoading = false
				})
			},
			getInfo2 () {
				this.$http({
						url: this.$http.adornUrl('/doctor/getOtherinfo'),
						method: 'post',
						params: this.$http.adornParams({})
					}).then(({
						data
					}) => {
						if(data && data.code === 0) {
							console.log(data)
							if(data.hohList==null) {
								this.hohList = []
							} else {
								this.hohList = data.hohList;
							}
						} else {
							this.$message.error(data.msg)
						}
						this.dataListLoading = false
					})	
			},
			getDataList() {
				this.dataListLoading = true
				this.$http({
					url: this.$http.adornUrl('/doctor/getProvince'),
					method: 'post',
					params: this.$http.adornParams({
						parentProvCode: null
					})
				}).then(({
					data
				}) => {
					if(data && data.code === 0) {
						this.provinceList = data.provinceList
					} else {
						this.$message.error(data.msg)
					}
					this.dataListLoading = false
				})
			},
			getCity() {
				this.dataListLoading = true
				this.form.city = ''
				this.form.county = ''
				this.$http({
					url: this.$http.adornUrl('/doctor/getProvince'),
					method: 'post',
					params: this.$http.adornParams({
						parentProvCode: this.form.province
					})
				}).then(({
					data
				}) => {
					if(data && data.code === 0) {
						this.cityList = data.provinceList
					} else {
						this.$message.error(data.msg)
					}
					this.dataListLoading = false
				})
			},
			getCounty() {
				this.dataListLoading = true
				this.form.county = ''
				this.$http({
					url: this.$http.adornUrl('/doctor/getProvince'),
					method: 'post',
					params: this.$http.adornParams({
						parentProvCode: this.form.city
					})
				}).then(({
					data
				}) => {
					if(data && data.code === 0) {
						this.countyList = data.provinceList
					} else {
						this.$message.error(data.msg)
					}
					this.dataListLoading = false
				})
			},
			dataFormSubmit() {
				let hohArr = [];
				if(!this.form.hospital){
					this.hospitalText=true
				}else{
					this.hospitalText=false
				}
				if(!this.form.deparment){
					this.deparmentText=true
				}else{
					this.deparmentText=false
				}
				if(this.form.status == 3 || this.form.status == 0  || this.form.status == 1) {
					hohArr = this.hohList;
					this.$refs['dataForm'].validate((valid) => {
						if(valid) {
							this.$http({
								url: this.$http.adornUrl('/doctor/update'),
								method: 'post',
								data: this.$http.adornData({
									'id': this.form.id,
									'name': this.form.name,
									'province': this.form.province,
									'city': this.form.city?this.form.city:null,
									'county': this.form.county?this.form.county:null,
									'hospital': this.form.hospital,
									'background': this.form.background,
									'deparment': this.form.deparment,
									'strong': this.form.strong?this.form.strong:null,
									'hohList': hohArr,
									'picture': this.imageUrl,
									'doctorCertificate': this.imageUrl2,
									'doctorCertificate2': this.imageUrl3
								})
							}).then(({
								data
							}) => {
								if(data && data.code === 0) {
									this.$message.success('提交成功');
//									this.active = 2;
									this.getInfo()
									this.getInfo2()
								} else {
									this.$message.error(data.msg)
								}
							})
						}
					})
				} else {
					hohArr = this.hohList;
					console.log(hohArr)
					
					this.$refs['dataForm'].validate((valid) => {
						if(valid) {
							this.$http({
								url: this.$http.adornUrl('/doctor/save'),
								method: 'post',
								data: this.$http.adornData({
									'name': this.form.name,
									'province': this.form.province,
									'city': this.form.city,
									'county': this.form.county,
									'hospital': this.form.hospital,
									'background': this.form.background,
									'deparment': this.form.deparment,
									'strong': this.form.strong,
									'hohList': hohArr,
									'picture': this.imageUrl,
									'doctorCertificate': this.imageUrl2,
									'doctorCertificate2': this.imageUrl3
								})
							}).then(({
								data
							}) => {
								if(data && data.code === 0) {
									this.$message.success('提交成功');
									this.status = 2;
									this.getInfo()
									this.getInfo2()
								} else {
									this.$message.error(data.msg)
								}
							})
						}
					})
				}

			},
			loadAll() {
		        this.$http({
					url: this.$http.adornUrl('/doctor/getHisInfoList'),
					method: 'post',
					data: this.$http.adornData({})
				}).then(({
					data
				}) => {
					if(data && data.code === 0) {
						this.hisInfo = data.hisInfoList;
					} else {
						this.$message.error(data.msg)
					}
				}),
				this.$http({
					url: this.$http.adornUrl('/doctor/getHisDeparment'),
					method: 'post',
					data: this.$http.adornData({})
				}).then(({
					data
				}) => {
					if(data && data.code === 0) {
						this.hisDept = data.hisDeparmentList;
					} else {
						this.$message.error(data.msg)
					}
				})
	      	},
      	 	querySearchHisInfo(queryString, cb) {
      	 		var hisInfos = this.hisInfo;
      	 		var results = queryString ? hisInfos.filter(this.createStateFilter(queryString)) : hisInfos;
      	 		cb(results);
      	 	},
      	 	querySearchHisDeparment(queryString, cb) {
      	 		var hisDepts = this.hisDept;
      	 		var results = queryString ? hisDepts.filter(this.createStateFilter(queryString)) : hisDepts;
      	 		cb(results);
      	 	},
      	 	createStateFilter(queryString) {
		        return (state) => {
	          		return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
		        };
	      	},
	      	handleSelect(item) {
          		if(item.value){
          			this.hospitalText=false
          		}else{
          			this.hospitalText=true
          		}
	      	},
	      	handleSelect1(item) {
          		if(item.value){
          			this.deparmentText=false
          		}else{
          			this.deparmentText=true
          		}
	      	},
	      	descInput(){
	 			this.strongLenth = this.form.strong.length;
	      	}
		},
		mounted() {
      		this.loadAll();
		}
	}
</script>
<style scoped>
	.avatar-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}
	
	.avatar-uploader .el-upload:hover {
		border-color: #409EFF;
	}
	
	.avatar-uploader-icon1 {
		font-size: 28px;
		color: #8c939d;
		width: 150px;
		height: 150px;
		line-height: 150px;
		text-align: center;
		border: 1px dashed #d9d9d9;
		border-radius: 50%;
		overflow: hidden;
	}
	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 100px;
		height: 100px;
		line-height: 100px;
		text-align: center;
		border: 1px dashed #d9d9d9;
		border-radius: 5px;
	}
	.avatar {
		width: 100px;
		height: 100px;
		display: block;
	}
	.avatar1 {
		width: 150px;
		height: 150px;
		display: block;
		border-radius: 50%;
		overflow: hidden;
		}
/*	/*
	.addBtn {
		margin-left: 10px;
	}
	*/
	.del {
		margin-left: 20px;
		cursor: pointer;
	}
	
	.star {
		position: absolute;
		left: -50px;
		color: #f56c6c;
	}
	.star1 {
		position: absolute;
		left: 16px;
		top: 11px;
		color: #f56c6c;
	}
	.star2 {
		position: absolute;
		left: -52px;
		color: #f56c6c;
	}
	.star3 {
		position: absolute;
		left: 356px;
		top: 10px;
		color: #f56c6c;
	}
	.pic {
		margin-left: 150px;
		margin-top: 50px;
	}
	.reasonText{color: #e9473a;position: relative;right: 690px;}
	.delBtn{position: absolute;top: 10px;left: 245px;}
	.addBtn{position: absolute;top: 0px;left: 540px;}
	.text{position: relative;color: #606266;}
	.otherDeparment{position: relative;right: 37px;}
	.width200{width: 200px;}
	.width606{width: 606px;}
	.my-autocomplete {
		li {
			line-height: normal;
			padding: 7px;
			.name {
				text-overflow: ellipsis;
				overflow: hidden;
			}
			.highlighted .addr {
				color: #ddd;
			}
		}
	}
	.uploadPhoto{
		width: 150px;
		height: 150px;
		line-height:150px;
		cursor: pointer;
	}
	 .errormsg{color: #f56c6c;font-size: 12px;position: absolute;top: 27px;}
</style>