<template>
  <div class="about-page">
    <h1>关于页面</h1>
    <p>这是关于页面的内容</p>
    <router-link to="/">返回主页</router-link>
  </div>
</template>

<script setup>
import './style.css';
</script>

<style scoped>
.about-page {
  padding: 2rem;
  text-align: center;
}

.about-page a {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #646cff;
  color: white;
  border-radius: 4px;
  text-decoration: none;
}

.about-page a:hover {
  background-color: #535bf2;
}
</style> 