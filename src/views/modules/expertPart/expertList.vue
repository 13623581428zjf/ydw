<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item label='姓名'>
        <el-input class='width200' v-model="dataForm.name" placeholder="姓名" clearable></el-input>
      </el-form-item>
       <el-form-item label='医院'>
        <el-input class='width200' v-model="dataForm.hospital" placeholder="医院" clearable></el-input>
      </el-form-item>
       <el-form-item label='科室'>
        <el-input class='width200' v-model="dataForm.deparment" placeholder="科室" clearable></el-input>
      </el-form-item>
       <el-form-item label='疾病'>
        <el-input class='width200' v-model="dataForm.strong" placeholder="疾病" clearable></el-input>
      </el-form-item>
      <el-form-item label="职称" prop='background'>
				<el-select placeholder="---请选择---" v-model="dataForm.background" class='width200'>
					<el-option value=''>---请选择---</el-option>
					<el-option :label='hisJob.name' :value='hisJob.id' v-for='(hisJob,index) in hisJobList' :key='index'></el-option>
				</el-select>
			</el-form-item>
      <el-form-item>
        <el-button @click="search()" type="success">查询</el-button>
        <!--<el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>-->
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        header-align="center"
        align="center"
        width="400"
        label="专家">
	      <template slot-scope="scope"  class='content'>
	      	<img :src="scope.row.picture" alt=""  class='picture' v-if='scope.row.picture'/>
          <img src="~@/assets/img/default.jpg"  class='picture' v-else >
	        <div class='pull-left'>
	        	<p style="margin: 0;">{{ scope.row.name }}&nbsp;&nbsp;{{ scope.row.hisJobTitleEntity.name }}</p><br/>
	        	<p style="margin: 0;">{{ scope.row.hospital }}&nbsp;{{ scope.row.deparment }}</p>
	        </div>
	      </template>
      </el-table-column>
      <el-table-column
        prop="strong"
        header-align="center"
        align="center"
        label="擅长">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="300"
        label="操作">
        <template slot-scope="scope">
          <!-- <el-button type="text" size="small" >修改</el-button> -->
          <!--<el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>-->
          <el-button type="success" size="small" @click="bespeak(scope.row,scope.$index)">会诊</el-button>
          <el-button type="warning" size="small" @click="bespeak(scope.row,scope.$index)">转诊</el-button>
          <el-button type="primary" size="small" @click="teamInvite(scope.row,scope.$index)">邀请</el-button>
          <el-button type="danger" size="small">留言</el-button>
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
    <!-- 预约会诊 -->
    <div class="side-model" v-show="dialogTableVisible" @click="changeDialong()">
        <div class="side-content">
            <ul v-if="sideList.length !='0'">
              <li class="clearfix" v-for="(item,index) in sideList" :key="index"  @click.stop="oneGroup(item)">
                <span style="display:inline-block; float:left;">{{item.date}} {{item.week|weekfilters}} {{item.fromTime|areaCut}}~{{item.thruTime|areaCut}}</span>
                <span v-if="item.visitsNum != item.num" style="display:inline-block; float:right;margin-right:20px;">&yen; {{item.price}} </span>
                <span v-else style="display:inline-block; float:right;margin-right:20px;">约满</span>
                </li>
            </ul>
            <h5 v-else style="font-size:24px;color:#999;margin:auto;height:35px;width:265px;line-height:32;">该医生还未添加医生排班</h5>
        </div>
    </div>
    <!--团队邀请-->
    <div class="side-model" v-show="team" >

        <div class="side-content">
						<ul v-if="sideList.length !='0'">
								 
                
              <li class="clearfix" v-for="(item,index) in sideList">
              	
                <span style="display:inline-block; float:left;">
                		<el-checkbox v-model="item.checked" style=" float:left;margin-right:10px;" @change="checkedItem(item)"></el-checkbox>
                		<span style="display: block;">
                			{{item.text}}
                		</span>
                </span>
              </li>
            </ul>
            <h5 v-else style="font-size:24px;color:#999;margin:auto;height:35px;width:265px;line-height:32;">您还没有创建团队</h5>
            
             <template >
            	<div style="text-align: center;margin-top: 30px;">
            		<el-button @click="invite()" type="primary" >邀请</el-button>
             	<el-button type="primary" @click="closeDialong()">取消</el-button>
            	</div>
             </template >
        </div>
           
            
           
    </div>
    
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>
<script>
import AddOrUpdate from "./expertList-add-or-update";
export default {
  data() {
    return {
    	 checked: false,
      dataForm: {
        name: "",
        hospital: "",
        deparment: "",
        strong: "",
        background:''
      },

      dataList: [],
      checkedItemList:[],
      sideList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      dialogTableVisible: false,
      team:false,
      hisJobList:[],
      receiverId:''
      
    };
  },
  components: {
    AddOrUpdate
  },
  activated() {
    this.getDataList();
    this.getInfo();
  },
  methods: {
  	getInfo() {
  			this.dataListLoading = true
				this.$http
            .postRequest("/his/hisjobtitle/listAll")
            .then(({ data }) => {
              console.log(data)
              this.hisJobList=data.job
            })
			},
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl("/doctor/getExpert"),
        method: "get",
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          name: this.dataForm.name,
          hospital: this.dataForm.hospital,
          deparment: this.dataForm.deparment,
          strong: this.dataForm.strong,
          background: this.dataForm.background,
          sidx:'create_date',
          order:'desc'
        })
      }).then(({ data }) => {
      	console.log(data)
        if (data && data.code === 0) {
          this.dataList = data.page.list;
          this.totalPage = data.page.totalCount;
        } else {
          this.dataList = [];
          this.totalPage = 0;
        }
        this.dataListLoading = false;
      });
    },
    checkedItem(item){
    	this.checkedItemList.push(item.team_id);	
    },
    //邀请添加
    invite(){
    	if (this.checkedItemList&&this.checkedItemList.length<=0) {
    		  this.$message({
          message: '请选择邀请的团队',
          type: 'success'
        }) 
    	}else{
    		this.$http.postRequest("/team/sendInvite", { 
    			 'teamId':this.checkedItemList[0],
    			 'receiverId':this.receiverId
        })
        .then(({ data }) => {       	
          if (data && data.code === 0) {         
            //this.sideList = data.page.list
            this.closeDialong()
            this.$message({
	          message: '邀请成功',
	          type: 'success'
        }) 
          } else {
            this.sideList = [];
          }
        });
    	}

    },
    search(){
    	this.pageIndex = 1;
    	this.getDataList();
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getDataList();
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.getDataList();
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val;
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id);
      });
    },
    //预约会诊
    bespeak(row,index) {
    	document.documentElement.scrollTop='0'
      this.dialogTableVisible = true;
      this.$http.getRequest("/schedulingDate/findScheduling", {
          schedulingType: "consultation",
          partyId: row.partyId
        })
        .then(({ data }) => {
          if (data && data.code === 0) {
            console.log(data);
            
            this.sideList = data.data;
            for(let i=0; i<this.sideList.length;i++){
                this.sideList[i].doctorPartyId = row.partyId;
            }
          } else {
            this.sideList = [];
          }
        });
    },
    //团队邀请
     teamInvite(row,index) {
    	document.documentElement.scrollTop='0'
      this.team = true;
      this.$http.getRequest("/team/findAllTeam", {         
        })
        .then(({ data }) => {
        	console.log(row);
          if (data && data.code === 0) {
            for(var i=0;i<data.page.list.length;i++){
            		data.page.list[i].checked = false;
            }
            this.sideList = data.page.list
            this.receiverId=row.partyId

          } else {
            this.sideList = [];
          }
        });
    },
    changeDialong() {
      this.dialogTableVisible = false;
    },
    closeDialong() {
      this.team = false;
    },
    oneGroup(row) {
      if(row.num != row.visitsNum){
        this.addOrUpdateVisible = true;
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(row);
       });
      }else {
        this.addOrUpdateVisible = false;
        this.$message({
          message: '预约已满',
          type: 'success'
        })        
      }
      this.dialogTableVisible = false;
    }
  }
};
</script> 
<style scoped>
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
.side-model {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
  margin: 0;
  z-index: 200;
  background: rgba(0, 0, 0, 0.3);
}
.side-content {
  width: 30%;
  position: relative;
  background: #fff;
  border-radius: 2px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  min-width: 30%;
  height: 100%;
  right: -100%;
  z-index: 210;
  overflow-y: auto;
  animation: sideslip 1s forwards;
}
.side-content ul {
  padding: 0;
  margin: 0;
}
.side-content ul li {
  list-style: none;
  padding: 20px 0 20px 10px;
  cursor: pointer;
  border-bottom: 1px solid #eeeeee;
}
.side-content ul li:hover {
  background-color: #17b3a3;
  color: #fff;
}
@keyframes sideslip {
  0% {
    right: -100%;
  }
  100% {
    right: -70%;
  }
}
	.picture{
		width:70px;
		height: 70px;
		float: left;
		margin-right: 20px;
	}
	.pull-left{
		float: left;
		text-align: left;
	}
</style>
