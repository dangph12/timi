import { createBrowserRouter } from 'react-router';

import HomePage from '@/app/page';
import DesignPage from '@/app/design/page';
import CheckoutPage from '@/app/checkout/page';
import PaymentPage from '@/app/payment/page';

const router = createBrowserRouter([
  {
    path: '/',
    Component: HomePage
  },
  {
    path: '/design',
    Component: DesignPage
  },
  {
    path: '/checkout',
    Component: CheckoutPage
  },
  {
    path: '/payment',
    Component: PaymentPage
  }
]);

export default router;
