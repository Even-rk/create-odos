import { Link } from 'react-router-dom';
import './style.css';

function About() {
  return (
    <div className="about-page">
      <h1>关于页面</h1>
      <p>这是关于页面的内容</p>
      <Link to="/">返回主页</Link>
    </div>
  );
}

export default About; 