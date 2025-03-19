import { createStore } from 'vuex';

interface State {
  count: number;
}

export default createStore<State>({
  state: {
    count: 0
  },
  mutations: {
    increment(state) {
      state.count++;
    },
    decrement(state) {
      state.count--;
    }
  },
  actions: {
    increment({ commit }) {
      commit('increment');
    },
    decrement({ commit }) {
      commit('decrement');
    }
  },
  getters: {
    double_count: (state) => state.count * 2
  }
}); 