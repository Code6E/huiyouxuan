import { reqShopcart, reqDeleteShopcart, updateIsChecked } from '@/api/index'
const state = {
    cartList: {}
}

const getters = {
    cartList(state) {
        // 注意undefined.cartInfoList会报错
        return state.cartList.cartInfoList || []
    }
}
const actions = {
    // 获取购物车数据
    async getShopCart({ commit }) {
        const result = await reqShopcart()
        console.log(result);
        if (result.code === 200) {
            commit('GETSHOPCART', result.data)
        }
    },
    // 删除购物车的商品
    async deleteShopCart(_, skuId) {
        const result = await reqDeleteShopcart(skuId)
        // console.log(result);
        if (result.code === 200) {
            return '删除购物车商品成功！'
        } else {
            return Promise.reject(new Error('删除购物车商品失败！'))
        }
    },
    // 修改服务器商品勾选状态的数据
    async updateChecked(_, { skuId, isChecked }) {
        const result = await updateIsChecked(skuId, isChecked)
        console.log(result);
        if (result.code === 200) {
            return '修改购物车商品勾选状态成功！'
        } else {
            return Promise.reject(new Error('修改购物车商品勾选状态失败！'))
        }
    },
    // 删除所有勾选的商品
    // 由于后端没有提供删除选中商品的接口，所以只能一个个派发deleteShopCart，一个个删除
    deleteAllChecked({ getters, dispatch }) {
        let promiseAll = []
        getters.cartList.forEach(item => {
            if (item.isChecked) {
                let promise = dispatch('deleteShopCart', item.skuId)// 函数deleteShopCart返回promise类型的数据
                promiseAll.push(promise)
            }
        });
        // Promise.all接受元素为promise对象的数组，如果所有的promise都成功，则返回第一个成功的promise，有一个失败则返回失败的promise
        return Promise.all(promiseAll)
    },
    // 全选或全不选，逻辑与删除全部勾选的商品差不多，都是一个个派发action
    checkToggle({ getters, dispatch }, isChecked) {
        let promiseAll = []
        getters.cartList.forEach(item => {
            // 加个判断，与全选按钮勾选状态不一致的商品就让其与全选按钮保持一致
            if (item.isChecked != isChecked) {
                let promise = dispatch('updateChecked', { skuId: item.skuId, isChecked })// 函数updateChecked返回promise类型的数据
                promiseAll.push(promise)
            }
        });
        // Promise.all接受元素为promise对象的数组，如果所有的promise都成功，则返回第一个成功的promise，有一个失败则返回失败的promise
        return Promise.all(promiseAll)
    }
}
const mutations = {
    GETSHOPCART(state, data) {
        // 后端这里的数据没设计好，因为后端把result.data设置成了永远只有一个元素的数组，导致真实需要的数据更深了一层
        // 或上一个空对象是为了防止undefined.cartInfoList报错
        state.cartList = data[0] || {}
    }
}
export default {
    state,
    getters,
    mutations,
    actions
}