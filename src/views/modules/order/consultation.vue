<template>
  <div class="mod-config">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1">我的会诊</el-menu-item>
      <el-menu-item index="2">专家会诊</el-menu-item>
    </el-menu>
    <el-form :inline="true" :model="dataForm" ref="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item label="订单状态" prop="status">
        <el-select v-model="dataForm.status" placeholder="订单状态">
          <el-option label="全部" value=""></el-option>
          <el-option label="待支付" value="created"></el-option>
          <el-option label="已预约" value="paid"></el-option>
          <!-- <el-option label="进行中" value="4"></el-option> -->
          <el-option label="已取消" value="cancel"></el-option>
          <el-option label="已结束" value="complete"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="会诊日期" prop="time">
        <el-date-picker
          v-model="dataForm.time"
          type="daterange"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions2"
          >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()" type="success">查询</el-button>
      </el-form-item>
      <span class='actionText' v-if='actionText'>默认显示当天的会诊订单</span>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        prop="consultation_id"
        header-align="center"
        align="center"
        width="200"
        label="订单号">
      </el-table-column>
      <el-table-column
        prop="create_date"
        header-align="center"
        align="center"
        width="200"
        label="下单时间">
      </el-table-column>
      <el-table-column
        prop="patient_name"
        header-align="center"
        align="center"
        width="100"
        label="患者">
      </el-table-column>
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        width="100"
        label="申请医生"
       v-if="activeIndex=='1'">
      </el-table-column>
       <el-table-column
        prop="name"
        header-align="center"
        align="center"
        width="100"
        label="会诊医生"
        v-else>
      </el-table-column>
      <el-table-column
        prop="remark"
        header-align="center"
        align="center"
        width="350"
        label="会诊时间">
         <template slot-scope="scope">
           <span>{{scope.row.consultation_time}} {{scope.row.week_day |weekfilters}} {{scope.row.from_time}} ~ {{scope.row.thru_time}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="price"
        header-align="center"
        align="center"
        width="80"
        label="价格">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="100"
        label="状态">
      <template slot-scope="scope">
           <span v-if='activeIndex=="1" &&( scope.row.status=="paid" || scope.row.status=="complete") && scope.row.consultation_status =="N"'>已结束</span>
           <span v-if='activeIndex=="1" && scope.row.consultation_status !="N"'>{{scope.row.status |statusfilters}}</span>
           <span v-if='activeIndex=="2"'>{{scope.row.status |statusfilters}}</span>
        </template>
      </el-table-column>
	 
      <el-table-column
        fixed="right"
        header-align="center"
        align="left"
        label="操作">
        <template slot-scope="scope">
          <el-button type="info" size="small" @click="queryStatus(scope.row.consultation_id)" v-if='scope.row.status=="created" && activeIndex=="2"'>去支付</el-button>
          <el-button type="danger" size="small" @click="underPay(scope.row.consultation_id)" v-if='scope.row.status=="created" && activeIndex=="2"'>线下支付</el-button>
          <el-button type="primary" size="small" @click="seeDetails(scope.row)">详情</el-button>
          <el-button type="text" size="small" @click="startCslt(scope.row)" v-if='scope.row.status=="paid" && activeIndex=="1" && (scope.row.consultation_status =="Y" || scope.row.consultation_status == null)' >发起会诊</el-button>
          <el-button type="text" size="small" @click="startCslt(scope.row)" v-if='scope.row.status=="paid"&& activeIndex=="2" && scope.row.start_ing=="Y"' >接受会诊</el-button>

          <el-button type="text" size="small" v-if='activeIndex=="1" && new Date(new Date(`${scope.row.consultation_time} 00:00:00`).getTime()-3600*1000*12) > new Date() && scope.row.consultation_status !="N" && (scope.row.status == "paid" || scope.row.status == "created")'  @click="offBespeak(scope.row.id)">取消预约</el-button>
          <el-button type="warning" size="small" v-if='activeIndex=="2" && new Date(new Date(`${scope.row.consultation_time} 00:00:00`).getTime()-3600*1000*12) > new Date() && (scope.row.status == "paid" || scope.row.status == "created")'  @click="offBespeak(scope.row.id)">取消预约</el-button>
          <el-button type="text"  size="small" @click="endOrder(scope.row)"  v-if='scope.row.status=="paid" && scope.row.consultation_status=="Y" && activeIndex=="1"'>结束会诊</el-button>
          <el-button type="danger" size="small" @click="endOrder(scope.row)"  v-if='scope.row.status=="paid" && activeIndex=="2" && scope.row.consultation_status=="N"' >结束会诊</el-button>
        	<el-button type="success" size="small" @click="editCase(scope.row)" v-if='activeIndex=="2"&&scope.row.status == "paid"'>编辑病例</el-button>
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
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <order-details v-if="details" ref="seeDetailsModel"></order-details>
    <el-dialog
		  title="提示"
		  :visible.sync="dialogVisible"
		  :before-close="handleClose"
		  width="30%"
		  >
		  <span>支付成功</span>
		  <span slot="footer" class="dialog-footer">
		    <el-button type="primary" @click="handleClose()">确 定</el-button>
		  </span>
		</el-dialog>
  </div>
</template>
<script>
import AddOrUpdate from "./consultation-add-or-update";
import OrderDetails from "./order-details";
export default {
  data() {
    return {
      dataForm: {
        time: "",
        status: ""
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      p: "1",
      details: false,
      activeIndex: "1",
      dialogVisible: false,
      actionText:true,
      pickerOptions2: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "明天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(end.getTime() + 3600 * 1000 * 24);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 3);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
    };
  },
  components: {
    AddOrUpdate,
    OrderDetails
  },
  computed: {
    typeId: {
      get() {
        return this.$store.state.common.typeId;
      },
      set(val) {
        this.$store.commit("common/typeIdChange", val);
      }
    }
  },
  activated () {
    	let href=window.location.href;
      	if(href.indexOf('?')!='-1'){
      		 this.p=href.split('?')[1].split('=')[1];
      	}
      if(this.$route.params.typeId == '2' || this.p =='2' || this.typeId == "2"){ 
      	  this.actionText=false
          this.activeIndex = '2';
          if(this.p=="2"){
          this.dialogVisible  = true;
          }
				 this.getDataList()
          this.p="";
        }else {
         	this.activeIndex = '1';
      	  this.getDataList()
      }
      this.getDataList();
      this.p = "";
  },
  methods: {
    // 获取数据列表
    getDataList() {
      console.log(this.dataForm.time);
      if(this.dataForm.time == null){
         this.$message({
            message: "请选择时间查询",
            type: "success",
            duration: 1500,
         })
      }else{
      this.dataListLoading = true;
        this.$http
          .getRequest("/consultation/findConsultation", {
            style: this.activeIndex,
            fromDate: this.dataForm.time[0] || '',
            thruDate: this.dataForm.time[1] || '',
            status: this.dataForm.status,
            pageIndex: this.pageIndex,
            pageSize: this.pageSize
          })
          .then(({ data }) => {
            console.log(data);
            if (data && data.code === 0) {
              this.dataList = data.page.records;
              this.totalPage = data.page.total;
            } else {
              this.dataList = [];
              this.totalPage = 0;
            }
            this.dataListLoading = false;
          });
      }
      
    },
    handleSelect(key) {
    	if(key==2){
    		this.actionText=false
    	}else{
    		this.actionText=true
    	}
    	this.pageIndex = 1;
	    this.dataForm = {
	      time: "",
	      status: ""
	    };
      this.activeIndex = key;
      this.typeId = key;
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
    //详情
    seeDetails(row) {
      this.details = true;
      this.$nextTick(() => {
        this.$refs.seeDetailsModel.init(row, this.activeIndex);
      });
    },
    //发起会诊
    startCslt(row) {
      this.$router.push({
        name: "consult-video",
        query: {
          patient_name: row.patient_name,
          patient_age: row.patient_age,
          patient_sex: row.patient_sex,
          name: row.name,
          background: row.background,
          hospital: row.hospital,
          deparment: row.deparment,
          activeIndex: this.activeIndex,
          consultation_id: row.consultation_id
        }
      });
    },
    //线下支付
    underPay(id) {
      this.$confirm(`确定使用线下支付？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http
            .postRequest("/consultation/payUnderLine", {
              orderId: id
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
    //取消预约
    offBespeak(id) {
      this.$confirm(`确定对此次预约取消`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http
            .postRequest("/consultation/cancelConsultation", {
              id: `${id}`
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
              } else {
                this.$message.error(data.msg);
              }
            });
        })
        .catch(() => {});
    },
    // 结束
    endOrder(row) {
      console.log(row);
      this.$confirm(`确定要结束此次会诊?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http
            .postRequest("/consultation/endOrder", {
              orderId: row.consultation_id
            })
            .then(({ data }) => {
              if (data && data.code === 0) {
                console.log("+++++++" + data.status);
                this.$message({
                  message: "操作成功",
                  type: "success",
                  duration: 1500,
                  onClose: () => {
                    this.getDataList();
                  }
                });
              } else {
                this.$message.error(data.msg);
              }
            });
        })
        .catch(() => {});
    },
    handleClose(done) {
      this.$router.replace({ name: "order-consultation" });
      this.dialogVisible = false;
    },
    //去支付
    queryStatus(paymentId) {
      //				  window.location.href='http://localhost:8080/alipay/pay?paymentId='+paymentId;
      // 						window.location.href='http://hlwyy.ngrok.yaodouwang.com:8080/alipay/pay?paymentId='+paymentId;
      window.location.href =
        window.SITE_CONFIG["baseUrl"] + "/alipay/pay?paymentId=" + paymentId;
    },
    // 删除
    deleteHandle(id) {
      var ids = id
        ? [id]
        : this.dataListSelections
            .map(item => {
              return item.id;
            })
            .catch(() => {});
    },
    //编辑病例页面
    editCase (row) {
    	this.$router.push({ name: 'editCase',query: { consultation_id: row.consultation_id }})
    }

  }
};
</script>
<style scoped>
.el-menu--horizontal {
  margin-bottom: 20px;
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

