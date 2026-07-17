/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react';
import { createBrowserRouter } from 'react-router';
import Layout from '@/components/Layout';
import ProfileLayout from '@/components/ProfileLayout';

const HomePage = lazy(() => import('@/app/page'));
const CartPage = lazy(() => import('@/app/gio-hang/page'));
const DesignPage = lazy(() => import('@/app/thiet-ke/page'));
const CheckoutPage = lazy(() => import('@/app/tao-don-hang/page'));
const PaymentPage = lazy(() => import('@/app/[publicId]/thanh-toan/page'));
const FinishPage = lazy(() => import('@/app/[publicId]/hoan-tat/page'));
const LoginPage = lazy(() => import('@/app/dang-nhap/page'));
const RegisterPage = lazy(() => import('@/app/dang-ky/page'));
const ProfilePage = lazy(() => import('@/app/ho-so/page'));
const OAuthCallbackPage = lazy(() => import('@/app/oauth2/callback/page'));
const OrderListPage = lazy(() => import('@/app/don-hang/page'));
const OrderDetailPage = lazy(() => import('@/app/don-hang/[publicId]/page'));

const router = createBrowserRouter([
  {
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: 'gio-hang', Component: CartPage },
      { path: 'thiet-ke', Component: DesignPage },
      { path: 'tao-don-hang', Component: CheckoutPage },
      { path: ':publicId/thanh-toan', Component: PaymentPage },
      { path: ':publicId/hoan-tat', Component: FinishPage },
      { path: 'dang-nhap', Component: LoginPage },
      { path: 'dang-ky', Component: RegisterPage },
      {
        Component: ProfileLayout,
        children: [
          { path: 'ho-so', Component: ProfilePage },
          { path: 'don-hang', Component: OrderListPage },
          { path: 'don-hang/:publicId', Component: OrderDetailPage },
        ],
      },
      { path: 'oauth2/callback', Component: OAuthCallbackPage },
    ],
  },
]);

export default router;
