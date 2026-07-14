/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react';
import { createBrowserRouter } from 'react-router';
import Layout from '@/components/layout';

const HomePage = lazy(() => import('@/app/page'));
const DesignPage = lazy(() => import('@/app/design/page'));
const CheckoutPage = lazy(() => import('@/app/checkout/page'));
const PaymentPage = lazy(() => import('@/app/[publicId]/payment/page'));
const FinishPage = lazy(() => import('@/app/[publicId]/finish/page'));

const router = createBrowserRouter([
  {
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: 'design', Component: DesignPage },
      { path: 'checkout', Component: CheckoutPage },
      { path: ':publicId/payment', Component: PaymentPage },
      { path: ':publicId/finish', Component: FinishPage },
    ],
  },
]);

export default router;
