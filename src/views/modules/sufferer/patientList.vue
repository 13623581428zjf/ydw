<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item label="姓名"> 
        <el-input v-model="dataForm.patientName" placeholder="姓名" clearable></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="dataForm.patientPhoneNum" placeholder="手机号" clearable></el-input>
      </el-form-item>
	      <el-form-item label="关注日期">
	        <div class="block">			 
				    <el-date-picker
				      v-model="value6"
				      value-format="yyyy-MM-dd"
				      placeholder="选择开始日期">
				    </el-date-picker>
				  </div>				  				
	      </el-form-item>
	      <el-form-item >
	        <div class="block">			 
				    <el-date-picker
				      v-model="value7"
				      value-format="yyyy-MM-dd"
				      placeholder="选择结束日期">
				    </el-date-picker>
				  </div>				  
	      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()" type="success">查询</el-button>
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
        prop="patientId"
        header-align="center"
        align="center"
        label="编号">
      </el-table-column>
      <el-table-column
        prop="patientName"
        header-align="center"
        align="center"
        label="姓名">
      </el-table-column>
      <el-table-column
        prop="patientSex"
        header-align="center"
        align="center"
        label="性别">
      </el-table-column>
      <el-table-column
        prop="patientAge"
        header-align="center"
        align="center"
        label="年龄">
      </el-table-column>
       <el-table-column
        prop="patientPhoneNum"
        header-align="center"
        align="center"
        label="手机号">
      </el-table-column>
      <el-table-column
        prop="cardId"
        header-align="center"
        align="center"
        label="身份证号">
      </el-table-column>
      <el-table-column
        prop="relationEntity.fromDate"
        header-align="center"
        align="center"
        label="关注日期">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="warning"  @click="historyCase(scope.row.patientId)" size="small">历史病例</el-button>
          <!--<el-button type="warning" size="small">转诊</el-button>-->
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
    <!--历史病例-->
    <edit-case v-if="editCase" ref="editCase" @refreshDataList="getDataList"></edit-case>
  </div>
</template>

<script>
	import EditCase from "./editCase-add-or-update";
  import AddOrUpdate from './prescriptionList-add-or-update'
  export default {
    data () {
      return {
        dataForm: {
          patientName: '',
          patientPhoneNum: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        editCase:false,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        value6: '',
        value7: ''
      }
    },
    components: {
      AddOrUpdate,EditCase
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
      	console.log(this.value6)
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/hispatient/seletPatientList'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'patientName': this.dataForm.patientName,
            'patientPhoneNum': this.dataForm.patientPhoneNum,
            'beginDate':this.value6,
            'endDate':this.value7,
            'sidx':'create_time',
            'order':'desc'
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
          	console.log(data)
            this.dataList = data.page.list
            this.totalPage = data.page.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
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
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      //历史病例
      historyCase (patientId){
			this.editCase = true;
      this.$nextTick(() => {
        this.$refs.editCase.init(patientId);
      });
		},
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      }     
    }
  }
</script>
