import request from '@/http/request'
import wayCode from "@/utils/wayCode";
import channelUserIdUtil from "@/utils/channelUserId";
import config from '@/config'

/** 获取url **/
export function getRedirectUrl () {
  return request.request({
    url: '/api/cashier/redirectUrl',
    method: 'POST',
    data: { wayCode: wayCode.getPayWay().wayCode, token: config.cacheToken }
  })
}

/** 获取抖音url **/
export function getDouyinUrl () {
  return request.request({
    url: '/api/cashier/douyinUrl',
    method: 'POST',
    data: { wayCode: wayCode.getPayWay().wayCode, token: config.cacheToken }
  })
}

/** 获取支付码信息 **/
export function getQrInfo () {
  return request.request({
    url: '/api/cashier/qr/info',
    method: 'POST',
    data: { wayCode: wayCode.getPayWay().wayCode, qrCode: config.cacheToken } 
  })
}

/** 获取url **/
export function getChannelUserId (redirectData) {
  return request.request({
    url: '/api/cashier/channelUserId',
    method: 'POST',
    data: Object.assign({ wayCode: wayCode.getPayWay().wayCode, token: config.cacheToken }, redirectData)
  })
}

/** 调起支付接口, 获取支付数据包 **/
export function getPayPackage (amount) {
  return request.request({
    url: '/api/cashier/pay',
    method: 'POST',
    data: {
      wayCode: wayCode.getPayWay().wayCode,
      token: config.cacheToken,
      amount: amount,
      channelUserId: channelUserIdUtil.getChannelUserId()
    }
  })
}

/** 调起支付接口, 获取支付数据包 **/
export function getQrPayPackage (qrCode, amount, remark) {
  return request.request({
    url: '/api/cashier/qr/pay',
    method: 'POST',
    data: {
      wayCode: wayCode.getPayWay().wayCode,
      qrCode: qrCode,
      amount: amount,
      remark: remark,
      channelUserId: channelUserIdUtil.getChannelUserId()
    }
  })
}

/** 调起支付接口, 获取订单信息 **/
export function getPayOrderInfo () {
  return request.request({
    url: '/api/cashier/payOrderInfo',
    method: 'POST',
    data: {
      token: config.cacheToken
    }
  })
}

/** 取消订单 **/
export function cancelPay () {
  return request.request({
    url: '/api/cashier/cancelPay',
    method: 'POST',
    data: {
      token: config.cacheToken
    }
  })
}
