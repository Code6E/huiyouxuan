// 对API进行统一地管理
import requests from "./request";
// 定义并暴露 请求CategoryList（分类列表）的函数。因为axios是返回Promise，二次封装axios时没有改变这一返回类型，所以requests仍返回Promise。所以reqCategoryList是返回值为Promise的函数
// baseURL已经写了api，这里url就不需要再写了
// 默认是GET请求
export const reqCategoryList = () => requests({ url: '/product/getBaseCategoryList', method: 'GET' })

import mockRequests from './mockRequest'
// baseURL已经写了mock，这里url就不需要再写了
// 默认是GET请求
// 获取Banner组件数据的请求
export const reqBannerList = () => mockRequests({ url: '/banner', method: 'GET' })
// 获取Floor组件的数据请求
export const reqFloorList = () => mockRequests({ url: '/floor', method: 'GET' })
// 搜索数据请求
export const reqSearchList= (params) => requests({ url: '/list', method: 'POST' ,data:params})
// 获取商品数据请求
export const reqGoodsInfo= (skuId) => requests({ url: `/item/${skuId}`, method: 'GET'})
// 添加购物车请求
// 该请求只是修改服务器上的数据，服务器返回的响应体数据为空
// 不同的用户有自己的购物车，可以用uuid给用户添加唯一的标识，但是添加购物车的请求reqAddShopcart只能带skuId,skuNum这2个参数，所以将用户标识添加到请求头中
export const reqAddShopcart= (skuId,skuNum) => requests({ url: `/cart/addToCart/${skuId}/${skuNum}`, method: 'POST'})
// 获取购物车数据请求
export const reqShopcart= () => requests({ url: '/cart/cartList', method: 'GET'})
// 删除购物车中的商品的请求
export const reqDeleteShopcart= (skuId) => requests({ url: `/cart/deleteCart/${skuId}`, method: 'DELETE'})
// 修改购物车商品的勾选状态
export const updateIsChecked= (skuId,isChecked) => requests({ url: `/cart/checkCart/${skuId}/${isChecked}`, method: 'GET'})
// 获取验证码
export const reqCode= (phone) => requests({ url: `/user/passport/sendCode/${phone}`, method: 'GET'})
// 注册，注意这里的参数是以配置项data形式发送的，而不是之前那种将参数放到请求地址中
// data是axios中的请求体配置项，这里键值名一样就简写了
export const reqRegister= (data) => requests({ url: `/user/passport/register`, data,method: 'POST'})
// 登录
export const reqLogin= (data) => requests({ url: `/user/passport/login`, data,method: 'POST'})
// 请求用户信息，因为token没有以请求参数的形式，所以就将token放到请求头中了
export const getUserInfo= () => requests({ url: `/user/passport/auth/getUserInfo`, method: 'GET'})
// 退出登录
export const reqLogout= () => requests({ url: `/user/passport/logout`, method: 'GET'})

//获取用户地址信息
export const reqAddressInfo = ()=>requests({url:`/user/userAddress/auth/findUserAddressList`,method:'GET'});

//获取交易数据
export const reqOrderInfo = ()=>requests({url:`/order/auth/trade`,method:'GET'});

//提交订单
export const submitOrder = (tradeNo,data)=>requests({url:`/order/auth/submitOrder?tradeNo=${tradeNo}`,method:'POST',data});

//获取订单支付信息
export const reqOrderPayInfo = (orderId)=>requests({url:`/payment/weixin/createNative/${orderId}`,method:'GET'});

//获取支付状态（是否成功支付）
export const reqPayStatus = (orderId)=>requests({url:`/payment/weixin/queryPayStatus/${orderId}`,method:'GET'});

// 获取我的订单列表
export const reqMyOrderList = (page,limit)=>requests({url:`/order/auth/${page}/${limit}`,method:'GET'});

