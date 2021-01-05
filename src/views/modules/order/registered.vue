<template>
  <div class="mod-config">
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
        <el-button @click="getDataList()">查询</el-button>
      </el-form-item>
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
        label="订单号">
      </el-table-column>
      <el-table-column
        prop="create_date"
        header-align="center"
        align="center"
        label="下单时间">
      </el-table-column>
      <el-table-column
        prop="patient_name"
        header-align="center"
        align="center"
        label="患者">
      </el-table-column>
      <el-table-column
        prop="remark"
        header-align="center"
        align="center"
        label="接诊时间">
         <template slot-scope="scope">
           <span>{{scope.row.consultation_time}} {{scope.row.week_day |weekfilters}} <span v-if="scope.row.from_time == '08:00:00'">上午</span><span v-if="scope.row.from_time == '14:00:00'">下午</span> <span v-if="scope.row.from_time == '20:00:00'">晚上</span> </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="remark"
        header-align="center"
        align="center"
        label="医院">
         <template slot-scope="scope">
           <span>{{scope.row.hospital}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="price"
        header-align="center"
        align="center"
        label="价格">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="状态">
      <template slot-scope="scope">
           <span v-if='( scope.row.status=="paid" || scope.row.status=="complete") && scope.row.consultation_status =="N"'>已结束</span>
           <span v-if='scope.row.consultation_status !="N"'>{{scope.row.status |statusfilters}}</span>
        </template>
      </el-table-column>
	  
    </el-table>
  </div>
</template>
<script>
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
  activated () {
  	this.getDataList()
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
            pageSize: this.pageSize,
            type:'register'
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
</style>

