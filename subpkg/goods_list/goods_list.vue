<template>
  <view class="goods-list">
    <view v-for="(goods, i) in goodsList" :key="i" @click="goToDetail(goods)">
      <my-goods :goods="goods"></my-goods>
    </view>
  </view>
</template>

<script setup>
  import {
    onLoad,onReachBottom,onPullDownRefresh
  } from '@dcloudio/uni-app'
  import {
    ref
  } from 'vue'
  const isLoading = ref(false)
  const queryObj = ref({
    // 查询关键词
    query: '',
    // 页码值
    pagenum: 1,
    // 每页显示多少条数据
    pagesize: 10
  })
  const goodsList = ref([])
  const total = ref(0)
  const getGoodsList = async (cb) => {
    isLoading.value = true
    const res = await uni.$http.get('/api/public/v1/goods/search', queryObj.value)
    isLoading.value = false
    cb && cb()
    const newgoodsList = [...res.data.message.goods]
    goodsList.value = [...goodsList.value, ...newgoodsList]
    total.value = res.data.message.total
  }
  onLoad((option) => {
    queryObj.value.query = option.query
    getGoodsList()
  })
  // onReachBottom 不需要导入，直接在 setup 中使用
  onReachBottom(() => {
    if(queryObj.value.pagenum*queryObj.value.pagesize>=total.value) return
    if(isLoading.value) return
    queryObj.value.pagenum++
    getGoodsList()
  })
  onPullDownRefresh(()=>{
    queryObj.value.pagenum = 1
    total.value = 0
    isLoading.value = false
    goodsList.value = []
    // 重新发送请求
    getGoodsList(()=>uni.stopPullDownRefresh())
  })
  
  const goToDetail = (item)=>{
    uni.navigateTo({
        url: '/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
      })
  }
</script>

<style lang="scss">

</style>