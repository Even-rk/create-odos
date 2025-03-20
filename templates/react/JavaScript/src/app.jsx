import { useState } from 'react';
import './styles/app.css';

function App() {
  const [count, set_count] = useState(0);

  return (
    <div className="app">
      <h1>ODOS React App</h1>
      <div className="card">
        <button onClick={() => set_count((count) => count + 1)}>
          点击计数: {count}
        </button>
        <p>
          编辑 <code>src/app.jsx</code> 并保存以测试 HMR
        </p>
      </div>
    </div>
  );
}

export default App; 