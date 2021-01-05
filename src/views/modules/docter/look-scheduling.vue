<template>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
    style='overflow: hidden;'
    :visible.sync="visible">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1">挂号排班</el-menu-item>
      <el-menu-item index="2">问诊排班</el-menu-item>
      <el-menu-item index="3">会诊排班</el-menu-item>
    </el-menu>
     <el-form :inline="true">
      <el-form-item>
        <el-button type="danger" @click="lastWeek()">上一周</el-button>
        <el-button type="danger" @click="thisWeek()">本周</el-button>
        <el-button type="danger" @click="nextWeek()">下一周</el-button>
        <span>&nbsp;&nbsp;&nbsp;{{day}}</span>
      </el-form-item>
    </el-form>
    <!--挂号排班表格-->
    <el-table
    	v-if='activeIndex==1'
      :data="dataList"
      border
      :row-class-name="tableRowClassName"
      :span-method="objectSpanMethod"
      v-loading="dataListLoading"
      style="width: 100%;height: 551px;overflow-y: auto;">
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
         		<p v-if="scope.row.fromTime == '08:00:00'"> 上午</p>
     				<p v-if="scope.row.fromTime == '14:00:00'"> 下午</p>
     				<p v-if="scope.row.fromTime == '20:00:00'"> 晚上</p>
            <!--<p > {{ scope.row.fromTime | areaCut}} ~ {{ scope.row.thruTime | areaCut}}</p>-->
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
        label="医院">
        <template slot-scope="scope">
            <p> {{ scope.row.hospital}} </p>
         </template>
      </el-table-column>
      <el-table-column
        prop="price"
        header-align="center"
        align="center"
        label="价格">
        <template slot-scope="scope">
            <p v-if="scope.row.fromTime">&yen; {{scope.row.price}}</p>
            <p v-else>无</p>
         </template>
      </el-table-column>
    </el-table>
     <!--问诊表格-->
     <el-table
     	v-if='activeIndex==2'
      :data="dataList"
      border
      :row-class-name="tableRowClassName"
      :span-method="objectSpanMethod"
      v-loading="dataListLoading"
      style="width: 100%;height: 551px;overflow-y: auto;">
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
    </el-table>
     <!--会诊表格-->
     <el-table
     		v-if='activeIndex==3'
      :data="dataList"
      border
      :row-class-name="tableRowClassName"
      :span-method="objectSpanMethod"
      v-loading="dataListLoading"
      style="width: 100%;height: 551px;overflow-y: auto;">
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
            <p v-if="scope.row.fromTime"> 视频</p>
            <p v-else>无</p>
         </template>
      </el-table-column>
      <el-table-column
        prop="price"
        header-align="center"
        align="center"
        label="价格">
        <template slot-scope="scope">
            <p v-if="scope.row.fromTime">&yen; {{scope.row.price}}</p>
            <p v-else>无</p>
         </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>
<script>
  export default {
    data () {
      return {
      	title:'查看排班',
        visible: false,
        activeIndex: "1",
        day: 0,
        arr1: [],
        week: 0,
        dataListLoading: false,
        time:new Date().getTime(),
        dataList:[],
        partyId:''
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
    methods: {
      init (partyId) {
        this.visible = true
        this.activeIndex='1'
        this.partyId=partyId
      	this.getDataList2()
      },
    //添加颜色
    tableRowClassName({row, rowIndex}){
      if (!row.fromTime) {
          return 'warning-row';
        } 
        return '';
    },
    // 获取数据列表(会诊排班)
    getDataList() {
      this.dataListLoading = true;
      this.$http
        .getRequest("/schedulingDate/findSchedulingByWeek", {
          week: this.week,
          schedulingType:"consultation",
          partyId:this.partyId
        })
        .then(({ data }) => {
        	console.log(data)
          if (data && data.code === 0) {
            this.day = data.day;
            this.dataList = data.List;
            this.setdates(data.List);
          } else {
            this.dataList = [];
          }
          this.dataListLoading = false;
        });
    },
    //获取问诊排班
     getDataList1() {
      this.dataListLoading = true;
	      this.$http
	        .getRequest("/schedulingDate/findSchedulingByWeek", {
	          week: this.week,
	          schedulingType: "inquisition"	,
	          partyId:this.partyId
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
    //获取挂号排班
    getDataList2() {
      this.dataListLoading = true;
      this.$http
        .getRequest("/schedulingDate/findSchedulingByWeek", {
          week: this.week,
          schedulingType: "register",
          partyId:this.partyId
        })
        .then(({ data }) => {
          if (data && data.code === 0) {
            this.day = data.day;
            console.log(data)
            this.dataList = data.List;
            this.addPrice = data.price;

            this.setdates(data.List);
          } else {
            this.dataList = [];
          }
          this.dataListLoading = false;
        });
    },
    handleSelect(key) {
     	this.activeIndex = key;
     	this.week=0;
     	if(key==2){
     		this.getDataList1()
     	}else if(key==3){
     		this.getDataList()
     	}else if(key==1){
     		this.getDataList2()
     	}
    },
    //计算合并数
    setdates(arr) {
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
     //上一周
    lastWeek() {
      this.week--;
      if(this.activeIndex=='2'){
      	this.getDataList1();
      }else if(this.activeIndex=='3'){
      	this.getDataList();
      }else if(this.activeIndex=='1'){
      	this.getDataList2();
      }
    },
    //本周
    thisWeek() {
      this.week = 0;
      if(this.activeIndex=='2'){
      	this.getDataList1();
      }else if(this.activeIndex=='3'){
      	this.getDataList();
      }else if(this.activeIndex=='1'){
      	this.getDataList2();
      }
    },
    //下周
    nextWeek() {
      this.week++;
      if(this.activeIndex=='2'){
      	this.getDataList1();
      }else if(this.activeIndex=='3'){
      	this.getDataList();
      }else if(this.activeIndex=='1'){
      	this.getDataList2();
      }
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
    }
    }
  }
</script>
<style scoped>
.el-table .warning-row {
    background: oldlace;
  }
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
