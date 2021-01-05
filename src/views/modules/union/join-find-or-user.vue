<template>
<div>
<el-dialog title="团队成员" :visible.sync="dialogTableVisible">
  <el-table :data="list">
    <el-table-column property="doctorName" label="创建人" width="350">
		  <template slot-scope="scope"  class='content'>
			  <img :src="scope.row.picture" alt=""  class='picture' v-if='scope.row.picture'/>
		    <img src="~@/assets/img/default.jpg"  class='picture' v-else >
			  <div class='pull-left'>
			      <p style="margin: 0;">{{ scope.row.doctorName }}&nbsp;&nbsp;&nbsp;&nbsp;{{ scope.row.titleName }}</p><br/>
			      <p style="margin: 0;">{{ scope.row.hospital }}&nbsp;&nbsp;&nbsp;&nbsp;{{ scope.row.deparment }}</p>
			  </div>
			</template>   	
    </el-table-column>
    <el-table-column property="remark" label="擅长" width="200"></el-table-column>
    <el-table-column property="address" label="操作">
	    	<template slot-scope="scope">
				  <el-button type="success" size="small" @click="findText(scope.row.team_id)">关注</el-button>
				  <el-button type="primary" size="small" @click="deleteDoctor(scope.row.team_id,scope.row.user_id)">删除成员</el-button>
				  <el-button type="warning" size="small" @click="dissolveTeam(scope.row.team_id)">预约会诊</el-button>
				  <el-button type="danger" size="small" @click="dissolveTeam(scope.row.team_id)">在线留言</el-button>
	      </template>
    	
    </el-table-column>
  </el-table>
  <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
</el-dialog>
</div>
</template>
<script>
  export default {
    data() {
      return {
        list: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dialogTableVisible: false,
        dialogFormVisible: false,
        formLabelWidth: '120px',
        item_id:''
      };
    },
    methods: {
      init (id) {
      	this.item_id=id
        this.dialogTableVisible = true
        this.getDadtaList()
      },
      getDadtaList(){
          this.$nextTick(() => {
          this.dataListLoading = true;
	        this.$http.getRequest("/team/findDoctor", 
	        	{
	            teamId: this.item_id,
	            'page': this.pageIndex,
	            'limit': this.pageSize
	          }).then(({ data }) => {
	            console.log(data);
	            this.list = data.list.list;
	             this.totalPage = data.list.totalCount
	          });         
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDadtaList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDadtaList()
      },
      //删除团队成员
   		deleteDoctor(team_id,user_id){ 		
        this.$confirm(`确定删除此成员吗?`,{
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(() => {
          this.$http
            .postRequest("/team/deleteDoctor", {
              teamId:team_id,
              userId:user_id,
              status:"N"
            })
            .then(({ data }) => {
              if (data && data.code === 0) {
                this.$message({
                  message: "操作成功",
                  type: "success",
                  duration: 1500,
                  onClose: () => {
                    this.getDadtaList();
                  }
                });
              }
            });
        })
        .catch(() => {});
   		}
    }
  };
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