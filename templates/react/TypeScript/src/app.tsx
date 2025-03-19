import { useState } from 'react';
import './styles/app.css';

function App() {
  const [count, set_count] = useState<number>(0);

  return (
    <div className="app">
      <h1>ODOS React TypeScript App</h1>
      <div className="card">
        <button onClick={() => set_count((count) => count + 1)}>
          点击计数: {count}
        </button>
        <p>
          编辑 <code>src/app.tsx</code> 并保存以测试 HMR
        </p>
      </div>
      <p className="read-the-docs">
        点击 ODOS 图标了解更多
      </p>
    </div>
  );
}

export default App; 