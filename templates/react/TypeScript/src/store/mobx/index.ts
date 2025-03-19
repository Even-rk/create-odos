import { makeAutoObservable } from 'mobx';

class CounterStore {
  value = 0;

  constructor() {
    makeAutoObservable(this);
  }

  increment() {
    this.value += 1;
  }

  decrement() {
    this.value -= 1;
  }
}

export const counter_store = new CounterStore(); 