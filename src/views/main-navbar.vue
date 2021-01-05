<template>
  <nav class="site-navbar" :class="'site-navbar--' + navbarLayoutType">
    <div class="site-navbar__header">
      <h1 class="site-navbar__brand" @click="$router.push({ name: 'home' })">
        <a class="site-navbar__brand-lg" href="javascript:;">慧疗远程会诊平台</a>
        <a class="site-navbar__brand-mini" href="javascript:;">工作台</a>
      </h1>
    </div>
    <div class="site-navbar__body clearfix">
      <el-menu
        class="site-navbar__menu"
        mode="horizontal">
        <el-menu-item class="site-navbar__switch" index="0" @click="sidebarFold = !sidebarFold">
          <icon-svg name="zhedie"></icon-svg>
        </el-menu-item>
      </el-menu>
      <el-menu
        class="site-navbar__menu site-navbar__menu--right"
        mode="horizontal">
        <el-menu-item  class="site-navbar__avatar" index="1" style="padding: 0px;">
          <el-dropdown>
					  <span class="el-dropdown-link">
					  	<el-badge :value="newNews">
					     <icon-svg name="bell" class="el-icon-setting " :class="[ newNews > 0 ? 'newsShow' : 'newTiding' ]" ></icon-svg>
            	</el-badge>
					  </span>
					  <el-dropdown-menu slot="dropdown" >
					    <!--<el-dropdown-item command="b">狮子头</el-dropdown-item>
					    <el-dropdown-item command="c">螺蛳粉</el-dropdown-item>
					    <el-dropdown-item command="d" >双皮奶</el-dropdown-item>
					    <el-dropdown-item command="e" >蚵仔煎</el-dropdown-item>-->
					  </el-dropdown-menu>
					</el-dropdown>
        </el-menu-item>
        <!--<el-menu-item index="2" @click="$router.push({ name: 'theme' })">
          <template slot="title">
            <el-badge value="new">
              <icon-svg name="shezhi" class="el-icon-setting"></icon-svg>
            </el-badge>
          </template>
        </el-menu-item>-->
        <el-menu-item class="site-navbar__avatar" index="3">
          <el-dropdown :show-timeout="0" placement="bottom">
            <span class="el-dropdown-link">
              <img src="~@/assets/img/default.jpg" :alt="userName">{{ userName }}
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="updatePasswordHandle()">修改密码</el-dropdown-item>
              <el-dropdown-item @click.native="logoutHandle()">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-menu-item>
      </el-menu>
    </div>
    <!-- 弹窗, 修改密码 -->
    <update-password v-if="updatePassowrdVisible" ref="updatePassowrd"></update-password>
  </nav>
</template>

<script>
import UpdatePassword from "./main-navbar-update-password";
export default {
  data() {
    return {
      updatePassowrdVisible: false,
      newNews: 1,
      instance: null
    };
  },
  components: {
    UpdatePassword
  },
  computed: {
    navbarLayoutType: {
      get() {
        return this.$store.state.common.navbarLayoutType;
      }
    },
    sidebarFold: {
      get() {
        return this.$store.state.common.sidebarFold;
      },
      set(val) {
        this.$store.commit("common/updateSidebarFold", val);
      }
    },
    mainTabs: {
      get() {
        return this.$store.state.common.mainTabs;
      },
      set(val) {
        this.$store.commit("common/updateMainTabs", val);
      }
    },
    userName: {
      get() {
        return this.$store.state.user.name;
      }
    },
    newsList: {
      get() {
        return this.$store.state.common.news;
      },
      set(val) {
        this.$store.commit("common/updataNews", val);
      }
    },
    notifyMsg: {
      get() {
        return this.$store.state.common.notifyMsg;
      },
      set(val) {
        this.$store.commit("common/updatanotifyMsg", val);
      }
    },
    splicenotifyMsg: {
      get() {
        return this.$store.state.common.notifyMsg;
      },
      set(val) {
        this.$store.commit("common/splicenotifyMsg", val);
      }
    }
  },
  methods: {
    // 修改密码
    updatePasswordHandle() {
      this.updatePassowrdVisible = true;
      this.$nextTick(() => {
        this.$refs.updatePassowrd.init();
      });
    },
    // 退出
    logoutHandle() {
      this.$confirm(`确定进行[退出]操作?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl("/sys/logout"),
            method: "post",
            data: this.$http.adornData()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$cookie.delete("token");
              this.$cookie.delete("userName");
              this.$router.options.isAddDynamicMenuRoutes = false;
              window.location.reload();
              this.notifyMsg = [];
              // this.$router.push({ name: "login" });
            }
          });
        })
        .catch(() => {});
    },
    showNot() {
      const h = this.$createElement;
      console.log(this.notifyMsg);
      console.log(this.newsList.msg);
      if (this.newsList.type != undefined) {
        if (this.newsList.type === 1 && this.newsList.state === 0) {
          if (this.times(this.notifyMsg, this.newsList.msg) == 1) {
            this.instance = this.$notify({
              title: "提示",
              message: h("div", null, [
                h("p", { style: "margin:10px 0 50px 0;" }, "视频会诊已开启"),
                h(
                  "el-button",
                  {
                    style: "margin:0 20px;",
                    on: {
                      click: this.yesBtn
                    }
                  },
                  "进入"
                ),
                h(
                  "el-button",
                  {
                    on: {
                      click: this.noBtn
                    }
                  },
                  "取消"
                )
              ]),
              position: "bottom-right",
              duration: 0
            });
          } else {
            console.log(this.times(this.notifyMsg, this.newsList.msg));
          }
        }
      }
    },
    times(arr, str) {
      var m = str,
        times = 0; //m是数组中的元素，times用来统计出现的次数
      // for循环遍历arr数组
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] == m) {
          times++; //数组中有相同值就加1
        }
      }
      return times;
      console.log(times);
    },
    
    yesBtn() {
      this.instance.close();
      this.splicenotifyMsg = this.newsList.msg;
      this.$router.push({
        name: "consult-video",
        query: {
          consultation_id: this.newsList.msg
        }
      });
    },
    noBtn() {
      console.log("1");
      this.splicenotifyMsg = this.newsList.msg;
      this.instance.close();
    }
  },
  //监控数据变化
  watch: {
    newsList: function(val) {
      this.showNot();
    }
  },
  mounted() {
    // this.showNot();
  },
  beforeDestroy() {
    if(this.instance){
      this.splicenotifyMsg = this.newsList.msg;
      this.instance.close();
    }
    this.notifyMsg = [];
  }
};
</script>
<style type="text/css" scoped  lang="scss">
.newsShow {
  transform: rotate(0deg);
  animation: rotateNews 0.1s ease-in 0.1s alternate infinite;
  animation-fill-mode: initial;
}

@keyframes rotateNews {
  from {
    transform: rotate(10deg);
  }
  to {
    transform: rotate(-10deg);
  }
}
</style>
