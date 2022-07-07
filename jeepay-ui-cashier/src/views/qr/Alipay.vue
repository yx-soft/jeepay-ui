<template>
  <div>
    <header class="header">
      <div class="header-text" v-show="merchantName">
        付款给{{ merchantName }}
      </div>
      <div class="header-img">
        <img :src="avatar ? avatar : icon_member_default" alt="" />
      </div>
    </header>
    <div class="plus-input">
      <!-- ￥字符 货币的符号-->
      <div class="S">
        <img src="../../assets/icon/S.svg" alt="" />
      </div>

      <!-- 输入框光标 -->
      <!-- <div class="ttt">
        <div class="input-c-div" style="background: #07c160"></div>
      </div> -->

      <!-- 手写输入框 -->
      <div class="input-c">
        <div class="input-c-div-1">{{ amount }}</div>
        <!-- 数字金额后边的光标 -->
        <div class="input-c-div" style="background: #07c160"></div>
      </div>
      <!-- 手写输入框的提示文字 -->
      <div v-show="!amount" class="placeholder">请输入金额</div>
    </div>
    <ul class="plus-ul"></ul>
    <!-- 备注板块 ，目前不需要添加备注，隐藏-->
    <div class="remark-k">
      <div class="remark">
        <div class="remark-hui" v-show="remark">{{ remark }}</div>
        <div @click="myDialogStateFn">{{ remark ? "修改" : "添加备注" }}</div>
      </div>
    </div>
    <!-- dialog 对话框 目前不需要添加备注，隐藏-->
    <MyDialog
      v-show="myDialogState"
      @myDialogStateFn="myDialogStateFn"
      :remark="remark"
    >
    </MyDialog>

    <!-- 键盘板块 目前不需要键盘 隐藏 -->
    <div class="keyboard-plus" v-if="isAllowModifyAmount">
      <Keyboard
        @delTheAmount="delTheAmount"
        @conceal="conceal"
        @enterTheAmount="enterTheAmount"
        @payment="payment"
        :money="money"
        :concealSate="concealSate"
        :typeColor="typeColor[payType]"
      ></Keyboard>
    </div>

    <!-- jeepay中，付款的点击事件 由 payment 修改为 pay  -->
    <!-- jeepay中，付款页面是唯一的，颜色不在需要v-bind，去掉即可 -->
    <div class="bnt-pay" v-if="!isAllowModifyAmount">
      <div class="bnt-pay-text" style="background-color: #07c160" @click="pay">
        付款
      </div>
    </div>
  </div>
</template>

<script>
import MyDialog from "../dialog/dialog"; // 添加备注弹出的对话框
import Keyboard from "../keyboard/keyboard"; // 手写键盘
import channelUserIdUtil from "@/utils/channelUserId";
import { getQrPayPackage } from "@/api/api";
import config from "@/config";
export default {
  // 注册备注对话框，和 手写键盘组件，由于这里是直接掉起支付事件，所以目前不应用
  components: { MyDialog, Keyboard },
  data: function () {
    return {
      qrCode: "",
      isAllowModifyAmount: true, // 允许编辑金额
      remark: "", // 备注
      myDialogState: false,
      payType: 0, // 支付方式
      typeColor: ["#1678ff"],
      concealSate: "",
      merchantName: "商家", // 付款的商户默认
      avatar: require("../../assets/icon/zhifu.svg"), // 商户头像默认
      money: 0,
      amount: "", // 支付金额默认
      resData: {},
      payOrderInfo: {}, //订单信息
    };
  },

  mounted() {
    var userId = this.$route.query.userId;
    //设置channelUserId
    channelUserIdUtil.setChannelUserId(userId);

    // 设置QrCode
    this.qrCode = this.$route.query.qr;

    // 设置商户名称
    this.merchantName = this.$route.query.mchName;
  },

  methods: {
   
    pay: function (){

      let that = this;
      getQrPayPackage(this.qrCode, this.amount, this.remark).then(res => {
        //订单创建异常
        if(res.code != 0) {
          return alert(res.msg);
        }

        if (!window.AlipayJSBridge) {
          document.addEventListener('AlipayJSBridgeReady', function(){
            that.doAlipay(res.data.alipayTradeNo);
          }, false);
        }else{
          that.doAlipay(res.data.alipayTradeNo);
        }

      }).catch(res => {
        that.$router.push({name: config.errorPageRouteName, params: {errInfo: res.msg}})
      });
    },


    doAlipay(alipayTradeNo){
      const that = this
      // eslint-disable-next-line no-undef
      AlipayJSBridge.call("tradePay", {
        tradeNO: alipayTradeNo
      }, function (data) {
        if ("9000" == data.resultCode) {
          // alert('支付成功！');

          // //重定向
          if(that.payOrderInfo.returnUrl){
            location.href = that.payOrderInfo.returnUrl;
          }else{
            alert('支付成功！');
            window.AlipayJSBridge.call('closeWebview')
          }

          //‘8000’：后台获取支付结果超时，暂时未拿到支付结果;
        // ‘6004’：支付过程中网络出错， 暂时未拿到支付结果;
        }else if("8000" == data.resultCode || "6004" == data.resultCode){ //其他

          alert(JSON.stringify(data));
          window.AlipayJSBridge.call('closeWebview')

        }else{ ///其他异常信息， 需要取消订单
          alert('用户已取消！');
          window.AlipayJSBridge.call('closeWebview')
        }
      });
    },

    // 输入备注
    myDialogStateFn(item) {
      this.myDialogState = !this.myDialogState;
      if (typeof item == "string") {
        this.remark = item;
      }
      console.log("添加备注" + this.remark);
    },

    delTheAmount() {
      if (this.amount.length > 0) {
        this.amount = this.amount.substr(0, this.amount.length - 1);
        console.log("aaa" + this.amount);
        this.money = parseFloat(this.amount);
      }
      console.log(
        "支付键盘delTheAmount amount:" + this.amount + " money:" + this.money
      );
    },

    conceal() {
      this.amount = "";
      this.money = 0;
      console.log("支付键盘conceal ");
    },

    enterTheAmount(item) {
      console.log("点击按钮 " + item);
      if (this.checkAmt(this.amount + item)) {
        this.amount = this.amount + item;
      }
      this.money = parseFloat(this.amount);
      console.log(
        "支付键盘enterTheAmount amount:" + this.amount + "money:" + this.money
      );
    },

    payment() {
      console.log("支付键盘payment ");
      this.pay();
    },

    /**
     *
     * 输入框输入金额控制
     */
    // 金额校验
    checkAmt(dPrice) {
      // 第一步：判断是否有非法字符
      for (var i = 0; i < dPrice.length; i++) {
        if (
          isNaN(parseInt(dPrice.charAt(i))) &&
          dPrice.charAt(i) != "." &&
          dPrice.charAt(i) != ","
        ) {
          alert("请输入正确的金额！");
          return false;
        }
      }
      // 第二步：如果存在小数点，判断是否仅有一个小数点，小数点是否在第一位
      if (dPrice.indexOf(".") != dPrice.lastIndexOf(".")) {
        return false;
      }

      // 第三步：判断金额是否为零
      var re = /,/g;
      var amt1 = dPrice.replace(re, "");
      var amt2 = parseFloat(amt1);
      if (amt2 < 0) {
        return false;
      } else if (amt2 == 0) {
        if (amt1 == "0" || amt1 == "0." || amt1 == "0.0") {
          return true;
        } else {
          return false;
        }
      } else {
        // 第四步：判断金额小数点后是否超过两位
        if (amt1.indexOf(".") != -1) {
          var str = amt1.substr(amt1.indexOf(".") + 1);
          if (str.length > 2) {
            return false;
          }
        }

        // 小数点在第一位
        if (amt1.charAt(0) == ".") {
          return false;
        }

        // 第五步：判断以零开头的金额，小数点是否在第一位
        if (amt1.charAt(0) == "0" && amt1.indexOf(".") != 1) {
          return false;
        }
        // 第六步：判断金额是否超过最大金额
        var temp =
          amt1.indexOf(".") != -1 ? amt1.substring(0, amt1.indexOf(".")) : amt1;
        if (temp.length > 10) {
          return false;
        }

        if (amt2 >= 1000000) {
          return false;
        }
      }
      return true;
    },
  },
};
</script>
<style lang="css" scoped>
@import "../payway/pay.css";
</style>