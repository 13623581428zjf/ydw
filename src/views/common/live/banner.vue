<template>
	<div class="edu-header clearfix">
		<h1>                                                                                         
	    <a href="javascript:return false;" onclick="return false;" title="WebRTC互通">                                                         
	      <!--<img src="../../../assets/live/webrtc-logo-min.png" style="width:154px; height:26px" alt="WebRTC互通">-->
	    </a> 
	  </h1>
		<div class="edu-class-title">{{courseName}}（ID:{{courseId}})</div>
		<div class="edu-header-login">
			<a href="javascript:return false;" onclick="return false;">{{teacher}}</a>
			<a v-on:click="logout">退出</a>
			<!--<a href="https://support.qq.com/products/31450" target="_blank">问题反馈</a>-->
		</div>
	</div>
</template>

<script>
	export default {
		name: 'Banner',
		props: {
			teacher: String,
			courseName: String,
			courseId: String
		},
		methods: {
			logout: function() {
				this.$emit('logout')
			},
		}
	}
</script>

<style>

.edu-header{
	height:50px;
	line-height: 50px;
	background-color:#262626;
	color:#fff;
	text-align:center;
}
.edu-header h1{
	display:inline-block;
	float:left;
	padding-left:20px;
}
.edu-header h1 img{
	font-size:0px;vertical-align:-6px;
}
.edu-class-title{
	display:inline-block;
}
.edu-header-login{
	display:inline-block;
	float:right;
	padding-right:20px;
}
.edu-header-login a{
	margin-left:10px;
	color:#fff;
}
.edu-header{
	height:50px;
	line-height: 50px;
	background-color:#262626;
	color:#fff;
	text-align:center;
}
.edu-header h1{
	display:inline-block;
	float:left;
	padding-left:20px;
}
.edu-header h1 img{
	font-size:0px;vertical-align:-6px;
}
.edu-class-title{
	display:inline-block;
}
.edu-header-login{
	display:inline-block;
	float:right;
	padding-right:20px;
}
.edu-header-login a{
	margin-left:10px;
	color:#fff;
}
</style>