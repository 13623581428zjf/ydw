<template>
	<div style="position: absolute; top: 0; bottom: 0; left: 0;right: 0; ">
		<banner @logout="logout" :courseName="courseName" :courseId="courseId" :teacher="selfName"></banner>
		<div class="edu-container">
			<div class="edu-container-inner">
				<!-- 左侧固定 start -->
				<div class="edu-left-sidebar">
					<div class="edu-sidebar-box">
						<div class="edu-sidebar-hd">
							<h2 class="edu-sidebar-hd-title">成员管理</h2>
						</div>
						<div class="edu-sidebar-bd">
							<div class="edu-sidebar-btn">
								<button v-if="false" type="button" class="tc-15-btn" v-on:click="onInviteButtonClick">邀请成员</button>
							</div>
							<ul class="edu-sidebar-list">
								<li>
									<span>{{selfName}}<em>（我）</em></span>
									<span class="edu-sidebar-list-state">{{ selfRole }}</span>
									<a v-show="canLink" style="margin-left: 10px;" href="javascript:;" @click="togglePusher">{{ togglePusherText }}</a>
								</li>
								<li v-for="item in member_list" v-if="item.userID != userID" :key="'edu-sidebar-'+(item.userID)">
									<span>{{ item.nickName || item.userID}}</span>
								</li>
							</ul>
						</div>
					</div>
				</div>
				<!-- 左侧固定 start -->

				<!-- 主界面 start -->
				<div class="edu-main" style="overflow-y: scroll">
					<div style=" margin-right:290px; margin-left: 20px; height: 100%;">
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
							<div v-show="mode == 'camera'" style="background-color: black;display: flex;justify-content: center;">
								<!-- <div id="videoview" class="edu-main-video-play" style=" margin: 0 auto; width: 720px; height: 540px;"> -->
								<!-- </div> -->
								<video id="localVideo" style=" margin: 0 auto; width: 100%; height: calc( 88vh - 325px );" muted autoplay playinline></video> 
							</div>
							<!--tab1 摄像头 End -->
							<!--tab2 白板 Start -->
							<!--<div v-show="mode == 'whiteboard'">
								<sketchpad ref="sketchpadCom" v-if="showSketchpad" :canDraw="canDraw" :toggleSketchPage="toggleSketchPage" @sketchpadData="onSketchpadDataGen" :inputData="inputSketchpadData" :imOptions="imOptions" :userAuthData="userAuthData" />
							</div>-->
							<!--tab2 白板 End -->
						</div>
						<!-- 内容快 end -->
						<!-- 互动人员 start -->
						<div v-show="mode === 'camera'" class="tc-member-list-container">
							<ul class="edu-member-list-inner edu-scroll">
								<li v-show="showSelfPreviewed" class="edu-member-box">
									<!-- 互动人员图片 start -->
									<div class="edu-member-img" id="video_previewed">
									</div>
									<!-- 互动人员图片 end -->
									<!-- 互动信息 start -->
									<div class="edu-member-body">
										<div class="edu-member-body-info">
											<span class="edu-member-name">{{ selfName }}</span>
										</div>
									</div>
								</li>

								<li class="edu-member-box" v-for="(item, index) in members" :key="index">
									<!-- 互动人员图片 start -->
									<div class="edu-member-img" :id="'video_'+(item.id)">
										<img :id="'img_'+(item.id)" v-show="item.reqeust" srcset="../../../assets/live/css/img/default.png 1x, ../../../assets/live/css/img/default@2x.png 2x" src="../../../assets/live/css/img/default.png" alt="default">
										<video :id="'v_'+(item.id)" style=" margin: 0 auto; width: 100%; height: 100%;" autoplay playsinline></video>
									</div>
									<!-- 互动人员图片 end -->
									<!-- 互动信息 start -->
									<div class="edu-member-body">
										<div class="edu-member-body-info">
											<span class="edu-member-name">{{ nameMap[item.name] || item.name}}</span>
										</div>
									</div>
								</li>

								<li class="edu-member-box" v-for="(item, index) in requestMembers" :key="index">
									<!-- 互动人员图片 start -->
									<div class="edu-member-img">
										<img srcset="../../../assets/live/css/img/default.png 1x, ../../../assets/live/css/img/default@2x.png 2x" src="../../../assets/live/css/img/default.png" alt="default">
										<!--学生请求发言 start -->
										<div class="request-speak">
											<div class="request-speak-bd">
												<h4>请求连麦,{{ item.count }}s后关闭</h4>
												<div class="request-speak-btn">
													<a @click="agreeSpeak(true, item.id)" href="javascript:void(0)" class="request-agree">同意</a>
													<a @click="agreeSpeak(false, item.id)" href="javascript:void(0)" class="request-refuse">拒绝</a>
												</div>
											</div>
										</div>
										<!-- 学生请求发言 end -->
									</div>
									<!-- 互动人员图片 end -->
									<!-- 互动信息 start -->
									<div class="edu-member-body">
										<div class="edu-member-body-info">
											<span class="edu-member-name">{{item.name}}</span>
										</div>
									</div>
								</li>
							</ul>
						</div>
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
							<div class="edu-chatroom-list">
								<ul style="padding-left: 10px;">
									<li style="white-space:pre-wrap;white-space:-moz-pre-wrap;white-space:-pre-wrap;white-space:-o-pre-wrap;word-wrap:break-word; " v-for="msg in msgs" v-if="!msg.isSystem" :class="{'edu-chatroom-admin': msg.isSystem, 'edu-chatroom-student': !msg.isSystem}">
										<span>{{ msg.who }} :</span>
										<div style="margin-top: 5px;">{{msg.content}}</div>
									</li>
								</ul>
							</div>
							<div class="edu-chatroom-speaking">
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
	</div>
</template>

<script>
function remove(array, id) {
		var found = false;
		for(var i = 0; i < array.length; i++) {
			if(array[i].id == id) {
				found = true;
				break;
			}
		}
		console.log("remove member at index ", i, found ? 'found' : 'Not found');
		found && array.splice(i, 1);
	}
	import '../../../../static/plugins/live/webim.js'
	import WebRTCRoom from '../../../../static/plugins/live/WebRTCRoom.js'
	import IM from '../../../../static/plugins/live/im.js'
	import Banner from './banner'
//	import Sketchpad from './sketchpad'
	export default {
		name: 'MainView',
		components: {
			'banner': Banner,
//			'sketchpad': Sketchpad,
		},
		data() {
			return {
				courseName: null, //房间名
				courseId: null, //房间id
				selfName: null,
				selfRole: '主播',
				userID: null, //用户id
				canLink: false,
				showSelfPreviewed: 0,
				toggleSketchPage: false,
				isRoomCreator: false,
				togglePusherText: '',
				inputSketchpadData: null,
				showSketchpad: false,
				members: [
					// { name: "李明", id: "2343", reqeust: true, ts: new Date()-30*60*1000},
				],
				member_list: [],
				requestMembers: [],
				refleshTask: null,
				requestingPushers: [{
					id: '1',
					'name': 'jacqiu'
				}],
				pusherVideosDisplay: [false, false, false, false, false, false],
				pushers: {},
				msgs: [], // chat list
				nameMap: {
					"@TIM#SYSTEM": ''
				}, // userId : nickName
				messages: [
					//   {name: "李明", admin: false, id: "2343", text: "大家好，准备上课了！"},
					//   {name: "王老师", admin: true, id: "2343", text: "上课啦！"}
				],
				inputMessage: "",
				lastUpdateTime: moment(Date.now() - 10 * 1000 * 60).format("hh:mm:ss A"),
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
				userAuthData: { // 用户鉴权信息
				},
				heartBeatTask: null // 心跳任务定时器
			};
		},
		mounted: function() {
			var query = this.$route.query;
			console.log("Main.mounted: ", JSON.stringify(query));
			if(!query) {
				alert("请先登录!");
			} else if(query.cmd == "create") {
				this.userID = query.userID;
				this.selfRole = '教师'
				this.canDraw = true;
				this.isRoomCreator = true;
				this.courseName = query.courseName || '新房间';
				this.selfName = query.creator;
			} else if(query.cmd == "enter") {
				this.userID = query.userID;
				if(query.roomCreator === this.userID) { // 相当于老师重新加入房间
					this.selfRole = '教师';
					this.canDraw = true;
					this.isRoomCreator = true;
				} else {
					this.selfRole = '学生';
					this.canDraw = false;
					this.isRoomCreator = false;
				}
				this.selfName = query.userName;
				this.roomID = query.roomID;
			} else if(query.cmd != "create" && query.cmd != "enter") {
				alert("发生错误，无法识别身份");
			}
			var self = this;
			WebRTCRoom.getLoginInfo(
				self.userID,
				function(res) {
					self.userAuthData = res.data;
					self.userID = res.data.userID;
					self.userSig = res.data.userSig;
					self.accountType = res.data.accountType;
					self.sdkAppID = res.data.sdkAppID;
					localStorage.setItem("userID", self.userID)
					self.initRTC();
				},
				function(res) {});
		},

		watch: {
			members: {
				handler: function(newData, oldData) {
					var self = this;
					console.warn("members:", newData);
					self.$nextTick(function() {
						for(var index in newData) {
							var videoElement = document.getElementById("v_" + newData[index].id);
							if(videoElement) {
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
					if(newData.length == 0) {
						self.refleshTask = null;
					} else {
						if(!self.refleshTask) {
							self.refleshTask = setTimeout(function() {
								self.refleshRequestMembers();
							}, 1000)
						}
					}
				},
				deep: true
			},
			showSelfPreviewed: function(newValue, oldValue) {
				var self = this;
				if(newValue) {
					self.$nextTick(function() {
						var previewId = 'video_previewed'
					})
				} else {}
			},
			selfRole: function(newValue, oldValue) {
				console.log("selfRole: " + oldValue + "-> newValue:" + newValue)
				switch(newValue) {
					case '主播':
						{
							if(oldValue == '观众') {
								this.canLink = true;
								this.togglePusherText = '断开连麦'
							}
							break;
						}
					case '观众':
						{
							this.canLink = true;
							// this.togglePusherText = '请求连麦'
							this.togglePusherText = ''
							this.members = [];
							break;
						}
				}
			}
		},

		methods: {
			initRTC: function() {
				var self = this;
				var query = this.$route.query;

				trtc_report.send({
					type: "event",
					event: 1206
				});
				var RTC = this.RTC = new WebRTCAPI({
					sdkAppId: self.sdkAppID,
					openid: self.userID,
					userSig: self.userSig,
					accountType: self.accountType
				}, function() {
					if(query.cmd == "create") {
						self.actionCreateRoom(query);
					} else if(query.cmd == "enter") {
						self.actionEnterRoom(query);
					}
				}, function(error) {
					console.error(error)
				});

				RTC.on("onLocalStreamAdd", function(info) {
					var videoElement = document.getElementById("localVideo");
					videoElement.srcObject = info.stream;
					videoElement.muted = true;
				});

				RTC.on("onRemoteStreamUpdate", function(info) {
					var videoElement = document.getElementById("v_" + info.videoId);
					if(videoElement) {
						videoElement.srcObject = null;
					}
					if(info.stream) {
						var temp = []
						for(var i = 0; i < self.members.length; i++) {
							if(self.members[i].openId != info.openId) {
								temp.push(self.members[i])
							}
						}
						var member = {
							id: info.videoId,
							name: info.openId,
							request: false,
							role: '主播',
							roleText: '连麦',
							ts: Date.now(),
							stream: info.stream,
							openId: info.openId
						};
						temp.push(member);
						self.members = temp;

					} else {
						console.info(info.openId + "进入了房间");
					}
				});

				RTC.on("onRemoteStreamRemove", function(info) {
					var videoElement = document.getElementById("v_" + info.videoId);
					if(videoElement) {
						videoElement.srcObject = null;
					}
					var temp = []
					for(var i = 0; i < self.members.length; i++) {
						if(self.members[i].id != info.videoId) {
							temp.push(self.members[i])
						}
					}
					self.members = temp;
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
			togglePusher: function() {
				var self = this;
				switch(self.togglePusherText) {
					case '请求连麦':
						{
							self.joinPusherBtnClick();
							break;
						}
					case '断开连麦':
						{
							LiveRoom.quitPusher({
								fail: function() {
									alert('发生错误(quitPusher)')
									self.selfRole = '观众'
								},
								success: function() {
									self.selfRole = '观众'
									console.log('退出连麦成功')
								}
							});
							break;
						}
				}
			},

			getMemberList: function() {
				var self = this;
				WebRTCRoom.get_room_members(self.courseId, function(data) {
					console.debug(data)
					if(data.data.code === 0) {
						data.data.members.forEach(function(item) {
							self.nameMap[item.userID] = item.nickName
						})
						self.member_list = data.data.members;
					}
				}, function(err) {
					if(err && err.errCode === 3) {
						self.goHomeRouter();
					}
				})
			},

			renderMemberList: function() {
				var self = this
				this.stopRenderMemberList();
				self.getMemberList();
				this.getMemberListSto = setTimeout(function() {
					self.renderMemberList();
				}, 3000);
			},
			stopRenderMemberList: function() {
				clearTimeout(this.getMemberListSto)
			},

			refleshRequestMembers: function() {
				var self = this;
				var temp = []
				for(var i = 0; i < self.requestMembers.length; i++) {
					var mb = self.requestMembers[i]
					mb.count--;
					if(mb.count > 0)
						temp.push(mb)
				} //for
				self.refleshTask = null;
				self.requestMembers = temp;
				console.log('reflesh: ', JSON.stringify(self.requestMembers))
			},

			afterCreateRoom: function(courseInfo) {
				var self = this
				self.courseId = courseInfo.courseId;
				self.courseName = courseInfo.courseName;
				//创建房间
				this.RTC.createRoom({
					roomid: parseInt(self.courseId),
					role: 'miniwhite'
				}, function() {

					trtc_report.send({
						type: "event",
						event: 1207
					});
					console.info('ENTER RTC ROOM OK')
				}, function(result) {
					if(result) {
						console.error("ENTER RTC ROOM failed");
						self.goHomeRouter();
					}
				});
				self.initIM();
				self.renderMemberList();
			},

			actionCreateRoom: function(query) {
				console.log('-> action create room')
				var self = this;

				//本地存储，刷新的时候还是同一个房间号
				if(localStorage.getItem('course_info')) {
					var courseInfo = JSON.parse(localStorage.getItem('course_info'))
					console.log(' localstorage', courseInfo)
					self.afterCreateRoom(courseInfo);
					self.heartBeatTask = WebRTCRoom.startHeartBeat(self.userID, courseInfo.courseId, function() {}, function() {
						self.$toast.center('心跳包超时，请重试~');
						self.goHomeRouter();
					});
				} else {
					WebRTCRoom.createRoom(self.userID, self.selfName, query.courseName, function(res) {
						// 发送心跳包
						self.heartBeatTask = WebRTCRoom.startHeartBeat(self.userID, res.data.roomID, function() {}, function() {
							self.$toast.center('心跳包超时，请重试~');
							self.goHomeRouter();
						});
						//本地存储，刷新的时候还是同一个房间号
						localStorage.setItem('course_info', JSON.stringify({
							courseId: res.data.roomID,
							courseName: query.courseName
						}));
						self.afterCreateRoom({
							courseId: res.data.roomID,
							courseName: query.courseName
						})
					}, function(res) {
						// error, 返回
						self.goHomeRouter();
					});
				}
			},

			actionEnterRoom: function(query) {
				var self = this;
				self.courseId = query.roomID;
				self.courseName = query.roomInfo;
				self.selfName = query.userName;
				WebRTCRoom.enterRoom(self.userID, query.userName, self.courseId, function(res) {

					// 发送心跳包
					self.heartBeatTask = WebRTCRoom.startHeartBeat(self.userID, res.data.roomID, function() {}, function() {
						self.$toast.center('心跳包超时，请重试~');
						self.goHomeRouter();
					});

					//进房间
					self.RTC.createRoom({
						roomid: parseInt(self.courseId),
						role: 'miniwhite'
					}, function(result) {

						trtc_report.send({
							type: "event",
							event: 1208
						});
					}, function() {
						if(result) {
							console.error("webrtc建房失败");
							self.goHomeRouter();
						}
					});
					self.initIM();
					self.renderMemberList();
				}, function(res) {
					// error, 返回
					self.goHomeRouter();
				});
			},

			updateRecentMember: function(member, joined) {
				var self = this;
				if(self.recentMembers.length > 5) {
					self.recentMembers.splice(0, 1);
				}
				self.recentMembers.push({
					name: member.name,
					id: member.id,
					joined: joined
				})
				this.lastUpdateTime = moment(
					Date.now()
				).format("hh:mm:ss A");
				console.log("updateRecentMember： ", JSON.stringify(this.recentMembers));
			},

			setMode: function(mode) {
				this.mode = mode;
				this.showSketchpad = true;
				console.log("mode", this.mode);
			},
			onInviteButtonClick: function() {
				console.log("onBeginClassBtnClick() called");
			},

			joinPusherBtnClick: function() {
				var self = this;
				console.log("请求连麦: userID= ", self.userID, ' userName=', self.selfName);
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
				for(var i = 0; i < self.requestMembers.length; i++) {
					if(self.requestMembers[i].id == id) break;
				}
				self.requestMembers.splice(i, 1);
				if(agree) {
					console.log("同意" + id + "加入连麦");
				} else {}
			},

			kickMember: function(userID) {

			},

			onSendMessageClick: function() {
				var self = this;
				var msg = this.inputMessage;
				this.inputMessage = "";
				if(msg && msg.length > 0) {
					console.log("sending Msg: ", msg, {
						groupId: self.courseId,
						msg: msg,
						nickName: self.selfName,
						identifier: self.userID
					});
				}
				// IM.sendMsg( self.userID, self.courseId, msg);
				IM.sendRoomTextMsg({
					groupId: self.courseId,
					msg: msg,
					nickName: self.selfName,
					identifier: self.userID
				});
			},

			logout: function() {
				//推出登录
				console.log("logout clicked");
				var self = this;
				if(confirm("退出登录吗？")) {
					self.goHomeRouter();
				} else {}
			},

			goHomeRouter: function() {
				var self = this;
				// WebRTCAPI.init({}, {});
				localStorage.removeItem('course_info');
				this.RTC && this.RTC.quit();
				this.stopRenderMemberList();
				WebRTCRoom && WebRTCRoom.quitRoom(self.userID, self.courseId, function(res) {
					self.$router.push({
						path: '/message-directSeeding'
					});
				}, function(res) {
					self.$router.push({
						path: '/message-directSeeding'
					});
				});
			},

			onSketchpadDataGen: function(boardData) {
				if(boardData.indexOf('"action":401') > -1) {
					var boardBg = this.$refs.sketchpadCom.getBoardBg() || {};
					var boardId = JSON.parse(boardData).value.boardId; // 白板数据

					// 如果有图片则补发图片
					var bgUrl = boardBg[boardId] && boardBg[boardId].url || '';
					this.sendBoardBgPicMsg(boardId, bgUrl);
					setTimeout(() => {
						IM.sendBoardMsg({
							groupId: this.courseId,
							msg: boardData,
							nickName: this.selfName,
							identifier: this.userID
						});
					}, 500);
				} else if(boardData.indexOf('"action":201') > -1) { // 更换背景
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
				if(newMsgList && newMsgList.length > 0) {
					var msgsObj = IM.parseMsgs(newMsgList)
					this.msgs = this.msgs.concat(msgsObj.textMsgs);
					if(!this.isRoomCreator) {
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
				var self = this;
				if(msgs && msgs.length > 0) {
					var msgsObj = IM.parseMsgs(msgs)
					msgsObj.textMsgs.forEach((msg) => {
						var content = JSON.parse(msg.content);
						if(content.cmd === 'sketchpad') {
							var body = JSON.parse(content.data.msg);
							if(body.type == 'request' && body.action == 'currentBoard') {
								if(this.$refs.sketchpadCom) {
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
										identifier: this.userID
									});

									// 如果有图片则补发图片
									var bgUrl = boardBg[currentBoard] && boardBg[currentBoard].url;
									if(bgUrl) {
										this.sendBoardBgPicMsg(currentBoard, bgUrl);
										setTimeout(() => {
											this.sendSwitchBoardMsg(currentBoard);
										}, 500);
									}
								}
							}
						}
					})
				}
			},

			sendBoardBgPicMsg(boardId, url) {
				var data = JSON.stringify({
					seq: 1,
					timestamp: new Date().getTime(),
					value: {
						actions: [{
							action: 201,
							cleanBoard: 0,
							mode: 0,
							time: new Date().getTime() / 1000,
							seq: new Date().getTime(),
							url: url
						}],
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
						actions: [{
							"action": 401,
							"time": new Date().getTime() / 1000,
							"seq": new Date().getTime(),
							"toBoardId": boardId,
							"deleteBoards": []
						}],
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
				self.onMsgNotify.bind(this);
				var loginInfo = {
					sdkAppID: self.sdkAppID,
					appIDAt3rd: self.sdkAppID,
					identifier: self.userID,
					identifierNick: self.selfName,
					accountType: self.accountType,
					userSig: self.userSig
				};
				console.debug('initIM', loginInfo)
				IM.login(loginInfo, {
						"onBigGroupMsgNotify": self.onBigGroupMsgNotify,
						"onMsgNotify": self.onMsgNotify
					},
					function(resp) {
						IM.joinGroup(self.courseId, self.userID)
					},
					function(err) {
						alert(err.ErrorInfo);
					}
				);
			}

		},
		beforeDestroy() {
			IM.logout();
			this.stopRenderMemberList();
			clearInterval(this.heartBeatTask);
		}
	}
</script>

<style>
body,html{
	min-width:initial;
	/*overflow: hidden;*/
}
ul li {
	list-style-type:none;
}
.edu-sidebar-hd-title {
	padding: 0 0 0 10px;
}
.edu-header,.edu-header .topnav,.top-panel{
	background-color: #262626;
	height: 50px;
	line-height: 50px;
}
.edu-container{
	position: absolute;
	background: #fff;
	top:50px;
	left:0px;
	right: 0px;
	bottom: 0px;
	overflow: hidden;
	height: auto;
}
.edu-container-inner{
	position: relative;
	height:100%;width: 100%;
}
/*左侧固定 start*/
.edu-left-sidebar{
	position: absolute;
	top:0px;
	left:0px;
	width:200px; 
	height: 100%;
	background-color: #333333;
	color: #fff;
}
/*左侧固定 end*/

/*主界面start*/
.edu-main{
	margin-left: 200px;
	height: 100%;
	position: relative;
}
	/*内容快 start*/
	.edu-main-inner{
		background-color: #fff;
		margin-right: 220px;
		/* box-sizing:border-box; */
		height: 100%;
		overflow-x:auto;
	}
	/*内容快 end*/

	/*右侧固定start*/
	.edu-right-sidebar{
		position: absolute;
		top:0px;
		right:0px;
		bottom: 0px;
		height: 100%;
		background-color: #f2f2f2;
		font-family:'MicrosoftYaHei';
		transform: translateZ(0);
	}
	/*右侧固定 end*/
/*主界面 end*/
.bg_blue{
   background:#006eff
}
.edu-right-sidebar{width:270px;padding:9px 15px;height: auto}
.edu-chatroom-speaking .tc-15-input-textarea{padding:10px 5px;}
.edu-right-chatroom{ height: calc( 88vh - 140px);}
.edu-chatroom-notification{padding:0 10px;
   position: absolute;
   top: 0;
   left: 0;
   right: 0;
   bottom: 140px;
   word-wrap: break-word;
   overflow: auto;
}
.edu-chatroom-list{padding:0}
.edu-chatroom-notification{
	padding:25px 20px 0px 20px;
}
.edu-chatroom-notification h4{
	font-size:16px;
	font-weight:normal;
	margin-bottom:15px;
}
.edu-chatroom-notification ul li{
	line-height:25px;
	color:#888;
}
.edu-notification-time{
	text-align:center;
	position:relative;
	margin-top:10px;
}
.edu-notification-time:before{
	content:' ';
	display:block;
	width:100%;
	height:1px;
	position:absolute;
	top:50%;
	background-color:#ddd;
	z-index:-1;
}
.edu-notification-time span{
	padding:0 3px;
	display:inline-block;
	background-color:#f2f2f2;
	color:#c3c3c3;
}


.edu-chatroom-list li{
	padding-bottom:5px;
	line-height: 20px;
}
.edu-chatroom-list li.edu-chatroom-student span{
	color:#006eff;
}
.edu-chatroom-list li.edu-chatroom-admin{
	font-weight:bold;
}
.edu-chatroom-speaking{
	position:absolute;
	bottom:0px;
	left:0px;
	border-top:solid 1px #ddd;
	width:100%;
}


.bg_blue{
   background:#006eff
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
    outline:0 none;
    box-sizing: border-box;
    text-decoration: none;
    font-size: 12px;
    -webkit-transition: all .3s ease-in-out;
    transition: all .3s ease-in-out;
}
.tc-15-btn:hover {
    border-color: #0063e5;
    background: #0063e5;
    text-decoration: none;
}
.edu-notification-time{
	text-align:center;
	position:relative;
	margin-top:10px;
}
.edu-notification-time:before{
	content:' ';
	display:block;
	width:100%;
	height:1px;
	position:absolute;
	top:50%;
	background-color:#ddd;
	z-index:-1;
}
.edu-notification-time span{
	padding:0 3px;
	display:inline-block;
	background-color:#f2f2f2;
	color:#c3c3c3;
}



.edu-chatroom-speaking{
	position:absolute;
	bottom:0px;
	left:0px;
	border-top:solid 1px #ddd;
	width:100%;
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
	resize:none;
	box-sizing: border-box;
	-webkit-transition: all .3s cubic-bezier(.645,.045,.355,1);
	transition: all .3s cubic-bezier(0.65, 0.05, 0.36, 1);
}

.tc-15-input-textarea:hover,
.tc-15-input-textarea:focus {
	border-color: #006eff;
	outline:0 none;
}
.tc-15-tab {
    font-size: 0;
    position: relative;
    border-bottom: none;
    margin-bottom: 20px;
    overflow: inherit;
}
.tc-15-tab.secondary-title{
    margin-top: -21px;
    background-color: transparent;
    margin-left: -20px;
    margin-right: -20px;
}
.tc-15-tab.secondary-title > .tc-15-tablist{
    background-color: #fff;
    padding: 0 20px;
}
.tc-15-tab.mt-20{
    margin-top: -21px;
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

.tc-15-tablist li a,
.tc-15-tablist li a:hover {
    text-decoration: none;
}
.tc-15-tab .tc-15-tablist li.disabled a,
.tc-15-tab .tc-15-tablist li.disabled a:hover
{
    color: #bbb;
    cursor: default;
    border-bottom: none;
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

.tc-15-tablist li a:hover {
    position: relative;
    margin-bottom: -1px;
    padding-bottom: 1px;
    color: #000;
    background: transparent;
    font-size: 14px;
    border-bottom: 2px solid #006eff;
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
.tc-15-tab .tc-15-tablist .sub-tablist{
    position: absolute;
    white-space: nowrap;
    margin-top: 8px;
    display: none;
    left: 0;
}
.tc-15-tab .tc-15-tablist .sub-tablist a{
    font-size: 12px;
    display: inline-block;
    border-right: 1px solid #ddd;
    line-height: 1;
    height: inherit;
}
.tc-15-tab .tc-15-tablist .sub-tablist a:last-child{
    border-right: none;
}
.tc-15-tab .tc-15-tablist .sub-tablist a:hover{
    border-bottom: none;
    color: #006eff;
    height: inherit;
    line-height: 1;
    border-right: 1px solid #ddd;
}
.tc-15-tab .tc-15-tablist .sub-tablist a:hover:last-child{
    border-right: none;
}

.tc-15-tab.tc-sub-tab{
    /* padding-bottom: 10px; */
}

.tc-15-tab.s .tc-15-tablist {
    height: 29px;
    line-height: 28px;
}

.tc-15-tab.s .tc-15-tablist li a {
    padding-left: 15px;
    padding-right: 15px;
}


/*带关闭功能的tab S*/
.tc-15-tab li.tc-cur .icon-close,
.tc-15-tab li .icon-close {
    position: absolute;
    outline: none;
    right: 6px;
    top: 2px;
    height: 16px;
    width: 16px;
    font: 400 14px Tahoma;
    color: #a2a2a2;
    background-color: #fff;
    background: transparent;
}

.tc-15-tab.s li.tc-cur .icon-close,
.tc-15-tab.s li .icon-close {
    right: 0;
    top: 0;
    padding: 0;
}
/*带关闭功能的tab E*/
.tc-15-tab .tc-icon-btn,
.tc-15-tab .tc-link-btn{
    padding: 5px;
    font-size: 0;
    vertical-align: middle;
    position: absolute;
    background-color: #fff;
    z-index: 9;
    margin-top: 3px;
    top: 1px;
    /* right: 0; */
}
.tc-15-tab .tc-icon-btn:hover,
.tc-15-tab .tc-link-btn:hover{
    background-color: #f2f2f2;
}
.tc-15-tab .tc-icon-btn:last-child,
.tc-15-tab .tc-icon-btn:nth-last-child(2)
{
    margin-left: -26px;
    top: 0;
    right: 0;
}


.tc-15-tab .tab-panel{
    font-size: 12px;
}

/*可编辑tab*/
.tc-super-tab{
    border: 1px solid #ddd;
}
.tc-super-tab .text{
    font-size: 12px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    display: block;
}
.tc-super-tab .tc-super-tablist{
    font-size: 0;
    display: inline-block;
    vertical-align: middle;
}
.tc-super-tab .tc-super-tablist li{
    border:1px solid #ddd;
    border-top: none;
    border-bottom: none;
    display: inline-block;
    height: 30px;
    line-height: 30px;
    min-width: 150px;
    max-width: 150px;
    padding: 0 15px;
    box-sizing: border-box;
    background-color: #f2f2f2;
    vertical-align: middle;
    position: relative;
    margin-right: -1px;
}
.tc-super-tab .tc-super-tablist li.tc-cur{
    background-color: #fff;
}
.tc-super-tab .tc-super-tab-btn-box{
    position: absolute;
    top: 1px;
    right: 0;
    background-color: #f2f2f2;
    height: 28px;
    line-height: 28px;
    width: 64px;
    text-align: center;
    display: none;
    z-index: 99;
}
.tc-super-tab .tc-super-tablist li.tc-cur .tc-super-tab-btn-box{
    background-color: #fff;
}
.tc-super-tab .tc-super-tablist li:hover .tc-super-tab-btn-box{
    display: block;
}
.tc-super-tab .tc-super-tablist li:first-child{
    border-left: none;
}
.tc-super-tab .tc-tab-btn{
    display: inline-block;
    margin-right: 7px;
}
.tc-super-tab .tc-tab-btn:nth-last-child(2){
    margin-right: 7px;
}
.tc-super-tab .tc-tab-btn:hover + .tc-15-confirm-popout,
.tc-super-tab .tc-tab-btn.hover + .tc-15-confirm-popout
{
    display: block;
}
.tc-super-tab .add-tab-btn{
    margin-left: 20px;
}
.tc-super-tab .tab-panel{
    border-top:1px solid #ddd;
    padding: 15px;
}
.tc-super-tab .tc-super-tablist .tc-15-confirm-popout{
    min-width: inherit;
    position: absolute;
    top: 30px;
    left: -35px;
    display: none;
    transition: all .2s;
}
/*分页*/
.tc-super-tab-hd{
    position: relative;
}
.tc-super-tab-hd .tc-tab-page{
    position: absolute;
    right: 0;
    top: 0;
    box-sizing: border-box;
    padding: 0;
    margin-top:-1px;
}
.tc-super-tab-hd .tc-tab-page .tc-15-page-pre,
.tc-super-tab-hd .tc-tab-page .tc-15-page-next{
    height: 30px;
    line-height: 30px;
    border:none;
    width: 30px;
    padding-top: 3px;
}
/*分页end*/

.edu-chatroom-speaking {
    position: absolute;
    bottom: 0px;
    left: 0px;
    width: 100%;
    border-top: 1px solid rgb(221, 221, 221);
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
.tc-15-input-textarea {
    font-size: 12px;
    width: 330px;
    display: inline-block;
    color: rgb(23, 29, 37);
    height: 100px;
    resize: none;
    box-sizing: border-box;
    padding: 5px 10px;
    border-width: 1px;
    border-style: solid;
    border-radius: 0px;
    border-color: rgb(221, 221, 221);
    border-image: initial;
    border-radius: 0px;
    transition: all 0.3s cubic-bezier(0.65, 0.05, 0.36, 1);
}
textarea {
	font-family: monospace;
    border-color: rgb(169, 169, 169);
    -webkit-appearance: textarea;
    background-color: white;
    -webkit-rtl-ordering: logical;
    flex-direction: column;
    resize: auto;
    cursor: text;
    white-space: pre-wrap;
    word-wrap: break-word;
    border-width: 1px;
    border-style: solid;
    border-color: initial;
    border-image: initial;
    padding: 2px;
}
input, textarea, select, button {
    text-rendering: auto;
    color: initial;
    letter-spacing: normal;
    word-spacing: normal;
    text-transform: none;
    text-indent: 0px;
    text-shadow: none;
    display: inline-block;
    text-align: start;
    margin: 0em;
    font: 400 13.3333px Arial;
}
input, textarea, select, button, meter, progress {
    -webkit-writing-mode: horizontal-tb !important;
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
}

.tc-15-btn.m {
    height: 30px;
    line-height: 28px;
}
.tc-15-btn {
    height: 30px;
    min-width: 24px;
    color: rgb(255, 255, 255);
    line-height: 30px;
    text-align: center;
    display: inline-block;
    cursor: pointer;
    box-sizing: border-box;
    border-radius: 0px;
    font-size: 12px;
    padding: 0px 20px;
    background: rgb(0, 110, 255);
    border-width: 1px;
    border-style: solid;
    border-color: rgb(0, 110, 255);
    border-image: initial;
    outline: none 0px;
    text-decoration: none;
    transition: all 0.3s ease-in-out;
}
</style>