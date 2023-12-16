<template>
  <div class="cart">
    <h4>全部商品</h4>
    <div class="cart-main">
      <div class="cart-th">
        <div class="cart-th1">全部</div>
        <div class="cart-th2">商品</div>
        <div class="cart-th3">单价（元）</div>
        <div class="cart-th4">数量</div>
        <div class="cart-th5">小计（元）</div>
        <div class="cart-th6">操作</div>
      </div>
      <div class="cart-body">
        <ul
          class="cart-list"
          v-show="cartList"
          v-for="item in cartList"
          :key="item.id"
        >
          <li class="cart-list-con1">
            <input
              type="checkbox"
              name="chk_list"
              :checked="item.isChecked"
              @change="updateCheck($event, item)"
            />
          </li>
          <li class="cart-list-con2">
            <img :src="item.imgUrl" />
            <div class="item-msg">{{ item.skuName }}</div>
          </li>
          <li class="cart-list-con4">
            <span class="price">{{ item.skuPrice }}.00</span>
          </li>
          <li class="cart-list-con5">
            <a
              href="javascript:void(0)"
              class="mins"
              @click="updateShopCart($event, item, 'mins')"
              >-</a
            >
            <input
              autocomplete="off"
              type="text"
              :value="item.skuNum"
              minnum="1"
              class="itxt"
              @change="updateShopCart($event, item, 'change')"
            />
            <a
              href="javascript:void(0)"
              class="plus"
              @click="updateShopCart($event, item, 'plus')"
              >+</a
            >
          </li>
          <li class="cart-list-con6">
            <span class="sum">{{ item.skuNum * item.skuPrice }}</span>
          </li>
          <li class="cart-list-con7">
            <!-- 记得删除href属性 -->
            <a class="sindelet" @click="deleteShopCart(item.skuId)">删除</a>
            <br />
            <a href="#none">移到收藏</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="cart-tool">
      <div class="select-all">
        <input
          class="chooseAll"
          type="checkbox"
          :checked="isAllChecked && cartList.length > 0"
          @change="checkAll"
        />
        <span>全选</span>
      </div>
      <div class="option">
        <!-- 记得删除href属性 -->
        <a @click="deleteChecked">删除选中的商品</a>
        <a href="#none">移到我的关注</a>
        <a href="#none">清除下柜商品</a>
      </div>
      <div class="money-box">
        <div class="chosed">已选择 <span>0</span>件商品</div>
        <div class="sumprice">
          <em>总价（不含运费） ：</em>
          <i class="summoney">{{ totalPrice }}元</i>
        </div>
        <div class="sumbtn">
          <a @click="toTrade" class="sum-btn">结算</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import throttle from "lodash/throttle";
export default {
  name: "ShopCart",
  data() {
    return {};
  },
  computed: {
    // cartList是购物车列表
    ...mapGetters(["cartList"]),
    // 计算总价
    totalPrice() {
      let sum = 0;
      for (let i = 0; i < this.cartList.length; i++) {
        sum += this.cartList[i].skuNum * this.cartList[i].skuPrice;
      }
      return sum;
    },
    // 判断全选框是否应该勾上
    isAllChecked() {
      return this.cartList.every((item) => item.isChecked === 1);
    },
  },
  methods: {
    // 如果不加async await的话，会导致this.getShopCart()在所有勾选状态修改完前执行，所以页面显示上会有一部分商品勾选状态与全选按钮一致，一部分不一致，但是刷新后所有商品的勾选状态会与全选按钮一致，因为等用户刷新的这个时间段已经有足够的时间修改完服务器购物车商品的勾选状态了
    async checkAll(event) {
      let isChecked = event.target.checked ? 1 : 0;
      try {
        await this.$store.dispatch("checkToggle", isChecked);
        this.getShopCart();
      } catch (error) {
        alert(error.message);
      }
    },
    async deleteChecked() {
      try {
        await this.$store.dispatch("deleteAllChecked");
        this.getShopCart();
      } catch (error) {
        alert(error.message);
      }
    },
    async deleteShopCart(skuId) {
      try {
        await this.$store.dispatch("deleteShopCart", skuId);
        this.getShopCart();
      } catch (error) {
        alert(error.message);
      }
    },
    getShopCart() {
      this.$store.dispatch("getShopCart");
    },
    async updateCheck(event, item) {
      try {
        // console.log(event.target.checked);// 布尔值
        // 后端规定了1表示勾选，0表示不勾选，所以注意把布尔值转换成后端规定的格式
        let isChecked = event.target.checked ? 1 : 0;
        await this.$store.dispatch("updateChecked", {
          skuId: item.skuId,
          isChecked: isChecked,
        });
        this.getShopCart();
      } catch (error) {
        alert(error.message);
      }
    },
    /*
      bug：连续快速点击减号会出现负数
      原因：前面点击减号还未来得及修改服务器中商品的数量，此时服务器商品的数量大于1，但实际上前几次减少商品数量的请求已经让商品数量为负了，只是还未来得及修改服务器的数据，所以导致用户还可以发送减少商品数量的请求，等减请求修改服务器的商品数量后，页面就会出现负数了
      解决办法：防抖，这样让减请求修改完服务器的商品数量后才可发送下一个减请求
    */
    updateShopCart: throttle(async function (event, item, type) {
      // 有个很大的问题：数据延迟，数据不能实时地显示，要刷新才能显示最新的数据
      // 以下的逻辑是满足一定条件才会发送修改购物车的POST请求，并更新购物车页面，否则就不做任何操作
      if (type === "plus") {
        // 注意接口要求的是skuId不是id
        await this.$store.dispatch("addShopcart", {
          skuId: item.skuId,
          skuNum: 1,
        });
      } else if (type === "mins") {
        // 商品数不能小于1，商品数大于1才能进行减操作
        if (item.skuNum >= 2) {
          await this.$store.dispatch("addShopcart", {
            skuId: item.skuId,
            skuNum: -1,
          });
        }
      } else {
        // 判断是否含字符串类型的数据
        // 注意event.target.value是字符串类型，所以需要event.target.value*1换成数值类型再再做数值相关的操作
        // 输入框需要是数值类型并且大于0才能修改购物车数据
        if (!isNaN(event.target.value * 1) && event.target.value * 1 >= 1) {
          // 还要注意用户输入小数的情况
          await this.$store.dispatch("addShopcart", {
            skuId: item.skuId,
            skuNum: parseInt(event.target.value) - item.skuNum,
          });
        }
        console.log(item.skuNum, parseInt(event.target.value));
      }
      this.getShopCart();
    }, 2000),

    toTrade(){
      // 用于检验勾选的商品是否为空，因为一个商品都不勾选的话，进入交易页面会导致报错（这个后面自己发现的bug，，自己加上这个校验步骤的）
      if(this.cartList.every((item)=>item.isChecked==0)){
        alert('勾选的商品不能为空！')
      }else{
        this.$router.push('/trade')
      }
    }
  },
  mounted() {
    this.getShopCart();
    // setTimeout(() => {
    //   console.log(this.cartList);
    // }, 3000);
  },
};
</script>

<style lang="less" scoped>
.cart {
  width: 1200px;
  margin: 0 auto;

  h4 {
    margin: 9px 0;
    font-size: 14px;
    line-height: 21px;
  }

  .cart-main {
    .cart-th {
      background: #f5f5f5;
      border: 1px solid #ddd;
      padding: 10px;
      overflow: hidden;

      & > div {
        float: left;
      }

      .cart-th1 {
        width: 25%;

        input {
          vertical-align: middle;
        }

        span {
          vertical-align: middle;
        }
      }

      .cart-th2 {
        width: 25%;
      }

      .cart-th3,
      .cart-th4,
      .cart-th5,
      .cart-th6 {
        width: 12.5%;
      }
    }

    .cart-body {
      margin: 15px 0;
      border: 1px solid #ddd;

      .cart-list {
        padding: 10px;
        border-bottom: 1px solid #ddd;
        overflow: hidden;

        & > li {
          float: left;
        }

        .cart-list-con1 {
          width: 15%;
        }

        .cart-list-con2 {
          width: 35%;

          img {
            width: 82px;
            height: 82px;
            float: left;
          }

          .item-msg {
            float: left;
            width: 150px;
            margin: 0 10px;
            line-height: 18px;
          }
        }

        .cart-list-con4 {
          width: 10%;
        }

        .cart-list-con5 {
          width: 15%;

          .mins {
            border: 1px solid #ddd;
            border-right: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }

          input {
            border: 1px solid #ddd;
            width: 40px;
            height: 33px;
            float: left;
            text-align: center;
            font-size: 14px;
          }

          .plus {
            border: 1px solid #ddd;
            border-left: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }
        }

        .cart-list-con6 {
          width: 12%;

          .sum {
            font-size: 16px;
          }
        }

        .cart-list-con7 {
          width: 13%;

          a {
            color: #666;
          }
        }
      }
    }
  }

  .cart-tool {
    overflow: hidden;
    border: 1px solid #ddd;

    .select-all {
      padding: 10px;
      overflow: hidden;
      float: left;

      span {
        vertical-align: middle;
      }

      input {
        vertical-align: middle;
      }
    }

    .option {
      padding: 10px;
      overflow: hidden;
      float: left;

      a {
        float: left;
        padding: 0 10px;
        color: #666;
      }
    }

    .money-box {
      float: right;

      .chosed {
        line-height: 26px;
        float: left;
        padding: 0 10px;
      }

      .sumprice {
        width: 200px;
        line-height: 22px;
        float: left;
        padding: 0 10px;

        .summoney {
          color: #c81623;
          font-size: 16px;
        }
      }

      .sumbtn {
        float: right;

        a {
          display: block;
          position: relative;
          width: 96px;
          height: 52px;
          line-height: 52px;
          color: #fff;
          text-align: center;
          font-size: 18px;
          font-family: "Microsoft YaHei";
          background: #e1251b;
          overflow: hidden;
        }
      }
    }
  }
}
</style>