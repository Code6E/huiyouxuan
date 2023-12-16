<template>
  <div class="pagination">
    <!-- 给分页器按钮绑定点击事件，并设置上一页和下一页按钮在合适的时候不能点击 -->
    <button
      @click="$emit('paginationEvent', pageNo - 1)"
      :disabled="pageNo === 1"
    >
      上一页
    </button>
    <button
      v-if="startAndEnd.start > 1"
      @click="$emit('paginationEvent', 1)"
      :class="{ active: pageNo === 1 }"
    >
      1
    </button>
    <button v-if="startAndEnd.start > 2">···</button>

    <button
      v-for="(page, index) in pages"
      :key="index"
      @click="$emit('paginationEvent', page)"
      :class="{ active: pageNo === page }"
    >
      {{ page }}
    </button>

    <button v-if="startAndEnd.end < totalPage - 1">···</button>
    <button
      v-if="startAndEnd.end < totalPage"
      @click="$emit('paginationEvent', totalPage)"
      :class="{active:pageNo===totalPage}"
    >
      {{ totalPage }}
    </button>
    <button
      @click="$emit('paginationEvent', pageNo + 1)"
      :disabled="pageNo === totalPage"
    >
      下一页
    </button>

    <button style="margin-left: 30px">共 {{ total }} 条</button>
  </div>
</template>

<script>
export default {
  name: "Pagination",
  // 总数据项数total，每页多少条数据pageSize，连续多少页continues，当前第几页pageNo
  props: ["total", "pageSize", "continues", "pageNo"],
  data() {
    return {};
  },
  computed: {
    
    totalPage() {
      return Math.ceil(this.total / this.pageSize);
    },
    startAndEnd() {
      // ES6解构赋值
      const { totalPage, continues, pageNo } = this;
      let start = 1,
        end = 2;
      if (totalPage < continues) {
        start = 1;
        end = totalPage;
      } else {
        start = pageNo - parseInt(continues / 2);
        end = pageNo + parseInt(continues / 2);
        if (start < 1) {
          start = 1;
          end = continues;
        }
        if (end > totalPage) {
          end = totalPage;
          start = totalPage - continues + 1;
        }
      }
      return { start, end };
    },
    // 计算连续的页面号的数组
    pages(){
      let arr=[]
      for(let i=this.startAndEnd.start,j=0;i<=this.startAndEnd.end;i++){
        arr[j++]=i
      }
      return arr
    },
  },
  methods: {},
  mounted() {},
};
</script>

<style lang="less" scoped>
.pagination {
  text-align: center;
  button {
    margin: 0 5px;
    background-color: #f4f4f5;
    color: #606266;
    outline: none;
    border-radius: 2px;
    padding: 0 4px;
    vertical-align: top;
    display: inline-block;
    font-size: 13px;
    min-width: 35.5px;
    height: 28px;
    line-height: 28px;
    cursor: pointer;
    box-sizing: border-box;
    text-align: center;
    border: 0;

    &[disabled] {
      color: #c0c4cc;
      cursor: not-allowed;
    }

    &.active {
      cursor: not-allowed;
      background-color: #409eff;
      color: #fff;
    }
  }
}
</style>