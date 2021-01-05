<template>
	<div class="edu-index-body">
		<div class="edu-index-pop-ups" style="margin: 0 auto;">
			<div class="edu-index-logo" style="display: flex;justify-content: center;">
				<img src="../../../assets/live/webrtc-logo-min.png" alt="" />
			</div>
			<!-- 输入直播课堂 s -->
			<div class="edu-index-class-input">
				<ul>
					<li><input type="text" placeholder="请输入课堂名称" v-model="courseName" /></li>
					<li><input type="text" placeholder="请输入你的昵称" v-model="nickName" /></li>
				</ul>
			</div>
			<!-- 输入直播课堂 e -->

			<!-- 按钮 s -->
			<div class="edu-index-button">
				<!-- 加入教室的按钮 s -->
				<div class="tc-15-rich-dialog-ft">
					<div class="tc-15-rich-dialog-ft-btn-wrap">
						<button v-on:click="onClickCreate" class="tc-15-btn">创建</button>
						<button v-on:click="onClickCancel" class="tc-15-btn weak">取消</button>
					</div>
				</div>
				<!-- 加入教室的按钮 e -->
			</div>
			<!-- 按钮 e -->
		</div>
	</div>
</template>

<script>
	export default {
		name: 'CreateCourse',
		data() {
			return {
				userID: '',
				courseName: null,
				nickName: null,
			};
		},
		mounted: function() {
			var query = this.$route.query;
			this.userID = query.userID;
		},
		methods: {
			onClickCreate: function() {
				var self = this;
				console.log('create course: ', self.courseName, ' by ', self.nickName)
				if(!self.courseName || !self.nickName) {
					alert('课程名字和昵称不能为空!')
					return;
				} else if(self.courseName.length > 15) {
					alert('课程名字太长');
					self.courseName = null;
					return;
				} else {
					console.log(self.nickName + "创建课程:" + self.courseName);
					var name = this.nickName;
					var course = this.courseName;
					this.courseName = null;
					this.$router.push({
						path: 'main-live',
						query: {
							cmd: 'create',
							creator: name,
							courseName: course,
							userID: this.userID
						}
					})
				}
			},
			onClickCancel: function() {
				this.$router.go(-1);
//				this.$router.push({
//					path: '/list'
//				});
			}
		},
		created: function() {
			console.log('创建课程 created: query=', JSON.stringify(this.$route.query))
			this.nickName = this.$route.query.name
		}
	}
</script>

<style scoped="scoped">

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

.tc-15-btn{
    border-radius: 0;
}

.tc-15-table-fixed-head{
    border-top: none;
}
.tc-15-page .tc-15-page-select{
    height: auto;
    line-height: inherit;
    padding: 0;
}
.tc-15-page .indent{
    line-height: 1;
    height: inherit;
    border: none;
}
.tc-15-page .ico-arrow{
    border:none;
}


/*锟斤拷锟斤拷锟斤拷*/
.manage-area{
    background-color: #f2f2f2;
}

.manage-area .manage-area-title{
    color: #000;
}
.manage-area-title h2{
    font-size: 16px;
    font-weight: bold;
}
.manage-area-title .tc-external-link-btn{
    float:right;
    margin-top:7px;
}
/*.manage-area-main{*/
    /*padding: 0 20px;*/
/*}*/

/*锟斤拷页*/
.tc-15-page .tc-15-page-first,
.tc-15-page .tc-15-page-last,
.tc-15-page .tc-15-page-next,
.tc-15-page .tc-15-page-num,
.tc-15-page .tc-15-page-pre
{
    background-image: none;
}
.tc-15-page .tc-15-page-first.disable,
.tc-15-page .tc-15-page-first.disable:focus,
.tc-15-page .tc-15-page-first.disable:hover{
    /* border:none; */
    background-position: inherit;
}
.tc-15-page .tc-15-page-next:focus,
.tc-15-page .tc-15-page-next:hover{
    border-color: #ddd;
    background-position: inherit;
}
.tc-15-page .tc-15-page-last:focus,
.tc-15-page .tc-15-page-last:hover{
    border-color: #ddd;
    background-position: inherit;
}
.tc-15-page .tc-15-page-selected .ico-arrow{
    border:none;
}
.tc-15-page .tc-15-page-selected .tc-15-simulate-option{
    border-bottom: 1px solid #ddd;
}
.tc-15-page .tc-15-page-selected .indent{
    border:none;
    line-height: 17px;
}


/*锟斤拷锟斤拷*/
.tc-15-btn.m{
    /* padding: 0 20px; */
    /* height: 30px; */
    /* line-height: 30px; */
}
.tc-15-checkbox{
    background-image: none;
}
.tc-15-checkbox:focus,
.tc-15-checkbox:hover
{
    background-image: none;
    background-position: inherit;
}
/*.tc-15-checkbox[disabled]:focus,*/
/*.tc-15-checkbox[disabled]:hover{*/
    /*background-image: url(img/slice/svg/checkbox.svg);*/
    /*background-position: inherit;*/
/*}*/

.tc-15-input-textarea{
    border-radius: 0;
    border-color: #ddd;
}
/*.tc-15-checkbox:checked,*/
/*.tc-15-checkbox:checked:hover{*/
    /*background-position:inherit;*/
/*}*/


/*锟斤拷锟斤拷锟斤拷*/
.tc-15-search-words:hover{
    z-index:0;
}
.tc-15-btn.download:hover,
.tc-15-btn.refresh:hover,
.tc-15-btn.search:hover,
.tc-15-btn.setting:hover{
    background-color: rgba(0,0,0,.05);
    outline: none;
    /* margin: inherit; */
    border: none;
    margin-right: 0px;
}

/*锟斤拷锟斤拷锟斤拷锟酵凤拷锟�??*/
/*.manage-area-title.secondary-title{*/
    /*height: 60px;*/
    /*line-height: 60px;*/
    /*border-bottom: none;*/
/*}*/
.secondary-title .back-link{
    font-size: 0;
    height: 26px;
    line-height: 26px;
    width: 26px;
    box-sizing: border-box;
    display: inline-block;
    text-align: center;
    margin-left: -6px;
    margin-right: 24px;
    vertical-align: middle;
    overflow: hidden;
}
.secondary-title .back-link i{
    display: none;
}
.secondary-title .back-link:before{
    content: '';
    width: 16px;
    height: 16px;
    display: inline-block;
    margin-top: 4px;
}

.secondary-title .back-link:hover{
    background-color: rgba(0, 0, 0, .05);
}
.secondary-title .line-icon{
    display: none;
}
.secondary-title .back-link .btn-back-icon{
    margin-right: 0;
    vertical-align: inherit;
}


/*通锟斤拷锟斤拷示锟斤拷*/
.tc-15-msg{
    /* margin:0; */
    margin-bottom: 20px;
    border-radius: 0;
}

/*锟斤拷锟节控硷拷*/
.tc-15-calendar-select-wrap div[role=tablist]{margin-right: 0;}

.tc-15-calendar2-hook .tc-15-simulate-select{
    border-radius: 0;
    width: inherit;
    padding-right: 36px;
    position: relative;
}

/*dialog*/
.tc-15-rich-dialog-hd{padding: 0;line-height: inherit;border: none;}
.tc-15-rich-dialog-hd .tc-15-btn-close{
    background-image:none;
}
.tc-15-rich-dialog-bd{
    border: none;
    min-height: inherit;
    padding: 0;
}
.tc-15-rich-dialog-ft{
    padding: 0;
    border:none;
    background-color: transparent;
    min-height: inherit;
}
.tc-15-rich-dialog-ft .tc-15-page-pre:focus,
.tc-15-rich-dialog-ft .tc-15-page-pre:hover{
}
/**/
.secondary-main .tc-15-step{
    margin-left: auto;
    margin-right: auto;
}



/*锟斤拷锟斤拷*/
.form-list{
    font-size: 12px;
}
.tc-15-input-text{
    border-radius: 0;
}
.tc-15-input-text-wrap.m .tc-15-input-text,
/*.tc-15-rich-dialog .tc-15-input-text,*/
.tc-15-input-text-wrap.m .tc-15-input-text,
.tc-15-input-text.m{
    height: 30px;
    line-height: normal;
    width: 180px;
}
.tc-15-radio[type=radio]:focus, .tc-15-radio[type=radio]:hover{
    /* background-image: none; */
    /* background-position: inherit; */
}
.form-ctrl-label .tc-15-radio,
.form-ctrl-label-stacked .tc-15-radio,
.tc-15-radio-wrap .tc-15-radio{
    background-image: none;
}
.tc-input-group .tc-input-group-addon{
    border-radius: 0;
    font-size: 12px;
    border-right: none;
}
/*end*/
 
</style>