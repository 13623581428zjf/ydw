<template>
  <div class="mod-config"> 	
   <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
   		<el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
			      <el-menu-item index="1">全部</el-menu-item>
			      <el-menu-item index="2">已启用</el-menu-item>
			      <el-menu-item index="3">已禁用</el-menu-item>
       </el-menu>
      <el-form-item  label="名称"> 
        <el-input v-model="dataForm.key" placeholder="名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('sys:hisdoctormanage:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('sys:hisdoctormanage:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
      </el-form-item>
    </el-form>
    
    <a v-if="activeIndex == 1">
    	 <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="id"
        header-align="center"
        align="center"
        label="医院编号">
      </el-table-column>
      <el-table-column
        prop="his_name"
        header-align="center"
        align="center"
        label="名称">
      </el-table-column>
      <el-table-column
        prop="description"
        header-align="center"
        align="center"
        label="描述">
      </el-table-column>
      
      <el-table-column
      		header-align="center"
			    align="center"
			    width="350"
			    label="区域">			         
	     		 <template slot-scope="scope"  class='content'>			      	
		        <div class='pull-left'>
		        	<p style="margin: 0;">{{ scope.row.prov_name }}{{ scope.row.parent_prov_name }}{{ scope.row.county_name }}{{ scope.row.address }}</p>
		        </div>
		       </template>
      </el-table-column>
      
      <el-table-column
        prop="create_date"
        header-align="center"
        align="center"
        label="创建时间">
      </el-table-column>
      
		  <el-table-column
		        header-align="center"
		        align="center"
		        width="200"
		        label="启用状态">			         
	     		 <template slot-scope="scope"  class='content'>			      	
							<el-button type="success" size="small" @click="updateStatus(scope.row.id,is_league='1')" v-if='scope.row.is_league=="2"'>启用</el-button>
							<el-button type="warning" size="small" @click="updateStatus(scope.row.id,is_league='2')" v-if='scope.row.is_league=="1"'>禁用</el-button>										
		       </template>
		  </el-table-column>
      
      <el-table-column
        prop="check"
        header-align="center"
        align="center"
        label="检查项">
        <template slot-scope="scope" >
        	{{scope.row.check}}
           <el-button type="primary" icon="el-icon-edit" circle @click="checkUpdate(scope.row.id)"  size='mini'></el-button>
        </template>
               
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="success" size="small" @click="update(scope.row.id)">修改</el-button>
          <el-button type="danger" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
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
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="id"
        header-align="center"
        align="center"
        label="医院编号">
      </el-table-column>
      <el-table-column
        prop="his_name"
        header-align="center"
        align="center"
        label="名称">
      </el-table-column>
      <el-table-column
        prop="description"
        header-align="center"
        align="center"
        label="描述">
      </el-table-column>
      
      <el-table-column
      		header-align="center"
			    align="center"
			    width="350"
			    label="区域">			         
	     		 <template slot-scope="scope"  class='content'>			      	
		        <div class='pull-left'>
		        	<p style="margin: 0;">{{ scope.row.prov_name }}{{ scope.row.parent_prov_name }}{{ scope.row.county_name }}{{ scope.row.address }}</p>
		        </div>
		       </template>
      </el-table-column>
      
      <el-table-column
        prop="create_date"
        header-align="center"
        align="center"
        label="创建时间">
      </el-table-column>
      
		  <el-table-column
		        header-align="center"
		        align="center"
		        width="200"
		        label="启用状态">			         
	     		 <template slot-scope="scope"  class='content'>			      	
							<el-button type="success" size="small" @click="updateStatus(scope.row.id,is_league='1')" v-if='scope.row.is_league=="2"'>启用</el-button>
							<el-button type="warning" size="small" @click="updateStatus(scope.row.id,is_league='2')" v-if='scope.row.is_league=="1"'>禁用</el-button>										
		       </template>
		  </el-table-column>
      
      <el-table-column
        prop="check"
        header-align="center"
        align="center"
        label="检查项">
        <template slot-scope="scope" >
        	{{scope.row.check}}
           <el-button type="primary" icon="el-icon-edit" circle @click="checkUpdate(scope.row.id)"  size='mini'></el-button>
        </template>
               
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="success" size="small" @click="update(scope.row.id)">修改</el-button>
          <el-button type="danger" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
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
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="id"
        header-align="center"
        align="center"
        label="医院编号">
      </el-table-column>
      <el-table-column
        prop="his_name"
        header-align="center"
        align="center"
        label="名称">
      </el-table-column>
      <el-table-column
        prop="description"
        header-align="center"
        align="center"
        label="描述">
      </el-table-column>
  
      <el-table-column
      		header-align="center"
			    align="center"
			    width="350"
			    label="区域">			         
	     		 <template slot-scope="scope"  class='content'>			      	
		        <div class='pull-left'>
		        	<p style="margin: 0;">{{ scope.row.prov_name }}{{ scope.row.parent_prov_name }}{{ scope.row.county_name }}{{ scope.row.address }}</p>
		        </div>
		       </template>
      </el-table-column>
      
      <el-table-column
        prop="create_date"
        header-align="center"
        align="center"
        label="创建时间">
      </el-table-column>
      
		  <el-table-column
		        header-align="center"
		        align="center"
		        width="200"
		        label="启用状态">			         
	     		 <template slot-scope="scope"  class='content'>			      	
							<el-button type="success" size="small" @click="updateStatus(scope.row.id,is_league='1')" v-if='scope.row.is_league=="2"'>启用</el-button>
							<el-button type="warning" size="small" @click="updateStatus(scope.row.id,is_league='2')" v-if='scope.row.is_league=="1"'>禁用</el-button>										
		       </template>
		  </el-table-column>
      
      <el-table-column
        prop="check"
        header-align="center"
        align="center"
        label="检查项">
        <template slot-scope="scope" >
        	{{scope.row.check}}
           <el-button type="primary" icon="el-icon-edit" circle @click="checkUpdate(scope.row.id)"  size='mini'></el-button>
        </template>
               
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="success" size="small" @click="update(scope.row.id)">修改</el-button>
          <el-button type="danger" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
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
    <!-- 弹窗, 新增 /  -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <!--修改-->
    <update-or-update v-if="updateOrUpdateVisible" ref="updateOrUpdate" @refreshDataList="getDataList"></update-or-update>
    <!--检查项-->
    <check-or-update v-if="checkOrUpdateVisible" ref="checkOrUpdate" @refreshDataList="getDataList"></check-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './hisdoctormanage-add-or-update'
  import UpdateOrUpdate from './hisdoctormanage-update-or-update'
  import CheckOrUpdate  from './hisdoctormanage-check-or-update'
  
  export default {
    data () {
      return {
        dataForm: {
          key: ''
        },
        activeIndex:'1',
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        updateOrUpdateVisible:false,
        checkOrUpdateVisible:false,
        dataListSelections: [],
        addOrUpdateVisible: false
      }

    },
    components: {
      AddOrUpdate,UpdateOrUpdate,CheckOrUpdate
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
      	if (this.activeIndex == 1) {
		      	this.dataListLoading = true
		        this.$http({
		          url: this.$http.adornUrl('/his/hisinfo/list'),
		          method: 'get',
		          params: this.$http.adornParams({
		          	'name':this.dataForm.hisName,
		          	'provName':this.dataForm.province,
		          	'parentProvName':this.dataForm.city,
		          	'countyName':this.dataForm.county,
		          	'address':this.dataForm.address,
		            'page': this.pageIndex,
		            'limit': this.pageSize,
		            'key': this.dataForm.key
		          })
		        }).then(({data}) => {
		        	console.log(data)
		          if (data && data.code === 0) {
		            this.dataList = data.page.list
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
		          url: this.$http.adornUrl('/his/hisinfo/list'),
		          method: 'get',
		          params: this.$http.adornParams({
		          	'name':this.dataForm.name,
		          	'provName':this.dataForm.province,
		          	'parentProvName':this.dataForm.city,
		          	'countyName':this.dataForm.county,
		          	isLeague:'1',
		          	'address':this.dataForm.address,
		            'page': this.pageIndex,
		            'limit': this.pageSize,
		            'key': this.dataForm.key
		          })
		        }).then(({data}) => {
		        	console.log(data)
		          if (data && data.code === 0) {
		            this.dataList = data.page.list
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
		          url: this.$http.adornUrl('/his/hisinfo/list'),
		          method: 'get',
		          params: this.$http.adornParams({
		          	'name':this.dataForm.name,
		          	'provName':this.dataForm.province,
		          	'parentProvName':this.dataForm.city,
		          	'countyName':this.dataForm.county,
		          	isLeague:'2',
		          	'address':this.dataForm.address,
		            'page': this.pageIndex,
		            'limit': this.pageSize,
		            'key': this.dataForm.key
		          })
		        }).then(({data}) => {
		        	console.log(data)
		          if (data && data.code === 0) {
		            this.dataList = data.page.list
		            this.totalPage = data.page.totalCount
		          } else {
		            this.dataList = []
		            this.totalPage = 0
		          }
		          this.dataListLoading = false
		        })
		     }
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
      handleSelect(key) {
      	this.activeIndex = key;
        this.getDataList();
      
    },
    	//检查项弹框
    	checkUpdate(id){
    		this.checkOrUpdateVisible=true
    		this.$nextTick(() => {
          this.$refs.checkOrUpdate.init(id)
        })
    	},
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      //修改
      update(id){
      	this.updateOrUpdateVisible= true
      		this.$nextTick(() => {
          this.$refs.updateOrUpdate.init(id)
        })
      },
      //修改启用状态
   		updateStatus(id,is_league){ 		
        this.$confirm(`确定此操作吗?`,{
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(() => {
          this.$http
            .postRequest("/his/hisinfo/update", {
              id:id,
              isLeague:is_league
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
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定进行删除操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/his/hisinfo/delete'),
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
        })
      }
    }
  }
</script>
