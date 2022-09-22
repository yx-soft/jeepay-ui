/*
 *  全局定义信息
 *
 *  @author terrfly
 *  @site https://www.jeepay.vip
 *  @date 2021/5/8 07:18
 */

const errorPageRouteName = 'Error' //错误页面名称定义
const passGuardRouteList = [errorPageRouteName, 'QrCashierAlipay', 'QrCashierWxpay']  // 不进入路由守卫的name

/** 定义支付方式 **/
const payWay = {
    WECHAT : {wayCode: "WX_JSAPI", routeName: "QrCashierWxpay"},
    ALIPAY : {wayCode: "ALI_JSAPI", routeName: "QrCashierAlipay"},
    DOUYIN : {wayCode: "DY_JSAPI", routeName: "QrCashierDouyin"}, 
}

export default {
    errorPageRouteName: errorPageRouteName,
    passGuardRouteList: passGuardRouteList,
    urlTokenName: "token", //URL传递的token名称
    payWay: payWay,
    cacheToken: "",
    qrCode: ""
}