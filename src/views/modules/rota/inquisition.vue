<template>
  <div class="mod-config">
    <el-form :inline="true">
      <el-form-item>
        <el-button type="primary" @click="addWeek(addPrice,textPrice)">新增排班</el-button>
        <el-button type="danger" @click="lastWeek()">上一周</el-button>
        <el-button type="danger" @click="thisWeek()">本周</el-button>
        <el-button type="danger" @click="nextWeek()">下一周</el-button>
        <span>&nbsp;&nbsp;&nbsp;{{day}}</span>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      :row-class-name="tableRowClassName"
      :span-method="objectSpanMethod"
      v-loading="dataListLoading"
      style="width: 100%;">
      <el-table-column
        header-align="center"
        align="center"
        width="200"
        label="日期"
        >
        <template slot-scope="scope">
            <p> {{ scope.row.date }} {{ scope.row.weekDay | weekfilter}}</p>
         </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="时间">
         <template slot-scope="scope">
            <p> {{ scope.row.fromTime | areaCut}} ~ {{ scope.row.thruTime | areaCut}}</p>
         </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="接诊人数">
         <template slot-scope="scope">
            <p> {{ scope.row.num}} / {{ scope.row.visitsNum}}</p>
         </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="类型">
        <template slot-scope="scope">
            <p v-if="scope.row.inquisitionType=='video'"> 视频 </p>          
            <p v-if="scope.row.inquisitionType=='text'">图文</p>
            <p v-if="scope.row.inquisitionType=='all'">视频&nbsp;/&nbsp;图文</p>
         </template>
      </el-table-column>
      <el-table-column
        prop="price"
        header-align="center"
        align="center"
        label="价格">
        <template slot-scope="scope">
            <p v-if="scope.row.price&&!scope.row.textPrice">&yen; {{scope.row.price}}</p>
            <p v-if="!scope.row.price&&scope.row.textPrice">&yen; {{scope.row.textPrice}}</p>
            <p v-if="scope.row.price&&scope.row.textPrice">&yen;{{scope.row.price}}&nbsp;/ &yen;{{scope.row.textPrice}}</p>
         </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="200"
        label="操作">
        <template slot-scope="scope">
          <!-- <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">加号</el-button> -->
          <el-button type="text" size="small" v-if=" (scope.row.isLoop == 'Y' || scope.row.thruDate != null) && new Date(`${scope.row.date} ${scope.row.fromTime}`).getTime() > time && new Date(`${scope.row.date}`).getTime() != new Date(`${scope.row.thruDate}`).getTime()" @click="stopCycle(scope.row)">停止循环</el-button>
          <el-button type="text" size="small" v-if=" scope.row.isLoop && new Date(`${scope.row.date} ${scope.row.fromTime}`).getTime() > time " @click="cancel(scope.row,scope.$index)">取消</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from "./inquisition-add-or-update";
export default {
  data() {
    return {
      dataList: [],
      dataListLoading: false,
      addOrUpdateVisible: false,
      day: 0,
      arr1: [],
      week: 0,
      time:new Date().getTime(),
      addPrice:0,
      textPrice:0
    }
  },
  filters: {
    weekfilter: function(value) {
      if (!value) {
        return "";
      } else if (value == 1) {
        return "星期一";
      } else if (value == 2) {
        return "星期二";
      } else if (value == 3) {
        return "星期三";
      } else if (value == 4) {
        return "星期四";
      } else if (value == 5) {
        return "星期五";
      } else if (value == 6) {
        return "星期六";
      } else if (value == 7) {
        return "星期日";
      } else {
        return "休息休息";
      }
    }
  },
  components: {
    AddOrUpdate
  },
  activated() {
    this.getDataList();
  },
  methods: {
    //计算合并数
    setdates(arr) {
      // console.log(arr)
      var obj = {},
        k,
        arr1 = [];
      this.arr1 = [];
      for (var i = 0, len = arr.length; i < len; i++) {
        k = arr[i].date;
        if (obj[k]) {
          obj[k]++;
        } else {
          obj[k] = 1;
        }
      }
      // console.log(obj)
      //保存结果{el-'元素'，count-出现次数}
      for (var o in obj) {
        for (let i = 0; i < obj[o]; i++) {
          if (i === 0) {
            this.arr1.push(obj[o]);
          } else {
            this.arr1.push(0);
          }
        }
      }
      // console.log(this.arr1);
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0) {
          if (this.arr1[rowIndex] !== 0) {
            return {
              rowspan: this.arr1[rowIndex],
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
    },
    //添加颜色
    tableRowClassName({row, rowIndex}){
      if (!row.fromTime) {
          return 'warning-row';
        } 
        return '';
    },
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      this.$http
        .getRequest("/schedulingDate/findSchedulingByWeek", {
          week: this.week,
          schedulingType: "inquisition"	
        })
        .then(({ data }) => {
          if (data && data.code === 0) {
            this.day = data.day;
            console.log(data)
            this.dataList = data.List;
            this.addPrice = data.price;
            this.textPrice = data.textPrice; 
            this.setdates(data.List);
          } else {
            this.dataList = [];
          }
            this.dataListLoading = false;
        });
    },
    //上一周
    lastWeek() {
      this.week--;
      this.getDataList();
    },
    //本周
    thisWeek() {
      this.week = 0;
      this.getDataList();
    },
    //下周
    nextWeek() {
      this.week++;
      this.getDataList();
    },
    // 新增
    addWeek(addPrice,textPrice) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
      this.getDataList();
        this.$refs.addOrUpdate.init(addPrice,textPrice);
      });
    },
    
    
    
    //停止循环
    stopCycle(row) {
      this.$http
        .postRequest("/schedulingDate/stopLoop", {
          id: `${row.id}`,
          date: row.date
        })
        .then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              message: "操作成功",
              type: "success"
            });
            this.getDataList();
          } else {
            this.$message.error(data.msg);
          }
        });
    },
    //取消
    cancel(row, index) {
      console.log(index);
      this.$confirm(`确定对此条排班进行删除操作?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http
            .postRequest("/schedulingDate/deleScheduling", {
              id: `${row.id}`,
              date: row.date,
              fromTime:row.fromTime
            })
            .then(({ data }) => {
              if (data && data.code === 0) {
                this.$message({
                  message: "操作成功",
                  type: "success"
                });
                this.getDataList();
              } else {
                this.$message.error(data.msg);
              }
            });
        })
        .catch(() => {});
    }
  }
};
</script>
<style >
 .el-table .warning-row {
    background: oldlace;
  }

</style>

