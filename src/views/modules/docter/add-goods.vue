<template>
	<el-dialog :title="title" :close-on-click-modal="false" :before-close="handleClose" :visible.sync="visible">
		<div class="mod-config">
			<el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
				<el-menu-item index="1">全部({{totalCount}})</el-menu-item>
				<el-menu-item index="2">已选择({{pharmacyCount}})</el-menu-item>
			</el-menu>
			<el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" label-width="80px">
				<el-form-item>
					<el-input class='width200' v-model="dataForm.medicinesNum" placeholder="编号" clearable></el-input>
				</el-form-item>
				<el-form-item>
					<el-input class='width200' v-model="dataForm.medicinesName" placeholder="名称" clearable></el-input>
				</el-form-item>
				<el-form-item>
					<el-select placeholder="---全部信息类型---" v-model="dataForm.medicinesType">
						<el-option value=''>---全部信息类型---</el-option>
						<el-option :label='type.medicinesTypeName' :value='type.medicinesTypeId' v-for='(type,index) in typeList' :key='index'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-cascader placeholder="---全部分类---" :v-model="dataForm.classId" :options="options" :show-all-levels="false" :clearable="true" @click.native='sele()'></el-cascader>
				</el-form-item>
				<el-form-item>
					<el-button @click="getDataList()" type="primary">查询</el-button>
				</el-form-item>
			</el-form>
			<el-table :data="dataList" border @selection-change="selectionChangeHandle" style="width: 100%;">
				<el-table-column type="selection" header-align="center" align="center" width="50">
				</el-table-column>
				<el-table-column prop="medicinesNum" header-align="center" align="center" width="150" label="账号">
				</el-table-column>
				<el-table-column width="350" label="商品名称">
					<div slot-scope="scope" class='content' style="display: flex;width: 100%;height: 100px;">
						<div style="width: 30%;height: 100%;height: 100%;text-align: center;line-height: 100px;">
							<img style="margin: 14px 13px;" :src="scope.row.imgUrl" alt="" class='picture' v-if='scope.row.imgUrl' />
							<img style="margin: 14px 13px;" src="~@/assets/img/default.jpg" class='picture' v-else>
						</div>
						<div style="width: 70%;margin-top: -2px;line-height: 14px;padding-left: 20px;">
							<p>{{ scope.row.medicinesName }}</p>
							<p>{{ scope.row.single }}{{ scope.row.unit }}</p>
							<p>{{ scope.row.producer }}</p>
						</div>
					</div>
				</el-table-column>
				<el-table-column prop="medicinesTypeName" header-align="center" align="center" label="信息类型">
				</el-table-column>
				<el-table-column fixed="right" header-align="center" align="center" label="操作">
					<template slot-scope="scope">
						<el-button type="primary" size="small" @click="addPharmacy(scope.row.medicinesNum)" v-if="activeIndex == '1'">选择</el-button>
						<el-button type="primary" size="small" @click="delPharmacy()" v-if="activeIndex == '2'">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-button v-if="activeIndex == '1'" type="danger" @click="addPharmacy()" :disabled="dataListSelections.length <= 0" style='margin-top: 20px;'>全部加入</el-button>
			<el-button v-if="activeIndex == '2'" type="danger" @click="delPharmacy()" :disabled="dataListSelections.length <= 0" style='margin-top: 20px;'>全部删除</el-button>
			<el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
			</el-pagination>
		</div>
	</el-dialog>
</template>
<script>
	export default {
		data() {
			return {
				dataForm: {
					id: 0,
					imgUrl: '',
					medicinesNum: '',
					medicinesName: '',
					medicinesType: '',
					classId: '',
					unit: '',
					single: '',
					producer: '',
					medicinesTypeName: ''
				},
				checked: false,
				visible: false,
				partyId: '',
				title: '选择商品',
				activeIndex: "1",
				typeList: [],
				classList: [],
				dataList: [],
				pharmacyId: '',
				pageIndex: 1,
				pageSize: 10,
				totalPage: 0,
				totalCount: 0,
				pharmacyCount: 0,
				dataListSelections: [],
				options: [{
					value: 'zhinan',
					label: '指南',
					children: [{
						value: 'shejiyuanze',
						label: '设计原则',
						children: [{
							value: 'yizhi',
							label: '一致'
						}, {
							value: 'fankui',
							label: '反馈'
						}, {
							value: 'xiaolv',
							label: '效率'
						}, {
							value: 'kekong',
							label: '可控'
						}]
					}, {
						value: 'daohang',
						label: '导航',
						children: [{
							value: 'cexiangdaohang',
							label: '侧向导航'
						}, {
							value: 'dingbudaohang',
							label: '顶部导航'
						}]
					}]
				}]
			}
		},
		methods: {
			init(partyId) {
				console.log(partyId)
				this.activeIndex = "1"
				this.visible = true
				this.partyId = partyId;
				this.getPharmacyId();
			},
			handleClose() {
				this.visible = false
			},
			cancle() {
				this.visible = false;
			},
			handleSelect(key) {
				console.log(key)
				if(key == 2) {
					this.actionText = false
					this.getPharmacyList();
				} else {
					this.actionText = true
					this.getDataList();
				}
				this.pageIndex = 1;
				this.activeIndex = key;
			},
			//通过partyId获取医生药房编码
			getPharmacyId() {
				this.$http.getRequest("/userph/getPharmacyId/" + this.partyId)
					.then(({
						data
					}) => {
						console.log(data.pharmacyId)
						if(data && data.code === 0) {
							this.pharmacyId = data.pharmacyId;
							this.getDataList();
							this.getMedicinesType();
						} else {
							this.pharmacyId = 0;
						}
					});
			},
			//获取全部信息类型
			getMedicinesType() {
				this.$http.getRequest("/goods/findMedicinesType")
					.then(({
						data
					}) => {
						console.log(data)
						if(data && data.code === 0) {
							this.typeList = data.types;
						} else {
							this.pharmacyId = 0;
						}
					});
			},
			//获取药品数据
			getDataList() {
				this.$http.getRequest("/goods/findMedicinesList", {
						pageIndex: this.pageIndex,
						pageSize: this.pageSize,
						medicinesNum: this.dataForm.medicinesNum,
						medicinesName: this.dataForm.medicinesName,
						medicinesType: this.dataForm.medicinesType,
						classId: this.dataForm.classId,
						pharmacyId: this.pharmacyId
					})
					.then(({
						data
					}) => {
						console.log(data)
						if(data && data.code === 0) {
							this.dataList = data.page.list;
							this.totalCount = data.page.totalCount;
							this.pharmacyCount = data.pharmacyCount;
						} else {
							this.dataList = []
							this.totalPage = 0
						}
					});
			},
			//获取药房数据
			getPharmacyList() {
				this.$http.getRequest("/pharmacy/list", {
						pageIndex: this.pageIndex,
						pageSize: this.pageSize,
						medicinesNum: this.dataForm.medicinesNum,
						medicinesName: this.dataForm.medicinesName,
						medicinesType: this.dataForm.medicinesType,
						classId: this.dataForm.classId,
						pharmacyId: this.pharmacyId
					})
					.then(({
						data
					}) => {
						console.log(data)
						if(data && data.code === 0) {
							this.dataList = data.page.list;
						} else {
							this.dataList = []
							this.totalPage = 0
						}
					});
			},
			//药品加入云药房
			addPharmacy(medicinesNum) {
				var entitys = medicinesNum ? [id] : this.dataListSelections.map(item => {
					return item.roleId
				})
				this.$http.postRequest("/pharmacy/add", {
						entitys: [{
							"id": 0,
							"pharmacyId": "string",
							"medicinesNum": "string"
						}]
					})
					.then(({
						data
					}) => {
						if(data && data.code === 0) {
							console.log(data)
						}
					});
			},
			// 每页数
			sizeChangeHandle(val) {
				this.pageSize = val
				this.pageIndex = 1
				this.getDataList()
			},
			// 当前页
			currentChangeHandle(val) {
				this.pageIndex = val
				this.getDataList()
			},
			// 多选
			selectionChangeHandle(val) {
				this.dataListSelections = val
			},
			//获取全部分类
			sele() {
				console.log('我是==================================全部分类')
				this.$http.getRequest("/medicinesClassification/getParent", {

					})
					.then(({
						data
					}) => {
						console.log(data.parents)
						for(var i = 0; i < data.parents.length; i++) {
							console.log(data.parents[i].className)
						}
					});
			}
		}
	}
</script>
<style scoped>
	.el-menu--horizontal {
		margin-bottom: 20px;
	}
	
	.el-menu--horizontal>.el-menu-item {
		height: 35px;
		line-height: 35px;
		border-radius: 10px 10px 0 0;
	}
	
	.el-menu--horizontal>.el-menu-item.is-active {
		background: #17b3a3;
		color: #ffffff;
	}
	
	.actionText {
		font-size: 12px;
		color: #e9473a;
		position: relative;
		top: 10px;
	}
	
	.picture {
		width: 70px;
		height: 70px;
		float: left;
		margin-right: 20px;
	}
</style>