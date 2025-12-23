<script setup>
  import {
    onLoad,
    onShow,
    onReady
  } from '@dcloudio/uni-app'
  import {
    ref
  } from 'vue'

  const options = [{
    icon: 'shop',
    text: '店铺'
  }, {
    icon: 'cart',
    text: '购物车',
    info: 2
  }]

  const buttonGroup = [{
      text: '加入购物车',
      backgroundColor: '#ff0000',
      color: '#fff'
    },
    {
      text: '立即购买',
      backgroundColor: '#ffa200',
      color: '#fff'
    }
  ]

  const goodsId = ref()
  const goodsInfo = ref({
    pics: []
  })
  onLoad((options) => {
    goodsId.value = options.goods_id
    getGoodsDetail(goodsId.value)
  })

  const getGoodsDetail = async (goods_id) => {
    const res = await uni.$http.get('/api/public/v1/goods/detail', {
      goods_id
    })
    if (res.data.meta.status != 200) return uni.$showMsg()

    // 1. 先处理 goods_introduce
    const processedGoodsIntroduce = res.data.message.goods_introduce
      .replace(/<img /g, '<img style="display:block;" ')
      .replace(/webp/g, 'jpg')

    // 2. 将处理后的内容赋值给 goodsInfo
    goodsInfo.value = {
      ...res.data.message, // 展开原数据
      goods_introduce: processedGoodsIntroduce // 覆盖处理后的 goods_introduce
    }
  }

  const preview = (index) => {
    const urls = []
    goodsInfo.value.pics.forEach(item => {
      urls.push(item.pics_big)
    })
    uni.previewImage({
      current: index,
      urls
    })
  }

  const onClick = (e) => {
    // 为1时，点击进入购物车
    if (e.index) {
      console.log("进入购物车");
      uni.switchTab({
        url: '/pages/cart/cart'
      })
    } else {
      console.log("进入店铺");
    }
    // 为0，则进入店铺
  }

  const buttonClick = (e) => {
    // 为1时，点击进入购物车
    if (e.index) {
      console.log("立即购买");
    } else {
      console.log("加入购物车");
    }
  }
</script>

<template>
  <view class="container">
    <!-- 轮播图区域 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
      <swiper-item v-for="(item,index) in goodsInfo.pics" :key="index">
        <image :src="item.pics_big" @click="preview(index)"></image>
      </swiper-item>
    </swiper>
    <!-- 商品信息区域 -->
    <view class="goods-info-box">
      <view class="price">￥{{goodsInfo.goods_price}}</view>
      <view class="goods-info-body">
        <view class="goods-name">
          {{goodsInfo.goods_name}}
        </view>
        <view class="favi">
          <uni-icons type="star" size="18" color="gray"></uni-icons>
          <text>收藏</text>
        </view>
      </view>
      <view class="yf">
        快递:免运费
      </view>
    </view>
    <rich-text :nodes="goodsInfo.goods_introduce"></rich-text>
    <!-- 商品导航组件 -->

  </view>
  <view class="goods_nav">
    <!-- fill 控制右侧按钮的样式 -->
    <!-- options 左侧按钮的配置项 -->
    <!-- buttonGroup 右侧按钮的配置项 -->
    <!-- click 左侧按钮的点击事件处理函数 -->
    <!-- buttonClick 右侧按钮的点击事件处理函数 -->
    <uni-goods-nav :fill="true" :options="options" :buttonGroup="buttonGroup" @click="onClick"
      @buttonClick="buttonClick" />
  </view>

</template>


<style lang="scss">
  .container {
    position: relative;
    min-height: 100vh;
    /* 确保页面足够高 */
    padding-bottom: 100rpx;
    /* 给底部栏留出空间 */
  }

  swiper {
    height: 750rpx;

    image {
      width: 100%;
      height: 100%;
    }
  }

  uni-icons {
    margin-bottom: 0%;
  }

  .goods-info-box {
    padding: 10px;
    padding-right: 0;

    .price {
      color: #c00000;
      font-size: 18px;
      margin: 10px 0;
    }

    .goods-info-body {
      display: flex;
      justify-content: space-between;

      .goods-name {
        font-size: 13px;
        padding-right: 10px;
      }

      .favi {
        width: 120px;
        font-size: 12px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-left: 1px solid #808080;
        color: gray;
      }
    }

    .yf {
      margin: 10px 0;
      font-size: 12px;
      color: gray;
    }
  }



  .goods_nav {
    // 为商品导航组件添加固定定位
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
  }
</style>