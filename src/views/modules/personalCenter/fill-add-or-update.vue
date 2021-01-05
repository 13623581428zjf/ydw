<template>
  <el-dialog
    :close-on-click-modal="false"
     z-index='2001'
     width='500px'
    :visible.sync="visible">
	   <div style="display:flex;">
				<div class="info-item">
					<div class='uploadBtn'>
						<label class="btn btn-orange" for="uploads">选择图片</label>
						<input type="file" id="uploads" :value="imgFile" accept="image/png, image/jpeg, image/gif, image/jpg" @change="uploadImg($event, 1)">
						<el-button type="success" class="btn-success"  @click="finish('blob')" size='small'>确定上传</el-button>
					</div>
					<div class="line">
						<div class="cropper-content">
							<div class="cropper">
								<vueCropper ref="cropper" :img="option.img" :outputSize="option.size" :outputType="option.outputType" :info="true" :full="option.full" :canMove="option.canMove" :canMoveBox="option.canMoveBox" :original="option.original" :autoCrop="option.autoCrop" :autoCropWidth="option.autoCropWidth" :autoCropHeight="option.autoCropHeight" :fixedBox="option.fixedBox" @realTime="realTime" @imgLoad="imgLoad"></vueCropper>
							</div>
							<div style="margin-left:20px;">
								<div class="show-preview">
									<div :style="previews.div" class="preview">
										<img :src="previews.url" :style="previews.img">
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
  </el-dialog>
</template>
<script>
	import VueCropper from 'vue-cropper'
  export default {
    data () {
      return {
      	visible:false,
       //剪切图片上传
				crap: false,
				previews: {},
				option: {
					img: '',
					outputSize: 1, //剪切后的图片质量（0.1-1）
					full: false, //输出原图比例截图 props名full
					outputType: 'png',
					canMove: true,
					original: false,
					canMoveBox: true,
					autoCrop: true,
					autoCropWidth: 150,
					autoCropHeight: 150,
					fixedBox: true
				},
				fileName: '', //本机文件地址
				downImg: '#',
				imgFile: '',
				uploadImgRelaPath: '' //上传后的图片的地址（不带服务器域名）
      }
    },
     components: {
      		VueCropper
   		 },
    methods: {
      init () {
        this.visible = true
     },
      //放大/缩小
			changeScale(num) {
				num = num || 1;
				this.$refs.cropper.changeScale(num);
			},
			//上传图片（点击上传按钮）
			finish(type) {
				let _this = this;
				let formData = new FormData();
				// 输出 
				if(type === 'blob') {
					this.$refs.cropper.getCropBlob((data) => {
						let img = window.URL.createObjectURL(data)
						this.model = true;
						this.modelSrc = img;
						formData.append("file", data, this.fileName);
						let url = this.$http.adornUrl(`/common/fileupload/?token=${this.$cookie.get('token')}`)
						this.$http.post(url, formData)
							.then((response) => {
								this.imageUrl = response.data.url
								this.visible = false
								this.$emit('refreshDataList',this.imageUrl)
							})
					})
				} else {
					this.$refs.cropper.getCropData((data) => {
						this.model = true;
						this.modelSrc = data;
					})
				}
			},
			// 实时预览函数 
			realTime(data) {
				this.previews = data
			},
			//选择本地图片
			uploadImg(e, num) {
				var _this = this;
				//上传图片 
				var file = e.target.files[0]
				console.log(file)
				_this.fileName = file.name;
				if(!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
					this.$message.error('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种');
					return false
				}
				if(file.size/1024/1024>4){
					this.$message.error('上传图片大小不能超过 4MB!！');
					return false
				}
				var reader = new FileReader();
				reader.onload = (e) => {
					let data;
					if(typeof e.target.result === 'object') {
						// 把Array Buffer转化为blob 如果是base64不需要 
						data = window.URL.createObjectURL(new Blob([e.target.result]))
					} else {
						data = e.target.result
					}
					if(num === 1) {
						_this.option.img = data
					} else if(num === 2) {
						_this.example2.img = data
					}
				}
				reader.readAsArrayBuffer(file);
			},
			imgLoad(msg) {}
    }
  }
</script>
<style>
	.info {
		width: 720px;
		margin: 0 auto;
		.oper-dv {
			height: 20px;
			text-align: right;
			margin-right: 100px;
			a {
				font-weight: 500;
				&:last-child {
					margin-left: 30px;
				}
			}
		}
		.info-item {
			margin-top: 15px;
			label {
				display: inline-block;
				width: 100px;
				text-align: right;
			}
			.sel-img-dv {
				position: relative;
				.sel-file {
					position: absolute;
					width: 90px;
					height: 30px;
					opacity: 0;
					cursor: pointer;
					z-index: 2;
				}
				.sel-btn {
					position: absolute;
					cursor: pointer;
					z-index: 1;
				}
			}
		}
	}
	
	.cropper-content {
		display: flex;
		display: -webkit-flex;
		justify-content: flex-end;
		-webkit-justify-content: flex-end;
		.cropper {
			width: 260px;
			height: 260px;
		}
		.show-preview {
			flex: 1;
			-webkit-flex: 1;
			display: flex;
			display: -webkit-flex;
			justify-content: center;
			-webkit-justify-content: center;
			.preview {
				overflow: hidden;
				border-radius: 50%;
				border: 1px solid #cccccc;
				background: #cccccc;
				margin-left: 40px;
			}
		}
	}
	
	.cropper-content .show-preview .preview {
		margin-left: 0;
	}
	
	.cropper {
		width: 260px;
		height: 260px;
	}
	
	.oper {
		font-size: 20px;
		margin: 3px 5px;
	}
	
	.info-item {
		flex: 1;
		margin-top: 30px;
	}

	.btn-orange {
		display: inline-block;
		width: 85px;
		height: 33px;
		line-height: 33px !important;
		padding: 0;
		text-align: center;
		line-height: 28px;
		border: 1px solid #ccc;
		border-radius: 5px;
		background-color: orangered;
		color: #fff;
		cursor: pointer;
	}
	
	#uploads {
		position: absolute;
		clip: rect(0 0 0 0);
	}
	
	.showPic {
		width: 120px;
		height: 120px;
		border-radius: 50%;
		overflow: hidden;
		margin-left: 123px;
		border: 1px solid #ddd
	}
	
	.show_img {
		width: 120px;
		height: 120px;
	}
	
	.show-preview {
		width: 150px;
		height: 150px;
		overflow: hidden;
		margin: 5px;
		border-radius: 50%;
	}
	.uploadBtn{margin: 0px 0 20px 20px;}
</style>
