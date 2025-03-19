import { createBrowserRouter } from 'react-router-dom';
import App from '../app.jsx';
import Home from '../pages/home/index.jsx';
import About from '../pages/about/index.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/about',
        element: <About />
      }
    ]
  }
]);

export default router; 