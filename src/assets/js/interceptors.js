import Vue from 'vue';
import axios from 'axios';

//$ajax
Vue.prototype.$axios = axios;

//http请求拦截器
Vue.prototype.$axios.interceptors.request.use(config => {
    
    //登录页面接口不需要token
    if(!window.location.href.includes('login')){
        config.headers = {
            Authorization: localStorage.getItem('token'),
        }
    }
    
    return config;
})

//http响应拦截器
Vue.prototype.$axios.interceptors.response.use(res => {

    //更新token
    if (res.headers.authorization) localStorage.setItem('token', res.headers.authorization);

    //登录过期
    if(res.data.code == '9997'){
        Vue.prototype.$message({
            type:'error',
            message:res.data.msg,
            onClose:() => {
                //开发环境
                if(process.env.NODE_ENV == 'development'){
                    window.location.href = `${window.location.origin}/#/login`
                }else{
                    //生产环境
                    window.location.href = `${window.location.origin}/boss/#/login`
                }
            }
        })
    }else if(res.data.code == '9996'){
        Vue.prototype.$message.error(res.data.msg)
    }

    return res;
},error => {
    let res = error.response

    console.log(res);    
    Vue.prototype.$message.error(res.data.message)
    return Promise.reject(res);
})