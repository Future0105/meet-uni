<template>
  <!--撑开站位方便下面布局 -->
  <view class="fill" :style="{ height: getNavBarHeight() + 'px' }"></view>
</template>

<script setup>
import { getNavBarHeight } from '@/utils/system.js'
</script>

<style lang="scss" scoped></style>
