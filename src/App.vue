<template>
  <div id="app">
    <Header></Header>
    <router-view></router-view>
    <Footer v-show="$route.meta.show"></Footer>
  </div>
</template>

<script>
import Header from './components/Header'
import Footer from './components/Footer'
export default {
  name: 'App',
  data() {
    return {
      msg:'abc'
    }
  },
  components: {
    Header,
    Footer
  },
  mounted() {
    // 因为APP组件只挂载一次，TypeNav组件在每次跳转到Search及跳转回Home组件时都会挂载一次，为了避免重复发送请求，将原本写在TypeNav上的请求categoryList数据的操作 写在APP组件上（或main.js文件中） 以提高性能
    this.$store.dispatch("categoryList");
  },
}
</script>

<style>

</style>
