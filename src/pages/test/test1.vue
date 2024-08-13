<template>
  <view class="container">
    <view class="title">待 探 访 学 员</view>
    <view class="list">
      <uni-table ref="studentTable" border stripe emptyText="暂无待探访数据">
        <uni-tr style="height: 5.2083vw; /* 100px -> 5.2083vw */">
          <uni-th
            style="
              width: 15.625vw /* 300px -> 15.625vw */;
              font-size: 2.0833vw /* 40px -> 2.0833vw */;
              color: rgb(83, 114, 253);
            "
            align="center"
            >序号</uni-th
          >
          <uni-th
            style="
              width: 31.25vw /* 600px -> 31.25vw */;
              font-size: 2.0833vw /* 40px -> 2.0833vw */;
              color: rgb(83, 114, 253);
            "
            align="center"
            >学员姓名</uni-th
          >
          <uni-th
            style="
              width: 31.25vw /* 600px -> 31.25vw */;
              font-size: 2.0833vw /* 40px -> 2.0833vw */;
              color: rgb(83, 114, 253);
            "
            align="center"
            >家属姓名</uni-th
          >
        </uni-tr>
        <uni-tr v-for="(item, index) in dataList" key="index">
          <uni-td style="font-size: 1.5625vw /* 30px -> 1.5625vw */; font-weight: 500; color: black" align="center">{{
            item.num
          }}</uni-td>
          <uni-td style="font-size: 1.5625vw /* 30px -> 1.5625vw */; font-weight: 500; color: black" align="center">{{
            item.name
          }}</uni-td>
          <uni-td style="font-size: 1.5625vw /* 30px -> 1.5625vw */; font-weight: 500; color: black" align="center">
            <text
              style="padding: 0 0.5208vw; /* 10px -> .5208vw */ line-height: 1.5625vw; /* 30px -> 1.5625vw */"
              v-for="(family, index) in item.familyName"
              :key="index"
            >
              {{ family }}
            </text>
          </uni-td>
        </uni-tr>
      </uni-table>
    </view>
    <view class="img">
      <image :src="List" mode="aspectFit" />
    </view>
  </view>
</template>

<script setup>
import { onLoad, onUnload } from '@dcloudio/uni-app'
import { ref, nextTick } from 'vue'
const List = ref(null)
// 定义响应式数据
const dataList = ref([])
// 定义定时器变量
let timer = null
dataList.value = [
  {
    num: 12,
    id: 1001,
    name: '大毛',
    familyName: ['大毛毛']
  },
  {
    num: 13,
    id: 1002,
    name: '二毛',
    familyName: ['二毛毛', '二毛姐姐']
  },
  {
    num: 14,
    id: 1003,
    name: '三毛',
    familyName: ['三毛毛', '三毛父亲', '三毛母亲']
  },
  {
    num: 12,
    id: 1001,
    name: '熊大',
    familyName: ['熊大哥哥', '熊大姐姐', '熊大弟弟', '熊大妹妹']
  },
  {
    num: 13,
    id: 1002,
    name: '熊二',
    familyName: ['熊二父亲', '熊二母亲', '熊二哥哥', '熊二姐姐', '熊二弟弟', '熊二妹妹']
  },
  {
    num: 14,
    id: 1003,
    name: '张三',
    familyName: ['张一', '张二']
  },
  {
    num: 12,
    id: 1001,
    name: '李四',
    familyName: ['李五', '李六', '李七']
  },
  {
    num: 12,
    id: 1001,
    name: '大毛',
    familyName: ['大毛毛']
  },
  {
    num: 13,
    id: 1002,
    name: '二毛',
    familyName: ['二毛毛', '二毛姐姐']
  },
  {
    num: 14,
    id: 1003,
    name: '三毛',
    familyName: ['三毛毛', '三毛父亲', '三毛母亲']
  },
  {
    num: 12,
    id: 1001,
    name: '熊大',
    familyName: ['熊大哥哥', '熊大姐姐', '熊大弟弟', '熊大妹妹']
  },
  {
    num: 13,
    id: 1002,
    name: '熊二',
    familyName: ['熊二父亲', '熊二母亲', '熊二哥哥', '熊二姐姐', '熊二弟弟', '熊二妹妹']
  },
  {
    num: 14,
    id: 1003,
    name: '张三',
    familyName: ['张一', '张二']
  },
  {
    num: 12,
    id: 1001,
    name: '李四',
    familyName: ['李五', '李六', '李七']
  }
]
// 定义获取数据的方法
const getData = () => {
  uni.request({
    url: 'https://api.lolimi.cn/API/meinv/api.php', // 替换为实际的API地址
    success: res => {
      List.value = res.data.data.image
      console.log(List.value)
    },
    fail: err => {
      console.error(err)
    }
  })
  if (dataList.value.length > 0) {
    const firstItem = dataList.value.shift() // 移除第一项
    dataList.value.push(firstItem) // 添加到末尾
    console.log(111)
  }
}
// 页面加载时触发
onLoad(() => {
  // 首次请求数据
  getData()
  // 设置定时器，每隔5秒请求一次数据
  timer = setInterval(getData, 5000)
})
// 页面卸载时触发
onUnload(() => {
  // 清除定时器
  if (timer) {
    clearInterval(timer)
    timer = null
  }
})
</script>

<style lang="scss" scoped>
.container {
  width: 100vw;
  height: 100vh;
  display: flex;
  background-color: rgb(255, 255, 255);
  flex-direction: column;
  align-items: center;
  .title {
    height: 13vh;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3.125vw /* 60px -> 3.125vw */;
    font-weight: 700;
    color: rgb(51, 89, 255);
  }
  .list {
    max-height: 83vh;
    // background-color: cadetblue;
    overflow: hidden;
    border-radius: 0.5208vw /* 10px -> .5208vw */;
    overflow: hidden;
    border: rgba(149, 189, 237, 0.5) 0.1042vw /* 2px -> .1042vw */ solid;
  }
  .img {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 999;
  }
}
</style>
