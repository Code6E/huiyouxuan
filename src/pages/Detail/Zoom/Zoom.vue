<template>
  <div class="spec-preview">
    <img :src="bigImg.imgUrl" />
    <div class="event" @mousemove="mouseMove"></div>
    <div class="big">
      <img :src="bigImg.imgUrl" ref="big"/>
    </div>
    <div class="mask" ref="mask"></div>
  </div>
</template>

<script>
  export default {
    name: "Zoom",
    props:['imgList',],
    data() {
      return {
        // 第一张大图的计算放到computed里而不放到data里，因为服务器数据还未请求到时，this.imgList[0]为空对象，此时bigImg为空对象。如果放到data里之后就不会再计算了，页面的大图那就会显示空，如果放到computed里，当服务器数据拿到时，bigImg会随着this.imgList[0]的更新而更新，就不会出现data那种大图区空白的现象了
        // bigImg:this.imgList[0] || {}
        index:0
      }
    },
    computed:{
      // 考虑到当服务器请求的数据还没拿到时，imgList还是空数组（detail/index.vue定义的），imgList[0]就为undefined，直接读取imgList[0].imgUrl就会报错（即使这种报错不影响程序运行，但尽量要去解决），可以利用短路让this.imgList[0]为空对象。
      // undefined.xxx与undefined[0]都会报错
      // 第一张大图的计算放到computed里而不放到data里，因为服务器数据还未请求到时，this.imgList[0]为空对象，此时bigImg为空对象。如果放到data里之后就不会再计算了，页面的大图那就会显示空，如果放到computed里，当服务器数据拿到时，bigImg会随着this.imgList[0]的更新而更新，就不会出现data那种大图区空白的现象了
      bigImg(){
        return this.imgList[this.index] || {}
      }

    },
    methods: {
      mouseMove(event){
        const mask =this.$refs.mask
        const big =this.$refs.big
        // 遮罩层跟随鼠标移动逻辑开始
        let left=event.offsetX-mask.offsetWidth/2
        let top=event.offsetY-mask.offsetHeight/2
        // 限制遮罩层不超出大图区域
        if(left<0) left=0
        if(left>mask.offsetParent.offsetWidth-mask.offsetWidth) left=mask.offsetParent.offsetWidth-mask.offsetWidth
        if(top<0) top=0
        if(top>mask.offsetParent.offsetHeight-mask.offsetHeight) top=mask.offsetParent.offsetHeight-mask.offsetHeight
        mask.style.left=left+'px'
        mask.style.top=top+'px'
        // 遮罩层跟随鼠标移动逻辑结束

        // 放大的图片区域逻辑开始
        // 从css样式可以看出，图片大小是遮罩层的2倍
        // 注意大图的top，left是遮罩层的top, left的反方向的2倍。就是遮罩层与大图的移动方向是相反的
        big.style.left=-2*left+'px'
        big.style.top=-2*top+'px'

      }
    },
    mounted() {
      this.$bus.$on('showImg',(i)=>{
        this.index=i
      })
    },
  }
</script>

<style lang="less">
  .spec-preview {
    position: relative;
    width: 400px;
    height: 400px;
    border: 1px solid #ccc;

    img {
      width: 100%;
      height: 100%;
    }

    .event {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 998;
    }

    .mask {
      width: 50%;
      height: 50%;
      background-color: rgba(0, 255, 0, 0.3);
      position: absolute;
      left: 0;
      top: 0;
      display: none;
    }

    .big {
      width: 100%;
      height: 100%;
      position: absolute;
      top: -1px;
      left: 100%;
      border: 1px solid #aaa;
      overflow: hidden;
      z-index: 998;
      display: none;
      background: white;

      img {
        width: 200%;
        max-width: 200%;
        height: 200%;
        position: absolute;
        left: 0;
        top: 0;
      }
    }

    .event:hover~.mask,
    .event:hover~.big {
      display: block;
    }
  }
</style>