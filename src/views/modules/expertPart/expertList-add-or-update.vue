<template>
  <el-dialog
    :title="'预约会诊'"
    width="30%"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="会诊时间">
        <p style="margin:0 0;">{{groupObj.date}}&nbsp;&nbsp;&nbsp;{{groupObj.week|weekfilters}}&nbsp;&nbsp;&nbsp;{{groupObj.fromTime}} ~ {{groupObj.thruTime}}</p>
      </el-form-item>
      <el-form-item label="患者姓名" prop="patientName">
        <el-autocomplete style='width: 100%;'  popper-class="my-autocomplete" v-model="dataForm.patientName"  :fetch-suggestions="querySearch" @keyup.native="choose" placeholder="患者姓名" @select="handleSelect">
				<i class="el-icon-edit el-input__icon" slot="suffix" @click="handleIconClick"></i>
				<template slot-scope="{ item }">
					<span class="name">{{ item.patientName }}</span>
					<span class="age">{{ item.patientAge }}</span>
					<span class="phone">{{ item.patientPhoneNum }}</span>
					<span class="sex">{{ item.patientSex }}</span>
				</template>
			</el-autocomplete>
      </el-form-item>
      <el-form-item label="患者年龄" prop="patientAge">
        <el-input v-model="dataForm.patientAge" type="number" placeholder="患者年龄"></el-input>
      </el-form-item>
      <el-form-item label="患者电话" prop="patientPhoneNum">
        <el-input v-model="dataForm.patientPhoneNum" type="text" placeholder="患者电话"></el-input>
      </el-form-item>
      <el-form-item label="患者性别"  prop="patientSex">
         <el-radio-group v-model="dataForm.patientSex">
          <el-radio  label="男">男</el-radio>
          <el-radio  label="女">女</el-radio>
          </el-radio-group>
      </el-form-item>
      <el-form-item label="病情描述" prop="description">
      <el-input type="textarea" v-model="dataForm.description" maxlength="500" @input="changeLen"  rows="5" placeholder="详细描述患者的病情症状，曾经做过的检查，用药情况，目前病情加重还是缓解，想要获得医生什么帮助。（最少输入10个字）" ></el-input>
      <span style="position: absolute;
    bottom: 0;
    right: 20px;">{{start}}/{{end}}</span>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    var validateTen = (rule, value, callback) => {
        if (value.length < 10) {
          callback(new Error('请输入10个以上的描述'));
        }
        else {
          callback();
        }
      };
      var validatePhone = (rule,value,callback)=>{
        const reg1 = /^1[3|4|5|7|8][0-9]\d{8}$/;
          if(!reg1.test(value)){
               callback(new Error('请输入正确的手机号'));
          }else{
            callback();
          }
      }
    return {
      visible: false,
      start:0,
      end:500,
      dataForm: {
        patientName: "",
        description:"",
        patientSex:"",
        patientAge:"",
        patientPhoneNum:"",
        patientId:null
      },
      restaurants: [],
      groupObj:{},
      dataRule: {
        patientName: [
            { required: true, message: '姓名不能为空', trigger: 'change' },
          ],
          patientAge: [
            { required: true, message: '年龄不能为空', trigger: 'blur' },
          ],
          patientSex: [
            { required: true, message: '请选择性别', trigger: 'blur' },
          ],
          patientPhoneNum: [
            { required: true, message: '电话不能为空', trigger: 'blur' },
             { validator: validatePhone, trigger: 'blur' }
          ],
          description: [
            { required: true, message: '描述不能为空', trigger: 'blur' },
            { validator: validateTen, trigger: 'blur' }
          ],
      }
    };
  },
  methods: {
    init(row) {
      console.log(row);
      this.visible = true;
      this.groupObj = row;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
        this.dataForm.patientId = null;
        this.loadAll();
      });
    },
    // 表单提交
    dataFormSubmit() {
      console.log(this.dataForm);
      this.$refs["dataForm"].validate(valid => {
        console.log(this.groupObj)
        if (valid) {
          this.$http.postRequest('/consultation/createdConsultation',{
            description:this.dataForm.description,
            consultationTime:`${this.groupObj.date} 00:00:00`,
            schedulingId:this.groupObj.schedulingId,
            doctorPartyId:this.groupObj.doctorPartyId,
            patientId:this.dataForm.patientId,
            patientEntity:{
              patientName:this.dataForm.patientName,
              patientSex:this.dataForm.patientSex,
              patientAge:this.dataForm.patientAge,
              patientPhoneNum:this.dataForm.patientPhoneNum
            }
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.visible = false;
                  this.$emit("refreshDataList");
                }
              });
              this.$router.push({ name: 'order-consultation',params: { typeId: '2' }})
            } else {
              this.$message.error(data.msg);
            }
          });
        }
      });
    },
    querySearch(queryString, cb) {
        var restaurants = this.restaurants;
        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.patientName.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      //获取患者列表
      loadAll() {
        this.$http({
					url: this.$http.adornUrl('/hispatient/getRelationPatientList'),
					method: 'get',
					data: this.$http.adornData({})
				}).then(({
					data
				}) => {
					this.restaurants = data.patientList;
				})
      },
      //输入内容长度计算
      changeLen(){
        var len = this.dataForm.description.length;
        this.start = 0+len;
        this.end = 500-len;
      },
      handleSelect(item) {
        this.dataForm.patientName = item.patientName;
        this.dataForm.patientAge = item.patientAge;
        this.dataForm.patientPhoneNum = item.patientPhoneNum;
        this.dataForm.patientSex = item.patientSex;
        this.dataForm.patientId = item.patientId;
      },
      choose(){
        this.dataForm.patientId = null;
      },
      handleIconClick(ev) {
        console.log(ev);
      }
  },
	mounted() {
  	this.loadAll();
	}
};
</script>
<style>

</style>