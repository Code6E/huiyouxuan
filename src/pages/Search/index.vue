<template>
  <div>
    <TypeNav />
    <div class="main">
      <div class="py-container">
        <!--bread-->
        <div class="bread">
          <ul class="fl sui-breadcrumb">
            <li>
              <a href="#">全部结果</a>
            </li>
          </ul>
          <ul class="fl sui-tag">
            <!-- 分类名面包屑 -->
            <li class="with-x" v-if="searchParams.categoryName">
              {{ searchParams.categoryName
              }}<i @click="removeCategoryName">x</i>
            </li>
            <!-- 搜索关键字面包屑 -->
            <li class="with-x" v-if="searchParams.keyword">
              {{ searchParams.keyword }}<i @click="removeKeyword">x</i>
            </li>
            <!-- 品牌面包屑 -->
            <li class="with-x" v-if="searchParams.trademark">
              <!-- 记得显示面包屑的文本时通过searchParams.trademark.split(':')[1]把tmId去掉 -->
              {{ searchParams.trademark.split(':')[1] }}<i @click="removeTrademark">x</i>
            </li>
            <!-- 注意props可能有多项，所以用v-for -->
            <li class="with-x" v-for="(v,i) in searchParams.props" :key="i">
              <!--  -->
              {{ v.split(':')[1] }}<i @click="removeAttr(i)">x</i>
            </li>
          </ul>
        </div>

        <!--selector-->
        <!-- 因为searchParams在父组件Search中，所以请求服务器数据的操作写到父组件中，父组件Search需要子组件SearchSelector传递被点击的商标信息trademark等，通过给子组件绑定自定义事件实现子向父传递数据 -->
        <!-- 不要写成@tradeMarkEvent="tradeMarkEvent(trademark)" -->
        <SearchSelector @tradeMarkEvent="tradeMarkEvent" @attrEvent="attrEvent"/>

        <!--details-->
        <div class="details clearfix">
          <div class="sui-navbar">
            <div class="navbar-inner filter">
              <ul class="sui-nav">
                <!-- 注意changeOrder传入的是字符串'1'，因为后面split分割出的是字符串'1'或'2' -->
                <li :class="{active:isOne}" @click="changeOrder('1')">
                  <a>综合<span v-show="isOne" class="iconfont" :class="{'icon-up':isUp,'icon-down':isDown}"></span></a>
                </li>
                <!--  -->
                <li :class="{active:isTwo}" @click="changeOrder('2')">
                  <a>价格<span v-show="isTwo" class="iconfont" :class="{'icon-up':isUp,'icon-down':isDown}"></span></a>
                </li>
              </ul>
            </div>
          </div>
          <!-- 销售产品列表 -->
          <div class="goods-list">
            <ul class="yui3-g">
              <li class="yui3-u-1-5" v-for="good in goodsList" :key="good.id">
                <div class="list-wrap">
                  <div class="p-img">
                    <router-link :to="`/detail/${good.id}`">
                      <img v-lazy="good.defaultImg"/>
                    </router-link>
                    
                  </div>
                  <div class="price">
                    <strong>
                      <em>¥</em>
                      <i> {{ good.price }}.00</i>
                    </strong>
                  </div>
                  <div class="attr">
                    <a
                      target="_blank"
                      href="item.html"
                      title="促销信息，下单即赠送三个月CIBN视频会员卡！【小米电视新品4A 58 火爆预约中】"
                      >{{ good.title }}</a
                    >
                  </div>
                  <div class="commit">
                    <i class="command">已有<span>2000</span>人评价</i>
                  </div>
                  <div class="operate">
                    <a
                      href="success-cart.html"
                      target="_blank"
                      class="sui-btn btn-bordered btn-danger"
                      >加入购物车</a
                    >
                    <a href="javascript:void(0);" class="sui-btn btn-bordered"
                      >收藏</a
                    >
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <Pagination :total='total' :pageSize='searchParams.pageSize' :continues='5' :pageNo='searchParams.pageNo' @paginationEvent="paginationEvent"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SearchSelector from "./SearchSelector/SearchSelector";
import { mapGetters, mapState } from "vuex";
export default {
  name: "Search",
  components: {
    SearchSelector,
  },
  data() {
    return {
      searchParams: {
        // 一级列表
        category1Id: undefined,
        // 二级列表
        category2Id: undefined,
        // 三级列表
        category3Id: undefined,
        // 列表项名
        categoryName: undefined,
        // 输入搜索框的内容
        keyword: undefined,
        //默认是综合降序, 1表示综合，2表示价格，asc表示升序，desc表示降序
        order: '1:desc',
        // 当前页
        pageNo: 1,
        // 每页存放的商品项数
        pageSize: 3,
        // 商品参数
        props: [],
        // 商标
        trademark: '',
      },
      
    };
  },
  computed: {
    // searchParams.order.indexOf('1')!==-1表示searchParams.order存在'1'，即order当前是"综合"
    // 排序状态是否是‘综合’
    isOne(){
      return this.searchParams.order.indexOf('1')!==-1
    },
    // searchParams.order.indexOf('2')!==-1表示searchParams.order存在'2'，即order当前是"价格"
    // 排序状态是否是‘价格’
    isTwo(){
      return this.searchParams.order.indexOf('2')!==-1
    },
    // 排序状态是否是‘升序’
    isUp(){
      return this.searchParams.order.indexOf('asc')!==-1
    },
    // 排序状态是否是‘降序’
    isDown(){
      return this.searchParams.order.indexOf('desc')!==-1
    },
    ...mapGetters(["goodsList"]),
    ...mapState({
      total:state=>state.search.searchList.total
    })
  },
  methods: {
    // 带上参数，向服务器请求数据
    getData() {
      this.$store.dispatch("searchList", this.searchParams);
    },
    // 给分页器绑定的事件
    paginationEvent(pageNo){
      this.searchParams.pageNo=pageNo
      this.getData()
    },
    // 改变排序规则
    changeOrder(flag){
      let originFlag=this.searchParams.order.split(':')[0]
      let originSort=this.searchParams.order.split(':')[1]
      let newOrder=''
      // 点击同一个排序标签，只在升序降序中切换
      if(flag===originFlag){
        newOrder=`${originFlag}:${originSort==='asc' ? 'desc' : 'asc'}`
      }else{// 点击不同排序标签，切换排序标签，默认降序
        newOrder=`${flag}:desc`// 切换到新的排序默认是降序，所以就不用判断originSort的值了
      }
      this.searchParams.order=newOrder
      this.getData()
    },
    
    // 移除分类面包屑，并更新分类请求参数，向服务器发送请求更新显示数据
    removeCategoryName() {
      this.searchParams.categoryName = undefined;
      this.searchParams.category1Id = undefined;
      this.searchParams.category2Id = undefined;
      this.searchParams.category3Id = undefined;
      // 请求数据，更新展示的数据
      // this.getData();// 注意这里不用写这一行，因为this.$router.push({name:'search',params:this.$route.params})切换路由的操作会触发getData()操作
      // 跳转路由，改变地址栏的参数
      // 如果原来有params参数就将原来的params参数带上
      this.$router.push({ name: "search", params: this.$route.params });
    },
    // 移除关键字面包屑，并更新关键字请求参数，向服务器发送请求更新显示数据
    removeKeyword() {
      this.searchParams.keyword = undefined;
      // 实现兄弟组件Search与Header之间通信。实现×掉keyword面包屑，输入框清空的业务逻辑
      // 触发全局事件总线上的clear事件
      this.$bus.$emit("clear");
      // 跳转路由，改变地址栏的参数
      // 如果原来有query参数就将原来的query参数带上
      this.$router.push({ name: "search", query: this.$route.query });
    },
    // 更新品牌请求参数，并向服务器发送请求更新显示数据
    tradeMarkEvent(trademark){
      this.searchParams.trademark=`${trademark.tmId}:${trademark.tmName}`
      // 因为不用向路由传参（而是带着参数向服务器发送请求），而且这些动作本身就在Search路由里才能操作，所以这里就不用写路由跳转了。下面removeTrademark，attrEvent，removeAttr同理
      this.getData()
    },
    // 移除品牌面包屑，并更新品牌请求参数，向服务器发送请求更新显示数据
    removeTrademark(){
      this.searchParams.trademark=undefined
      this.getData()
    },
    // 更新商品属性请求参数，并向服务器发送请求更新显示数据
    attrEvent(attr,value){
      let prop=`${attr.attrId}:${value}:${attr.attrName}`
      // 加判断条件是为了不添加重复标签
      if(this.searchParams.props.indexOf(prop)===-1){
        this.searchParams.props.push(prop)
        this.getData()
      }
    },
    // 移除商品属性面包屑，并更新商品属性请求参数，向服务器发送请求更新显示数据
    removeAttr(index){
      this.searchParams.props.splice(index,1)
      this.getData()

    }
  },
  // 为了实现每次点击搜索按钮就查询并显示数据（而不只是挂载search组件时才查询并搜索数据）。所以侦听$route，因为每次点击搜索按钮都会触发TypeNav中的goSearch函数（实现路由跳转操作，路由跳转导致$route指向新的对象）
  watch: {
    // $route是组件实例或vm对象的第一层属性，也是属于data的，所以侦听时不用写成$route
    $route: {
      deep: true,
      handler(newRoute) {
        Object.assign(this.searchParams, newRoute.query, newRoute.params);
        this.getData();
        // 因为category1Id，category2Id，category3Id不是每次发送请求都会被新值覆盖的，可能还会留存上一次请求的数据，所以应该要记得清空
        // 注意空字符串与undefined是不一样的，空字符串意味着有这个参数，但是内容是空字符串，undefined就表示没有这个参数
        this.searchParams.category1Id = undefined;
        this.searchParams.category2Id = undefined;
        this.searchParams.category3Id = undefined;
      },
    },
  },
  beforeMount() {
    // Object.assign()是ES6的一个方法，将后面的对象与第一个对象合并，相同属性后面的覆盖前面的，第一个对象不存在的属性会原封不动存到该对象。第一个对象有而后面的对象没有的属性保持不变
    // 获取请求参数这一步一定要在发送请求前执行
    Object.assign(this.searchParams, this.$route.query, this.$route.params);
  },

  mounted() {
    // 因为在mounted中写了getData()函数，所以一切换到Search路由组件就会向服务器发送请求（包括自己切换到自己）
    this.getData();
    // console.log('search路由挂载了');
  },
};
</script>

<style lang="less" scoped>
.main {
  margin: 10px 0;

  .py-container {
    width: 1200px;
    margin: 0 auto;

    .bread {
      margin-bottom: 5px;
      overflow: hidden;

      .sui-breadcrumb {
        padding: 3px 15px;
        margin: 0;
        font-weight: 400;
        border-radius: 3px;
        float: left;

        li {
          display: inline-block;
          line-height: 18px;

          a {
            color: #666;
            text-decoration: none;

            &:hover {
              color: #4cb9fc;
            }
          }
        }
      }

      .sui-tag {
        margin-top: -5px;
        list-style: none;
        font-size: 0;
        line-height: 0;
        padding: 5px 0 0;
        margin-bottom: 18px;
        float: left;

        .with-x {
          font-size: 12px;
          margin: 0 5px 5px 0;
          display: inline-block;
          overflow: hidden;
          color: #000;
          background: #f7f7f7;
          padding: 0 7px;
          height: 20px;
          line-height: 20px;
          border: 1px solid #dedede;
          white-space: nowrap;
          transition: color 400ms;
          cursor: pointer;

          i {
            margin-left: 10px;
            cursor: pointer;
            font: 400 14px tahoma;
            display: inline-block;
            height: 100%;
            vertical-align: middle;
          }

          &:hover {
            color: #28a3ef;
          }
        }
      }
    }

    .details {
      margin-bottom: 5px;

      .sui-navbar {
        overflow: visible;
        margin-bottom: 0;

        .filter {
          min-height: 40px;
          padding-right: 20px;
          background: #fbfbfb;
          border: 1px solid #e2e2e2;
          padding-left: 0;
          border-radius: 0;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.065);

          .sui-nav {
            position: relative;
            left: 0;
            display: block;
            float: left;
            margin: 0 10px 0 0;

            li {
              float: left;
              line-height: 18px;

              a {
                display: block;
                cursor: pointer;
                padding: 11px 15px;
                color: #777;
                text-decoration: none;
              }

              &.active {
                a {
                  background: #e1251b;
                  color: #fff;
                }
              }
            }
          }
        }
      }

      .goods-list {
        margin: 20px 0;

        ul {
          display: flex;
          flex-wrap: wrap;

          li {
            height: 100%;
            width: 20%;
            margin-top: 10px;
            line-height: 28px;

            .list-wrap {
              .p-img {
                padding-left: 15px;
                width: 215px;
                height: 255px;

                a {
                  color: #666;

                  img {
                    max-width: 100%;
                    height: auto;
                    vertical-align: middle;
                  }
                }
              }

              .price {
                padding-left: 15px;
                font-size: 18px;
                color: #c81623;

                strong {
                  font-weight: 700;

                  i {
                    margin-left: -5px;
                  }
                }
              }

              .attr {
                padding-left: 15px;
                width: 85%;
                overflow: hidden;
                margin-bottom: 8px;
                min-height: 38px;
                cursor: pointer;
                line-height: 1.8;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;

                a {
                  color: #333;
                  text-decoration: none;
                }
              }

              .commit {
                padding-left: 15px;
                height: 22px;
                font-size: 13px;
                color: #a7a7a7;

                span {
                  font-weight: 700;
                  color: #646fb0;
                }
              }

              .operate {
                padding: 12px 15px;

                .sui-btn {
                  display: inline-block;
                  padding: 2px 14px;
                  box-sizing: border-box;
                  margin-bottom: 0;
                  font-size: 12px;
                  line-height: 18px;
                  text-align: center;
                  vertical-align: middle;
                  cursor: pointer;
                  border-radius: 0;
                  background-color: transparent;
                  margin-right: 15px;
                }

                .btn-bordered {
                  min-width: 85px;
                  background-color: transparent;
                  border: 1px solid #8c8c8c;
                  color: #8c8c8c;

                  &:hover {
                    border: 1px solid #666;
                    color: #fff !important;
                    background-color: #666;
                    text-decoration: none;
                  }
                }

                .btn-danger {
                  border: 1px solid #e1251b;
                  color: #e1251b;

                  &:hover {
                    border: 1px solid #e1251b;
                    background-color: #e1251b;
                    color: white !important;
                    text-decoration: none;
                  }
                }
              }
            }
          }
        }
      }

      .page {
        width: 733px;
        height: 66px;
        overflow: hidden;
        float: right;

        .sui-pagination {
          margin: 18px 0;

          ul {
            margin-left: 0;
            margin-bottom: 0;
            vertical-align: middle;
            width: 490px;
            float: left;

            li {
              line-height: 18px;
              display: inline-block;

              a {
                position: relative;
                float: left;
                line-height: 18px;
                text-decoration: none;
                background-color: #fff;
                border: 1px solid #e0e9ee;
                margin-left: -1px;
                font-size: 14px;
                padding: 9px 18px;
                color: #333;
              }

              &.active {
                a {
                  background-color: #fff;
                  color: #e1251b;
                  border-color: #fff;
                  cursor: default;
                }
              }

              &.prev {
                a {
                  background-color: #fafafa;
                }
              }

              &.disabled {
                a {
                  color: #999;
                  cursor: default;
                }
              }

              &.dotted {
                span {
                  margin-left: -1px;
                  position: relative;
                  float: left;
                  line-height: 18px;
                  text-decoration: none;
                  background-color: #fff;
                  font-size: 14px;
                  border: 0;
                  padding: 9px 18px;
                  color: #333;
                }
              }

              &.next {
                a {
                  background-color: #fafafa;
                }
              }
            }
          }

          div {
            color: #333;
            font-size: 14px;
            float: right;
            width: 241px;
          }
        }
      }
    }
  }
}
</style>