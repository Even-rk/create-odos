<template>
  <div class="vuex-example">
    <h2>Vuex Store Example</h2>
    <div class="counter">
      <button @click="decrement">-</button>
      <span>{{ count }}</span>
      <button @click="increment">+</button>
    </div>
    <p>Double count: {{ double_count }}</p>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  name: 'VuexExample',
  computed: {
    ...mapState(['count']),
    ...mapGetters(['double_count'])
  },
  methods: {
    ...mapActions(['increment', 'decrement'])
  }
}
</script>

<style scoped>
.vuex-example {
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