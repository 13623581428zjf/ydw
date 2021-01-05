<template>
	<el-dialog :title="'新增'" :close-on-click-modal="false" width="30%" :visible.sync="visible">
		<el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
			<el-form-item label="选择日期" prop="fromDate">
				<el-date-picker type="date" value-format="yyyy-MM-dd" placeholder="选择日期" v-model="dataForm.fromDate" style="width: 100%;"></el-date-picker>
			</el-form-item>
			<el-form-item label="接诊时间" prop="fromTime">
				<el-time-select placeholder="起始时间" v-model="dataForm.fromTime" :picker-options="{
          start: '07:00',
          step: '00:30',
          end: '23:30'
        }">
				</el-time-select>
			</el-form-item>
			<el-form-item prop="thruTime">
				<el-time-select placeholder="结束时间" v-model="dataForm.thruTime" :picker-options="{
          start: '07:00',
          step: '00:30',
          end: '23:30',
          minTime: dataForm.fromTime
        }">
				</el-time-select>
			</el-form-item>
			<el-form-item label="接诊人数" prop="visitsNum">
				<el-input v-model="dataForm.visitsNum" type="number" placeholder="接诊人数"></el-input>
			</el-form-item>
			<el-form-item label="图文价格">
				<el-input v-model="dataForm.textPrice" type="number" :min="0" placeholder="价格"></el-input>
			</el-form-item>
			<el-form-item label="视频价格">
				<el-input v-model="dataForm.price" type="number" :min="0" placeholder="价格"></el-input>
			</el-form-item>
			<el-form-item>
				<el-checkbox v-model="dataForm.checked" label="开启循环（开启后将在每周同一时间自动生成排班）"></el-checkbox>
			</el-form-item>
		</el-form>
		<span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
	</el-dialog>
</template>

<script>
	export default {
		data() {
			var validateNum = (rule, value, callback) => {
				if(value < 0) {
					callback(new Error('价格不可以小于0'));
				} else {
					callback();
				}
			}
			return {
				visible: false,
				dataForm: {
					isLoop: 'N',
					checked: false,
					fromDate: '',
					fromTime: '',
					thruTime: '',

					schedulingType: 'inquisition',

					visitsNum: '',
					price: '',
					textPrice: ''
				},

				dataRule: {
					fromDate: [{
						required: true,
						message: '参数名不能为空',
						trigger: 'blur'
					}],
					fromTime: [{
						required: true,
						message: '参数值不能为空',
						trigger: 'blur'
					}],
					thruTime: [{
						required: true,
						message: '参数值不能为空',
						trigger: 'blur'
					}],
					visitsNum: [{
						required: true,
						message: '参数值不能为空',
						trigger: 'blur'
					}]

				},

			}
		},
		methods: {
			init(addPrice, textPrice) {
				this.visible = true;
				this.$nextTick(() => {
					this.$refs['dataForm'].resetFields()
					this.dataForm.price = addPrice;
					this.dataForm.textPrice = textPrice;
				})
			},

			// 表单提交
			dataFormSubmit() {
				if(!this.dataForm.price && !this.dataForm.textPrice) {
					this.$message.error('请输入问诊金额')
					//return false;
				} if(this.dataForm.price <0 || this.dataForm.textPrice <0 ) {
					this.$message.error('金额不能为负数,请正确填写问诊金额')
				} else {
					this.$refs['dataForm'].validate((valid) => {
						if(valid) {
							if(this.dataForm.checked) {
								this.dataForm.isLoop = 'Y'
							} else {
								this.dataForm.isLoop = 'N'
							}

							this.$http.postRequest('/schedulingDate/createdScheduling', {
								isLoop: this.dataForm.isLoop,
								fromDate: `${this.dataForm.fromDate} 00:00:00`,
								schedulingEntity: {
									fromTime: `${this.dataForm.fromTime}:00`,
									thruTime: `${this.dataForm.thruTime}:00`,
									schedulingType: this.dataForm.schedulingType,

									visitsNum: this.dataForm.visitsNum,
									price: this.dataForm.price,
									textPrice: this.dataForm.textPrice
								},
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
					})
				}

			}
		}
	}
</script>
<style scoped>
	.el-date-editor.el-input,
	.el-date-editor.el-input__inner {
		width: 100%;
	}
</style>