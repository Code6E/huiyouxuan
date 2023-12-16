// 自定义插件
let myPlugin={}

// 通过Vue.use(myPlugin,options)注册插件时，会调用myPlugin.install()，第一个参数是 Vue 构造器，第二个参数是一个可选的选项对象
myPlugin.install=function(Vue,options){
    console.log(options);
    // 添加全局属性
    Vue.globalPropoty='这是一个全局属性'
    // 添加全局方法，只能通过全局变量Vue调用
    Vue.globalFn=function(){
        console.log('这是一个全局方法');
    }
    // 添加实例方法，Vue实例和组件实例都可以调用
    Vue.prototype.$myMethod=function(...args){
        console.log('调用了通过自定义组件添加的实例方法，传入的参数为：',...args);
    }
    // 添加全局指令
    Vue.directive('upper',{
        bind(element,binding){
            element.innerHTML=binding.value.toUpperCase()
        }

    })
    // 添加全局混入
    Vue.mixin({
        created() {
            console.log('这是自定义插件添加的全局混入');
        },
    })
}
export default myPlugin