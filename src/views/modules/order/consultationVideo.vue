<template>
  <div style="position: absolute; top: 0; bottom: 0; left: 0;right: 0; ">
		<banner @logout="logout" :courseName="courseName" :courseId="courseId" :teacher="selfName"></banner>
		<div class="edu-container">
			<div class="edu-container-inner">
				<!-- 主界面 start -->
				<div class="edu-main" style="overflow-y: scroll">
					<div style=" margin-right:270px; margin-left: 20px; height: 100%;">
						<!-- tab start -->
						<div class="tc-15-tab tc-15-tab-alt customize-tab-bg" style="padding: 9px 0 0 0;">
							<div role="tablist" class="tc-15-tablist edu-tab-tablist">
								<ul>
									<li v-bind:class="{ 'tc-cur': mode=='camera' }">
										<a @click="setMode('camera')" href="javascript:;" title="打开录像" role="tab">摄像头</a>
									</li>
									<!--<li v-bind:class="{ 'tc-cur': mode=='whiteboard' }">
										<a @click="setMode('whiteboard')" href="javascript:;" title="打开白板" role="tab">白板</a>
									</li>-->
								</ul>
								<!-- <div class="pull-right"> -->
								<!-- <button class="tc-15-btn weak" v-on:click=""></button> -->
								<!-- <button class="tc-15-btn" v-on:click="joinPusherBtnClick" v-if="selfRole != '主播'">加入互动</button> -->
								<!-- </div> -->
							</div>
						</div>
						<!-- tab end -->
						<!-- 内容快 start -->
						<div class="edu-area-main">
							<!--tab1 摄像头 Start -->
							<div v-show="mode == 'camera'" style="  height: calc( 20vh );position: absolute;right: 287px; bottom:8px; z-index:1;">
								<!-- <div id="videoview" class="edu-main-video-play" style=" margin: 0 auto; width: 720px; height: 540px;"> -->
								<!-- </div> -->
								<video id="localVideo" style=" margin: 0 auto;   height: 100%"  autoplay playinline></video> 
							</div>
							<!--tab1 摄像头 End -->
							<!--tab2 白板 Start -->
							<!--<div v-show="mode == 'whiteboard'">
								<sketchpad ref="sketchpadCom" v-if="showSketchpad" :canDraw="canDraw" :toggleSketchPage="toggleSketchPage" @sketchpadData="onSketchpadDataGen" :inputData="inputSketchpadData" :imOptions="imOptions" :userAuthData="userAuthData" />
							</div>-->
							<!--tab2 白板 End -->
              <div v-show="mode === 'camera'" style="background:#000;">
							<!-- <ul class="edu-member-list-inner edu-scroll" style="padding-left: 0; margin: 0 "> -->
								<!-- <li class="edu-member-box" v-for="(item, index) in members" :key="index"> -->
									<!-- 互动人员图片 start -->
									<!-- <div class="edu-member-img" :id="'video_'+(item.id)"> -->
										<video id="remoteVideo" style=" margin: 0 auto; width: 100%; height: calc( 76vh);" autoplay playsinline></video>
									<!-- </div> -->
									<!-- 互动人员图片 end -->
									<!-- 互动信息 start -->
									<!-- <div class="edu-member-body">
										<div class="edu-member-body-info">
											<span class="edu-member-name">{{ nameMap[item.name] || item.name}}</span>
										</div>
									</div> -->
								<!-- </li> -->
							<!-- </ul> -->
						</div>
						</div>
						<!-- 内容快 end -->
						<!-- 互动人员 start -->
						
						<!-- 互动人员 end -->
					</div>
					<!-- 右侧固定 留言 start -->
					<div class="edu-right-sidebar">
						<div role="tablist" class="tc-15-tablist edu-tab-tablist">
							<ul style="padding-left: 10px;">
								<li class="tc-cur">
									<a href="javascript:;" title="打开录像">消息</a>
								</li>
							</ul>
						</div>
						<div class="edu-right-chatroom">
							<div class="edu-chatroom-notification">
								<ul>
									<li v-for="item in recentMembers">{{item.name}}{{item.joined ? '进入': '退出'}}了直播间</li>
								</ul>
							</div>
							<div class="edu-chatroom-list" style="overflow: auto; height: calc(88vh - 320px);">
								<ul style="padding-left: 10px;">
									<li style="white-space:pre-wrap;white-space:-moz-pre-wrap;white-space:-pre-wrap;white-space:-o-pre-wrap;word-wrap:break-word; " v-for="msg in msgs" v-if="!msg.isSystem" :class="{'edu-chatroom-admin': msg.isSystem, 'edu-chatroom-student': !msg.isSystem}">
										<span>{{ msg.who }} :</span>
										<div style="margin-top: 5px;" v-if="isShowImg">{{msg.content}}</div>
										<div style="margin-top: 5px;" class="newsPic" @click="imageBig($event)" v-else v-html="msg.content"></div>
									</li>
								</ul>
							</div>
							<div class="edu-chatroom-speaking">
                <div>
                  <span title="上传图片" @click="updataImg"  style="display: inline-block; font-size: 20px;margin: 10px 10px 0 10px; cursor: pointer;"><icon-svg name="pic"></icon-svg></span>
                  <!-- <span title="上传文件" style="display: inline-block; font-size: 20px;margin: 10px 10px 0 10px;cursor: pointer;"><icon-svg name="file"></icon-svg></span> -->
                </div>
								<textarea v-model="inputMessage" @keyup.enter="onSendMessageClick" class="tc-15-input-textarea" placeholder="在此输入消息，按回车键发送"></textarea>
								<div class="edu-expression-icon">
									<!-- <i class="expression-icon"></i> -->
									<button @click="onSendMessageClick" class="tc-15-btn m ">发送</button>
								</div>
							</div>

						</div>
					</div>
					<!-- 右侧固定 留言 start -->
				</div>
				<!-- 主界面 end -->
			</div>
		</div>
    <el-dialog
      title="上传图片"
      :visible.sync="mask"
      :close-on-click-modal="false"
      width="30%"
     >
      <form class="form-horizontal" id="upd_form" name="upd_form" onkeydown="if(event.keyCode==13)return false;" role="form">
            <div class="form-group">
              <label class="col-sm-2 control-label" for="File">选择</label>
              <div class="col-sm-10">
                <a href="javascript:;" class="file">选择文件
                <input id="upd_pic" @change="fileOnChange($event)" type="file" ref="pathClear">
                </a>
                <span style="display:inline-block;line-height:30px;vertical-align:top;margin-left:20px;">{{fileName}}</span>
                <!--<input type="button" value="停止" id="upd_abort" />-->
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-2 control-label" for="File">预览</label>
              <div class="col-sm-10">
                <div id="previewPicDiv" ref="previewPicDiv"></div>
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-2 control-label" for="upd_progress">进度</label>
              <div class="col-sm-10">
                <progress id="upd_progress" max="100" value="0" ref="upd_progress"></progress>
                <!--<input type="text" id="upd_progress" value="0" name="upd_progress" />-->
              </div>
            </div>
          </form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="mask = false">取 消</el-button>
        <el-button type="primary" @click="uploadPic()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="mask2"
      :close-on-click-modal="false"
      width="90%"
     >
        <img :src="urlimg" alt="" width="100%" height="100%">
      <span slot="footer" class="dialog-footer">
        <el-button @click="mask2 = false">关闭</el-button>
      </span>
    </el-dialog>
	</div>
</template>
<script>
function remove(array, id) {
  var found = false;
  for (var i = 0; i < array.length; i++) {
    if (array[i].id == id) {
      found = true;
      break;
    }
  }
  console.log("remove member at index ", i, found ? "found" : "Not found");
  found && array.splice(i, 1);
}
import Banner from "../../common/live/banner"
import '../../../../static/plugins/live/webim.js'
import WebRTCRoom from '../../../../static/plugins/live/WebRTCRoom.js'
import IM from '../../../../static/plugins/live/im.js'
import '../../../../static/plugins/live/spark-md5.js'
import upImg from '../../../utils/upload_and_send_pic_msg.js'

export default {
  name: "MainView",
  components: {
    banner: Banner
  },
  data() {
    return {
      courseName: null, //房间名
      courseId: null, //房间id
      selfName: null,
      selfRole: "主播",
      userID: null, //用户id
      canLink: false,
      showSelfPreviewed: 0,
      toggleSketchPage: false,
      isRoomCreator: false,
      togglePusherText: "",
      inputSketchpadData: null,
      showSketchpad: false,
      members: [
        // { name: "李明", id: "2343", reqeust: true, ts: new Date()-30*60*1000},
      ],
      member_list: [],
      requestMembers: [],
      refleshTask: null,
      requestingPushers: [
        {
          id: "1",
          name: "jacqiu"
        }
      ],
      pusherVideosDisplay: [false, false, false, false, false, false],
      pushers: {},
      msgs: [], // chat list
      nameMap: {
        "@TIM#SYSTEM": ""
      }, // userId : nickName
      messages: [
        //   {name: "李明", admin: false, id: "2343", text: "大家好，准备上课了！"},
        //   {name: "王老师", admin: true, id: "2343", text: "上课啦！"}
      ],
      inputMessage: "",
      // lastUpdateTime: moment(Date.now() - 10 * 1000 * 60).format("hh:mm:ss A"),
      recentMembers: [],
      mode: "camera",
      memberUpdateTimer: null,
      imOptions: {
        sendMsg: function() {
          return "sendMsgFunction";
        }
      },
      canDraw: false,
      getMemberListSto: null,
      userAuthData: {
        // 用户鉴权信息
      },
      heartBeatTask: null, // 心跳任务定时器
      mask: false,
      mask2: false,
      isShowImg:true,
      isHideImg:false,
      fileName:'',
      orderId:null,
      urlimg:null
    };
  },
  mounted: function() {
    var self = this;
    var orderId = this.$route.query.consultation_id;
    this.orderId =orderId;
    WebRTCRoom.getLoginInfo(
      orderId,
      function(res) {
        console.log(res);
        self.userAuthData = res.data;
        self.userID = res.data.login.userID;
        self.userSig = res.data.login.userSig;
        self.accountType = res.data.login.accountType;
        self.sdkAppID = res.data.login.sdkAppID;
        self.room = res.data.room;
        localStorage.setItem("userID", self.userID);
        self.initRTC();

      },
      function(res) {
        if(res.errMsg == '001'){
            console.log(res)
          const h = self.$createElement;
           self.$notify({
              title: '提示',
              message: h('p', { style: 'width:500px;margin:50px 0; font-size:16px;color:#17b3a3;'}, '您的号码已过期，请等待下次叫号。'),
              position: 'top-right',
              type: 'warning',
              duration: 4500
            });
            // setTimeout(function(){
            //   self.tabsCloseCurrentHandle();
            // },1000)
        }
      }
    );
  },

  watch: {
    members: {
      handler: function(newData, oldData) {
        var self = this;
        console.warn("members:", newData);
        self.$nextTick(function() {
          for (var index in newData) {
            var videoElement = document.getElementById(
              "v_" + newData[index].id
            );
            if (videoElement) {
              videoElement.srcObject = newData[index].stream;
            }
          }
        });
      },
      deep: true
    },
    requestMembers: {
      handler: function(newData, oldData) {
        var self = this;
        if (newData.length == 0) {
          self.refleshTask = null;
        } else {
          if (!self.refleshTask) {
            self.refleshTask = setTimeout(function() {
              self.refleshRequestMembers();
            }, 1000);
          }
        }
      },
      deep: true
    },
    showSelfPreviewed: function(newValue, oldValue) {
      var self = this;
      if (newValue) {
        self.$nextTick(function() {
          var previewId = "video_previewed";
        });
      } else {
      }
    },
    selfRole: function(newValue, oldValue) {
      console.log("selfRole: " + oldValue + "-> newValue:" + newValue);
      switch (newValue) {
        case "主播": {
          if (oldValue == "观众") {
            this.canLink = true;
            this.togglePusherText = "断开连麦";
          }
          break;
        }
        case "观众": {
          this.canLink = true;
          // this.togglePusherText = '请求连麦'
          this.togglePusherText = "";
          this.members = [];
          break;
        }
      }
    }
  },
  computed: {
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
    typeId: {
      get() {
        return this.$store.state.common.typeId;
      },
      set(val) {
        this.$store.commit("common/typeIdChange", val);
      }
    }
  },
  methods: {
    initRTC: function(str) {
      var self = this;
      trtc_report.send({
        type: "event",
        event: 1206
      });
      var RTC = (this.RTC = new WebRTCAPI(
        {
          sdkAppId: self.sdkAppID,
          openid: self.userID,
          userSig: self.userSig,
          accountType: self.accountType
        },
        function() {
          //初始化完成后调用进房接口
          RTC.createRoom(
            {
              roomid: self.room.roomID,
              role: self.room.userID //画面设定的配置集名 （见控制台 - 画面设定 )
            },
            function() {
              // 发送心跳包
              self.selfName = self.room.nickName;
              self.courseId = self.room.roomID;
              self.courseName = self.room.roomInfo;
              self.heartBeatTask = WebRTCRoom.startHeartBeat(
                self.room.userID,
                self.room.roomID,
                function() {},
                function() {
                  self.$toast.center("心跳包超时，请重试~");
                  self.goHomeRouter();
                }
              );
            }
          );
          self.initIM();
        }
      ));
    //本地
      RTC.on("onLocalStreamAdd", function(info) {
        var videoElement = document.getElementById("localVideo");
        videoElement.srcObject = info.stream;
      });
      //远端
      RTC.on("onRemoteStreamUpdate", function(info) {
        var videoElement = document.getElementById("remoteVideo");
         videoElement.srcObject = info.stream;
        // if (videoElement) {
        //   videoElement.srcObject = null;
        // }
        // if (info.stream) {
        //   var temp = [];
        //   for (var i = 0; i < self.members.length; i++) {
        //     if (self.members[i].openId != info.openId) {
        //       temp.push(self.members[i]);
        //     }
        //   }
        //   var member = {
        //     id: info.videoId,
        //     name: info.openId,
        //     request: false,
        //     role: "主播",
        //     roleText: "连麦",
        //     ts: Date.now(),
        //     stream: info.stream,
        //     openId: info.openId
        //   };
        //   temp.push(member);
        //   self.members = temp;
        // } else {
        //   console.info(info.openId + "进入了房间");
        // }
      });
    //远端断开
      RTC.on("onRemoteStreamRemove", function(info) {
        var videoElement = document.getElementById("remoteVideo");
        videoElement.srcObject = info.stream;
        self.goHomeRouter();
        // if (videoElement) {
        //   videoElement.srcObject = null;
        // }
        // var temp = [];
        // for (var i = 0; i < self.members.length; i++) {
        //   if (self.members[i].id != info.videoId) {
        //     temp.push(self.members[i]);
        //   }
        // }
        // self.members = temp;
      });

      RTC.on("onKickOut", function() {
        console.warn("其他地方登录，被踢下线");
        self.goHomeRouter();
      });

      RTC.on("onWebSocketClose", function() {
        console.warn("websocket断开");
        self.goHomeRouter();
      });

      RTC.on("onRelayTimeout", function() {
        console.warn("服务器超时断开");
        self.goHomeRouter();
      });
    },
    //打开弹框
    updataImg() {
      this.mask = true;
      if(this.$refs.pathClear){
        this.$refs.pathClear.value =''
        this.$refs.previewPicDiv.innerHTML = '';
        this.fileName = '';
        this.$refs.upd_progress.value = 0;
      }
      
    },
    //上传图片
    fileOnChange(event){
      upImg.fileOnChange(event.target);
      this.fileName = this.$refs.pathClear.files[0].name;
    },
    uploadPic(){
       var uploadFiles = document.getElementById('upd_pic');
       var file = uploadFiles.files[0];
        if(file == undefined){
            this.$message({
              message: '请选择文件',
              type: 'warning'
            });
        }else {
          console.log(file);
          upImg.uploadPic();
        }
   
    },
    //打开图片
    imageBig(event){
      var arrUrl = event.target.src.split("#");
      // console.log(arrUrl);
        this.imgShow(arrUrl[2])
      // window.open(arrUrl[2]);
      // event.target.src;
    },
    imgShow(url){
      this.mask2 = true;
      this.urlimg = url;
    },
    closeStatus(){
        this.$http.postRequest('/consultation/updateStartToN',{
          orderId:this.orderId
          }).then(({ data }) => {
            console.log('调用了')
          });
    },
    // tabs, 关闭当前
    tabsCloseCurrentHandle() {
      this.typeId = this.$route.query.activeIndex;
      this.removeTabHandle(this.mainTabsActiveName);
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
    togglePusher: function() {
      var self = this;
      switch (self.togglePusherText) {
        case "请求连麦": {
          self.joinPusherBtnClick();
          break;
        }
        case "断开连麦": {
          LiveRoom.quitPusher({
            fail: function() {
              alert("发生错误(quitPusher)");
              self.selfRole = "观众";
            },
            success: function() {
              self.selfRole = "观众";
              console.log("退出连麦成功");
            }
          });
          break;
        }
      }
    },
    getMemberList: function() {
      var self = this;
      console.log(self.courseId);
      WebRTCRoom.get_room_members(
        self.courseId,
        function(data) {
          console.debug(data);
          if (data.data.code === 0) {
            data.data.members.forEach(function(item) {
              self.nameMap[item.userID] = item.nickName;
            });
            self.member_list = data.data.members;
          }
        },
        function(err) {
          if (err && err.errCode === 3) {
            self.goHomeRouter();
          }
        }
      );
    },
    renderMemberList: function() {
      var self = this;
      this.stopRenderMemberList();
      self.getMemberList();
      this.getMemberListSto = setTimeout(function() {
        self.renderMemberList();
      }, 3000);
    },
    stopRenderMemberList: function() {
      clearTimeout(this.getMemberListSto);
    },

    refleshRequestMembers: function() {
      var self = this;
      var temp = [];
      for (var i = 0; i < self.requestMembers.length; i++) {
        var mb = self.requestMembers[i];
        mb.count--;
        if (mb.count > 0) temp.push(mb);
      } //for
      self.refleshTask = null;
      self.requestMembers = temp;
      console.log("reflesh: ", JSON.stringify(self.requestMembers));
    },

    afterCreateRoom: function(courseInfo) {
      var self = this;
      self.courseId = courseInfo.courseId;
      self.courseName = courseInfo.courseName;
      // console.log(self.courseId);
      //创建房间
      this.RTC.createRoom(
        {
          roomid: parseInt(self.courseId),
          role: "miniwhite"
        },
        function() {
          trtc_report.send({
            type: "event",
            event: 1207
          });
          console.info("ENTER RTC ROOM OK");
        },
        function(result) {
          if (result) {
            console.error("ENTER RTC ROOM failed");
            self.goHomeRouter();
          }
        }
      );
      self.initIM();
      self.renderMemberList();
    },

    actionCreateRoom: function(query) {
      console.log("-> action create room");
      var self = this;

      //本地存储，刷新的时候还是同一个房间号
      if (localStorage.getItem("course_info")) {
        var courseInfo = JSON.parse(localStorage.getItem("course_info"));
        console.log(" localstorage", courseInfo);
        self.afterCreateRoom(courseInfo);
        self.heartBeatTask = WebRTCRoom.startHeartBeat(
          self.userID,
          courseInfo.courseId,
          function() {},
          function() {
            self.$toast.center("心跳包超时，请重试~");
            self.goHomeRouter();
          }
        );
      } else {
        // console.log(self.userID, self.nickName, query.courseName);
        WebRTCRoom.createRoom(
          self.userID,
          self.selfName,
          query.courseName,
          function(res) {
            // 发送心跳包
            // console.log(res.data.nickName);
            self.selfName = res.data.nickName;
            self.heartBeatTask = WebRTCRoom.startHeartBeat(
              self.userID,
              res.data.roomID,
              function() {},
              function() {
                self.$toast.center("心跳包超时，请重试~");
                self.goHomeRouter();
              }
            );
            //本地存储，刷新的时候还是同一个房间号
            localStorage.setItem(
              "course_info",
              JSON.stringify({
                courseId: res.data.roomID,
                courseName: res.data.roomInfo
              })
            );
            self.afterCreateRoom({
              courseId: res.data.roomID,
              courseName: res.data.roomInfo
            });
          },
          function(res) {
            // error, 返回
            self.goHomeRouter();
          }
        );
      }
    },

    actionEnterRoom: function(query) {
      var self = this;
      self.courseId = query.roomID;
      self.courseName = query.roomInfo;
      self.selfName = query.userName;
      WebRTCRoom.enterRoom(
        self.userID,
        query.userName,
        self.courseId,
        function(res) {
          // 发送心跳包
          self.heartBeatTask = WebRTCRoom.startHeartBeat(
            self.userID,
            res.data.roomID,
            function() {},
            function() {
              self.$toast.center("心跳包超时，请重试~");
              self.goHomeRouter();
            }
          );

          //进房间
          self.RTC.createRoom(
            {
              roomid: parseInt(self.courseId),
              role: "miniwhite"
            },
            function(result) {
              trtc_report.send({
                type: "event",
                event: 1208
              });
            },
            function() {
              if (result) {
                console.error("webrtc建房失败");
                self.goHomeRouter();
              }
            }
          );
          self.initIM();
          self.renderMemberList();
        },
        function(res) {
          // error, 返回
          self.goHomeRouter();
        }
      );
    },

    updateRecentMember: function(member, joined) {
      var self = this;
      if (self.recentMembers.length > 5) {
        self.recentMembers.splice(0, 1);
      }
      self.recentMembers.push({
        name: member.name,
        id: member.id,
        joined: joined
      });
      // this.lastUpdateTime = moment(Date.now()).format("hh:mm:ss A");
      console.log("updateRecentMember： ", JSON.stringify(this.recentMembers));
    },

    setMode: function(mode) {
      this.mode = mode;
      this.showSketchpad = true;
      // console.log("mode", this.mode);
    },
    onInviteButtonClick: function() {
      console.log("onBeginClassBtnClick() called");
    },

    joinPusherBtnClick: function() {
      var self = this;
      console.log(
        "请求连麦: userID= ",
        self.userID,
        " userName=",
        self.selfName
      );
      self.showSelfPreviewed = true;
    },

    toogleMemberVoice: function(id) {
      //关闭学生的声音
      console.log("toogleMemberVoice", id);
    },

    agreeSpeak: function(agree, id) {
      //连麦应答
      console.log("agreeSpeak", agree, id);
      var self = this;
      for (var i = 0; i < self.requestMembers.length; i++) {
        if (self.requestMembers[i].id == id) break;
      }
      self.requestMembers.splice(i, 1);
      if (agree) {
        console.log("同意" + id + "加入连麦");
      } else {
      }
    },

    kickMember: function(userID) {},

    onSendMessageClick: function() {
      var self = this;
      var msg = this.inputMessage;
      this.inputMessage = "";
      if (msg && msg.length > 0) {
        // console.log(self.courseId);
        console.log("sending Msg: ", msg, {
          groupId: self.room.roomID,
          msg: msg,
          nickName: self.room.nickName,
          identifier: self.userID
        });
      }
      // IM.sendMsg( self.userID, self.courseId, msg);
      IM.sendRoomTextMsg({
        groupId: self.room.roomID,
        msg: msg,
        nickName: self.room.nickName,
        identifier: self.userID
      });
    },

    logout: function() {
      //推出登录
      console.log("logout clicked");
      var self = this;
       this.$confirm('您确定要退出会诊吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
         self.goHomeRouter();
          this.$message({
            type: 'success',
            message: '退出成功!'
          });
        }).catch(() => {
          self.tabsCloseCurrentHandle();
          this.$message({
            type: 'info',
            message: '错误连接，退出请重试！'
          });          
        });
    },

    goHomeRouter: function() {
      var self = this;
      // WebRTCAPI.init({}, {});
      localStorage.removeItem("course_info");
      this.RTC && this.RTC.quit();
      this.stopRenderMemberList();
      this.closeStatus();
      WebRTCRoom &&
        WebRTCRoom.quitRoom(
          self.userID,
          self.room.roomID,
          function(res) {
            self.$router.push({
              path: "/order-consultation"
            });
            self.tabsCloseCurrentHandle();
          },
          function(res) {
            self.$router.push({
              path: "/order-consultation"
            });
            self.tabsCloseCurrentHandle();
          }
        );
    },

    onSketchpadDataGen: function(boardData) {
      if (boardData.indexOf('"action":401') > -1) {
        var boardBg = this.$refs.sketchpadCom.getBoardBg() || {};
        var boardId = JSON.parse(boardData).value.boardId; // 白板数据

        // 如果有图片则补发图片
        var bgUrl = (boardBg[boardId] && boardBg[boardId].url) || "";
        this.sendBoardBgPicMsg(boardId, bgUrl);
        setTimeout(() => {
          IM.sendBoardMsg({
            groupId: this.courseId,
            msg: boardData,
            nickName: this.selfName,
            identifier: this.userID
          });
        }, 500);
      } else if (boardData.indexOf('"action":201') > -1) {
        // 更换背景
        var currentBoard = this.$refs.sketchpadCom.getCurrentBoard();
        IM.sendBoardMsg({
          groupId: this.courseId,
          msg: boardData,
          nickName: this.selfName,
          identifier: this.userID
        });
        setTimeout(() => {
          this.sendSwitchBoardMsg(currentBoard);
        }, 500);
      } else {
        IM.sendBoardMsg({
          groupId: this.courseId,
          msg: boardData,
          nickName: this.selfName,
          identifier: this.userID
        });
      }
    },

    onBigGroupMsgNotify: function(newMsgList) {
      var self = this;
      if (newMsgList && newMsgList.length > 0) {
        var msgsObj = IM.parseMsgs(newMsgList);
        if(msgsObj.textMsgs[0].content.indexOf('<img') != -1){
         this.isShowImg = false;
         this.mask = false;
          // console.log(msgsObj)
          // console.log(msgsObj.textMsgs[0].who)
        //  msgsObj.textMsgs[0].who = self.selfName;
        //  console.log(msgsObj.textMsgs)
        }
        this.msgs = this.msgs.concat(msgsObj.textMsgs);
        if (!this.isRoomCreator) {
          var whiteBoardMsgs = msgsObj.whiteBoardMsgs || [];
          whiteBoardMsgs.forEach((item, index) => {
            (function(index, item) {
              setTimeout(() => {
                self.inputSketchpadData = item;
              }, index * 50);
            })(index, item);
          });
        }
      }
    },

    onMsgNotify: function(msgs) {
      // console.log(msgs)
      var self = this;
      if (msgs && msgs.length > 0) {
        var msgsObj = IM.parseMsgs(msgs);
        msgsObj.textMsgs.forEach(msg => {
          var content = JSON.parse(msg.content);
          if (content.cmd === "sketchpad") {
            var body = JSON.parse(content.data.msg);
            if (body.type == "request" && body.action == "currentBoard") {
              if (this.$refs.sketchpadCom) {
                var currentBoard = this.$refs.sketchpadCom.getCurrentBoard();
                var boardBg = this.$refs.sketchpadCom.getBoardBg() || {};
                IM.sendBoardMsg({
                  groupId: this.courseId,
                  msg: JSON.stringify({
                    action: body.action,
                    currentBoard: currentBoard
                    //,boardBg: JSON.stringify(boardBg)
                  }),
                  nickName: this.selfName,
                  identifier: this.selfName
                });

                // 如果有图片则补发图片
                var bgUrl = boardBg[currentBoard] && boardBg[currentBoard].url;
                if (bgUrl) {
                  this.sendBoardBgPicMsg(currentBoard, bgUrl);
                  setTimeout(() => {
                    this.sendSwitchBoardMsg(currentBoard);
                  }, 500);
                }
              }
            }
          }
        });
      }
    },

    sendBoardBgPicMsg(boardId, url) {
      var data = JSON.stringify({
        seq: 1,
        timestamp: new Date().getTime(),
        value: {
          actions: [
            {
              action: 201,
              cleanBoard: 0,
              mode: 0,
              time: new Date().getTime() / 1000,
              seq: new Date().getTime(),
              url: url
            }
          ],
          boardId: boardId,
          operator: this.userID
        }
      });
      IM.sendBoardMsg({
        groupId: this.courseId,
        msg: data,
        nickName: this.selfName,
        identifier: this.userID
      });
    },

    sendSwitchBoardMsg(boardId) {
      var data = JSON.stringify({
        seq: 1,
        timestamp: new Date().getTime(),
        value: {
          actions: [
            {
              action: 401,
              time: new Date().getTime() / 1000,
              seq: new Date().getTime(),
              toBoardId: boardId,
              deleteBoards: []
            }
          ],
          boardId: boardId,
          operator: this.userID
        }
      });
      IM.sendBoardMsg({
        groupId: this.courseId,
        msg: data,
        nickName: this.selfName,
        identifier: this.userID
      });
    },

    initIM: function() {
      var self = this;
      // console.log(self.sdkAppID);
      self.onMsgNotify.bind(this);
      var loginInfo = {
        sdkAppID: self.sdkAppID,
        appIDAt3rd: self.sdkAppID,
        identifier: self.userID,
        identifierNick: self.room.nickName,
        accountType: self.accountType,
        userSig: self.userSig
      };
      var roomid  = self.room.roomID;
      // console.debug("initIM", loginInfo);
      upImg.loginInfoInit(loginInfo,roomid);
      IM.login(
        loginInfo,
        {
          onBigGroupMsgNotify: self.onBigGroupMsgNotify,
          onMsgNotify: self.onMsgNotify
        },
        function(resp) {
          IM.joinGroup(self.courseId, self.userID);
        },
        function(err) {
          alert(err.ErrorInfo);
        }
      );
    }
  },
  beforeDestroy() {
    var self = this;
    IM.logout();
    this.stopRenderMemberList();
    clearInterval(this.heartBeatTask);
    this.closeStatus();
    
    WebRTCRoom && WebRTCRoom.quitRoom(
          this.userID,
          this.room.roomID,
          function(res) {
            self.$router.push({
              path: "/order-consultation"
            });
          },
          function(res) {
            self.$router.push({
              path: "/order-consultation"
            });
          }
        );
  }
};
</script>
<style scoped>
body,
html {
  min-width: initial;
}
ul li {
  list-style-type: none;
}

.live_mask {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
}
.dial {
  width: 50%;
  height: 300px;
  border-radius: 10px;
  background-color: #fff;
  position: absolute;
  top: 10%;
  left: 50%;
  margin-left: -25%;
  z-index: 3;
}
.file {
    position: relative;
    display: inline-block;
    background: #17B3A3;
    border: 1px solid #17B3A3;
    border-radius: 4px;
    padding: 4px 12px;
    overflow: hidden;
    color: #fff;
    text-decoration: none;
    text-indent: 0;
    line-height: 20px;
    cursor: pointer;
}
.file input {
    position: absolute;
    font-size: 100px;
    right: 0;
    top: 0;
    opacity: 0;
}
.file:hover {
    background: rgb(69, 194, 181);
    border-color: rgb(69, 194, 181);
    color: #fff;
    text-decoration: none;
    cursor: pointer;
}
.edu-sidebar-hd-title {
  padding: 0 0 0 10px;
}
.edu-header,
.edu-header .topnav,
.top-panel {
  background-color: #262626;
  height: 50px;
  line-height: 50px;
}
.edu-container {
  position: absolute;
  background: #fff;
  top: 50px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  overflow: hidden;
  height: auto;
}
/*主界面start*/
.edu-main {
  height: 100%;
}
.edu-right-sidebar {
  width: 270px;
  padding: 9px 15px;
  height: auto;
}
.edu-chatroom-speaking .tc-15-input-textarea {
  padding: 10px 5px;
}
.edu-right-chatroom {
  height: calc(88vh - 140px);
}
.newsPic >>> img {
  width: 200px !important;
}
.edu-chatroom-list li {
  padding-bottom: 5px;
  line-height: 20px;
}
.edu-chatroom-list li.edu-chatroom-student span {
  color: #006eff;
}
.edu-chatroom-list li.edu-chatroom-admin {
  font-weight: bold;
}
.edu-chatroom-speaking {
  position: absolute;
  bottom: 0px;
  left: 0px;
  border-top: solid 1px #ddd;
  width: 100%;
}
.tc-15-btn {
  height: 30px;
  min-width: 24px;
  padding: 0px 20px;
  background: #006eff;
  color: #fff;
  border: 1px solid #006eff;
  line-height: 30px;
  text-align: center;
  display: inline-block;
  cursor: pointer;
  outline: 0 none;
  box-sizing: border-box;
  text-decoration: none;
  font-size: 12px;
  -webkit-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
}
.tc-15-btn:hover {
  border-color: #0063e5;
  background: #0063e5;
  text-decoration: none;
}
.tc-15-input-textarea {
  font-size: 12px;
  width: 330px;
  display: inline-block;
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 0;
  color: #171d25;
  height: 100px;
  resize: none;
  box-sizing: border-box;
  -webkit-transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition: all 0.3s cubic-bezier(0.65, 0.05, 0.36, 1);
}

.tc-15-input-textarea:hover,
.tc-15-input-textarea:focus {
  border-color: #006eff;
  outline: 0 none;
}

.tc-15-tablist {
  line-height: inherit;
  height: auto;
  padding: 0;
  border-bottom: 1px solid #ddd;
  font-size: 0;
  margin-bottom: 20px;
}
.tc-15-tablist li {
  display: inline-block;
  position: relative;
  margin-top: -1px;
  margin-left: 10px;
  line-height: 29px;
}
.tc-15-tablist li:first-child {
  margin-left: 0;
}
.tc-15-tablist li a {
  display: block;
  height: 100%;
  font-size: 14px;
  padding: 0 10px;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 0;
  border-bottom: 0;
  background: transparent;
  color: #000;
  border: none;
  border-bottom: 2px solid transparent;
}
.tc-15-tablist li.tc-cur a {
  position: relative;
  margin-bottom: -1px;
  padding-bottom: 1px;
  color: #000;
  background: transparent;
  font-weight: bold;
  font-size: 14px;
  border-bottom: 2px solid #006eff;
}

.edu-chatroom-speaking .tc-15-input-textarea {
  background-color: transparent;
  width: 100%;
  height: 110px;
  line-height: 20px;
  border-width: initial;
  border-style: none;
  border-color: initial;
  border-image: initial;
  padding: 10px 5px;
}
.edu-right-sidebar {
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  height: 100%;
  background-color: rgb(242, 242, 242);
  font-family: MicrosoftYaHei;
  transform: translateZ(0px);
}
.edu-expression-icon {
  text-align: right;
  vertical-align: middle;
  padding-bottom: 25px;
  padding-right: 10px;
}

</style>

