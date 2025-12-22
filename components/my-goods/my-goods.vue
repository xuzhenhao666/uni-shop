<template>
  <view>
    <view class="goods-item">
      <!-- 商品左侧图片区域 -->
      <view class="goods-item-left">
        <image :onerror="`:src='${defaultPic}'`" :src="props.goods.goods_small_logo || defaultPic" class="goods-pic"></image>
      </view>
      <!-- 商品右侧信息区域 -->
      <view class="goods-item-right">
        <!-- 商品标题 -->
        <view class="goods-name">{{props.goods.goods_name}}</view>
        <view class="goods-info-box">
          <!-- 商品价格 -->
          <view class="goods-price">￥{{toFixed(props.goods.goods_price)}}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
  const defaultPic =
    'https://ts1.tc.mm.bing.net/th?id=OADD2.1236950624653355_1YL29U1OCS0GVZ0&pid=21.2&c=17&roil=0&roit=0.001&roir=1&roib=1&w=300&h=157&dynsize=1&qlt=90&dpr=2.00'
  const props = defineProps({
    goods: {
      type: Object,
    }
  })
  
  const toFixed=(num)=>{
    return Number(num).toFixed(2)
  }
</script>

<style lang="scss">
  .goods-item {
    display: flex;
    padding: 10px 5px;
    border-bottom: 1px solid #f0f0f0;

    .goods-item-left {
      margin-right: 5px;

      .goods-pic {
        width: 100px;
        height: 100px;
        display: block;
      }
    }

    .goods-item-right {
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .goods-name {
        font-size: 13px;
      }

      .goods-price {
        font-size: 16px;
        color: #c00000;
      }
    }
  }
</style>
