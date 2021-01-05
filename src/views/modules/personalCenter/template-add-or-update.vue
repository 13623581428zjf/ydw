<template>
	<el-dialog :title="!dataForm.id ? '处方模板' : '修改'" :close-on-click-modal="false" :visible.sync="visible">
		<el-form :inline="true" :model="dataForm" :rules="dataRule"  @keyup.enter.native="getDataList()">
			<el-form-item label="模板名称" prop="keyName">
				 <el-input v-model="dataForm.keyName" placeholder="模板名称" clearable></el-input>
			</el-form-item>	
			<el-form-item>
				<el-button type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
			</el-form-item>
		</el-form>
		<el-table 
			:data="dataList" 
			border v-loading="dataListLoading" 
			@selection-change="selectionChangeHandle" 
			style="width: 100%;">
			<el-table-column 
				type="selection" 
				header-align="center" 
				align="center" 
				width="50">
			</el-table-column>

			<!--输入框的展示形式-->
			<el-table-column prop="medicinesName" label="商品名称" align="center">
				<template slot-scope="scope">
					<el-select v-model="scope.row.medicinesName"  filterable placeholder="请选择" @change="changetype(scope.row,scope.$index)" class='width300'>
						<el-option 
							v-for="item in options" 
							:key="item.id" 
							:label="item.medicinesName" 
							:value="item.medicinesName">
						</el-option>
					</el-select>
				</template>
			</el-table-column>

			<el-table-column 
				prop="single" 
				header-align="center" 
				align="center" 
				width="80" 
				label="规格">
			</el-table-column>
			<el-table-column 
				 prop="medicinesNum" 
				 label="数量"
				 align="center" >
				<template slot-scope="scope">
					<el-input type='text' size="small" v-model="scope.row.quantity" placeholder="数量"></el-input>
				</template>
			</el-table-column>

			<el-table-column prop="tips" label="用量" align="center">
				<template slot-scope="scope">
					<el-input type='text' size="small" v-model="scope.row.tips" placeholder="用量"></el-input>
				</template>
			</el-table-column>

			<el-table-column 
				prop="usage" 
				header-align="center" 
				align="center" 
				width="80" 
				label="用法">
			</el-table-column>
			<el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
				<template slot-scope="scope">
					<el-button type="danger" size="small" @click="deleteHandle(scope.row.id,scope.$index)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div style="text-align:center;margin-top:30px;margin-left: -130px;">
			<el-button type="success" @click="add()">添加检查项</el-button>
		</div>
		<span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">保存</el-button>
    </span>
	</el-dialog>
</template>

<script>
	export default {
		data() {
			return {
				quantity:0,
				hisInfo: [],
				options: [],
				dataList: [],
				visible: false,
				dataListLoading: false,
				deparmentText: false,
				dataRule: {
				name: [{
					required: true,
					message: '名称不能为空',
					trigger: 'blur'
				}],
				},
				dataForm: {
					name: '',
					keyName: '',
					price: '',
					state3: '',
					checkId: '',
					manageId: ''
				},
				hisId: null,
				dataID:'',
				dataListSelections:[],
				dataRule: {
					keyName: [{
						required: true,
						message: '名称不能为空',
						trigger: 'blur'
					}]
				}
			}
		},
	mounted() {
		this.loadAll();
	},
	methods: {
		init(id) {
			this.visible = true
			if(!id){
				this.dataID='';
				this.dataForm.keyName='';
				this.dataList=[]
			}else{
				this.getDataList(id)
				this.dataID=id
			}
		},
  	  // 删除
      deleteHandle (id,index) {
      	if (this.dataID) {
      		var ids = id ? [id] : this.dataListSelections.map(item => {
            return item.id
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/recipeTemplateItem/delRecipeTempItem'),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                this.getDataList(this.dataID)
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }).catch(() => {})
      	}else{
    	   this.dataList.splice(index,1)
      	}
      },
		add() {
			var obj = {
				single: '',
				medicinesName:'',
				usage:'',
				medicinesNum:'',
				unit:'',
				tips:'',
				quantity:1
			}
			this.dataList.push(obj)
		},
		querySearchHisDeparment(queryString, cb) {
			var hisDepts = this.hisDept;
			var results = queryString ? hisDepts.filter(this.createStateFilter(queryString)) : hisDepts;
			cb(results);
		},
		handleSelect1(item) {
			if(item.value) {
				this.deparmentText = false
			} else {
				this.deparmentText = true
			}
		},
		getDeparment() {
			if(!this.dataForm.deparment) {
				this.deparmentText = true;
			} else {
				this.deparmentText = false
			}
		},

		loadAll() {
			this.$http({
				url: this.$http.adornUrl('/goods/findMedicinesList'),
				method: 'get',
				data: this.$http.adornData({})
			}).then(({
				data
			}) => {
				if(data && data.code === 0) {
					this.options = data.page.list;
				} else {
					this.$message.error(data.msg)
				}
			})
		},
		changetype(item, index) {
			this.$http.getRequest('/goods/findMedicinesList', {
				'medicinesName':item.medicinesName
			}).then(({
				data
			}) => {
				this.loadAll() 
				this.options = data.page.list;
				item.single =this.options[0].single;
				item.tips =this.options[0].tips;
				item.medicinesNum =this.options[0].medicinesNum;
				item.usage =this.options[0].usage;
			})
		},

		//回显
		getDataList(id) {
			this.dataForm.manageId = id;
			this.$http.getRequest("/recipeTemplateItem/getInfoById/"+id).then(({
				data
			}) => {
				this.dataList = data.dataList,
				this.dataForm.keyName=data.keyName
			})
		},
		// 多选
		selectionChangeHandle(val) {
			this.dataListSelections = val
		},

		// 表单提交
		dataFormSubmit() {
		 if(!this.dataForm.keyName){
	 		this.$message({
			message: '模板名称不能为空!',
			type: 'warning'
			})
		 }else{			 		
			 this.$http.postRequest("/recipeTemplate/createOrUpdate", {
		     //'id': 0, 
		     'id':this.dataID ? this.dataID : 0,
       		 'templateName':this.dataForm.keyName,        
       		 recipeTempList:this.dataList
			}).then(({
				data
			}) => {
				if(data && data.code === 0) {
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
}
</script>
<style>
	.width300 {
		width: 160px;
	}
</style>