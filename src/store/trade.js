import {reqAddressInfo,reqOrderInfo} from '@/api/index.js'
const state={
    addressList:[],
    orderInfo:{}
}
const getters={

}
const actions={
    async getUserAddress({commit}){
        let result =await reqAddressInfo();
        console.log(result);
        if(result.code==200){
            commit("GETUSERADDRESS",result.data)
            return '获取用户地址成功！'
        }else{
            return Promise.reject(new Error(result.message+'获取用户地址失败!'))
        }
    },
    async getOrderInfo({commit}){
        let result =await reqOrderInfo();
        console.log(result);
        if(result.code==200){
            commit("GETORDERINFO",result.data)
            return '获取交易数据成功！'
        }else{
            return Promise.reject(new Error(result.message+'获取交易数据失败!'))
        }
    }
}
const mutations={
    GETUSERADDRESS(state,addressArr){
        state.addressList=addressArr
    },
    GETORDERINFO(state,orderInfo){
        state.orderInfo=orderInfo
    }
}
export default {
    state,
    getters,
    actions,
    mutations
}