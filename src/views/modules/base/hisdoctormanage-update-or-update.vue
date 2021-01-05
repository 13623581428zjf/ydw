<template>
  <el-dialog
	    :title="!dataForm.id ? '新增医院' : '修改'"
	    :close-on-click-modal="false"
	    :visible.sync="visible">
	    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
	    <el-form-item label="医院名称" prop="name">
	      <el-input v-model="dataForm.name" placeholder="名称"></el-input>
	    </el-form-item>
	    <el-form-item label="描述" prop="describe">
	      <el-input v-model="dataForm.describe" placeholder="描述"></el-input>
	    </el-form-item>

			<el-form-item label="地区" prop='area' style='position: relative;'>
						<el-select placeholder="---请选择---" v-model="dataForm.province" @change='getCity()'  class='width200'>
							<el-option :label='province.name' :value='province.provCode' v-for='(province,index) in provinceList' :key='province.name'></el-option>
						</el-select>
						<el-select placeholder="---请选择---" v-model="dataForm.city" @change='getCounty()'  class='width200'>
							<el-option :label='city.name' :value='city.provCode' v-for='(city,index) in cityList' :key='city.name'></el-option>
						</el-select>
						<el-select placeholder="---请选择---" v-model="dataForm.county"  class='width200'>
							<el-option :label='county.name' :value='county.provCode' v-for='(county,index) in countyList' :key='county.name'></el-option>
						</el-select>
			</el-form-item>
			
			<el-form-item label='详细地址' prop='address'>
	        <el-input class='width200' v-model="dataForm.address" placeholder="站点名称	"  clearable></el-input>
	    </el-form-item>
	      
    
    	<el-form-item label='是否合作' prop='check'>
	        <el-radio v-model="dataForm.radio" label="1">是</el-radio>
		  		<el-radio v-model="dataForm.radio" label="2">否</el-radio>
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
      return {
      	cityList: [],	
        countyList:[],
        provinceList:[],
        visible: false,
        
        dataForm: {
          id:'',
          radio: '1',
          name: '',
          describe: '',
          address: '',
          createDate: '',
          status: '',
          check: '',
          county:''
        },
        dataRule: {
//        name: [
//          { required: true, message: '名称不能为空', trigger: 'blur' }
//        ],
//        describe: [
//          { required: true, message: '描述不能为空', trigger: 'blur' }
//        ],
//        address: [
//          { required: true, message: '地址不能为空', trigger: 'blur' }
//        ],
//        area: [
//          { required: true, message: '创建时间不能为空', trigger: 'blur' }
//        ],
//        check: [
//          { required: true, message: '检查项不能为空', trigger: 'blur' }
//        ]
       }
      }
    },
    methods: {
      init (id) {
      	this.findRegion();
        this.dataForm.id = id || 0
        this.visible = true
				this.findRegion()
				this.updateSite(id)
      },
      //编辑回显
      updateSite(id){
				this.$http.getRequest("/his/hisinfo/findById",{
					id : id
				  }).then(({data}) => {
              console.log(data)
              this.dataForm.id =data.map.id;
              this.dataForm.name=data.map.his_name;
              this.dataForm.describe =data.map.description;
              this.dataForm.province=data.map.prov_code;            
              this.dataForm.city=data.map.parent_prov_id;
              this.dataForm.county= data.map.county_id;           
              this.dataForm.address = data.map.address;
              this.cityList=data.hpc2List;            
              this.countyList=data.hpc3List                                
            })
      },

       //区域查询
      findRegion() {
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
   		
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/his/hisinfo/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'isLeague':this.dataForm.radio,
                'hisName': this.dataForm.name,
                'description': this.dataForm.describe,
                 provCode:this.dataForm.province,
	               parentProvId:this.dataForm.city,
	          		 countyId:this.dataForm.county,
                'address': this.dataForm.address,
                'check': this.dataForm.check
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
      }
    }
  }
</script>
