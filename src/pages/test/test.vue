<template>
  <view>
    <!-- 数据列表展示 -->
    <view v-for="item in paginatedData" :key="item.teacherId">
      {{ item.name }}
    </view>

    <!-- 分页器 -->
    <view class="uni-pagination-box">
      <uni-pagination show-icon :page-size="pageSize" :current="pageCurrent" :total="total" @change="change" />
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'

// 模拟20条数据
const data = ref([
  { teacherId: 0, name: '谢民警' },
  { teacherId: 1, name: '张民警' },
  { teacherId: 2, name: '李民警' },
  { teacherId: 3, name: '王民警' },
  { teacherId: 4, name: '黄民警' },
  { teacherId: 5, name: '熊民警' },
  { teacherId: 6, name: '陈民警' },
  { teacherId: 7, name: '范民警' },
  { teacherId: 8, name: '龙民警' },
  { teacherId: 9, name: '熊民警' },
  { teacherId: 10, name: '陈民警' },
  { teacherId: 11, name: '范民警' },
  { teacherId: 12, name: '龙民警' }
])

// 分页相关的设置
const pageSize = ref(5) // 每页显示条数
const pageCurrent = ref(1) // 当前页码

// 总数据条数
const total = computed(() => data.value.length)

// 根据当前页码和每页条数计算当前页显示的数据
const paginatedData = computed(() => {
  const start = (pageCurrent.value - 1) * pageSize.value
  return data.value.slice(start, start + pageSize.value)
})

// 页码改变时的处理函数
const change = newPage => {
  pageCurrent.value = newPage.current
  console.log('newPage:', newPage.current)
}
</script>

<style lang="scss" scoped>
.uni-pagination-box {
  margin-top: 20px;
}
</style>
