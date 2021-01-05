<template>
   <div class="mod-config" >
   	<div style="margin-bottom: 20px;">
		  <el-button
		    size="small"
		    @click="addTab(editableTabsValue2)">添加处方
		  </el-button>
		</div>
  	<el-tabs v-model="editableTabsValue2" type="card" closable @tab-remove="removeTab" @tab-click='getList(editableTabsValue2)'>
  <el-tab-pane v-for="(item, index) in editableTabs2" :key="item.name" :label="item.title" :name="item.name">
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%;">
      <el-table-column
        prop="id"
        header-align="center"
        align="center"
        label="商品名称">
      </el-table-column>
      <el-table-column
        prop="id"
        header-align="center"
        align="center"
        label="规格">
      </el-table-column>
      <el-table-column
        prop="paramKey"
        header-align="center"
        align="center"
        label="数量">
      </el-table-column>
      <el-table-column
        prop="paramValue"
        header-align="center"
        align="center"
        label="用量">
      </el-table-column>
      <el-table-column
        prop="remark"
        header-align="center"
        align="center"
        label="用法">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class='addProduct' @click='addProduct()'>
    	选择商品或模板
    </div>
     <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
  </el-tab-pane>
</el-tabs>
 		<div class="side-model" v-show="dialogTableVisible" @click='closeDialog()'>
        <div class="side-content">
            <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
			    <el-tab-pane label="选择商品" name="first">
			    	<el-input  placeholder="请输入内容" class='searchContent'></el-input>
			    	<el-button type="primary">搜索</el-button>
			    	<div>
			    		<!--<el-select placeholder="请选择"  class='selectStyle'>-->
						    <!--<el-option
						      v-for="item in options"
						      :key="item.value"
						      :label="item.label"
						      :value="item.value">
						    </el-option>-->
						  <!--</el-select>-->
			    	</div>
			    	<el-table
				      :data="dataList"
				      border
				      v-loading="dataListLoading"
				      style="width: 100%;margin: 20px 0;">
				      <el-table-column
				        type="selection"
				        header-align="center"
				        align="center"
				        width="50">
				      </el-table-column>
				      <el-table-column
				        prop="remark"
				        header-align="center"
				        align="center"
				        label="名称">
				      </el-table-column>
				       <el-table-column
				        prop="remark"
				        header-align="center"
				        align="center"
				        label="规格">
				      </el-table-column>
				       <el-table-column
				        prop="remark"
				        header-align="center"
				        align="center"
				        label="单价">
				      </el-table-column>
				    </el-table>
				    <el-pagination
				      @size-change="sizeChangeHandle1"
				      @current-change="currentChangeHandle1"
				      :current-page="pageIndex"
				      :page-sizes="[10, 20, 50, 100]"
				      :page-size="pageSize"
				      :total="totalPage"
				      layout="total, sizes, prev, pager, next, jumper">
				    </el-pagination>
				    <div class="closeBtn">
				    	<el-button>添加</el-button>&nbsp;&nbsp;&nbsp;
				     	<el-button>添加并关闭</el-button>
				    </div>
				    
			    </el-tab-pane>
			    <el-tab-pane label="选择模板" name="second" class='tabChoose'>选择模板</el-tab-pane>
			</el-tabs>
        </div>
   </div>
  </div>
</template>
<script>
	export default {
    props:['recipleList'],
    data() {
      return {
      	pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
      	dataListLoading:false,
      	dialogTableVisible:false,
      	activeName2: 'first',
      	dataList:[],
        editableTabsValue2: '1',
        editableTabs2: [{
          title: '处方1',
          name: '1'
        }],
        tabIndex: 1
      }
    },
    methods: {
    	//添加tab标签
      addTab(targetName) {
        let newTabName = ++this.tabIndex + '';
        this.editableTabs2.push({
          title: '处方'+newTabName,
          name: newTabName
        });
        this.editableTabsValue2 = newTabName;
      },
      //移除tab标签
      removeTab(targetName) {
        let tabs = this.editableTabs2;
        let activeName = this.editableTabsValue2;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }
        this.editableTabsValue2 = activeName;
        this.editableTabs2 = tabs.filter(tab => tab.name !== targetName);
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
        // 选择商品的分页-每页数
      sizeChangeHandle1 (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle1 (val) {
        this.pageIndex = val
        this.getDataList()
      },
      //获取处方数据
      getList (index) {
      	console.log(index)
      },
      //选择商品或模板
      addProduct(){
      	this.dialogTableVisible=true
      },
      handleClick(tab, event) {
        console.log(tab, event);
      } ,
      //关闭右侧框
      closeDialog(){
      	var btn = document.querySelector(".side-content");
        if(btn){
            if(!btn.contains(event.target)){
                this.dialogTableVisible = false;
            }
        }
      }
    }
  }
</script>
<style scoped>
	.addProduct{width: 100%;height: 35px;line-height: 35px;background-color: #ccc;
	margin-top: 20px;text-align: center;cursor: pointer;}
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

@keyframes sideslip {
  0% {
    right: -100%;
  }
  100% {
    right: -70%;
  }
}
.searchContent{width: 300px;margin: 0 20px;}
.selectStyle{width: 400px;display:block;margin: 20px 0 0 20px;}
.closeBtn{margin-top: 500px;margin-left: 150px;}
</style>
