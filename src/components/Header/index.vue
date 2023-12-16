<template>
  <header class="header">
    <!-- 头部的第一行 -->
    <div class="top">
      <div class="container">
        <div class="loginList">
          <p>尚品汇欢迎您！</p>
          <p v-if="!username">
            <span>请</span>
            <router-link to="/login">登录</router-link>
            <router-link to="/register" class="register">免费注册</router-link>
          </p>
          <p v-else>
            <!-- 业务逻辑设置的是用户登录后点击用户名不会跳转到登录页面，所以这里不用router-link标签，就用普通的a标签就可以了 -->
            <a>{{username}}</a>
            <a class="register" @click="logout">退出登录</a>
          </p>
        </div>
        <div class="typeList">
          <router-link to='/trade'>我的订单</router-link>
          <router-link to='/shopcart'>我的购物车</router-link>
          <a href="###">我的尚品汇</a>
          <a href="###">尚品汇会员</a>
          <a href="###">企业采购</a>
          <a href="###">关注尚品汇</a>
          <a href="###">合作招商</a>
          <a href="###">商家后台</a>
        </div>
      </div>
    </div>
    <!--头部第二行 搜索区域-->
    <div class="bottom">
      <h1 class="logoArea">
        <router-link class="logo" to="/home">
          <img src="./images/logo.png" alt="" />
        </router-link>
      </h1>
      <div class="searchArea">
        <form action="###" class="searchForm">
          <input
            type="text"
            id="autocomplete"
            class="input-error input-xxlarge"
            v-model="keyword"
          />
          <button
            @click="goSearch"
            class="sui-btn btn-xlarge btn-danger"
            type="button"
          >
            搜索
          </button>
        </form>
      </div>
    </div>
  </header>
</template>

<script>
// lodash封装了许多函数，按需引入lodash中的函数，减少开销
// debounce对外暴露的方式是module.exports = debounce;
// import debounce from 'lodash/debounce'
export default {
  name: "Header",
  data() {
    return {
      keyword: undefined, //这里设置undefined而不设置''的原因是避免search/''重定向到首页的情况，导致路由地址错误
    };
  },
  computed:{
    username(){
      return this.$store.state.user.userInfo.name
    }
  },
  watch: {
    // 侦听keyword是为了实现搜索框更改成非空的内容就更新search路由下params.keyword的效果
    keyword: {
      handler(newValue) {
        // 试过了，加上这个防抖没有实现搜索框更改成非空的内容就更新search路由下params.keyword的效果
        // debounce(function(){
          if (this.$route.name === "search") {
            if(newValue === ""){
              this.$route.params.keyword = undefined
            }else{
              this.$route.params.keyword = newValue;
            }
            
          }
        // },3000);
      },
    },
  },
  methods: {
    // 搜索按钮的回调函数
    goSearch() {
      let location = {
        name: "search",
        params: {
          keyword: this.keyword,
        },
      };
      if (this.$route.query) {
        location.query = this.$route.query;
      }
      this.$router.push(location);
    },
    // 退出登录
    async logout(){
      try {
        await this.$store.dispatch('logout')
        // 退出登录成功后跳转到home首页
        this.$router.push('/home')
      } catch (error) {
        alert(error.message)
      }
    }
  },
  // 实现兄弟组件Search与Header之间通信。实现×掉keyword面包屑，输入框清空的业务逻辑
  // 定义全局事件总线上的clear事件，这里回调函数作为this.$bus.$on()的参数时注意写成箭头函数的形式，以让this指向组件实例
  mounted() {
    this.$bus.$on('clear',()=>{
      this.keyword=''
    })
  },
};
</script>

// style默认是CSS样式，所以此处需要添加属性lang="less"说明是less样式
<style scoped lang="less">
.header {
  & > .top {
    background-color: #eaeaea;
    height: 30px;
    line-height: 30px;

    .container {
      width: 1200px;
      margin: 0 auto;
      overflow: hidden;

      .loginList {
        float: left;

        p {
          float: left;
          margin-right: 10px;

          .register {
            border-left: 1px solid #b3aeae;
            padding: 0 5px;
            margin-left: 5px;
          }
        }
      }

      .typeList {
        float: right;

        a {
          padding: 0 10px;

          & + a {
            border-left: 1px solid #b3aeae;
          }
        }
      }
    }
  }

  & > .bottom {
    width: 1200px;
    margin: 0 auto;
    overflow: hidden;

    .logoArea {
      float: left;

      .logo {
        img {
          width: 90px;
          margin: 25px 45px;
        }
      }
    }

    .searchArea {
      float: right;
      margin-top: 35px;

      .searchForm {
        overflow: hidden;

        input {
          box-sizing: border-box;
          width: 490px;
          height: 32px;
          padding: 0px 4px;
          border: 2px solid #ea4a36;
          float: left;

          &:focus {
            outline: none;
          }
        }

        button {
          height: 32px;
          width: 68px;
          background-color: #ea4a36;
          border: none;
          color: #fff;
          float: left;
          cursor: pointer;

          &:focus {
            outline: none;
          }
        }
      }
    }
  }
}
</style>