<template>
  <div class="home-page">
    <h1>主页</h1>
    <p>这是主页内容</p>
    <router-link to="/about">前往关于页面</router-link>
  </div>
</template>

<script setup>
import './style.css';
</script>

<style scoped>
.home-page {
  padding: 2rem;
  text-align: center;
}

.home-page a {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #646cff;
  color: white;
  border-radius: 4px;
  text-decoration: none;
}

.home-page a:hover {
  background-color: #535bf2;
}
</style> 