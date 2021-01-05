<template>
  <el-dialog
    :title="!dataForm.id ? '编辑检查项目' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
		<el-form :inline="true" :model="dataForm"  @keyup.enter.native="getDataList()">
	      <el-form-item  label="名称" > 
	        <el-input v-model="dataForm.keyName" placeholder="名称" clearable></el-input>
	      </el-form-item>
	      <el-form-item>
	        <el-button type="primary"  @click="findSearch()">查询</el-button>
	      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      

     <!--输入框的展示形式-->
       <el-table-column
		    prop="name"
		    label="名称"
		    align="center">
			    <template slot-scope="scope">
			    <el-select v-model="scope.row.name"  filterable placeholder="请选择" @change="changetype(scope.row)" class='width300'>
				    <el-option
				      v-for="item in options"
				      :key="item.id"
				      :label="item.name"
				      :value="item.id">
				    </el-option>
			  		</el-select>
			    </template>
  		 </el-table-column>
  		 	 
			<el-table-column
		    prop="price"
		    label="价格"
		    align="center">
			    <template slot-scope="scope">
			       <el-input type='text' size="small" v-model="scope.row.price"  placeholder="价格"></el-input>				  
	    		</template>
  		</el-table-column>
      
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="danger" size="small" @click="deleteHandle(scope.row.id,scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align:center;margin-top:30px;margin-left: -130px;">
     <el-button type="success"  @click="add()">添加检查项</el-button>
    </div>
  
		<span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {    	
      return {
      	hisInfo: [],
      	options: [],
      	dataList: [],	
        visible: false,
        dataListLoading:false,
        deparmentText:false,
         dataRule: {
          name: [
            { required: true, message: '名称不能为空', trigger: 'blur' }
          ],

        },
        dataForm: {
        	name:'',
        	keyName:'',
        	price:'',
        	state3: '',
        	checkId:'',
        	manageId:''
        },        
        hisId:null,
        dataRule: {
          name: [
            { required: true, message: '名称不能为空', trigger: 'blur' }
          ],
          describe: [
            { required: true, message: '描述不能为空', trigger: 'blur' }
          ],
          address: [
            { required: true, message: '地址不能为空', trigger: 'blur' }
          ],
          createDate: [
            { required: true, message: '创建时间不能为空', trigger: 'blur' }
          ],
          area: [
            { required: true, message: '状态不能为空', trigger: 'blur' }
          ],
          check: [
            { required: true, message: '检查项不能为空', trigger: 'blur' }
          ]

        }
      }
    },
    mounted() {
      	this.loadAll();
		},
    methods: {
    	deleteHandle(id,index){
		   
    		this.dataList.splice(index,1)
    		
    	},
    	add(){
    		var obj={
    			name:'',
    			checkId:''

    		}
    		 this.dataList.push(obj)
    	},
		  querySearchHisDeparment(queryString, cb) {
  	 		var hisDepts = this.hisDept;
  	 		var results = queryString ? hisDepts.filter(this.createStateFilter(queryString)) : hisDepts;
  	 		cb(results);
  	 	},
  	 	handleSelect1(item) {
      		if(item.value){
      			this.deparmentText=false
      		}else{
      			this.deparmentText=true
      		}
	    },
	    getDeparment () {
				if(!this.dataForm.deparment){
					this.deparmentText=true;
				}else{
					this.deparmentText=false
				}
			},
			
				loadAll() {
        this.$http({
					url: this.$http.adornUrl('/his/hischeckitem/findCheckList'),
					method: 'post',
					data: this.$http.adornData({})
				}).then(({
					data
				}) => {
					if(data && data.code === 0) {
						this.options = data.list;
					} else {
						this.$message.error(data.msg)
					}
				})				
  		},
  		//弹框模糊查询
  		findSearch(){				 		
  			this.$http({
              url: this.$http.adornUrl('/his/hisinfo/findSearch'),
              method: 'post',
              data: this.$http.adornData({
             'id': this.dataForm.manageId,             
              name: this.dataForm.keyName                
              })
            }).then(({data}) => {
           console.log(data.list)
            this.dataList = data.list                       
        })
  		},
  	 	
      init (id) {
        this.visible = true
        this.$nextTick(() => {
        	this.hisId = id;
        	this.getDataList(id)
        })
      },
      //回显
      getDataList(id){
      	this.dataForm.manageId = id;
      	this.$http.getRequest("/his/hisinfo/findCheck",{
					id : id
				  }).then(({data}) => {
            this.dataList = data.list
                        
        })
      },
        // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      changetype(item){  	
      	item.checkId =item.name;
      	item.hospitalManageId= this.hisId;
      	
      },
      // 表单提交
      dataFormSubmit () {  
    	  this.$http({
          url: this.$http.adornUrl('/his/hischeckitem/saveCheck'),
          method: 'post',
          data: JSON.stringify(this.dataList)
        }).then(({data}) => {
	        	if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.$emit('refreshDataList')
              }
            })
          } else {
            this.$message.error(data.msg)
          }          
        })
      }
    }
  }
</script>
<style>
	.width300{
		width: 360px;
	}
</style>
