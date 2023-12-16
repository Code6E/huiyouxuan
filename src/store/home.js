import { reqCategoryList,reqBannerList,reqFloorList } from "@/api/index.js"

const state={
    // 接收的是什么类型的数据，就先设置成什么类型的数据
    categoryList:[],
    bannerList:[],
    floorList:[]
}
const getters={

}
const actions={
    async categoryList(store){
        // axios返回的是一个promise对象，这里需要拿到promise的结果，所以用await运算符，使用了await就需要使用async
        const result=await reqCategoryList()
        if(result.code===200){
            store.commit('CATEGORYLIST',result.data)
        }
        // console.log(result.data);
    },
    async bannerList(store){
        const result=await reqBannerList()
        if(result.code===200){
            store.commit("BANNERLIST",result.data)
        }
    },
    async floorList(store){
        const result=await reqFloorList()
        if(result.code===200){
            store.commit("FLOORLIST",result.data)
        }
    }
}
const mutations={
    CATEGORYLIST(state,categoryList){
        state.categoryList=categoryList
    },
    BANNERLIST(state,bannerList){
        state.bannerList=bannerList
    },
    FLOORLIST(state,floorList){
        state.floorList=floorList
    }
}
export default {
    state,
    getters,
    actions,
    mutations
}