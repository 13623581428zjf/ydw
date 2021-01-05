<template>
	<div class="edu-index-body">
		<div class="edu-index-pop-ups" style="margin: 0 auto;">
			<div class="edu-index-logo" style="display: flex;justify-content: center;">
				<img src="../../../assets/live/webrtc-logo-min.png" alt="">
			</div>
			<!-- 创建课堂 s -->
			<div v-if="!joinFlag" class="edu-index-class-middle">
				<div class="edu-index-class-middle" v-if="courseItems.length > 0">
					<div class="edu-index-class-list">
						<ul>
							<li v-for="(item, index) in courseItems">
								<span>{{ item.roomInfo ? item.roomInfo : item.roomID }}</span>
								<button class="joinButton" v-on:click="join(index)">加入</button>
							</li>
						</ul>
					</div>
				</div>
				<div class="edu-index-class-prompt" v-if="courseItems.length === 0">
					<p>暂时没有直播，请创建课堂</p>
				</div>
			</div>
			<!-- 创建课堂 e -->
			<!-- 输入直播课堂 s -->
			<div v-if="joinFlag" class="edu-index-class-input">
				<ul>
					<li><input type="text" placeholder="请输入你的昵称" v-model="loginInfo.userName" /></li>
				</ul>
			</div>
			<!-- 输入直播课堂 e -->
			<!-- 按钮 s -->
			<div class="edu-index-button">
				<!-- 创建和加入课堂 s -->
				<div class="tc-15-rich-dialog-ft">
					<div class="tc-15-rich-dialog-ft-btn-wrap">
						<button v-if="!joinFlag" class="tc-15-btn" v-on:click="onCreateButtonClick">创建房间</button>
						<button v-if="joinFlag" class="tc-15-btn" v-on:click="onjoinButtonClick">进入房间</button>
						<!--<button class="tc-15-btn weak" v-on:click="onjoinButtonClick">加入课堂</button> -->
					</div>
				</div>
				<!-- 创建和加入课堂 e -->
			</div>
			<!-- 按钮 e -->
		</div>
	</div>
</template>

<script>
	import '../../../../static/plugins/live/webim.js'
	import WebRTCRoom from '../../../../static/plugins/live/WebRTCRoom.js'
	import IM from '../../../../static/plugins/live/im.js'
	function getRandomName() {
		var randomNames = ['曹操', '刘备', '李白', '诸葛亮', '赵子龙', '孙权', '张飞']
		var index = Math.ceil(Math.random() * 100) % randomNames.length;
		return randomNames[index];
	}

	function randomUserId() {
		var userid ="userid_web_" + Date.now().toString();
		return userid;
	}
	export default {
		name: "CourseList",
		data() {
			return {
				loginInfo: {
					userID: '',
					userName: '',
				},
				room: null,
				joinFlag: false,
				nickName: null,
				hasClass: false,
				courseItems: [],
			};
		},
		mounted: function() {
			this.loginInfo.userName = null;
			this.loginInfo.userID = localStorage.getItem('userID') || randomUserId();
			this.updateCourseList();
			localStorage.removeItem('course_info');
		},
		beforeDestroy: function() {
			clearTimeout(this.courseListSto)
		},
		methods: {
			join: function(idx) {
				this.room = this.courseItems[idx];
				this.joinFlag = true;
				return;
			},
			onCreateButtonClick: function() {
				var self = this;
				console.log('onCreateButtonClick: self.loginInfo.userName = ', self.loginInfo.userName)
				this.$router.push({
					path: 'create',
					query: {
						name: self.loginInfo.userName,
						userID: self.loginInfo.userID
					}
				})
			},
			onjoinButtonClick: function() {
				var self = this;
				if(!self.loginInfo.userName) {
					alert('昵称不能为空!')
					return;
				}
				console.log("跳转加入", JSON.stringify(self.room))
				this.$router.push({
					path: 'main-live',
					query: {
						cmd: 'enter',
						roomID: self.room.roomID,
						roomInfo: self.room.roomInfo,
						userName: self.loginInfo.userName,
						userID: self.loginInfo.userID,
						roomCreator: self.room.roomCreator
					}
				})
			},
			updateCourseList: function() {
				console.log('updateCourseList() called');
				var self = this;
				WebRTCRoom.getRoomList(0, 20,
					function(res) {
						self.courseItems = []
						if(res.data && res.data.rooms) {
							var rooms = res.data.rooms;
							rooms.forEach(function(room) {
								self.courseItems.push(room)
							});

							console.log('courseItems: ', JSON.stringify(self.courseItems));
							clearTimeout(self.courseListSto)
							self.courseListSto = setTimeout(function() {
								self.updateCourseList();
							}, 2000);
						}
					},
					function(res) {
						self.courseItems = []
						console.warn('获取房间列表失败', JSON.stringify(res))
					});
			}
		}
	}
</script>

<style scoped="scoped" >
.tc-15-rich-dialog-ft-btn-wrap {
	text-align: center;
}
.edu-index-body-container{
	width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
}

.edu-index-body{
	width: 100%;
    height: 100%;
    background-size: cover;
    position: relative;
    min-height: 640px;
}
.edu-index-pop-ups{
	width:420px;
	background-color:#fff;
	padding:30px 26px 24px 26px;
	box-sizing:border-box;
	position: absolute;
	top: 50%;
    left: 50%;
	-webkit-transform: translate(-50%,-50%);
	transform: translate(-50%,-50%);
}
.edu-index-logo{
	width:227px;
	height:34px;
	margin:0 auto;
	margin-bottom:33px;
}
.edu-index-logo img{
	max-width:100%;
	max-height:100%;
}
.edu-index-class-middle{
	border:solid 1px #ddd;
	box-sizing:border-box;
	min-height:248px;
}

/*输入课程 s*/
.edu-index-class-input{
	padding-top: 1px;
}
.edu-index-class-input li input{
	padding:0 14px;
	width:100%;
	box-sizing:border-box;
	line-height:38.5px;
	height:38.5px;
	color:#888;
	border:solid 1px #ddd;
	z-index:1;
	position:relative;
}
.edu-index-class-input li input:focus{
	z-index:2;
}
.edu-index-class-input li:last-of-type input{
	margin-top:-1px;
}
.edu-index-class-input li input:focus{
	border-color:#006eff;
    outline:0;
}
.edu-index-class-input input::-moz-placeholder{color:#bbb;}
.edu-index-class-input input::-webkit-input-placeholder{color:#bbb;}
.edu-index-class-input input:-ms-input-placeholder{color:#bbb;}
/*输入课程 e*/

/*创建课堂 s*/
.edu-index-class-prompt{
	width:100%;
	min-height:248px;
	display:table;
}
.edu-index-class-prompt p{
	vertical-align:middle;
	display:table-cell;
	text-align:center;
	color:#999;
}
.edu-index-class-prompt p:before{
	content:'';
	display:block;
	margin:0 auto 9px auto;
	width:36px;
	height:38px;
}
/*创建课堂 s*/

/*课堂列表 s*/
.edu-index-class-list{
	max-height:248px;
	overflow-x: auto;
}

.edu-index-class-list::-webkit-scrollbar{  
    width:12px;
}
.edu-index-class-list::-webkit-scrollbar-thumb{  
    border-radius:10px;   
    background-color:#dbdbdb;  
    border:solid 2px transparent;
    background-clip:content-box;
}

.edu-index-class-list li{
	line-height:42px;
	padding:0 14px;
	text-align:right;
	border-bottom:solid 1px #ddd;
}
.edu-index-class-list li:last-of-type{
	border-bottom:none;
}
.edu-index-class-list li span{
	float:left;
}
.edu-index-class-list li:hover{
	background-color:#f2f2f2;
}
/*课堂列表 e*/

.edu-index-button{
	padding-top:34px;
}

/*设备检测 s*/
.edu-index-video-preview{
	max-width:100%;
	width:100%;
	border-bottom:solid 1px #ddd;
	padding-bottom:16px;
}
.edu-index-video-preview img{
	max-width:100%;
	width:100%;
	font-size:0;
}
.ui_progress .edu-index-sound-box{
	height:30px;
}
.ui_progress .edu-index-sound-box .progress_bar{
	padding-top: 12px;
}
.ui_progress .progress_area .progress_bar .edu-index-sound{
	height:2px;
	border-radius:5px;
}
.ui_progress .progress_area .progress_bar .edu-index-sound .progress_in{
	height:0.5px;
	border-top-left-radius:5px;
	border-bottom-left-radius:5px;
}
.ui_progress .progress_area .progress_bar .edu-index-sound .btn_drag{
	width:24px;
	height:24px;
	border:none;
	top:-16px;
	background-color:transparent;
}	
.ui_progress .progress_area .progress_bar .edu-index-sound .btn_drag:before{
	width:24px;
	height:24px;
}
.ui_progress .progress_area .progress_bar .edu-index-sound .btn_drag:hover{
	background-color:transparent;
}
.ui_progress .edu-index-sound-box .input_area{
	line-height:29px;
	padding-left:3px;
}
.edu-index-sound-detection{
	position:relative;
}
.edu-index-sound-gray span,.edu-index-sound-green span{
	width:6px;
	height:10px;
	display:inline-block;
	background-color:#d1d2d3;
	margin-right:3px;
	font-size:0px;
}
.edu-index-sound-green{
	position:absolute;
	height:100%;
	left:0px;
	top:0px;
	overflow:hidden;
	word-wrap:break-word;
}
.edu-index-sound-green span{
	background-color:#00cc00;
}
/*设备检测 e*/


.edu-copy-prompt{
	position:absolute;
	background-color:rgba(171, 171, 171, 0.5);
	height:30px;
	line-height:30px;
	padding:0 20px;
	top: 50%;
    left: 50%;
    color:#fff;
	-webkit-transform: translate(-50%,-50%);
    transform: translate(-50%,-50%);
} 

input[type=file], /* FF, IE7+, chrome (except button) */
input[type=file]::-webkit-file-upload-button { /* chromes and blink button */
    cursor: pointer;
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
.tc-15-btn:active {
    border-color: #0058cc;
    background: #0058cc;
}
.tc-15-btn:focus{
    border-color: #006eff;
    background: #006eff;
}


.tc-15-btn.m {
    height: 30px;
    line-height: 28px;
}

.tc-15-btn.xl {
    height: 43px;
    min-width: 68px;
    padding: 0 25px;
    line-height: 43px;
}

.tc-15-btn.pay {
    border-color: #ff9700;
    background-color: #ff9700;
}

.tc-15-btn.pay:hover,
.tc-15-btn.pay:focus {
    background: #f28f00;
    border-color: #f28f00;
}
.tc-15-btn.pay:active {
    background: #e0880b;
    border-color: #e0880b;
}

.tc-15-btn.weak {
    background: #fff;
    border-color: #ddd;
    color: #000;
}

.tc-15-btn.weak:hover,
.tc-15-btn.weak:focus {
    border-color: #ddd;
    color: #000;
    background-color: #f2f2f2;
}
.tc-15-btn.weak:active {
    background: #f2f2f2;
    border-color: #ddd;
    color: #000;
}

.tc-15-btn.disabled,
.tc-15-btn.pay.disabled,
.tc-15-btn.weak.disabled {
    border-color: #ddd;
    background: #f2f2f2;
    color: #bbb;
    cursor: not-allowed;
}

/* å›¾æ ‡æ–‡å­—æŒ‰é’® */
.tc-15-btn.btn-only-icon,
.tc-15-btn.setting,
.tc-15-btn.download,
.tc-15-btn.search,
.tc-15-btn.refresh,
.tc-15-btn.m.btn-only-icon,
.tc-15-btn.m.setting,
.tc-15-btn.m.download,
.tc-15-btn.m.search,
.tc-15-btn.m.refresh
{
	font-size:0;
	border: none;
	padding: 5px;
	height: inherit;
	line-height: inherit;
	background-color: transparent;
	box-sizing: border-box;
}
.tc-15-btn.search{
    border:1px solid #ddd;
    background-color: #fff;
    width: inherit;
}




.tc-15-btn.btn-only-icon:before,
.tc-15-btn.setting:before,
.tc-15-btn.download:before,
.tc-15-btn.search:before,
.tc-15-btn.refresh:before{
	content:'';
	display:inline-block;
	width:16px;
	height:16px;
	vertical-align:middle;
}
.tc-15-btn.setting:before{
	background-position: inherit;
}
.tc-15-btn.download:before{
	background-position: inherit;
}
.tc-15-btn.search:before{
	background-position: inherit;
}
.tc-15-btn.refresh:before{
    background-position: inherit;
}

.tc-15-btn.setting:hover,
.tc-15-btn.download:hover,
.tc-15-btn.search:hover,
.tc-15-btn.refresh:hover
{
    background-color: rgba(0, 0, 0, 0.05);
}
.tc-15-action-panel .tc-15-btn{
    float: left;
    margin-right: 5px;
}
.tc-15-action-panel .tc-15-btn.setting,
.tc-15-action-panel .tc-15-btn.download{
	float: right;
	margin: 2px 0 0 5px;
}
.tc-15-search .tc-15-btn.search{
	position: absolute;
	border-top-left-radius:0;
	border-bottom-left-radius:0;
	width: 28px !important;
	right: 1px;
	border: none;
	height: 28px;
	top: 1px;
	z-index: 99;
}
.tc-15-search .tc-15-btn.search:hover,
.tc-15-search .tc-15-btn.search:focus {
    z-index: 999999;
}

/* ç­›é€‰æŒ‰é’® */
.tc-15-btn.for-select {
    clear: right;
}
.tc-15-btn.for-select:after{
	content:'';
	display:inline-block;
	width: 16px;
	height: 16px;
	margin-left:5px;
	vertical-align: -3px;
	background-position: inherit;
}
.tc-15-btn.for-select.show:after {
	background-position: inherit;
}

.tc-15-btn.for-select.show {
    position: relative;
    border-bottom-color: #fcfcfc;
    padding-bottom: 6px;
    border-radius: 0;
    z-index: 1;
    height: 36px;
}

.tc-15-btn.for-select.show:hover,
.tc-15-btn.for-select.show:focus {
    background-position: inherit;
    border: 1px solid #d1d2d3;
    border-bottom-color: #fcfcfc;
}


/* åŠ å·æŒ‰é’® */
.tc-15-btn.btn-add {
    margin-right: 10px;
}

.tc-15-btn .icon-add {
    vertical-align: -3px;
    margin-right: 5px;
    display: none;
}

.tc-15-btn.disabled .icon-add {
}

/*å›¾æ ‡æŒ‰é’®*/
.tc-icon-btn,
.tc-link-btn{
    display: inline-block;
    text-align: center;
    padding: 5px;
    vertical-align: middle;
    text-decoration: none;
    line-height: initial;
}
.tc-link-btn{
    font-size: 12px !important;
}
.tc-15-tab .tc-link-btn{
    position: relative !important;
}
.tc-link-btn.black{
    color: #444;
}
.tc-icon-btn:hover,
.tc-link-btn:hover{
    background-color: rgba(0, 0, 0, 0.05);
    text-decoration: none;
    font-size: 12px;
}
.tc-icon-btn{
    width: 26px;
    height: 26px;
    line-height: 1;
    box-sizing: border-box;
    font-size: 0;
}
.tc-icon-btn:hover{
    font-size: 0;

}

.tc-external-link-btn{
    font-size: 12px;
}
.tc-external-link-btn:after{
    width: 16px;
    height: 16px;
    content: '';
    display: inline-block;
    vertical-align: -4px;
}
.tc-external-link-btn.black{
    color: #444;
}
.tc-external-link-btn.black:hover{
    color: #006eff;
}
.tc-external-link-btn.black:after{
    color: #444;
}
.tc-external-link-btn.black:hover:after{
}



</style>