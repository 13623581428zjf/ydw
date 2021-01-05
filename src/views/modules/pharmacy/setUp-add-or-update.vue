<template>
  <el-dialog
    :title="!dataForm.id ? '编辑自提站点' : '自提站点'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm"  ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="68px">     
      <el-form-item label="名称" prop='name'>
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
			<el-form-item label='详细地址' >
	        <el-input class='width200' v-model="dataForm.address" placeholder="详细地址	"  clearable></el-input>
	    </el-form-item>
</el-form-item>
    </el-form>
	    <span slot="footer" class="dialog-footer">
		    <el-button @click="visible = false">取 消</el-button>
		    <el-button type="primary" @click="dataFormSubmit(dataForm.site_id)">确 定</el-button>
      </span>
</el-dialog>
</template>


<script>
  export default {
    data () {
      return {
        visible: false,
        provinceList:[],
        cityList:[],
        countyList:[],
        site_id:'',
        dataForm: {         
	          name:'',
	          county:'',   
	          province:'',
	          provCode:'',
	          city:'',
	          address:''
          }
       }
    },
    methods: {
      init (site_id) {
		this.site_id=site_id
        this.visible = true
		this.findRegion()
		this.updateSite(site_id)
      },

      //编辑回显
      updateSite(site_id){
				this.$http.getRequest("/site/findSiteId",{
					siteId : site_id
				  }).then(({data}) => {
              console.log(data)
              this.dataForm.site_id=site_id;
              this.dataForm.name=data.siteEntity.name;
              this.dataForm.province=data.siteEntity.prov_code;            
              this.dataForm.city=data.siteEntity.parent_prov_id;
              this.dataForm.county= data.siteEntity.county_id;           
              this.dataForm.address = data.siteEntity.address;
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
      // 数据列表	     
      getDataList () {      		
		      	this.dataListLoading = true
		        this.$http({
		          url: this.$http.adornUrl('/site/findSiteAll'),
		          method: 'post',
		          params: this.$http.adornParams({
		          	'site_id':this.dataForm.site_id,
		          	'name':this.dataForm.name,
		          	'provName':this.dataForm.province,
		          	'parentProvName':this.dataForm.city,
		          	'countyName':this.dataForm.county,
		          	'address':this.dataForm.address,
		            'page': this.pageIndex,
		            'limit': this.pageSize,
		            'paramKey': this.dataForm.paramKey

		          })
		        }).then(({data}) => {
		          if (data && data.code === 0) {
		          this.dataList = data.page.list;
		           this.totalPage = data.page.totalCount
		          } else {
		            this.dataList = []
		            this.totalPage = 0
		          }
		          this.dataListLoading = false		            	
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
      dataFormSubmit (id) {
      	     this.$refs['dataForm'].validate((valid) => {
	           this.$http.postRequest("/site/addSite",{
	           		 siteId:id,
	           		 name:this.dataForm.name,
	           		 provCode:this.dataForm.province,
	               parentProvId:this.dataForm.city,
	          		 countyId:this.dataForm.county,
	          		 address:this.dataForm.address
         		 
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
	          
	        })
      	 

      }
      
      
      
      
    }
  }
</script>
