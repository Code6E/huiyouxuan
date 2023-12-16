import Vue from 'vue'
import App from './App.vue'

// 将统一api文件中的请求接口函数全部引入
import * as API from '@/api/index'

// 关闭生产提示
Vue.config.productionTip = false

// 引入全局组件
import TypeNav from './components/TypeNav' // 首页的分类栏
import Carousel from './components/Carousel'
import Pagination from './components/Pagination' // 分页器
// 注册全局组件, 这样其他组件要用该组件时就不需再引入和注册了，参数：注册的名字，组件
Vue.component('TypeNav',TypeNav)
Vue.component('Carousel',Carousel)
Vue.component('Pagination',Pagination)


// 如果只是用到element-ui的某个组件，可以按需引入element-ui，而不是完整引用，这样能提升性能
import { Button,MessageBox } from 'element-ui';
// 单独引入Element UI组件
Vue.component(Button.name, Button);
// 也可以将element-ui的组件挂载到Vue原型上，而不用Vue.component()或Vue.use()方法。注意“将自定义的属性挂载到原型上”这样的语句应该放在new Vue前
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;


// 引入路由
import router from '@/router'

// 引入仓库化存储的Vuex文件
import store from '@/store/index.js'

import '@/mock/mockServe'

// 因为ListContainer和Floor组件都会用到swiper.css样式，所以就在入口文件处引入？（那import Swiper from swiper为什么不在这引入呢？）
import "swiper/swiper-bundle.min.css";

// 引入实现“图片加载出来前显示默认图片”的插件
import VueLazyload from 'vue-lazyload'
// 引入默认的图片
import loadImg from '@/assets/loading.gif'
// 引入加载失败的图片
import loadFail from '@/assets/loadFail.jpg'
// 也可以引入坤坤打篮球的动图作为加载图片
import kun from '@/assets/kunBasketball.gif'
// Vue.use这一步就相当于调用了VueLazyload.install()
Vue.use(VueLazyload, {
  // preLoad: 1.3,
  error: loadFail, // 加载失败时显示的图片
  loading: loadImg, // 加载中显示的图片
})

// import myPlugin from './plugins/myPlugin'
// 可以以如下形式给自定义插件传参
// Vue.use(myPlugin,'aa',1,2)
// 以选项对象的形式传参更常见
// Vue.use(myPlugin,{
//  name:'eee'
// })

new Vue({
  render: h => h(App),
  router,// 注册路由，用ES6语法简写了router:router
  store,
  beforeCreate(){
    // 注册全局事件总线
    Vue.prototype.$bus=this
    // 注册接口函数，API为存放所有接口函数的对象，这样注册之后组件使用接口函数就可以直接通过this.$API访问到，而不需要在组件使用该接口函数时再通过`import {xxx} from '@/api/index'`语句去单独引入，简化了书写
    Vue.prototype.$API=API
  },
  mounted(){
    console.log(this)
    
    // this.$store.dispatch("categoryList"); // 请求categoryList数据的操作也可以写到这里
  }
}).$mount('#app')
