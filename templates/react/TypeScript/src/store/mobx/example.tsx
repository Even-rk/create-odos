import { observer } from 'mobx-react-lite';
import { counter_store } from './index';

export const MobxExample = observer(() => {
  return (
    <div className="mobx-example">
      <h2>MobX 示例</h2>
      <div className="counter">
        <button onClick={() => counter_store.decrement()}>-</button>
        <span>{counter_store.value}</span>
        <button onClick={() => counter_store.increment()}>+</button>
      </div>
    </div>
  );
}); 