import { Link } from 'react-router-dom';
import './style.css';

function Home() {
  return (
    <div className="home-page">
      <h1>主页</h1>
      <p>这是主页内容</p>
      <Link to="/about">前往关于页面</Link>
    </div>
  );
}

export default Home; 