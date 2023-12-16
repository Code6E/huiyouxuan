// 登录与注册的仓库
import {reqCode,reqRegister,reqLogin,getUserInfo,reqLogout} from '@/api/index.js'
const state={
    code:'',
    token:localStorage.getItem('TOKEN'),
    userInfo:{}
}
const getters={

}
const actions={
    // 获取验证码
    async getVerifyCode({commit},phone){
        let result= await reqCode(phone)
        // console.log(result);
        // 实际工作中，验证码是以短信的形式发到用户手机上（这个过程由后端处理），然后用户手动填写验证码。所以，当前函数以下代码实际中是不存在的。
        if(result.code==200){
            commit('GETVERIFYCODE',result.data)
            return '验证码请求成功！'
        }else{
            Promise.reject(new Error('验证码请求失败！'))
        }
    },
    // 注册
    // 虽然没有用到userRegister的第一个参数，但不要忘了占位！否则写成userRegister(user)会报202参数错误的提示
    async userRegister(_,user){
        let result= await reqRegister(user)
        // console.log(result);
        // 实际工作中，验证码是以短信的形式发到用户手机上（这个过程由后端处理），然后用户手动填写验证码。所以，当前函数以下代码实际中是不存在的。
        if(result.code==200){
            return '注册成功！'
        }else{
           return Promise.reject(new Error(result.message+'注册失败！'))
        }
    },
    async userLogin({commit},user){
        let result= await reqLogin(user)
        // console.log(result);
        if(result.code==200){
            commit('USERLOGIN',result.data)
            // 将token存储到本地，方便读取用户信息
            localStorage.setItem('TOKEN',result.data.token)
            return '登录成功！'
        }else{
           return Promise.reject(new Error(result.message+'登录失败！'))
        }
    },
    async userInfo({commit}){
        let result= await getUserInfo()
        console.log(result);
        if(result.code==200){
            commit('USERINFO',result.data)
            return '用户数据请求成功！'
        }else{
           return Promise.reject(new Error(result.message+'，'+'用户数据请求失败！'))
        }
    },
    async logout({commit}){
        let result= await reqLogout()
        console.log(result);
        if(result.code==200){
            commit('LOGOUT')
            return '退出登录成功！'
        }else{
           return Promise.reject(new Error(result.message+'退出登录失败！'))
        }
    },
}
const mutations={
    GETVERIFYCODE(state,data){
        state.code=data
    },
    USERLOGIN(state,data){
        state.token=data.token
    },
    USERINFO(state,data){
        state.userInfo=data
    },
    LOGOUT(state){
        // 退出登录要清除vuex中的用户数据及本地的TOKEN
        state.token='';
        state.userInfo={}
        localStorage.removeItem('TOKEN')
    }
}
export default {
    state,
    getters,
    actions,
    mutations
}