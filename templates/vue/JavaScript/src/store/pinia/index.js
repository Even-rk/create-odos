import { defineStore } from 'pinia';

export const use_counter_store = defineStore('counter', {
  state: () => ({
    count: 0
  }),
  getters: {
    double_count: (state) => state.count * 2
  },
  actions: {
    increment() {
      this.count++;
    },
    decrement() {
      this.count--;
    }
  }
}); 