// 该文件对axios进行了二次封装，并设置了请求拦截器和相应拦截器

import axios from 'axios'
import store from '@/store/index';
const requests =axios.create({
    baseURL:'/api',
    timeout:5000
})
// 引入进度条
import nprogress from 'nprogress';
import 'nprogress/nprogress.css'
// 请求拦截器
// 要将用户唯一的标识添加到请求头中
requests.interceptors.request.use((config)=>{
    nprogress.start()// 进度条开始
    // 将用户标识存储在请求头中，userTempId是和后端商量好的固定名称
    if(store.state.detail.uuid_token){
        config.headers.userTempId=store.state.detail.uuid_token
    }
    // 将用户的token放到请求头的配置中
    if(localStorage.getItem('TOKEN')){
        // config.headers.token=store.state.user.token这样写一刷新token就没了，因为存在vuex中的数据是临时存储
        // store.state.user.token和localStorage.getItem('TOKEN')几乎是同时写入值的（我写的代码是这样设置的），只要登录成功就会有非空值，所以store.state.user.token非空时localStorage.getItem('TOKEN')也是非空的
        // 刷新页面，store.state.user.token即vuex中的state数据清空, 但localStorage中的数据还存储在本地
        config.headers.token=localStorage.getItem('TOKEN')
    }
    return config;
});
// 响应拦截器
requests.interceptors.response.use((res)=>{
    nprogress.done()// 进度条结束
    return res.data;
},(error)=>{
    return Promise.reject(error)
})

export default requests