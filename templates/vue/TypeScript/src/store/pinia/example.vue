<template>
  <div class="pinia-example">
    <h2>Pinia Store Example</h2>
    <div class="counter">
      <button @click="store.decrement">-</button>
      <span>{{ store.count }}</span>
      <button @click="store.increment">+</button>
    </div>
    <p>Double count: {{ store.double_count }}</p>
  </div>
</template>

<script setup lang="ts">
import { use_counter_store } from './index';

const store = use_counter_store();
</script>

<style scoped>
.pinia-example {
  padding: 20px;
  margin: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.counter {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 20px 0;
}

button {
  padding: 8px 16px;
  font-size: 18px;
  cursor: pointer;
}

span {
  font-size: 24px;
  min-width: 40px;
  text-align: center;
}
</style> 