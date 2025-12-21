<template>
  <view class="search-box">
    <!-- 使用 uni-ui 提供的搜索组件 -->
    <uni-search-bar @input="input" @clear="handleClear" v-model="keyWords" class="search-box" :radius="100"
      cancelButton="none" :focus="true"></uni-search-bar>
    <!-- 搜索建议列表 -->
    <view class="sugg-list" v-if="searchResults && searchResults.length!==0">
      <navigator :url="`/subpkg/goods_detail/goods_detail?goods_id=${item.goods_id}`" class="sugg-item"
        v-for="(item, i) in searchResults" :key="i">
        <view class="goods-name">{{item.goods_name}}</view>
        <uni-icons type="arrowright" size="16"></uni-icons>
      </navigator>
    </view>
    <view class="history-box" v-else>
      <view class="history-title">
        <text>搜索历史</text>
        <uni-icons type="trash" size="17" @click="clearHistory"></uni-icons>
      </view>
      <view class="history-list">
        <uni-tag @click="goToGoodsList(item)" :text="item" v-for="(item, i) in historyList" :key="i"></uni-tag>
      </view>
    </view>

  </view>
</template>

<script setup>
  import {
    ref
  } from 'vue';

  // 延时器的 timerId
  const timer = ref()
  // 搜索关键词
  const keyWords = ref('')
  const searchResults = ref([])
  const historyList = ref(JSON.parse(uni.getStorageSync('keyWordsHistoryList') || '[]'))

  const getSearchList = async (keyWords_value) => {
    // 如果关键词为空，直接返回空数组
    if (!keyWords_value || keyWords_value.trim() === '') {
      searchResults.value = []
      return
    }
    saveSearchList(keyWords_value)
    const res = await uni.$http.get('/api/public/v1/goods/qsearch', {
      query: keyWords_value
    })
    searchResults.value = res.data.message
  }

  const input = () => {
    if (timer.value) {
      clearTimeout(timer.value)
    }
    // 设置新的3秒延时
    timer.value = setTimeout(() => {
      getSearchList(keyWords.value)
    }, 1000) // 3000毫秒 = 3秒
  }

  // 处理搜索框清空事件
  const handleClear = () => {
    // 清空关键词
    keyWords.value = ''
    // 清空搜索结果
    searchResults.value = []
    // 清除定时器
    if (timer.value) {
      clearTimeout(timer.value)
      timer.value = null
    }
  }

  const saveSearchList = (keyWords_value) => {
    // 过滤掉相同的值
    historyList.value = historyList.value.filter(item => item !== keyWords_value)
    // 将新值添加到数组开头
    historyList.value.unshift(keyWords_value)
    // 限制数量
    const MAX_HISTORY = 30
    if (historyList.value.length > MAX_HISTORY) {
      historyList.value = historyList.value.slice(0, MAX_HISTORY)
    }
    uni.setStorageSync('keyWordsHistoryList', JSON.stringify(historyList.value));
  }

  const clearHistory = () => {
    uni.setStorageSync('keyWordsHistoryList', '[]')
    historyList.value = []
  }

  const goToGoodsList = (keyWords_value) => {
    uni.navigateTo({
      url: '/subpkg/goods_list/goods_list?query=' + keyWords_value
    })
  }
</script>

<style lang="scss">
  :deep(.uni-searchbar) {
    background-color: #C00000;
  }

  .search-box {
    position: sticky;
    top: 0;
    z-index: 999;
  }

  .sugg-list {
    padding: 0 5px;

    .sugg-item {
      font-size: 12px;
      padding: 13px 0;
      border-bottom: 1px solid #efefef;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .goods-name {
        // 文字不允许换行（单行文本）
        white-space: nowrap;
        // 溢出部分隐藏
        overflow: hidden;
        // 文本溢出后，使用 ... 代替
        text-overflow: ellipsis;
        margin-right: 3px;
      }
    }
  }

  .history-box {
    padding: 0 5px;

    .history-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      font-size: 13px;
      border-bottom: 1px solid #efefef;
    }

    .history-list {
      display: flex;
      flex-wrap: wrap;

      .uni-tag {
        margin-top: 5px;
        margin-right: 5px;
      }
    }
  }
</style>