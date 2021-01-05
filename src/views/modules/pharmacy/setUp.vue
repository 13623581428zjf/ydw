<template>
  <div class="mod-config" >
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
	      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
			      <el-menu-item index="1">全部</el-menu-item>
			      <el-menu-item index="2">已启用</el-menu-item>
			      <el-menu-item index="3">已禁用</el-menu-item>
       	  </el-menu>
	  	<el-form-item label='名称' >
	        <el-input class='width200' v-model="dataForm.name" placeholder="站点名称	"  clearable></el-input>
	    </el-form-item>
	      
	    <el-form-item label="区域" prop='area' style='position: relative;'>
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
	      
	      <el-form-item style='margin-left: 10px;'>
	        <el-button type="success"  @click="getDataList()">查询</el-button>
	      </el-form-item>
	      
	      <el-form-item>
	     	 	<el-button type="primary" @click='saveSite()'>创建自提站点</el-button>
	      </el-form-item>
    </el-form>
   
    <a v-if="activeIndex == 1">
	    	<el-table
		      :data="dataList"
		      border
		      v-loading="dataListLoading"
		      @selection-change="selectionChangeHandle"
		      style="width: 100%;">  
		      <!-- 选择框 -->
					<el-table-column
	        type="selection"
	        header-align="center"
	        align="center"
	        width="50">
	     	 </el-table-column>
	      	  
	  			<el-table-column
			        header-align="center"
			        align="center"
			        width="150"
			        label="编号">			         
		     		 <template slot-scope="scope"  class='content'>			      	
			        <div class='pull-left'>
			        	<p style="margin: 0;">{{ scope.row.site_id }}</p>
			        </div>
			       </template>
	    	  </el-table-column>
    	      
		      <el-table-column
			        header-align="center"
			        align="center"
			        width="300"
			        label="名称">			         
		     		 <template slot-scope="scope"  class='content'>			      	
			        <div class='pull-left'>
			        	<p style="margin: 0;">{{ scope.row.name }}</p>
			        </div>
			       </template>
	    	  </el-table-column>
	    	  
	    	  <el-table-column
			        header-align="center"
			        align="center"
			        width="350"
			        label="区域">			         
		     		 <template slot-scope="scope"  class='content'>			      	
			        <div class='pull-left'>
			        	<p style="margin: 0;">{{ scope.row.prov_name }}{{ scope.row.parent_prov_name }}{{ scope.row.county_name }}</p>
			        </div>
			       </template>
	    	  </el-table-column>
	    	  
	    	  <el-table-column
			        header-align="center"
			        align="center"
			        width="350"
			        label="详细地址">			         
		     		 <template slot-scope="scope"  class='content'>			      	
			        <div class='pull-left'>
			        	<p style="margin: 0;">{{ scope.row.address }}</p>
			        </div>
			       </template>
	    	  </el-table-column>
	    	  
	    	  <el-table-column
			        header-align="center"
			        align="center"
			        width="200"
			        label="启用状态">			         
		     		 <template slot-scope="scope"  class='content'>			      	
 								<el-button type="success" size="small" @click="updateStatus(scope.row.site_id,status='Y')" v-if='scope.row.status=="N"'>启用</el-button>
 								<el-button type="warning" size="small" @click="updateStatus(scope.row.site_id,status='N')" v-if='scope.row.status=="Y"'>禁用</el-button>										
			       </template>
	    	  </el-table-column>
    
		      <el-table-column
		        fixed="right"
		        header-align="center"
		        align="center"
		        width="200"
		        label="操作">
			        <template slot-scope="scope">		         
			          <el-button type="primary" size="small" @click="updateSite(scope.row.site_id)">编辑</el-button>
			          <el-button type="danger" size="small"  @click="deleteSite(scope.row.site_id)">删除</el-button>
			        </template>
		      </el-table-column>	
		      
	    </el-table>   	
    </a>
    
    <a v-if="activeIndex == 2">
	    	<el-table
		      :data="dataList"
		      border
		      v-loading="dataListLoading"
		      @selection-change="selectionChangeHandle"
		      style="width: 100%;">  
		      <!-- 选择框 -->
			<el-table-column
		        type="selection"
		        header-align="center"
		        align="center"
		        width="50">
	     	 </el-table-column>
	      	  
	  		<el-table-column
			        header-align="center"
			        align="center"
			        width="150"
			        label="编号">			         
		     		 <template slot-scope="scope"  class='content'>			      	
			        <div class='pull-left'>
			        	<p style="margin: 0;">{{ scope.row.site_id }}</p>
			        </div>
			       </template>
	    	  </el-table-column>
    	      
		      <el-table-column
			        header-align="center"
			        align="center"
			        width="300"
			        label="名称">			         
		     		 <template slot-scope="scope"  class='content'>			      	
			        <div class='pull-left'>
			        	<p style="margin: 0;">{{ scope.row.name }}</p>
			        </div>
			       </template>
	    	  </el-table-column>
	    	  
	    	  <el-table-column
			        header-align="center"
			        align="center"
			        width="350"
			        label="区域">			         
		     		 <template slot-scope="scope"  class='content'>			      	
			        <div class='pull-left'>
			        	<p style="margin: 0;">{{ scope.row.prov_name }}{{ scope.row.parent_prov_name }}{{ scope.row.county_name }}</p>
			        </div>
			       </template>
	    	  </el-table-column>
	    	  
	    	  <el-table-column
			        header-align="center"
			        align="center"
			        width="350"
			        label="详细地址">			         
		     	   <template slot-scope="scope"  class='content'>			      	
				        <div class='pull-left'>
				        	<p style="margin: 0;">{{ scope.row.address }}</p>
				        </div>
			       </template>
	    	  </el-table-column>
	    	  
	    	  
	    	  <el-table-column
			        header-align="center"
			        align="center"
			        width="200"
			        label="启用状态">			         
		     	   <template slot-scope="scope"  class='content'>			      	
 								<el-button type="success" size="small" @click="updateStatus(scope.row.site_id,status='Y')" v-if='scope.row.status=="N"'>启用</el-button>
 								<el-button type="warning" size="small" @click="updateStatus(scope.row.site_id,status='N')" v-if='scope.row.status=="Y"'>禁用</el-button>										
			       </template>
	    	  </el-table-column>
    
		      <el-table-column
		        fixed="right"
		        header-align="center"
		        align="center"
		        width="200"
		        label="操作">
			        <template slot-scope="scope">		         
			          <el-button type="primary" size="small" @click="updateSite(scope.row.site_id)">编辑</el-button>
			          <el-button type="danger" size="small"  @click="deleteSite(scope.row.site_id)">删除</el-button>
			        </template>
		      </el-table-column>	     
	    </el-table>  
    </a>
    
    <a v-if="activeIndex == 3">
	    	<el-table
		      :data="dataList"
		      border
		      v-loading="dataListLoading"
		      @selection-change="selectionChangeHandle"
		      style="width: 100%;">  
		      <!-- 选择框 -->
		     <el-table-column
		        type="selection"
		        header-align="center"
		        align="center"
		        width="50">
	     	 </el-table-column>
	      	  
	  		 <el-table-column
			        header-align="center"
			        align="center"
			        width="150"
			        label="编号">			         
		     		 <template slot-scope="scope"  class='content'>			      	
			        <div class='pull-left'>
			        	<p style="margin: 0;">{{ scope.row.site_id }}</p>
			        </div>
			       </template>
	    	  </el-table-column>
    	      
		      <el-table-column
			        header-align="center"
			        align="center"
			        width="300"
			        label="名称">			         
		     		 <template slot-scope="scope"  class='content'>			      	
			        <div class='pull-left'>
			        	<p style="margin: 0;">{{ scope.row.name }}</p>
			        </div>
			       </template>
	    	  </el-table-column>
	    	  
	    	  <el-table-column
			        header-align="center"
			        align="center"
			        width="350"
			        label="区域">			         
		     		 <template slot-scope="scope"  class='content'>			      	
			        <div class='pull-left'>
			        	<p style="margin: 0;">{{ scope.row.prov_name }}{{ scope.row.parent_prov_name }}{{ scope.row.county_name }}</p>
			        </div>
			       </template>
	    	  </el-table-column>
	    	  
	    	  <el-table-column
			        header-align="center"
			        align="center"
			        width="350"
			        label="详细地址">			         
		     		 <template slot-scope="scope"  class='content'>			      	
			        <div class='pull-left'>
			        	<p style="margin: 0;">{{ scope.row.address }}</p>
			        </div>
			       </template>
	    	  </el-table-column>
	    	  	  
	    	  <el-table-column
			        header-align="center"
			        align="center"
			        width="200"
			        label="启用状态">			         
		     		 <template slot-scope="scope"  class='content'>			      	
 								<el-button type="success" size="small" @click="updateStatus(scope.row.site_id,status='Y')" v-if='scope.row.status=="N"'>启用</el-button>
 								<el-button type="warning" size="small" @click="updateStatus(scope.row.site_id,status='N')" v-if='scope.row.status=="Y"'>禁用</el-button>										
			       </template>
	    	  </el-table-column>
    
		       <el-table-column
		        fixed="right"
		        header-align="center"
		        align="center"
		        width="200"
		        label="操作">
			        <template slot-scope="scope">		         
			          <el-button type="primary" size="small" @click="updateSite(scope.row.site_id)">编辑</el-button>
			          <el-button type="danger" size="small"  @click="deleteSite(scope.row.site_id)">删除</el-button>
			        </template>
		      </el-table-column>	     
	    </el-table>   	
    </a>
          
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-site v-if="addSite" ref="addsiteAll" @refreshDataList="getDataList"></add-or-site>
    <save-or-site v-if="savesite" ref="savesiteAll" @refreshDataList="getDataList"></save-or-site>
  </div>
</template>

<script>
import AddOrSite from './setUp-add-or-update'
import SaveOrSite from './save-add-or-update'
  export default {
    data () {
      return {
        dataForm: {
          paramKey: '',
          input: '',
          site_id:'',
          name:'',
          prov_code:'',
          parent_prov_id:'',
          county: '',
          county_id:'',
          address:'',
          status:'',
          parentProvCode:''
        },
        dataList: [],
        cityList: [],	
        countyList:[],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        activeIndex:'1',
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        addSite:false,
        savesite:false,
        provinceList:[]
      }
    },
    components: {
	    AddOrSite,SaveOrSite
    },
    //初始化加载
    activated () {
      this.getDataList()
      this.findRegion()
    },
    methods: {
    	
      // 数据列表	     
      getDataList () {      		
      	 if (this.activeIndex == 1) {
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
		      }
      	if (this.activeIndex == 2) {
		      	this.dataListLoading = true
		        this.$http({
		          url: this.$http.adornUrl('/site/findSiteAll'),
		          method: 'get',
		          params: this.$http.adornParams({
		          	'site_id':this.dataForm.site_id,
		          	'name':this.dataForm.name,
		          	'status':"Y",
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
		      }
      	if (this.activeIndex == 3) {
		      	this.dataListLoading = true
		        this.$http({
		          url: this.$http.adornUrl('/site/findSiteAll'),
		          method: 'get',
		          params: this.$http.adornParams({
		          	'site_id':this.dataForm.site_id,
		          	'name':this.dataForm.name,
		          	'provName':this.dataForm.province,
		          	'parentProvName':this.dataForm.city,
		          	'countyName':this.dataForm.county,
		          	'address':this.dataForm.address,
		          	'status':"N",
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
		      }
      },

      handleSelect(key) {
      	this.activeIndex = key;
        this.getDataList();
      
    },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      //创建站点
      saveSite(){
      	this.savesite=true;
      	this.$nextTick(() => {
        this.$refs.savesiteAll.init()          
        })
      },
      // 多选删除
      selectionChangeHandle (val) {
        this.dataListSelections = val
        console.log(this.dataListSelections)
      },

      //编辑
      updateSite(site_id){
      	this.addSite = true     	
        this.$nextTick(() => {
        this.$refs.addsiteAll.init(site_id)          
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
   		
   		//修改启用状态
   		updateStatus(site_id,status){ 		
        this.$confirm(`确定此操作吗?`,{
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(() => {
          this.$http
            .postRequest("/site/updateStatus", {
              siteId:site_id,
              status:status
            })
            .then(({ data }) => {
              if (data && data.code === 0) {
                this.$message({
                  message: "操作成功",
                  type: "success",
                  duration: 1500,
                  onClose: () => {
                  this.getDataList();
                  }
                });
              }
            });
        })
        .catch(() => {});
   		},
   		// 删除
      deleteSite (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/site/delSite'),
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
            } else {
              this.$message.error(data.msg)
            }
          })
        }).catch(() => {})
      }      		
    }
  }
</script>
<style scoped>
.el-menu--horizontal {
  margin-bottom: 20px;
}
.width200{width: 200px;}
.picture {
  width: 70px;
  height: 70px;
  float: left;
  margin-right: 20px;
}
.pull-left {
  float: left;
  text-align: left;
}
.el-menu--horizontal > .el-menu-item {
  height: 35px;
  line-height: 35px;
  border-radius: 10px 10px 0 0;
}
.el-menu--horizontal > .el-menu-item.is-active {
  background: #17b3a3;
  color: #ffffff;
}
.actionText{font-size:12px;color: #e9473a;position: relative;top: 10px;}
</style>