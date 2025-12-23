
// #ifndef VUE3
import Vue from 'vue'
import App from './App'
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
import http from '@/utils/http.js'
import { showMsg } from './utils/showMsg'


export function createApp() {
  uni.$http = http
  uni.$showMsg = showMsg()
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif