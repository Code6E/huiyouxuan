import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
import routes from './routes'
import store from '@/store'

// 用变量暂存原始的VueRouter原型对象中的push和replace方法
const oraginPush = VueRouter.prototype.push
const oraginReplace = VueRouter.prototype.replace
// 对VueRouter原型对象中的push和replace方法进行二次封装
// 使用了ES6中默认参数的语法
VueRouter.prototype.push = function (location, resolve = () => { }, reject = () => { }) {
    // 注意要指定this(VueRouter实例对象)，否则this就变成了window
    oraginPush.call(this, location, resolve, reject)
}
VueRouter.prototype.replace = function (location, resolve = () => { }, reject = () => { }) {
    oraginReplace.call(this, location, resolve, reject)
}
const router = new VueRouter({
    routes,
    // 设置路由切换时，滚动到页面顶部
    scrollBehavior() {
        // return 期望滚动到哪个的位置, 这里是滚动到顶部
        return { y: 0 }
    }
})
export default router
router.beforeEach(async (to, from, next) => {
    let token=localStorage.getItem('TOKEN')
    // console.log(this) // undefined
    // let name=this.$store.state.userInfo.name // 注意不能通过this访问store，因为这里this是undefined，拿不到store的信息，而需要通过import引入store对象
    let name=store.state.user.userInfo.name // 不能直接根据userInfo是否为真来判断用户信息是否为空，因为空对象（和空数组）永远为真，应该判断该对象的属性值是否为真/存在
    // console.log(from);
    // console.log(to);
    // console.log(router);
    if(token){
        if(!name){ // 解决有token时刷新页面用户信息丢失的问题
            try{
                await store.dispatch('userInfo')
                next()
            }catch(err){ // token过期的情况
                alert('token已过期，请重新登录')
                await store.dispatch('logout')
                next('/login')
                console.log(err.message)
            }
        }
        // 已登录且用户信息存在的情况
        else{
            next()
        }
    }
    // “未登录状态不能去购物车”这个逻辑是自己加的，原教程支持游客状态有自己的购物车，以下表示游客状态的逻辑
    else{
        // 以下页面只有登录时才能查看
        let pathArr=['/addcartsuccess' , '/trade' , '/pay' , '/paysuccess' , '/center' , '/center/myorder' , '/center/grouporder','/shopcart']
        if(pathArr.includes(to.path)){
            alert('亲，该页面需要登录后才可以查看哟~')
            next(`/login?redirect=${to.path}`)
        }else{// 如果游客去除购物车外的其他路径
            next()
        }
    }
    
})