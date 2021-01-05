const filters = {
    areaCut:function(value){
        if(!value) return '';
        return value.substring(0, value.length - 3);
    },
    weekfilters: function(value) {
        if (!value) {
          return "";
        } else if (value == 1) {
          return "周一";
        } else if (value == 2) {
          return "周二";
        } else if (value == 3) {
          return "周三";
        } else if (value == 4) {
          return "周四";
        } else if (value == 5) {
          return "周五";
        } else if (value == 6) {
          return "周六";
        } else if (value == 7) {
          return "周日";
        } else {
          return "休息休息";
        }
      },
      statusfilters: function(value) {
        if (!value) {
          return "";
        } else if (value == 'created') {
          return "待支付";
        } else if (value == 'cancel') {
          return "已取消";
        } else if (value == 'paid') {
          return "已预约";
        } else if (value == 'complete') {
          return "已结束";
        } else {
          return "什么情况";
        }
      }
}
export default filters

