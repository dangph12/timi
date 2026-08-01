/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react';
import { createBrowserRouter } from 'react-router';

const HomePage = lazy(() => import('@/app/page'));
const DesignPage = lazy(() => import('@/app/design/page'));
const CheckoutPage = lazy(() => import('@/app/checkout/page'));
const PaymentPage = lazy(() => import('@/app/payment/page'));
const FinishPage = lazy(() => import('@/app/finish/page'));
const AboutUsPage = lazy(() => import('@/app/aboutus/page'));
const HowToBuyPage = lazy(() => import('@/app/howtobuy/page'));
const router = createBrowserRouter([
  {
    path: '/',
    Component: HomePage
  },
  {
    path: '/aboutus',
    Component: AboutUsPage
  },
  {
    path: '/howtobuy',
    Component: HowToBuyPage
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
  },
  {
    path: '/finish',
    Component: FinishPage
  },
 
]);

export default router;
