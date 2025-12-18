<script setup>
  import {
    ref
  } from 'vue';

  const swiperList = ref([])
  const navList = ref([])
  const floorList = ref([])

  const getSwiperList = async () => {
    const res = await uni.$http.get('/api/public/v1/home/swiperdata')
    swiperList.value = res.data.message
  }

  const getNavList = async () => {
    const res = await uni.$http.get('/api/public/v1/home/catitems')
    navList.value = res.data.message
  }

  const getFloorList = async () => {
    const res = await uni.$http.get('/api/public/v1/home/floordata')
    res.data.message.forEach(floor => {
    floor.product_list.forEach(prod => {
      prod.url = '/subpkg/goods_list/goods_list?' + prod.navigator_url.split('?')[1]
    })
  })
    floorList.value = res.data.message
  }

  const loadDataSequentially = async () => {
    try {
      await getSwiperList()
      await getNavList() // 等轮播图加载完再加载导航
      await getFloorList()
    } catch (error) {
      uni.showToast({
        title: '加载失败'
      })
    }
  }

  const navClickHandler = (item) => {
    if (item.name === '分类') {
      uni.switchTab({
        url: '/pages/cate/cate'
      })
    }
  }

  loadDataSequentially()
</script>

<template>
  <view>
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
      <swiper-item v-for="item in swiperList" :key="item.goods_id">
        <navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail'">
          <!-- 动态绑定图片的 src 属性 -->
          <image :src="item.image_src"></image>
        </navigator>
      </swiper-item>
    </swiper>

    <view class="nav-list">
      <view class="nav-item" v-for="(item,i) in navList" :key="i" @click="navClickHandler(item)">
        <image :src="item.image_src" class="nav-img"></image>
      </view>
    </view>

    <!-- 楼层区域 -->
    <view class="floor-list">
      <!-- 楼层 item 项 -->
      <view class="floor-item" v-for="(item, i) in floorList" :key="i">
        <!-- 楼层标题 -->
        <image :src="item.floor_title.image_src" class="floor-title"></image>
        <!-- 楼层图片区域 -->
        <view class="floor-img-box">
          <navigator class="left-img-box" :url="item.product_list[0].url">
            <image :src="item.product_list[0].image_src" :style="{width: item.product_list[0].image_width + 'rpx'}"
              mode="widthFix"></image>
          </navigator>
          <!-- 右侧 4 个小图片的盒子 -->
          <view class="right-img-box">
            <navigator class="right-img-item" v-for="(item2, i2) in item.product_list.slice(1)" :key="i2"
              :url="item2.url">
              <image :src="item2.image_src" mode="widthFix" :style="{width: item2.image_width + 'rpx'}"></image>
            </navigator>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss">
  swiper {
    height: 330rpx;

    .swiper-item,
    image {
      width: 100%;
      height: 100%;
    }
  }

  .nav-list {
    display: flex;
    justify-content: space-around;
    margin: 15px 0;

    .nav-img {
      width: 128rpx;
      height: 140rpx;
    }
  }

  .floor-title {
    height: 60rpx;
    width: 100%;
    display: flex;
  }

  .right-img-box {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }

  .floor-img-box {
    display: flex;
    padding-left: 10rpx;
  }
</style>