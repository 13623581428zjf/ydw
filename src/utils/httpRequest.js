import Vue from 'vue'
import axios from 'axios'
import router from '@/router'
import qs from 'qs'
import merge from 'lodash/merge'
import { Message, Loading } from 'element-ui'
//let loading; //定义loading变量
//
//function startLoading() { //使用Element loading-start 方法
//	loading = Loading.service({
//		lock: true,
//		text: '加载中……',
//		background: 'rgba(0, 0, 0, 0.7)'
//	})
//}
//
//function endLoading() { //使用Element loading-close 方法
//	loading.close()
//}

const http = axios.create({
	timeout: 1000 * 30,
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json; charset=utf-8'
	}
})
let base = process.env.NODE_ENV !== 'production' && process.env.OPEN_PROXY ? '/proxyApi/' : window.SITE_CONFIG.baseUrl;
/**
 * 请求拦截
 */
http.interceptors.request.use(config => {
	config.headers['token'] = Vue.cookie.get('token') // 请求头带上token
//	startLoading();
	return config;
}, error => {
//	endLoading();
	return Promise.reject(error)
	Message.error({
		message: '请求超时'
	})
})

/**
 * 响应拦截
 */
http.interceptors.response.use(response => {
	if(response.data && response.data.code === 401) {
		// 401, token失效
		Vue.cookie.delete('token')
		router.options.isAddDynamicMenuRoutes = false
		router.push({
			name: 'login'
		})
	} else if(response.data && response.data.code === 403) {
		// 没有权限
		if(response.data.msg !== null) {
			Message.error({
				message: response.data.msg
			})
		} else {
			Message.error({
				message: '未知错误'
			})
		}
	} else if(response.data && response.data.code === 500) {
		// 错误
		if(response.data.msg !== null) {
			Message.error({
				message: response.data.msg
			})
		} else {
			Message.error({
				message: '未知错误'
			})
		}
	}
//	endLoading();
	return response
}, error => {
//	endLoading();
	Message.error({
		message: '请求失败'
	})
	return Promise.reject(error)
})

/**
 * 请求地址处理
 * @param {*} actionName action方法名称
 */
http.adornUrl = (actionName) => {
	// 非生产环境 && 开启代理, 接口前缀统一使用[/proxyApi/]前缀做代理拦截!
	return(process.env.NODE_ENV !== 'production' && process.env.OPEN_PROXY ? '/proxyApi/' : window.SITE_CONFIG.baseUrl) + actionName
}

/**
 * get请求参数处理
 * @param {*} params 参数对象
 * @param {*} openDefultParams 是否开启默认参数?
 */
http.adornParams = (params = {}, openDefultParams = true) => {
	var defaults = {
		't': new Date().getTime()
	}
	return openDefultParams ? merge(defaults, params) : params
}

/**
 * post请求数据处理
 * @param {*} data 数据对象
 * @param {*} openDefultdata 是否开启默认数据?
 * @param {*} contentType 数据格式
 *  json: 'application/json; charset=utf-8'
 *  form: 'application/x-www-form-urlencoded; charset=utf-8'
 */
http.adornData = (data = {}, openDefultdata = true, contentType = 'json') => {
	var defaults = {
		't': new Date().getTime()
	}
	data = openDefultdata ? merge(defaults, data) : data
	return contentType === 'json' ? JSON.stringify(data) : qs.stringify(data)
}
/**
 * get请求
 * @param {*} url 请求地址
 * @param {*} params 请求参数
 */
http.getRequest = (url, params) => {
	return http({
		method: 'get',
		url: `${base}${url}`,
		params: params,
		headers: {}
	});
};
/**
 * post请求
 * @param {*} url 请求地址
 * @param {*} params 请求参数
 */
http.postRequest = (url, params) => {
	return http({
		method: 'post',
		url: `${base}${url}`,
		data: params,
		headers: {
			'Content-Type': 'application/json;charset=UTF-8',
		}
	});
};
/**
 * put请求
 * @param {*} url 请求地址
 * @param {*} params 请求参数
 */
http.putRequest = (url, params) => {
	return http({
		method: 'put',
		url: `${base}${url}`,
		data: params,
		transformRequest: [function(data) {
			let ret = '';
			for(let it in data) {
				ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
			}
			return ret;
		}],
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		}
	});
};
/**
 * delete请求
 * @param {*} url 请求地址
 * @param {*} params 请求参数
 */
http.deleteRequest = (url, params) => {
	return http({
		method: 'delete',
		url: `${base}${url}`,
		params: params,
		headers: {}
	});
};
/**
 * upload请求
 * @param {*} url 请求地址
 * @param {*} params 请求参数
 */
http.uploadFileRequest = (url, params) => {
	return http({
		method: 'post',
		url: `${base}${url}`,
		params: params,
		headers: {}
	});
};
export default http