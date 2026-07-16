/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react';
import { createBrowserRouter } from 'react-router';
import Layout from '@/components/layout';

const HomePage = lazy(() => import('@/app/page'));
const DesignPage = lazy(() => import('@/app/design/page'));
const CheckoutPage = lazy(() => import('@/app/checkout/page'));
const PaymentPage = lazy(() => import('@/app/[publicId]/payment/page'));
const FinishPage = lazy(() => import('@/app/[publicId]/finish/page'));
const LoginPage = lazy(() => import('@/app/dang-nhap/page'));
const RegisterPage = lazy(() => import('@/app/dang-ky/page'));
const ProfilePage = lazy(() => import('@/app/ho-so/page'));
const OAuthCallbackPage = lazy(() => import('@/app/oauth2/callback/page'));

const router = createBrowserRouter([
  {
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: 'design', Component: DesignPage },
      { path: 'checkout', Component: CheckoutPage },
      { path: ':publicId/payment', Component: PaymentPage },
      { path: ':publicId/finish', Component: FinishPage },
      { path: 'dang-nhap', Component: LoginPage },
      { path: 'dang-ky', Component: RegisterPage },
      { path: 'ho-so', Component: ProfilePage },
      { path: 'oauth2/callback', Component: OAuthCallbackPage },
    ],
  },
]);

export default router;
