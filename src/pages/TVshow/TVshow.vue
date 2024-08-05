<template>
  <div class="TVshow">TVshow</div>
</template>

<script setup>
import { onLoad } from '@dcloudio/uni-app'

onLoad(e => {
  if (e.page) {
    console.log('cunzaiu')
  } else {
    console.log('bucunzai ')
  }
})
</script>

<style lang="scss" scoped></style>
