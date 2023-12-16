// 请求假数据版本的request.js，与request.js的区别是baseURL是'mock'
import axios from 'axios'
const requests =axios.create({
    // 注意修改baseURL为'/mock'
    baseURL:'/mock',
    timeout:5000
})
// 引入进度条
import nprogress from 'nprogress';
import 'nprogress/nprogress.css'
// 请求拦截器
requests.interceptors.request.use((config)=>{
    nprogress.start()// 进度条开始
    return config;
});
// 响应拦截器
requests.interceptors.response.use((res)=>{
    nprogress.done()
    return res.data;
},(error)=>{
    return Promise.reject(error)
})

export default requests