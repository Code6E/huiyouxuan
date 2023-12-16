import { reqGoodsInfo,reqAddShopcart } from "@/api/index.js"
import {UUID} from "@/utils/uuid_token"
const state={
    // 接收的是什么类型的数据，就先设置成什么类型的数据
    goodsInfo:{},
    uuid_token:UUID()
}
const getters={
    categoryView(state){
        // 若网络差，还未请求到goodsInfo数据，就不会有相应的属性(此时为undefined),这样就会报错，所以“或上”对应类型的空数据来避免报错
        return state.goodsInfo.categoryView || {}
    },
    price(state){
        return state.goodsInfo.price || 0
    },
    skuInfo(state){
        return state.goodsInfo.skuInfo || {}
    },
    spuSaleAttrList(state){
        return state.goodsInfo.spuSaleAttrList || []
    },
    valuesSkuJson(state){
        return state.goodsInfo.valuesSkuJson || ''
    }
}
const actions={
    async goodsInfo(store,skuId){
        // axios返回的是一个promise对象，这里需要拿到promise的结果，所以用await运算符，使用了await就需要使用async
        const result=await reqGoodsInfo(skuId)
        if(result.code===200){
            store.commit('REQGOODSINFO',result.data)
        }
        // console.log(result);
    },
    // 因为该请求服务器返回的响应体无数据，所以不需要经历mutations中的方法修改state数据这些过程
    // 带有async标识的函数返回值是Promise对象
    async addShopcart(_,{skuId,skuNum}){
        // axios返回的是一个promise对象，这里需要拿到promise的结果，所以用await运算符，使用了await就需要使用async
        const result=await reqAddShopcart(skuId,skuNum)
        // console.log(result);
        if(result.code===200){
            return 'ok'
        }else{
            return Promise.reject(new Error('fail'))
        }
        
    },
}
const mutations={
    REQGOODSINFO(state,goodsInfo){
        state.goodsInfo=goodsInfo
    }
}
export default {
    state,
    getters,
    actions,
    mutations
}