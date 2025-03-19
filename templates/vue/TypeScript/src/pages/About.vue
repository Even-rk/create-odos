<template>
  <div class="about-page">
    <h1>关于我们</h1>
    <p>这是关于页面，您可以根据需要修改此页面内容。</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AboutPage',
  setup() {
    return {}
  }
})
</script>

<style scoped>
.about-page {
  padding: 20px;
  text-align: center;
}

h1 {
  color: var(--secondary-color);
}
</style> 