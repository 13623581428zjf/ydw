<template>
	<el-dialog :title="title" :close-on-click-modal="false" :before-close="handleClose" :visible.sync="visible">
		<table class="actionText">
			<tr>
				<th></th>
				<th>挂号</th>
				<th>问诊</th>
				<th>会诊</th>
				<th>直播</th>
			</tr>
			<tr>
				<td>医生</td>
				<td><input type="number" v-model="ProportionsEntity.registerDoctor" /></td>
				<td><input type="number" v-model="ProportionsEntity.inquisitionDoctor" /></td>
				<td><input type="number" v-model="ProportionsEntity.consultDoctor" /></td>
				<td><input type="number" v-model="ProportionsEntity.liveDoctor" /></td>
			</tr>
			<tr>
				<td>平台</td>
				<td><input type="number" v-model="ProportionsEntity.registerSys" /></td>
				<td><input type="number" v-model="ProportionsEntity.inquisitionSys" /></td>
				<td><input type="number" v-model="ProportionsEntity.consultSys" /></td>
				<td><input type="number" v-model="ProportionsEntity.liveSys" /></td>
			</tr>
		</table>
		<div style="text-align: center; margin-top: 50px;">
			<el-button @click="cancle()">取消</el-button>
  		<el-button type="primary"style="margin-left:50px;" @click="confirm()">保存</el-button>
		</div>
	</el-dialog>
</template>
<script>
	export default {
		data() {
			return {
				visible: false,
				id: 0,
				partyId:'',
				title: '配置分成比例',
				ProportionsEntity: {}
			}
		},
		methods: {
			init(id,partyId) {
				console.log(id)
				console.log(partyId)
				this.visible = true
				this.id = id || 0;
				this.partyId = partyId;
				this.getDataList();
			},
			handleClose() {
				this.visible = false
			},
			// 获取数据列表
			getDataList() {
				this.$http.getRequest("/proportions/getInfo/" + this.id)
					.then(({
						data
					}) => {
						console.log(data)
						if(data && data.code === 0) {
							if(data.entity) {
								this.ProportionsEntity = data.entity;
							} else {
								this.ProportionsEntity = {
									id:0,
									partyId:this.partyId,
									registerDoctor: 100,
									inquisitionDoctor: 100,
									consultDoctor: 100,
									liveDoctor: 100,
									registerSys: 0,
									inquisitionSys: 0,
									consultSys: 0,
									liveSys: 0
								}
							}

						}
					});
			},
			cancle(){
				this.visible = false;
			},
			confirm(){
				this.$http.postRequest("/proportions/saveOrUpdate",{
							id:this.ProportionsEntity.id,
							partyId:this.ProportionsEntity.partyId,
							registerDoctor: this.ProportionsEntity.registerDoctor ? this.ProportionsEntity.registerDoctor: 100,
							inquisitionDoctor: this.ProportionsEntity.inquisitionDoctor ? this.ProportionsEntity.inquisitionDoctor : 100,
							consultDoctor: this.ProportionsEntity.consultDoctor ? this.ProportionsEntity.consultDoctor : 100,
							liveDoctor: this.ProportionsEntity.liveDoctor ? this.ProportionsEntity.liveDoctor : 100,
							registerSys: this.ProportionsEntity.registerSys ? this.ProportionsEntity.registerSys : 0, 
							inquisitionSys: this.ProportionsEntity.inquisitionSys ? this.ProportionsEntity.inquisitionSys : 0,
							consultSys: this.ProportionsEntity.consultSys ? this.ProportionsEntity.consultSys  : 0,
							liveSys: this.ProportionsEntity.liveSys ? this.ProportionsEntity.liveSys:0
					})
					.then(({
						data
					}) => {
						if(data && data.code === 0) {
							this.$emit("refreshDataList");
						}

					});
				this.visible = false;
			}
		}
	}
</script>
<style scoped="scoped" type="text/css">
	table {
		width: 100%;
		text-align: center;
		border-collapse: collapse;
		border-spacing: 1;
		border-spacing: 0;
	}
	
	table td {
		word-break: break-all;
		word-wrap: break-word;
		border-right: 1px solid #EEEEEE;
		border-bottom: 1px solid #EEEEEE;
		font: 500 14px Arial
	}
	
	.actionText {
		border: 1px solid #EEEEEE;
	}
	
	.actionText tr th {
		border: 1px solid #EEEEEE;
	}
	
	.actionText tr td {
		border: 1px solid #EEEEEE;
		padding: 8px;
	}
</style>