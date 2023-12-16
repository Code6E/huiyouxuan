<template>
  <div class="swiper-container">
    <div class="swiper-wrapper">
      <div class="swiper-slide" v-for="(img,i) in imgList" :key="i" >
        <img :src="img.imgUrl" :class="{active:i===index}" @click="changeIndex(i)"/>
      </div>
    </div>
    <div class="swiper-button-next"></div>
    <div class="swiper-button-prev"></div>
  </div>
</template>

<script>
import Swiper from "swiper/swiper-bundle.min.js";
export default {
  name: "ImageList",
  props: ["imgList"],
  data() {
    return {
      // 索引默认为0，就是默认选中第一张图片
      index:0
    }
  },
  computed: {
    // img(){
    //   return this.imgList[0] || {}
    // }
  },
  // watch与nextTick结合解决创建Swiper实例时轮播图HTML结构还没准备好的问题
  watch: {
    imgList: {
      handler() {
        this.$nextTick(() => {
          var mySwiper = new Swiper(".swiper-container", {
            // 设置轮播图方向
            direction: "horizontal",
            // loop: true, // 循环模式选项
            // 设置slider容器能够同时显示的slide数量
            slidesPerView: 3,
            // 
            slidesPerGroup:2,
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
  methods: {
    changeIndex(i){
      this.index=i;
      this.$bus.$emit('showImg',i)
    }
  },
};
</script>

<style lang="less" scoped>
.swiper-container {
  height: 56px;
  width: 412px;
  box-sizing: border-box;
  padding: 0 12px;

  .swiper-slide {
    width: 56px;
    height: 56px;

    img {
      width: 100%;
      height: 100%;
      border: 1px solid #ccc;
      padding: 2px;
      width: 50px;
      height: 50px;
      display: block;

      &.active {
        border: 2px solid #f60;
        padding: 1px;
      }

      &:hover {
        border: 2px solid #f60;
        padding: 1px;
      }
    }
  }

  .swiper-button-next {
    left: auto;
    right: 0;
  }

  .swiper-button-prev {
    left: 0;
    right: auto;
  }

  .swiper-button-next,
  .swiper-button-prev {
    box-sizing: border-box;
    width: 12px;
    height: 56px;
    background: rgb(235, 235, 235);
    border: 1px solid rgb(204, 204, 204);
    top: 0;
    margin-top: 0;
    &::after {
      font-size: 12px;
    }
  }
}
</style>