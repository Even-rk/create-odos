import { use_app_dispatch, use_app_selector } from './hooks';
import { increment, decrement } from './index';
import './style.css';

export function ReduxExample() {
  const count = use_app_selector((state) => state.counter.value);
  const dispatch = use_app_dispatch();

  return (
    <div className="redux-example">
      <h2>Redux 示例</h2>
      <div className="counter">
        <button onClick={() => dispatch(decrement())}>-</button>
        <span>{count}</span>
        <button onClick={() => dispatch(increment())}>+</button>
      </div>
    </div>
  );
} 