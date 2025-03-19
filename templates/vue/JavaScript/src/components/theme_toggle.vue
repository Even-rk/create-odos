<template>
  <button 
    class="theme-toggle" 
    @click="toggle_theme"
    :aria-label="`切换到 ${theme === 'light' ? '暗色' : '亮色'} 主题`"
  >
    {{ theme === 'light' ? '🌙' : '☀️' }}
  </button>
</template>

<script>
export default {
  name: 'ThemeToggle',
  data() {
    return {
      theme: 'light'
    };
  },
  methods: {
    toggle_theme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light';
    }
  },
  watch: {
    theme(new_theme) {
      // 设置 HTML 根元素的 data-theme 属性
      document.documentElement.setAttribute('data-theme', new_theme);
      
      // 保存用户选择到 localStorage
      localStorage.setItem('theme-preference', new_theme);
    }
  },
  mounted() {
    // 从 localStorage 中获取保存的主题
    const saved_theme = localStorage.getItem('theme-preference');
    if (saved_theme && (saved_theme === 'light' || saved_theme === 'dark')) {
      this.theme = saved_theme;
    } else {
      // 如果没有保存的主题，则使用系统主题
      const prefer_dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.theme = prefer_dark ? 'dark' : 'light';
    }
  }
}
</script>

<style scoped>
.theme-toggle {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #333;
  color: #fff;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.theme-toggle:hover {
  transform: scale(1.1);
}

:global([data-theme='dark']) {
  color-scheme: dark;
  --bg-color: #121212;
  --text-color: #f5f5f5;
  --primary-color: #bb86fc;
  --secondary-color: #03dac6;
  --error-color: #cf6679;
}

:global([data-theme='light']) {
  color-scheme: light;
  --bg-color: #ffffff;
  --text-color: #121212;
  --primary-color: #6200ee;
  --secondary-color: #03dac4;
  --error-color: #b00020;
}
</style> 