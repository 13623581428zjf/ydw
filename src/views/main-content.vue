<template>
  <main class="site-content" :class="{ 'site-content--tabs': $route.meta.isTab }">
    <!-- 主入口标签页 s -->
    <el-tabs
      v-if="$route.meta.isTab"
      v-model="mainTabsActiveName"
      :closable="true"
      @tab-click="selectedTabHandle"
      @tab-remove="removeTabHandle">
      <el-dropdown class="site-tabs__tools" :show-timeout="0">
        <i class="el-icon-arrow-down el-icon--right"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="tabsCloseCurrentHandle">关闭当前标签页</el-dropdown-item>
          <el-dropdown-item @click.native="tabsCloseOtherHandle">关闭其它标签页</el-dropdown-item>
          <el-dropdown-item @click.native="tabsCloseAllHandle">关闭全部标签页</el-dropdown-item>
          <el-dropdown-item @click.native="tabsRefreshCurrentHandle">刷新当前标签页</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-tab-pane
        v-for="item in mainTabs"
        :key="item.name"
        :label="item.title"
        :name="item.name">
        <el-card :body-style="siteContentViewHeight">
          <iframe
            v-if="item.type === 'iframe'"
            :src="item.iframeUrl"
            width="100%" height="100%" frameborder="0" scrolling="yes">
          </iframe>
          <keep-alive v-else>
            <router-view v-if="item.name === mainTabsActiveName" />
          </keep-alive>
        </el-card>
      </el-tab-pane>
    </el-tabs>
    <!-- 主入口标签页 e -->
    <el-card v-else :body-style="siteContentViewHeight">
      <keep-alive>
        <router-view />
      </keep-alive>
    </el-card>
  </main>
</template>

<script>
import { isURL } from "@/utils/validate";
import '@/utils/sockjs-1.1.1'
import '@/utils/stomp'

export default {
  data() {
    return {
      stompClient:null,
      _subscribeQueue:null,
      _subscribeTopic:null
    };
  },
  computed: {
    documentClientHeight: {
      get() {
        return this.$store.state.common.documentClientHeight;
      }
    },
    menuActiveName: {
      get() {
        return this.$store.state.common.menuActiveName;
      },
      set(val) {
        this.$store.commit("common/updateMenuActiveName", val);
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
    mainTabsActiveName: {
      get() {
        return this.$store.state.common.mainTabsActiveName;
      },
      set(val) {
        this.$store.commit("common/updateMainTabsActiveName", val);
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
    siteContentViewHeight() {
      var height = this.documentClientHeight - 50 - 30 - 2;
      if (this.$route.meta.isTab) {
        height -= 40;
        return isURL(this.$route.meta.iframeUrl)
          ? { height: height + "px" }
          : { minHeight: height + "px" };
      }
      return { minHeight: height + "px" };
    }
  },
  mounted(){
    this.connect();
  },
  methods: {
    // tabs, 选中tab
    selectedTabHandle(tab) {
      tab = this.mainTabs.filter(item => item.name === tab.name);
      if (tab.length >= 1) {
        this.$router.push({ name: tab[0].name });
      }
    },
    // tabs, 删除tab
    removeTabHandle(tabName) {
      this.mainTabs = this.mainTabs.filter(item => item.name !== tabName);
      if (this.mainTabs.length >= 1) {
        // 当前选中tab被删除
        if (tabName === this.mainTabsActiveName) {
          this.$router.push(
            { name: this.mainTabs[this.mainTabs.length - 1].name },
            () => {
              this.mainTabsActiveName = this.$route.name;
            }
          );
        }
      } else {
        this.menuActiveName = "";
        this.$router.push({ name: "home" });
      }
    },
    // tabs, 关闭当前
    tabsCloseCurrentHandle() {
      this.removeTabHandle(this.mainTabsActiveName);
    },
    // tabs, 关闭其它
    tabsCloseOtherHandle() {
      this.mainTabs = this.mainTabs.filter(
        item => item.name === this.mainTabsActiveName
      );
    },
    // tabs, 关闭全部
    tabsCloseAllHandle() {
      this.mainTabs = [];
      this.menuActiveName = "";
      this.$router.push({ name: "home" });
    },
    // tabs, 刷新当前
    tabsRefreshCurrentHandle() {
      var tempTabName = this.mainTabsActiveName;
      this.removeTabHandle(tempTabName);
      this.$nextTick(() => {
        this.$router.push({ name: tempTabName });
      });
    },
    setConnected(connected) {
      console.log(connected)
      // $("#connect").prop("disabled", connected);
      // $("#disconnect").prop("disabled", !connected);
      // if (connected) {
      //   $("#conversation").show();
      // } else {
      //   $("#conversation").hide();
      // }
      // $("#greetings").html("");
    },

    // 参数依次为 订阅地址，收到消息做什么，header
    doSubscribeQueue() {
      // 一对一消息（注意url前面需要加上/user）
      var self = this;
      this._subscribeQueue = this.stompClient.subscribe(
        "/user/queue/user",
        function(data) {
          var obj = JSON.parse(data.body);
           self.newsList = obj;
           self.notifyMsg = obj;
           if(obj.type == 2){
             self.queueSend();
           }
        },
        {}
      );
      console.log("已订阅 一对一消息");

      // 广播消息
      this._subscribeTopic = this.stompClient.subscribe(
        "/topic/nf",
        function(data) {
          console.log("收到 广播消息 ：" + data);
          console.log("收到 广播消息 ：" + data.body);
        },
        {}
      );
      console.log("已订阅 广播消息");
    },

    //连接socket服务
    connect() {
      var socket = new SockJS(`${window.SITE_CONFIG['baseUrl']}/ws/endpointChat`);
      this.stompClient = Stomp.over(socket); //子协议
      // this.newsList = {name:'zan'};
      let user = {
        username:this.$cookie.get('userName'),
        token:this.$cookie.get('token')
      }
      this.stompClient.connect(user, (frame)=> {
        //setConnected(true);
        console.log("Connected: " + frame);
        this.doSubscribeQueue();
      });
    },
    //关闭连接
    disconnect() {
      if (this.stompClient != null) {
        this.stompClient.disconnect();
      }
      this.setConnected(false);
      this.unSubscription();
      console.log("Disconnected");
    },

    sendName() {
      this.stompClient.send(
        "/app/hello",
        {},
        JSON.stringify({ name: 'ghhf' })
      );
    },

    // 向服务器发送消息（服务器将发送给发送者）
    queueSend() {
      var newsStr = JSON.stringify(this.newsList);
      var message = newsStr;
      // 参数依次为 发送地址，header，消息
      this.stompClient.send("/ws/receiver", {}, message);
    },

    // 向服务器发送消息（服务器将广播给所有客户端）
    topicSend() {
      var message = '群消息';
      // 参数依次为 发送地址，header，消息
      this.stompClient.send("/ws/test", {}, message);
     console.log("发送 广播消息 " + message);
    },

    // 取消订阅消息
    unSubscription() {
      if (this._subscribeQueue) {
        this._subscribeQueue.unsubscribe();
      }
      if (this._subscribeTopic) {
        this._subscribeTopic.unsubscribe();
      }
    },

  },
  destroyed () {
    this.disconnect();
  }
};
</script>

