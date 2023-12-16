<template>
  <div class="swiper-container">
    <div class="swiper-wrapper">
      <div class="swiper-slide" v-for="item in list" :key="item.id">
        <img :src="item.imgUrl" />
      </div>
    </div>
    <!-- 如果需要分页器 -->
    <div class="swiper-pagination"></div>

    <!-- 如果需要导航按钮 -->
    <div class="swiper-button-prev"></div>
    <div class="swiper-button-next"></div>
  </div>
</template>

<script>
// 不要写成import Swiper from "swiper"
import Swiper from "swiper/swiper-bundle.min.js";
export default {
  name: "Carousel",
//   list是传给Carousel组件的要遍历图片对象的列表
  props: ["list"],
  // watch与nextTick结合解决创建Swiper实例时轮播图HTML结构还没准备好的问题
  watch: {
    list: {
      immediate: true,// 因为Floor组件中的list数据不会变化，所以设置初始就执行handler函数
      handler() {
        this.$nextTick(() => {
          var mySwiper = new Swiper(".swiper-container", {
            // 设置轮播图方向
            direction: "horizontal",
            loop: true, // 循环模式选项

            // 如果需要分页器
            pagination: {
              el: ".swiper-pagination",
              type: "bullets",
              clickable: true,
            },
            //自动轮播
            autoplay: {
              delay: 2000,
              //新版本的写法：目前是5版本
              pauseOnMouseEnter: true,
              //用户操作swiper之后，是否禁止autoplay
              disableOnInteraction: true,
            },
            // 如果需要前进后退按钮
            navigation: {
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            },
          });
        });
      },
    },
  },
};
</script>
