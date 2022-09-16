<template>
  <div class="jump">
    <!-- <p style="24px">
      正在跳转到支付页面，请稍候~
    </p> -->
    <img src="@/assets/images/loading.gif" alt="" />
  </div>
</template>

<script>
import {getQrInfo, getRedirectUrl, getDouyinUrl} from '@/api/api';
// import channelUserIdUtil from '@/utils/channelUserId'
import wayCodeUtils from '@/utils/wayCode'
import config from "@/config";

// 分发器页面，  用户扫码后进入的第一个页面：
// 判断是否存在channelUserId, 如果存在则直接跳到 对应的支付页面，如果不存在则重定向到对应的页面。
export default {
  components: {
  },

  mounted() {

    console.log("正在跳转", this.$router.params)

    const that = this;

    // eslint-disable-next-line no-constant-condition
    // if( true ){
    //   this.$router.push({name: "CashierAlipay"})
    //   return;
    // }

    getQrInfo().then(res => {
      var status = res.data.status;
      
      if(res.data.isNeedRedirect){
        location.href = res.data.redirectUrl;
        return ;
      }
      
      if(status == 1){

        if(wayCodeUtils.getPayWay() == config.payWay.DOUYIN){

        //以下为不存在
        getDouyinUrl().then(res => {
          // alert("跳转地址：" + res.data)
          location.href = res.data;
        }).catch(res => {
          that.$router.push({name: config.errorPageRouteName, params: {errInfo: res.msg}})
        });

          return ;
        }
        

        if(wayCodeUtils.getPayWay() != config.payWay.ALIPAY){
          this.$router.push({name: config.errorPageRouteName, params: {errInfo: "请通过支付宝扫码支付"}}) 
          return ;
        }

       //TODO 需要获取到不同的商户的userId
    // if(channelUserIdUtil.getChannelUserId()){// 存在
    //   //重定向到对应的支付页面
    //   this.$router.push({name: wayCodeUtils.getPayWay().routeName})
    //   return ;
    // }

           //以下为不存在
        getRedirectUrl().then(res => {
          location.href = res.data;
        }).catch(res => {
          that.$router.push({name: config.errorPageRouteName, params: {errInfo: res.msg}})
        });

      }else{
        that.$router.push({name: config.errorPageRouteName, params: {errInfo: "支付码未激活"}})
        return ;
      }
      
    }).catch(res => {
      that.$router.push({name: config.errorPageRouteName, params: {errInfo: "获取支付码信息失败" + res.msg}})
      return ;
    })

  }
}
</script>
<style lang="css" scoped>
  .jump {
    height:100vh;
    width: 100vw;
    display:flex;
    justify-content: center;
    align-items: center;
  }
</style>
