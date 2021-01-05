<template>
  <el-dialog
    :title="'订单详情'"
    :close-on-click-modal="false"
    width="40%"
    :visible.sync="visible"
    >
    <ul class="order_ist">
        <li><span>{{type}}医生  </span><span>{{orderObg.name}}&nbsp;&nbsp;{{orderObg.background}}&nbsp;&nbsp;{{orderObg.deparment}}&nbsp;&nbsp;{{orderObg.hospital}}</span></li>
        <li><span>患者  </span><span>{{orderObg.patient_name}}&nbsp;&nbsp;{{orderObg.patient_sex}}&nbsp;&nbsp;{{orderObg.patient_age}}&nbsp;&nbsp;{{orderObg.patient_phone_num}}</span></li>
        <li><span>病情描述  </span><span>{{orderObg.description}}</span></li>
        <li><span>会诊时间  </span><span>{{orderObg.consultation_time}}&nbsp;&nbsp;{{orderObg.week_day |weekfilters}}&nbsp;&nbsp;{{orderObg.from_time|areaCut}}&nbsp;~&nbsp;{{orderObg.thru_time|areaCut}}</span></li>
        <li><span>价格  </span><span> &yen; {{orderObg.price}}</span></li>
    </ul>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        orderObg:{},
        type:''
      }
    },
    methods: {
      init (row,activeIndex) {
        this.orderObg = row;
        if(activeIndex == '1'){
            this.type= '申请';
        }else {
            this.type= '会诊';
        }
        this.visible = true
      },
     
    }
  }
</script>
<style scoped>
.order_ist li {
    margin: 0 0 20px 0;
    list-style: none;
}
.order_ist li span:first-child{
    width: 20%;
    display: inline-block;
    float: left;
}
.order_ist li span:last-child{
    width: 80%;
    display: inline-block;
    word-wrap:break-word;

}
</style>

