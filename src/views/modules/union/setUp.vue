<template>
  <div class="mod-config" >
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
	      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
			      <el-menu-item index="1">我创建的</el-menu-item>
			      <el-menu-item index="2">我加入的</el-menu-item>	
			      <el-button type="success" class="site" size="small"  @click="addSite()" style='position: absolute;right: 20px;'>创建团队</el-button>
       </el-menu>
    </el-form>
     
    <a v-if="activeIndex == 1">
	    	<el-table
		      :data="dataList"
		      border
		      v-loading="dataListLoading"
		      style="width: 100%;">  
	  			<el-table-column
			        header-align="center"
			        align="center"
			        width="500"
			        label="创建人">
		     		 <template slot-scope="scope"  class='content'>
			      	<img :src="scope.row.picture" alt=""  class='picture' v-if='scope.row.picture'/>
		          <img src="~@/assets/img/default.jpg"  class='picture' v-else >
			        <div class='pull-left'>
			        	<p style="margin: 0;">{{ scope.row.name }}&nbsp;&nbsp;&nbsp;&nbsp;{{ scope.row.titleName }}</p><br/>
			        	<p style="margin: 0;">{{ scope.row.hospital }}&nbsp;&nbsp;&nbsp;&nbsp;{{ scope.row.deparment }}</p>
			        </div>
			      </template>
	    	  </el-table-column>
	      	      
		      <el-table-column
		        prop="text"
		        header-align="center"
		        align="center"
		        label="团队介绍">
		      </el-table-column>
	      
		      <el-table-column
		        fixed="right"
		        header-align="center"
		        align="center"
		        width="300"
		        label="操作">
			        <template slot-scope="scope">
			          <el-button type="success" size="small" @click="findText(scope.row.team_id)">编辑介绍</el-button>
			          <el-button type="primary" size="small" @click="findUser(scope.row.team_id)">查看成员</el-button>
			          <el-button type="warning" size="small" @click="dissolveTeam(scope.row.team_id)">解散团队</el-button>
			        </template>
		      </el-table-column>
	    </el-table>   	
    </a>
    
     <a v-if="activeIndex == 2">
	    	<el-table
	      :data="dataList"
	      border
	      v-loading="dataListLoading"
	      style="width: 100%;">  
	      <el-table-column
			        header-align="center"
			        align="center"
			        width="500"
			        label="创建人">
		     		 <template slot-scope="scope"  class='content'>
			      	<img :src="scope.row.picture" alt=""  class='picture' v-if='scope.row.picture'/>
		          <img src="~@/assets/img/default.jpg"  class='picture' v-else >
			        <div class='pull-left'>
			        	<p style="margin: 0;">{{ scope.row.name }}&nbsp;&nbsp;&nbsp;&nbsp;{{ scope.row.titleName }}</p><br/>
			        	<p style="margin: 0;">{{ scope.row.hospital }}&nbsp;&nbsp;&nbsp;&nbsp;{{ scope.row.deparment }}</p>
			        </div>
			      </template>
    	  </el-table-column>
	      
	      <el-table-column
	        prop="text"
	        header-align="center"
	        align="center"
	        label="团队介绍">
	      </el-table-column>
	      
	      <el-table-column
	        fixed="right"
	        header-align="center"
	        align="center"
	        width="300"
	        label="操作">
		        <template slot-scope="scope">
		          <el-button type="success" size="small" @click="findUser(scope.row.team_id)">查看成员</el-button>
		          <el-button type="warning" size="small" @click="escTeam(scope.row.team_id)">退出团队</el-button>
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
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <find-user-all v-if="findUserVisible" ref="FindUserAll" @refreshDataList="getDataList"></find-user-all>
    <add-or-add v-if="addUserVisible" ref="addUserAll" @refreshDataList="getDataList"></add-or-add>
  </div>
</template>

<script>
	import AddOrUpdate from './setUp-add-or-update'
	import FindUserAll from './join-find-or-user'
	import AddOrAdd from './setUp-add-or-add'
  export default {
    data () {
      return {
        dataForm: {
          paramKey: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        activeIndex:'1',
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        findUserVisible:false,
        addUserVisible:false
      }
    },
    components: {
      AddOrUpdate,FindUserAll,AddOrAdd
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
		          url: this.$http.adornUrl('/team/findAllTeam'),
		          method: 'get',
		          params: this.$http.adornParams({
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
		          url: this.$http.adornUrl('/team/jionTeam'),
		          method: 'get',
		          params: this.$http.adornParams({
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
      //  修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      //回显数据
      findText(team_id){
      	this.addOrUpdateVisible = true     	
        this.$nextTick(() => {
        this.$refs.addOrUpdate.init(team_id)
          
        })
      },
   		//查询团队成员
   		findUser(team_id){
   			this.findUserVisible=true
   			 this.$nextTick(() => {
         this.$refs.FindUserAll.init(team_id)         
        })
   			
   		},
   		
   		//解散团队
   		dissolveTeam(team_id){ 		
        this.$confirm(`确定解散团队操作吗?`,{
        confirmButtonText: "确定",
        cancelButtonText: "取消",

      })
        .then(() => {
          this.$http
            .postRequest("/team/update", {
              teamId:team_id,
              status:"N"
            })
            .then(({ data }) => {
              console.log(data);
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
   		//创建团队   		
   		addSite(){
   			 this.addUserVisible=true
   			 this.$nextTick(() => {
         this.$refs.addUserAll.init()         
       })  			
   		},
   		  		
   		//退出团队
   		escTeam(team_id){ 		
        this.$confirm(`确定退出团队吗?`,{
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(() => {
          this.$http
            .postRequest("/team/escTeam", {
              teamId:team_id,
              status:"N"
            })
            .then(({ data }) => {
              console.log(data);
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
{
	 background: green;
	 width: 20px;
	 height: 20px;
	 display: inline-block;
	 text-align: center;
	 line-height: 20px;
	 position: absolute;
	 right: 10px;
}
</style>