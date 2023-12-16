<template>
  <div>
    <TypeNav />
    <ListContainer />
    <Recommand/>
    <Rank/>
    <Like/>
    <Floor v-for="floor in floorList" :key="floor.id" :list="floor"/>
    <Brand/>
  </div>
</template>

<script>
import ListContainer from "./ListContainer";
import Recommand from "./Recommand";
import Rank from "./Rank";
import Like from "./Like";
import Floor from "./Floor";
import Brand from "./Brand";
import {mapState} from 'vuex'
export default {
  name: "Home",
  components: { 
    ListContainer,
    Recommand,
    Rank,
    Like,
    Floor,
    Brand
  },
  computed:{
    ...mapState({
      floorList:state=>state.home.floorList
    })
  },
  mounted() {
    this.$store.dispatch("floorList")
    // this.$store.state.user.token非空表示当前是登录了某一个用户，而不是游客状态，这时就应该请求用户的信息，将用户的部分信息显示在页面上
    // 这个获取用户信息的操作放到了全局路由守卫中
    // if(localStorage.getItem('TOKEN')){
    //   this.$store.dispatch("userInfo")
    // }
    
  }
};
</script>

<style>
</style>