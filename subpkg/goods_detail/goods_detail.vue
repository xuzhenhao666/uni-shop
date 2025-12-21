<template>
  <view>
  </view>
</template>

<script setup>
  import { onLoad, onShow, onReady } from '@dcloudio/uni-app'
  import { ref } from 'vue'
  const goodsId = ref()
  onLoad((options) => {
    // 接收参数
    goodsId.value = options.goods_id || ''
    if (options.goods_name) {
      goodsName.value = decodeURIComponent(options.goods_name)
    }
  })
</script>

<style lang="scss">

</style>