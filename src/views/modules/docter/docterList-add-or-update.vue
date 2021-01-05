<template>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
     width="850px"
    :visible.sync="visible">
    <el-form :model="dataForm"  :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
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
					<el-input v-model="dataForm.name" :maxlength='20'></el-input>
				</el-col>
			</el-form-item>
			<el-form-item label="地区" prop='area' style='position: relative;'>
				<span class='star'>*</span>
				<el-select placeholder="---请选择---" v-model="dataForm.province" @change='getCity()'>
					<el-option :label='province.name' :value='province.provCode' v-for='(province,index) in provinceList' :key='province.name'></el-option>
				</el-select>
				<el-select placeholder="---请选择---" v-model="dataForm.city" @change='getCounty()'>
					<el-option :label='city.name' :value='city.provCode' v-for='(city,index) in cityList' :key='city.name'></el-option>
				</el-select>
				<el-select placeholder="---请选择---" v-model="dataForm.county">
					<el-option :label='county.name' :value='county.provCode' v-for='(county,index) in countyList' :key='county.name'></el-option>
				</el-select>
			</el-form-item>
			<el-row>
				<el-col :span='5'> 
					<span class='star1'>*</span>
					<el-form-item  label="第一执业点" prop='hospital'>
						<el-autocomplete class='width200' :maxlength='40'  v-model="dataForm.hospital" @blur='getHospital()' :fetch-suggestions="querySearchHisInfo" placeholder="请输入内容" @select="handleSelect"></el-autocomplete>
						<div  v-if='hospitalText' class='errormsg'>第一执业点不能为空</div>
						<span @click='addHospital()' class='addBtn'>
							<el-button type="danger" size='small' v-if='status!=2'>增加</el-button>
			    		</span>
					</el-form-item>
				</el-col>
				<el-col :span='5'>
					<span class='star3'>*</span>
					<el-form-item label="科室" prop='deparment' style='position: absolute;left: 298px;'>
						<el-autocomplete class='width200' :maxlength='40' @blur='getDeparment()' v-model="dataForm.deparment" :fetch-suggestions="querySearchHisDeparment" placeholder="请输入内容" @select="handleSelect1"></el-autocomplete>
						<div  v-if='deparmentText' class='errormsg'>科室不能为空</div>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row  v-for='(hoh,index) in hohList' :key='hoh.index'>
			<el-col>
				<el-col :span='8'>
					<el-form-item label="其他执业点" prop='otherHospital' >
						<el-autocomplete class='width200' :maxlength='40' v-model="hohList[index].otherHospital" :fetch-suggestions="querySearchHisInfo" placeholder="请输入内容" ></el-autocomplete>
					</el-form-item>
				</el-col>
				<el-col :span='8'>
					<el-form-item label="科室" prop='otherDeparment' class='otherDeparment' style='position: absolute;left: 298px;'>
						<el-autocomplete class='width200' :maxlength='40' v-model="hohList[index].otherDeparment" :fetch-suggestions="querySearchHisDeparment" placeholder="请输入内容" ></el-autocomplete>
						<el-col>
		  					<i class='el-icon-delete del delBtn' @click="delBtn(hoh.otherId,index)" v-if='status!=2&&hohList!=""'></i>
						</el-col>
					</el-form-item>
				</el-col>
			</el-col>
		</el-row>
			<el-form-item label="职称" prop='background'>
				<el-select placeholder="---请选择---" v-model="dataForm.background" style='width: 200px;'>
					<el-option :label='hisJob.name' :value='hisJob.id' v-for='(hisJob,index) in hisJobList' :key='index'></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="擅长" prop='strong' style='position: relative;'>
				<el-col class='width606'>
					<el-input type="textarea" :maxlength='200' v-model="dataForm.strong" @input="descInput()" :autosize="{ minRows: 2, maxRows: 10}"></el-input>
					<span style='color: #666;position: absolute;right: 85px;bottom: -30px;'>{{strongLenth}}/200</span>
				</el-col>
			</el-form-item>
			<!--<el-form-item label="证书" prop='doctorCertificate'>-->
			<el-form-item label="证书" >
				<!--<span class='star2'>*</span>-->
				<span class='text'>上传资格证或执业证的第一、二两页，请确保证书上姓名、照片、编号等信息清晰可见</span>
				<el-row style='margin-top: 20px;'>
					<el-col :span="5">
						<el-upload class="avatar-uploader" :action="this.$http.adornUrl(`/common/fileupload/?token=${this.$cookie.get('token')}&watermarke=true`)" :show-file-list="false" :on-success="handleAvatarSuccess1" :on-error="uploaderr" :before-upload="beforeAvatarUpload">
							<img v-if="imageUrl2" :src="imageUrl2" class="avatar">
							<i v-else class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
					</el-col>
					<el-col  :span="5" >
						<el-upload  class="avatar-uploader"  v-if='zsPic' :action="this.$http.adornUrl(`/common/fileupload/?token=${this.$cookie.get('token')}&watermarke=true`)" :show-file-list="false" :on-success="handleAvatarSuccess2" :on-error="uploaderr" :before-upload="beforeAvatarUpload">
							<img v-if="imageUrl3" :src="imageUrl3" class="avatar">
							<i v-else class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
					</el-col>
				</el-row>
			</el-form-item>
		  <el-form-item label="审核" prop='status'>
	  		<el-select v-model="dataForm.status" placeholder="---请选择---" @change='changeStauts()'>
						  <el-option :label='examain.text'  :value='examain.status' v-for='(examain,index) in examinList' :key='examain.status'></el-option>
				  </el-select>
	    </el-form-item>
	    <el-form-item  v-if='dataForm.reason' prop='comments'>
	    		<span class='star4'>*</span>
	    		<label for=""  class='reasonText'>不通过原因</label>
	  		<el-col class='width606'>
	  				<el-input type='textarea' v-model="dataForm.comments"></el-input>
	  		</el-col>
	    </el-form-item>
  	<add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getUploaPhoto" ></add-or-update>
    </el-form>
    <span slot="footer" class="dialog-footer"> 
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
	import AddOrUpdate from '../personalCenter/fill-add-or-update'
  export default {
    data () {
    	var areaProvince = (rule, value, callback) => {
				if(this.dataForm.province == '') {
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
      	title:'信息审核',
        visible: true,
        dataForm: {
        	picture:'',
       		name: '',
          province: '',
          city: '',
          county:'',
          hospital:'',
          otherHospital:'',
          background: '',
          deparment: '',
          strong: '',
          comments:'',
          id:'',
          status:'',         
          reason:''
        },
        examinList:[
          	 {'status':'3','text':'审核通过'},
          	 {'status':'0','text':'审核不通过'}
        ],
        strongLenth:0,
        hospitalText:false,
				deparmentText:false,
        zsPic:false,
				status: 1,
				addOrUpdateVisible:false,
				imageUrl: '',
				imageUrl2: '',
				imageUrl3: '',
				provinceList: [],
				cityList: [],
				countyList: [],
				hisJobList: [],
				hohList:[],
				hisInfo: [],
				hisDept: [],
        dataRule: {
        	name: [
        	  	{ required: true,message: '名字不能为空',trigger: 'blur'}
        	  ],
					area: [
							{ validator: areaProvince,trigger: 'blur'}
						],
//					hospital: [
//							{ required: true,message: '第一执业点不能为空',trigger: 'change'}
//					],
					background: [
							{ required: true,message: '职称不能为空',trigger: 'change'}
					],
//					deparment: [
//							{required: true,message: '科室不能为空',trigger: 'change'}
//					],
			    /*doctorCertificate: [
			        {validator: validPic,trigger: 'blur'}
			    ],*/
        	status: [
            { required: true, message: '请选择审核操作！', trigger: 'change' }
          ],
          comments: [
            { required: true, message: '请填写审核不通过原因！', trigger: 'change' }
          ]
        }
      }
    },
    mounted() {
      	this.loadAll();
      	this.getProvince();
		},
		components: {
      	AddOrUpdate
   	},
    methods: {
    	getHospital () {
				if(!this.dataForm.hospital){
					this.hospitalText=true;
				}else{
					this.hospitalText=false
				}
			},
			getDeparment () {
				if(!this.dataForm.deparment){
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
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
            this.$http({
              url: this.$http.adornUrl('/doctor/getDoctorById/'+this.dataForm.id),
              method: 'post',
              params: this.$http.adornParams({})
            }).then(({data}) => {
            	console.log(data)
              if (data && data.code === 0) {
              	if(data.result.hisJob){
              		this.dataForm.background = data.result.hisJob.id;
              	}
                this.hisJobList = data.result.hisJobList
                this.dataForm.name = data.result.doctor.name
                this.dataForm.province = data.result.province
                this.dataForm.city = data.result.city
                this.dataForm.county = data.result.county
                this.dataForm.hospital = data.result.doctor.hospital
                this.dataForm.deparment = data.result.doctor.deparment
                this.dataForm.comments = data.result.doctor.comments
                this.dataForm.strong = data.result.doctor.strong
                if(data.result.doctor.strong){
               	 	this.strongLenth = data.result.doctor.strong.length;
                }
                this.imageUrl = data.result.doctor.picture
                this.imageUrl2 = data.result.doctor.doctorCertificate
                this.imageUrl3 = data.result.doctor.doctorCertificate2
     						if(data.result.doctor.doctorCertificate){
     							this.zsPic = true
     						}else{
     							this.imageUrl2=''
     							this.zsPic=false
     						}
                this.dataForm.status = data.result.doctor.status
            	  if(data.result.doctor.status==0){
	                	this.dataForm.reason = true
	              }else if(data.result.doctor.status==2||data.result.doctor.status==1){
	              	  this.dataForm.status = ''
	              }
                this.dataForm.id = data.result.doctor.id
                this.dataForm.doctorCertificate = data.result.doctor.doctorCertificate
                this.dataForm.doctorCertificate2 = data.result.doctor.doctorCertificate2
                if(data.result.hpc1){
                	 this.dataForm.province = data.result.hpc1.provCode;
                }
                if(data.result.hpc2){
                		this.cityList= data.result.hpc2List
										this.dataForm.city = data.result.hpc2.provCode;
                }else{
									this.cityList= data.result.hpc2List
								}
								if(data.result.hpc3){
										this.countyList= data.result.hpc3List
										this.dataForm.county= data.result.hpc3.provCode;
								}else{
									this.countyList= data.result.hpc3List
								}
							
              }
            })
        })
      },
      getotherHospital(id) {
				this.dataListLoading = true
				this.$http({
					url: this.$http.adornUrl('/doctor/sysGetOtherinfo/'+id),
					method: 'post',
					params: this.$http.adornParams({})
				}).then(({
					data
				}) => {
					if(data && data.code === 0) {
						this.hohList = data.hohList;
					} else {
						this.$message.error(data.msg)
					}
					this.dataListLoading = false
				})
			},
      // 表单提交
      dataFormSubmit () {
      	let hohArr = [];
      	if(!this.dataForm.hospital){
					this.hospitalText=true
				}else{
					this.hospitalText=false
				}
				if(!this.dataForm.deparment){
					this.deparmentText=true
				}else{
					this.deparmentText=false
				}
      	hohArr = this.hohList;
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('/doctor/checkDoctorInfo'),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id,
                'status': this.dataForm.status,
                'name': this.dataForm.name,
                'comments': this.dataForm.comments,
                'picture' :this.dataForm.picture,
                'province':this.dataForm.province,
                'city':this.dataForm.city,
                'county':this.dataForm.county,
                'hohList': hohArr,
                'hospital':this.dataForm.hospital,
                'background':parseInt(this.dataForm.background),
                'deparment':this.dataForm.deparment,
                'strong':this.dataForm.strong,
                'picture':this.imageUrl,
                'doctorCertificate':this.imageUrl2,
                'doctorCertificate2':this.imageUrl3
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
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
      changeStauts () {
      	if(this.dataForm.status==0){
						this.dataForm.reason = true     		
						this.dataForm.comments = ''     		
      	}else{
      		  this.dataForm.reason = false     		
      	}
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
			uploaderr (){
				this.$message.error('文件上传失败！');
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
										this.hohList.splice(index,1)
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
			getProvince() {
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
						console.log(data)
						this.provinceList = data.provinceList
					} else {
						this.$message.error(data.msg)
					}
					this.dataListLoading = false
				})
			},
			getCity() {
				this.dataListLoading = true
				this.dataForm.city = ''
				this.dataForm.county = ''
				this.$http({
					url: this.$http.adornUrl('/doctor/getProvince'),
					method: 'post',
					params: this.$http.adornParams({
						parentProvCode: this.dataForm.province
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
				this.dataForm.county = ''
				this.$http({
					url: this.$http.adornUrl('/doctor/getProvince'),
					method: 'post',
					params: this.$http.adornParams({
						parentProvCode: this.dataForm.city
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
	 					this.strongLenth = this.dataForm.strong.length;
	      	}
    	}
  }
</script>

<style scoped>
	.marginR{margin-right: 20px;}
	.marginR50{margin-right: 50px;}
	.pictureImg{display: block;width: 100px;height: 100px;}
	.reasonText{color: #e9473a; float: left;position: absolute;right: 100px;left: -81px;width:80px;}
	.star4 {position: absolute;left: -94px;color: #f56c6c;}
	.width200{width: 200px;}
	.width606{width: 606px;}
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
	.del {
		margin-left: 20px;
	}
	
	.star {
		position: absolute;
		left: -50px;
		color: #f56c6c;
	}
	.star1 {
		position: absolute;
		left: 26px;
		top: 6px;
		color: #f56c6c;
	}
	.star3 {
		position: absolute;
		left: 366px;
		top: 7px;
		color: #f56c6c;
	}
	.star2 {
		position: absolute;
		left: -52px;
		color: #f56c6c;
	}
	.pic {
		margin-left: 150px;
		margin-top: 50px;
	}
	.delBtn{position: absolute;top: 10px;left: 220px;}
	.addBtn{position: absolute;top: 0px;left: 515px;}
	.text{position: relative;color: #606266;}
	.otherDeparment{position: relative;right: -4px;}
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
	.avatar1 {
		width: 150px;
		height: 150px;
		display: block;
		border-radius: 50%;
		overflow: hidden;
		cursor: pointer;
		}
		.uploadPhoto{
		width: 150px;
		height: 150px;
		line-height:150px;
		cursor: pointer;
	}
	 .errormsg{color: #f56c6c;font-size: 12px;position: absolute;top: 27px;width: 120px;}
</style>
