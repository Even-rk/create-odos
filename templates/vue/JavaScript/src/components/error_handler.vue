<template>
  <slot v-if="!has_error" />
  <div v-else class="error-container">
    <h2>出错了！</h2>
    <p>{{ error_message }}</p>
    <button @click="reset">重试</button>
  </div>
</template>

<script>
export default {
  name: 'ErrorHandler',
  data() {
    return {
      has_error: false,
      error_message: '发生了未知错误'
    };
  },
  methods: {
    reset() {
      this.has_error = false;
      this.error_message = '发生了未知错误';
    }
  },
  errorCaptured(err) {
    this.has_error = true;
    this.error_message = err ? err.message : '发生了未知错误';
    
    // 记录错误
    console.error('Vue 错误处理:', err);
    
    // 阻止错误继续向上传播
    return false;
  }
}
</script>

<style scoped>
.error-container {
  margin: 20px;
  padding: 20px;
  border: 1px solid #f56c6c;
  border-radius: 4px;
  background-color: #fef0f0;
  color: #f56c6c;
  text-align: center;
}

button {
  margin-top: 15px;
  padding: 8px 16px;
  background-color: #f56c6c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #e64a4a;
}
</style> 