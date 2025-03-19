<template>
  <div class="app">
    <h1>ODOS Vue TypeScript App</h1>
    <div class="card">
      <button @click="count++">
        点击计数: {{ count }}
      </button>
      <p>
        编辑 <code>src/app.vue</code> 并保存以测试 HMR
      </p>
    </div>
    <p class="read-the-docs">
      点击 ODOS 图标了解更多
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import './styles/app.css';

const count = ref<number>(0);
</script>

<style scoped>
.app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.card {
  padding: 2em;
}

.read-the-docs {
  color: #888;
}
</style> 