import { reqSearchList } from "@/api/index.js"

const state={
    // 接收的是什么类型的数据，就先设置成什么类型的数据
    searchList:{},
}
const getters={
    attrsList(state){
        // 若网络差，还未请求到searchList数据，就不会有相应的attrsList，goodsList，trademarkList等属性(此时为undefined),此时`return state.searchList.attrsList`会报错，所以加上“|| []”避免报错
        return state.searchList.attrsList || []
    },
    goodsList(state){
        return state.searchList.goodsList || []
    },
    trademarkList(state){
        return state.searchList.trademarkList || []
    },
}
const actions={
    async searchList(store,params){
        // axios返回的是一个promise对象，这里需要拿到promise的结果，所以用await运算符，使用了await就需要使用async
        const result=await reqSearchList(params)
        if(result.code===200){
            store.commit('SEARCHLIST',result.data)
        }
        
        // console.log(result);
    },
}
const mutations={
    SEARCHLIST(state,searchList){
        state.searchList=searchList
    }
}
export default {
    state,
    getters,
    actions,
    mutations
}