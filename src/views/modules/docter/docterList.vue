<template>
	<div class="mod-config">
		<el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" label-width="80px">
			<el-row>
				<el-form-item label='审核状态' style='margin-left: -11px;'>
					<el-button type="primary" class="status" @click='getStatus ("",0)' :class="index ==0?'red':''">全部</el-button>
					<el-button type="primary" class="status" @click='getStatus ("1",1)' :class="index ==1?'red':''">待提交</el-button>
					<el-button type="primary" class="status" @click='getStatus ("2",2)' :class="index ==2?'red':''">待审核</el-button>
					<el-button type="primary" class="status" @click='getStatus ("3",3)' :class="index ==3?'red':''">审核通过</el-button>
					<el-button type="primary" class="status" @click='getStatus ("0",4)' :class="index ==4?'red':''">审核未通过</el-button>
					<div></div>
				</el-form-item>
			</el-row>
			<el-row>
				<div>
					<el-form-item label='账号状态' style='margin-left: -11px;'>
						<el-button type="primary" class="statusId" @click='getStatusId ("",0)' :class="indexT ==0?'red':''">全部</el-button>
						<el-button style='margin-left: 16px;' type="primary" class="statusId" @click='getStatusId ("1",1)' :class="indexT ==1?'red':''">启用</el-button>
						<el-button style='margin-left: 26px;' type="primary" class="statusId" @click='getStatusId ("0",2)' :class="indexT ==2?'red':''">禁用</el-button>
					</el-form-item>
				</div>
			</el-row>
			<el-form-item label='账号' style='margin-left: -38px;'>
				<el-input class='width200' v-model="dataForm.idcard" placeholder="登录账号" clearable></el-input>
			</el-form-item>
			<el-form-item label='姓名'>
				<el-input class='width200' v-model="dataForm.name" placeholder="姓名" clearable></el-input>
			</el-form-item>
			<el-form-item label='职称'>
				<el-select placeholder="---请选择---" v-model="dataForm.background">
					<el-option value=''>---请选择---</el-option>
					<el-option :label='hisJob.name' :value='hisJob.id' v-for='(hisJob,index) in hisJobList' :key='index'></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label='科室'>
				<el-input class='width200' v-model="dataForm.deparment" placeholder="科室" clearable></el-input>
			</el-form-item>
			<el-form-item style='margin-left: 10px;'>
				<el-button @click="getDataList()" type="primary" style='margin-left: 20px;'>查询</el-button>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" style='margin-left: 20px;'>导出</el-button>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click='addMsg()' style='margin-left: 20px;'>创建医生</el-button>
			</el-form-item>
		</el-form>
		<el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
			<el-table-column prop="id" header-align="center" align="center" width="50" label="编号">
			</el-table-column>
			<el-table-column prop="username" header-align="center" align="center" width="150" label="账号">
			</el-table-column>
			<el-table-column header-align="center" align="center" width="300" label="医生信息">
				<template slot-scope="scope" class='content'>
					<img :src="scope.row.picture" alt="" class='picture' v-if='scope.row.picture' />
					<img src="~@/assets/img/default.jpg" class='picture' v-else>
					<div class='pull-left'>
						<p style="margin: 0;display: flex;margin-top: 6px;">
							<span style="width: 50px;display: block;height: 30px;margin-left: 20px;   white-space: nowrap;overflow: hidden;text-align:left;text-overflow: ellipsis;">{{ scope.row.name }}</span>
							<span style="margin-left: 20px;">{{ scope.row.jobName }}</span></p>
						<p style="margin: 0;display: flex;">
							<span style="width: 130px;display: block;height: 30px;margin-left: 20px;   white-space: nowrap;overflow: hidden;text-align:left;text-overflow: ellipsis;">{{ scope.row.hospital }}</span>
							<span style="width: 80px;display: block;height: 30px;   white-space: nowrap;overflow: hidden;text-align:left;text-overflow: ellipsis;">{{ scope.row.deparment }}</span>
						</p>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="create_date" header-align="center" align="center" label="创建时间">
			</el-table-column>
			<el-table-column prop="pharmacys" header-align="center" align="center" label="云药房" width="80">
				<template slot-scope="scope">
					<span>{{scope.row.pharmacys}}</span>
					<i class='el-icon-edit-outline' @click="addGoods(scope.row.party_id)" title="添加云药房"></i>
				</template>
			</el-table-column>
			<el-table-column prop="jobName" header-align="center" align="center" width="150" label="分成比例">
				<div slot-scope="scope" class='content' style="float: left;width: 129px;height: 100px;">
					<template>
						<div style="float: left;width: 18px;padding-top: 3px;">
							<img style="width: 15px;height: 15px;" src="../../../assets/img/gua.png" />
							<img style="width: 15px;height: 15px;" src="../../../assets/img/gua2.png" />
							<img style="width: 15px;height: 15px;" src="../../../assets/img/gua3.png" />
							<img style="width: 15px;height: 15px;" src="../../../assets/img/gua4.png" />
						</div>
						<div style="float: left;width: 90.5px;margin-top: 5px;">
							<p style="margin: 0;" v-if="scope.row.register_doctor ==null">100%:0%</p>
							<p style="margin: 0;" v-else>{{scope.row.register_doctor}}%:{{scope.row.register_sys}}%</p>
							<p style="margin: 0;" v-if="scope.row.inquisition_doctor ==null">100%:0%</p>
							<p style="margin: 0;" v-else>{{scope.row.inquisition_doctor}}%:{{scope.row.inquisition_sys}}%</p>
							<p style="margin: 0;" v-if="scope.row.consult_doctor ==null">100%:0%</p>
							<p style="margin: 0;" v-else>{{scope.row.consult_doctor}}%:{{scope.row.consult_sys}}%</p>
							<p style="margin: 0;" v-if="scope.row.live_doctor ==null">100%:0%</p>
							<p style="margin: 0;" v-else>{{scope.row.live_doctor}}%:{{scope.row.live_sys}}%</p>
						</div>
						<div style="float: left;width: 20px;padding-top: 30px;margin-top: 8px;">
							<i class='el-icon-edit-outline' @click="addProportions(scope.row.pId,scope.row.party_id)" title="添加分成比例"></i>
						</div>
					</template>
				</div>
			</el-table-column>
			<el-table-column prop="doctorAssistant" header-align="center" align="center" width="80" label="医生助手">
				<template slot-scope="scope">
					<span>{{scope.row.doctorAssistant}}</span>
					<i class='el-icon-edit-outline' @click="addAssistant(scope.row.party_id)" title="添加助手"></i>
				</template>
			</el-table-column>
			<el-table-column fixed="right" header-align="center" align="center" width="80" label="患者数量">
				<template slot-scope="scope">
					<p>{{scope.row.patientNum}}</p>
				</template>
			</el-table-column>
			<el-table-column fixed="right" header-align="center" align="center" width="80" label="审核状态">
				<template slot-scope="scope">
					<el-button type="text" plain size='small' v-if='scope.row.status==2'>待审核</el-button>
					<el-button type="text" plain size='small' v-if='scope.row.status==3'>审核通过</el-button>
					<el-button type="text" plain size='small' v-if='scope.row.status==0'>审核失败</el-button>
					<el-button type="text" plain size='small' v-if="scope.row.status==1 || scope.row.status==null || scope.row.status==''">待提交</el-button>
				</template>
			</el-table-column>
			<el-table-column fixed="right" header-align="center" label="启用状态" align="center" width="170">
				<template slot-scope="scope" class="opens" width="230">
					<!--<el-button type="warning" size='small' @click="updateStatus(scope.row.userId)" v-show='scope.row.statusId==1'>禁用</el-button>-->
					<!--<el-button type="primary" size='small' @click="updateStatus(scope.row.userId)" v-show='scope.row.statusId==0'>开启</el-button>-->
					<div class="switch-btn" @click="updateStatus(scope.row.userId)">
						<input type="checkbox" class="c1" />
						<div class="switch-inner">
							<div class="btn">
								<span class="active">禁用</span>
								<span class="inactive">开启</span>
							</div>
							<div class="arrow"></div>
						</div>
					</div>
				</template>
			</el-table-column>
			<el-table-column fixed="right" header-align="center" align="left" width="270" label="操作">
				<div slot-scope="scope" style="text-align: center;">
					<template>
						<el-button type="primary" size="small" @click="lookScheduling(scope.row.party_id)">查看排班</el-button>
						<el-button type="danger" size='small' @click="addOrUpdateHandle(scope.row.id)" v-if='scope.row.status==2'>审核</el-button>
						<el-button type="danger" size='small' @click="addOrUpdateHandle(scope.row.id)" v-if='scope.row.status !=2'>编辑</el-button>
						<el-button type="success" size='small' @click="showCode(scope.row.id)" v-if='scope.row.status==3'>二维码</el-button>
					</template>
				</div>
			</el-table-column>
		</el-table>
		<el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
		</el-pagination>
		<!-- 弹窗, 新增 / 修改 -->
		<add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
		<add-msg v-if="addMsgdialog" ref="addMsgdialog" @refreshDataList="getDataList"></add-msg>
		<!--查看排班弹框-->
		<look-scheduling v-if="LookSchedulingdialog" ref="LookSchedulingdialog"></look-scheduling>
		<add-assistant v-if="AddAssistantdialog" ref="AddAssistantdialog" @refreshDataList="getDataList"></add-assistant>
		<add-proportions v-if="addProportionslog" ref="addProportionslog" @refreshDataList="getDataList"></add-proportions>
		<add-goods v-if="addGoodslog" ref="addGoodslog" @refreshDataList="getDataList"></add-goods>
		<!--添加助手弹框-->
		<div :visible.sync="dialogVisible" width="23%" style="text-align: center;">
			<el-dialog :visible.sync="dialogVisible" width="23%">
				<img :src="captchaPath" alt="" style="display:block; margin: 0 auto;">
				<span slot="footer" class="dialog-footer">
		   	<el-button type="primary" @click="dialogVisible = false">确 定</el-button>
		  </span>
			</el-dialog>
		</div>
	</div>
</template>
<script>
	import AddOrUpdate from './docterList-add-or-update'
	import addMsg from './add-msg'
	import LookScheduling from './look-scheduling'
	import AddAssistant from './add-assistant'
	import AddProportions from './add-proportions'
	import AddGoods from './add-goods'
	export default {
		data() {
			return {
				dataForm: {
					status: '',
					idcard: '',
					name: '',
					hospital: '',
					deparment: '',
					background: ''
				},
				statusId: '',
				dataList: [],
				hisJobList: [],
				checkbox:true,
				pageIndex: 1,
				pageSize: 10,
				totalPage: 0,
				dataListLoading: false,
				LookSchedulingdialog: false,
				AddAssistantdialog: false,
				addProportionslog: false,
				dataListSelections: [],
				addOrUpdateVisible: false,
				addMsgdialog: false,
				addGoodslog: false,
				index: 0,
				indexT: 0,
				value4: '1',
				examinList: [{
						'status': '3',
						'text': '审核通过'
					},
					{
						'status': '0',
						'text': '审核不通过'
					},
					{
						'status': '2',
						'text': '待审核'
					},
				],
				captchaPath: '',
				dialogVisible: false,
				tabselect: false,
				arr: [{
						'name': '启用',
						'id': 1,
						'type': true
					},
					{
						'name': '禁用',
						'id': 2,
						'type': true
					}
				],
			}
		},
		components: {
			AddOrUpdate,
			addMsg,
			LookScheduling,
			AddAssistant,
			AddProportions,
			AddGoods
		},
		//相当于生命周期函数created
		activated() {
			this.getDataList();
		},
		methods: {
			getStatus(status, value) {
				this.pageIndex = 0;
				this.index = value
				this.dataForm.status = status;
				this.getDataList();
			},
			getStatusId(statusId, value) {
				this.indexT = value
				this.statusId = statusId;
				this.getDataList();
			},
			// 获取数据列表
			getDataList() {
				this.dataListLoading = true
				this.$http({
					url: this.$http.adornUrl('/doctor/list'),
					method: 'get',
					params: this.$http.adornParams({
						'status': this.dataForm.status,
						'statusId': this.statusId,
						'username': this.dataForm.idcard,
						'name': this.dataForm.name,
						'hospital': this.dataForm.hospital,
						'deparment': this.dataForm.deparment,
						'background': this.dataForm.background,
						'page': this.pageIndex,
						'limit': this.pageSize,
						'sidx': 'create_date',
						'order': 'desc'
					})
				}).then(({
					data
				}) => {
					if(data && data.code === 0) {
						this.dataList = data.result.page.list
						this.hisJobList = data.result.hisJobList
						this.totalPage = data.result.page.totalCount
					} else {
						this.dataList = []
						this.totalPage = 0
					}
					this.dataListLoading = false
				})
			},
			// 禁止用户登录/开启用户登录
			updateStatus(userId) {
				this.$http({
					url: this.$http.adornUrl(`/sys/user/updateStatus/` + userId),
					method: 'get',
					params: this.$http.adornParams()
				}).then(({
					data
				}) => {
					if(data && data.code === 0) {
						console.log(data)
						this.getDataList();
					}
				})
			},
			//查看二维码
			showCode(id) {
				this.dialogVisible = true;
				this.captchaPath = this.$http.adornUrl(`/qrCode/generate?doctorId=` + id)
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
				console.log(this.pageIndex)
				this.getDataList()
			},
			// 多选
			selectionChangeHandle(val) {
				this.dataListSelections = val
			},
			// 新增 / 修改
			addOrUpdateHandle(id) {
				this.addOrUpdateVisible = true
				this.$nextTick(() => {
					this.$refs.addOrUpdate.init(id)
					this.$refs.addOrUpdate.getotherHospital(id)
				})
			},
			// 新增 / 修改
			addMsg() {
				this.addMsgdialog = true
				this.$nextTick(() => {
					this.$refs.addMsgdialog.init()
				})
			},
			// 删除
			deleteHandle(id) {
				var ids = id ? [id] : this.dataListSelections.map(item => {
					return item.id
				})
				this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$http({
						url: this.$http.adornUrl('/sys/config/delete'),
						method: 'post',
						data: this.$http.adornData(ids, false)
					}).then(({
						data
					}) => {
						if(data && data.code === 0) {
							this.$message({
								message: '操作成功',
								type: 'success',
								duration: 1500,
								onClose: () => {
									this.getDataList()
								}
							})
						} else {
							this.$message.error(data.msg)
						}
					})
				}).catch(() => {})
			},
			//查看排班
			lookScheduling(partyId) {
				this.LookSchedulingdialog = true
				this.$nextTick(() => {
					this.$refs.LookSchedulingdialog.init(partyId)
				})
			},
			//添加医生助手
			addAssistant(partyId) {
				this.AddAssistantdialog = true
				this.$nextTick(() => {
					this.$refs.AddAssistantdialog.init(partyId)
				})
			},
			//添加分成比例
			addProportions(id, partyId) {
				this.addProportionslog = true
				this.$nextTick(() => {
					this.$refs.addProportionslog.init(id, partyId)
				})
			},
			//添加医生助手
			addGoods(partyId) {
				this.addGoodslog = true
				this.$nextTick(() => {
					this.$refs.addGoodslog.init(partyId)
				})
			}
		}
	}
</script>
<style scoped>
	.width200 {
		width: 200px;
	}
	
	.el-button--info {
		background: #AA5500;
		border-color: #AA5500;
	}
	
	.picture {
		width: 70px;
		height: 70px;
		float: left;
		margin-left: 12%;
	}
	
	.red {
		background: #E45B25;
		border: #E45B25;
		opacity: .8;
	}
	
	.showTabsr {
		width: 60px;
		background: #46AC99;
		border-radius: 5px;
		height: 30px;
		line-height: 30px;
		text-align: center;
		display: flex;
		color: white;
		cursor: pointer;
	}
	
	.showTabsr div {
		border-radius: 5px;
		width: 47%;
		text-align: center;
	}
	
	.switch-btn {
		position: relative;
		width: 60px;
		height: 30px;
		overflow: hidden;
		margin-left: 40px;
	}
	
	.switch-btn .c1 {
		position: absolute;
		top: 0;
		left: 0;
		width: 60px;
		height: 30px;
		opacity: 0;
		-moz-opacity: 0;
		-webkit-opacity: 0;
		cursor: pointer;
		z-index: 10;
	}
	
	.switch-btn .switch-inner {
		position: relative;
		height: 30px;
		border-radius: 13px;
		-moz-border-radius: 13px;
		-webkit-border-radius: 13px;
		background: #cccccc;
		transform: all 0.1s ease-in 0s;
	}
	
	.switch-btn .switch-inner .btn {
		width: 200%;
		height: 30px;
		line-height: 30px;
		margin-left: -100%;
		transition: margin 0.1s ease-in 0s;
	}
	
	.switch-btn .switch-inner .btn span {
		float: left;
		width: 50%;
		height: 30px;
		line-height: 30px;
		box-sizing: border-box;
		-moz-box-sizing: border-box;
		-webkit-box-sizing: border-box;
		font-size: 12px;
	}
	
	.switch-btn .switch-inner .btn span.active {
		color: #FFFFFF;
		padding-right: 26px;
		text-align: center;
	}
	
	.switch-btn .switch-inner .btn span.inactive {
		color: #FFFFFF;
		padding-left: 26px;
		text-align: center;
	}
	
	.switch-btn .switch-inner .arrow {
		height: 26px;
		width: 26px;
		background: #FFFFFF;
		position: absolute;
		top: 2px;
		right: 32px;
		-moz-border-radius: 100%;
		-webkit-border-radius: 100%;
		border-radius: 100%;
		transition: all 0.1s ease-in 0s;
	}
	
	.switch-btn .c1:checked+.switch-inner {
		background: #4F9CF3;
	}
	
	.switch-btn .c1:checked+.switch-inner .btn {
		margin-left: 0;
	}
	
	.switch-btn .c1:checked+.switch-inner .arrow {
		right: 2px;
	}
</style>