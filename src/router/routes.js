// routes配置单独存在一个文件中，同时配置项中用到的路由组件也要引入

export default [
    // 个人中心页面
    {
        path: '/center',
        name: 'center',
        // component:'Center'是传统的引入方法，如果所有路由都用这种方法，项目一启动就会加载所有的路由组件，即使很多路由实际没展示在页面上，所以这种方法比较消耗性能。为了优化性能，就用以下这种函数调用的形式引入组件，这种只有在用户要前往相应的路由时才会调用函数，函数返回值是import该路由代码的语句，就实现了按需加载的效果，这种方法叫路由懒加载。
        component: ()=>import('@/pages/Center'),
        meta: { show: true },
        // 注意子路由路径前不能加斜线'/'，因为最前面的斜线表示根路径，最前面加上斜线路径就错了
        children: [
            {
                path: 'myorder',
                component: ()=>import('@/pages/Center/MyOrder')
            },
            {
                path: 'grouporder',
                component: ()=>import('@/pages/Center/GroupOrder')
            },
            // 这里加上重定向，是为了让路由跳转到/center时初始默认显示/center/myorder中的内容，避免初始右侧内容空白的情况
            {
                path: '/center',
                redirect: '/center/myorder'
            }
        ]
    },
    // 支付成功页面
    {
        path: '/paysuccess',
        name: 'paysuccess',
        component: ()=>import('@/pages/PaySuccess'),
        meta: { show: true }
    },
    // 支付组件
    {
        path: '/pay',
        name: 'pay',
        component: ()=>import('@/pages/Pay'),
        meta: { show: true },
        // 路由独享守卫
        beforeEnter: (to, from, next) => {
            if (from.path === '/trade' || from.path === '/') {
                next()
            } else {
                next(false)
            }
        }
    },
    // 交易组件
    {
        path: '/trade',
        name: 'trade',
        component: ()=>import('@/pages/Trade'),
        meta: { show: true },
        // 路由独享守卫
        beforeEnter: (to, from, next) => {
            // bug：自己刷新时不会保持在当前页面
            // console.log(from);// 处于trade页面刷新时打印的对象{name: null, meta: {…}, path: '/', hash: '', query: {}}
            if (from.path === '/shopcart' || from.path === '/') {
                next()
            } else {
                next(false)
            }
        }
    },
    // 购物车组件
    {
        path: '/shopcart',
        name: 'shopcart',
        component: ()=>import('@/pages/ShopCart'),
        meta: { show: true }
    },
    // 添加购物车成功组件
    {
        path: '/addcartsuccess',
        name: 'addcartsuccess',
        component: ()=>import('@/pages/AddCartSuccess'),
        meta: { show: true }
    },
    // 商品详情组件
    {
        path: '/detail/:id',
        name: 'detail',
        component: ()=>import('@/pages/Detail'),
        meta: { show: true }
    }
    ,
    {
        path: '/home',
        name: 'home',
        component: ()=>import('@/pages/Home'),
        meta: { show: true }
    },
    {
        path: '/login',
        name: 'login',
        component: ()=>import('@/pages/Login'),
        meta: { show: false }

    },
    {
        path: '/Register',
        name: 'register',
        component: ()=>import('@/pages/Register'),
        meta: { show: false }

    },
    {
        path: '/search/:keyword?',
        name: 'search',
        component: ()=>import('@/pages/Search'),
        // 自定义的show属性用来标记是否展示Footer组件
        meta: { show: true },
        props: true,
        // query:{
        //     categoryName:'',
        //     category1Id:-1,
        //     category2Id:-1,
        //     category3Id:-1,
        // }
    },
    // 重定向，默认定位到'/home'路径。当使用通配符路由时，请确保路由的顺序是正确的，也就是说含有通配符的路由应该放在最后。因为匹配有优先级，同一个路径可以匹配多个路由时，就按照路由的定义顺序：路由定义得越早，优先级就越高。路由 { path: '*' } 通常用于客户端 404 错误。
    {
        path: '*',// path:'*'
        redirect: '/home'
    }
]