import { $http } from '@escook/request-miniprogram'

$http.baseUrl='https://api-hmugo-web.itheima.net'

$http.beforeRequest = function (options) {
  uni.showLoading({
    title:'数据加载中',
  })
}

$http.afterRequest = function(){
  uni.hideLoading()
}

export default $http