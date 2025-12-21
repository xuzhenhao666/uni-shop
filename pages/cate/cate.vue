<template>
  <view>
    <view class="search-box">
      <my-search></my-search>
    </view>

    <view class="scroll-view-container">
      <!-- 左侧的滚动视图区域 -->
      <scroll-view class="left-scroll-view" scroll-y :style="{height: windowHeight + 'px'}">
        <view class="left-scroll-view-item" :class="{active: index === active }" v-for="(item,index) in cateList"
          :key="item.cat_id" @click="activeChange(index)">{{item.cat_name}}</view>
      </scroll-view>
      <!-- 右侧的滚动视图区域 -->
      <scroll-view class="right-scroll-view" scroll-y :style="{height: windowHeight + 'px'}" :scroll-top="scrollTop">
        <view class="cate-lv2" v-for="item2 in cateLevel2" :key="item2.cat_id">
          <view class="cate-lv2-title">/ {{item2.cat_name}} /</view>
          <view class="cate-lv3-list">
            <navigator :url="`/subpkg/goods_list/goods_list?cid=${item3.cat_id}`" class="cate-lv3-item"
              v-for="item3 in item2.children" :key="item3.cat_id">
              <img :src="item3.cat_icon" alt="" />
              <text>{{item3.cat_name}}</text>
            </navigator>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup>
  import {
    onMounted,
    ref
  } from 'vue';

  const windowHeight = ref(500) // 默认值
  const systemInfo = uni.getSystemInfoSync()
  windowHeight.value = systemInfo.windowHeight

  const cateList = ref([])
  const cateLevel2 = ref([])
  const active = ref(0)
  const scrollTop = ref(0)


  const getCateList = async () => {
    const res = await uni.$http.get('/api/public/v1/categories')
    cateList.value = res.data.message
    cateLevel2.value = cateList.value[0].children
  }

  const activeChange = (id) => {
    active.value = id
    cateLevel2.value = cateList.value[id].children
    scrollTop.value = scrollTop ? 0 : 1
  }

  // onMounted(async () => {
  //   try {
  //     const systemInfo = await uni.getSystemInfoSync()
  //     windowHeight.value = systemInfo.windowHeight

  //     // 如果需要减去导航栏等高度，可以这样计算：
  //     // windowHeight.value = systemInfo.windowHeight - 50
  //   } catch (error) {
  //     console.log('获取系统信息失败，使用默认高度')
  //   }
  // })

  getCateList()
</script>

<style lang="scss" scoped>
  // 添加 scoped 防止样式冲突

  .scroll-view-container {
    display: flex;
    width: 100%;
    height: 100vh; // 确保容器占满屏幕

    // 左侧样式
    .left-scroll-view {
      width: 120px; // 固定宽度
      flex-shrink: 0; // 防止被压缩

      .left-scroll-view-item {
        line-height: 60px;
        background-color: #f7f7f7;
        text-align: center;
        font-size: 12px;
        border-bottom: 1px solid #e5e5e5;

        // 激活项的样式
        &.active {
          background-color: #ffffff;
          color: #c00000;
          font-weight: bold;
          position: relative;

          // 渲染激活项左侧的红色指示边线
          &::before {
            content: ' ';
            display: block;
            width: 3px;
            height: 30px;
            background-color: #c00000;
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
          }
        }
      }
    }

    // 右侧样式
    .right-scroll-view {
      flex: 1; // 占据剩余宽度
      min-width: 0; // 重要：防止内容溢出

      .cate-lv2-title {
        font-size: 12px;
        font-weight: bold;
        text-align: center;
        padding: 15px 0;
      }

      .cate-lv3-list {
        display: flex;
        flex-wrap: wrap;
        padding: 10px;
        background-color: #fff;

        .cate-lv3-item {
          width: 33.33%;
          padding: 15px 5px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;

          // 点击反馈
          &:active {
            background-color: #f8f8f8;
            border-radius: 8px;
          }

          image {
            width: 70px;
            height: 70px;
            margin-bottom: 8px;
            // 图片显示优化
            object-fit: cover;
            border-radius: 8px;

            // 如果图片需要铺满容器
            // width: 80%;
            // height: 0;
            // padding-bottom: 80%; // 保持正方形
          }

          text {
            font-size: 12px;
            color: #333;
            text-align: center;
            line-height: 1.4;
            // 文字超出显示省略号
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
          }
        }
      }
    }
  }

  .search-box {
    // 设置定位效果为“吸顶”
    position: sticky;
    // 吸顶的“位置”
    top: 0;
    // 提高层级，防止被轮播图覆盖
    z-index: 999;
  }
</style>