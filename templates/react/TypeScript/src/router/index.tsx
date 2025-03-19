import React from 'react';

// 这是一个简单的路由示例，您可以根据需要使用 react-router-dom 等库进行扩展
interface Route {
  path: string;
  component: React.ComponentType;
  exact?: boolean;
}

// 在实际项目中，您应该导入这些组件
const Home = () => <div>首页</div>;
const About = () => <div>关于页面</div>;

const routes: Route[] = [
  {
    path: '/',
    component: Home,
    exact: true
  },
  {
    path: '/about',
    component: About
  }
];

export default routes; 