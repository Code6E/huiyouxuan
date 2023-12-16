// 教程没有讲解如何进行表单的数据校验，我们可以自己将这一部分完成
// 考虑如何实现点击注册按钮后才决定是否显示错误提示信息
<template>
  <div class="register-container">
    <!-- 注册内容 -->
    <div class="register">
      <h3>
        注册新用户
        <span class="go"
          >我有账号，去 <router-link to='/login'>登陆</router-link>
        </span>
      </h3>
      <div class="content">
        <label><span style="color:red;">*</span>手机号:</label>
        <!-- <input type="text" placeholder="请输入你的手机号" v-model="phone" size="11"/> size长度检验没起作用-->
        <!-- 设置minlength和maxlength只能控制字符数不超过11位 -->
        <input type="text" placeholder="请输入你的手机号" v-model="phone" minlength="11" maxlength="11"/>
        <span class="error-msg" v-show="!phone">手机号不能为空</span>
      </div>
      <div class="content">
        <label><span style="color:red;">*</span>验证码:</label>
        <input type="text" placeholder="请输入验证码" v-model="code" />
        <button
          style="width: 100px; height: 38px; margin-left: 5px"
          @click="getCode(phone)"
        >
          获取验证码
        </button>
      </div>
      <div class="content">
        <label><span style="color:red;">*</span>登录密码:</label>
        <input
          type="password"
          placeholder="设置密码"
          v-model="password"
        />
        <span class="error-msg" v-show="!password">密码不能为空</span>
      </div>
      <div class="content">
        <label><span style="color:red;">*</span>确认密码:</label>
        <input
          type="password"
          placeholder="确认密码"
          v-model="password1"
        />
        <span class="error-msg" v-show="password!=password1">密码输入不一致</span>
      </div>
      <div class="controls">
        <input name="m1" type="checkbox" :checked="agree" />
        <span>同意协议并注册《尚品汇用户协议》</span>
        <span class="error-msg">错误提示信息</span>
      </div>
      <div class="btn">
        <button @click="register">注册</button>
      </div>
    </div>

    <!-- 底部 -->
    <div class="copyright">
      <ul>
        <li>关于我们</li>
        <li>联系我们</li>
        <li>联系客服</li>
        <li>商家入驻</li>
        <li>营销中心</li>
        <li>手机尚品汇</li>
        <li>销售联盟</li>
        <li>尚品汇社区</li>
      </ul>
      <div class="address">地址：北京市昌平区宏福科技园综合楼6层</div>
      <div class="beian">京ICP备19006430号</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Register",
  data() {
    return {
      phone: "",
      code: "",
      password: "",
      password1: "",
      agree: true,
    };
  },
  methods: {
    // 获取验证码
    async getCode() {
      try {
        // 手机号不为空时，才可以发送验证码
        this.phone && (await this.$store.dispatch("getVerifyCode", this.phone));
        this.code = this.$store.state.user.code;
      } catch (error) {
        alert(error.message);
      }
    },
    async register() {
      // 表单验证
      try {
        // 手机号原来不在数据库中，且手机号，验证码，密码都不为空，且两次输入的密码一致时，才能注册成功
        let {phone,password,password1,code}=this
        if (phone && code && password === password1) {
          // 注意参数名及顺序与后端接口设计的保持一致，否则会有“202参数错误”
          let result = await this.$store.dispatch("userRegister", {phone,code,password});
          // 如果注册失败，则会抛出错误（详见user.js文件actions定义的userRegister函数）。就不会再执行try中这后面的代码了
          console.log(result);
          // 注册成功后跳转到登录页面
          this.$router.push('/login')
        }
      } catch (error) {
        alert(error.message);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.register-container {
  .register {
    width: 1200px;
    height: 445px;
    border: 1px solid rgb(223, 223, 223);
    margin: 0 auto;

    h3 {
      background: #ececec;
      margin: 0;
      padding: 6px 15px;
      color: #333;
      border-bottom: 1px solid #dfdfdf;
      font-size: 20.04px;
      line-height: 30.06px;

      span {
        font-size: 14px;
        float: right;

        a {
          color: #e1251b;
        }
      }
    }

    div:nth-of-type(1) {
      margin-top: 40px;
    }

    .content {
      padding-left: 390px;
      margin-bottom: 18px;
      position: relative;

      label {
        font-size: 14px;
        width: 96px;
        text-align: right;
        display: inline-block;
      }

      input {
        width: 270px;
        height: 38px;
        padding-left: 8px;
        box-sizing: border-box;
        margin-left: 5px;
        outline: none;
        border: 1px solid #999;
      }

      img {
        vertical-align: sub;
      }

      .error-msg {
        position: absolute;
        top: 100%;
        left: 495px;
        color: red;
      }
    }

    .controls {
      text-align: center;
      position: relative;

      input {
        vertical-align: middle;
      }

      .error-msg {
        position: absolute;
        top: 100%;
        left: 495px;
        color: red;
      }
    }

    .btn {
      text-align: center;
      line-height: 36px;
      margin: 17px 0 0 55px;

      button {
        outline: none;
        width: 270px;
        height: 36px;
        background: #e1251b;
        color: #fff !important;
        display: inline-block;
        font-size: 16px;
      }
    }
  }

  .copyright {
    width: 1200px;
    margin: 0 auto;
    text-align: center;
    line-height: 24px;

    ul {
      li {
        display: inline-block;
        border-right: 1px solid #e4e4e4;
        padding: 0 20px;
        margin: 15px 0;
      }
    }
  }
}
</style>