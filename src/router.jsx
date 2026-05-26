import { createBrowserRouter } from 'react-router';

import HomePage from '@/app/page';
import DesignPage from './app/design/page';

const router = createBrowserRouter([
  {
    path: '/',
    Component: HomePage
  },
  {
    path: '/design',
    Component: DesignPage
  }
]);

export default router;
