/**
 * 路由配置信息
 *
 * @author terrfly
 * @site https://www.jeepay.vip
 * @date 2021/5/8 07:18
 */

import Vue from 'vue'
import VueRouter from 'vue-router'

// hack router push callback
// [解决 vue-router跳转相同路径报错 ]
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}


Vue.use(VueRouter)

const routes = [
  {path: '/Qr/:token', name: 'Qr', component: () => import('../views/Qr.vue')}, //支付码分发器
  {path: '/hub/:token', name: 'Hub', component: () => import('../views/Hub.vue')}, //自动分发器
  {path: '/error', name: 'Error', component: () => import('../views/Error.vue')},
  {path: '/oauth2Callback/:token', name: 'Oauth2Callback', component: () => import('../views/Oauth2Callback.vue')}, //oauth回调地址
  {path: '/cashier', name: 'Cashier', component: () => import('../views/Cashier.vue'), //收银台（该地址无意义）
    children: [
        { path: '/cashier/wxpay', name: 'CashierWxpay', component: () => import('../views/payway/Wxpay.vue') },
        { path: '/cashier/alipay', name: 'CashierAlipay', component: () => import('../views/payway/Alipay.vue') },
        { path: '/cashier/ysfpay', name: 'CashierYsfpay', component: () => import('../views/payway/Ysfpay.vue') },
        { path: '/cashier/qr/alipay', name: 'QrCashierAlipay', component: () => import('../views/qr/Alipay.vue') },
        { path: '/cashier/qr/wxpay', name: 'QrCashierWxpay', component: () => import('../views/qr/Wxpay.vue') },  
    ]
  }
]

const router = new VueRouter({
  mode: 'history', //history 需要nginx适配    hash：是#的格式。
  base: "",
  routes
})

export default router
