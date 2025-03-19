<template>
  <div class="home-page">
    <h1>欢迎使用 ODOS Vue3 TypeScript 模板</h1>
    <p>这是首页内容，您可以根据需要修改此页面。</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HomePage',
  setup() {
    return {}
  }
})
</script>

<style scoped>
.home-page {
  padding: 20px;
  text-align: center;
}

h1 {
  color: var(--primary-color);
}
</style> 