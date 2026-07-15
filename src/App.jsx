import { Suspense } from 'react';
import { RouterProvider } from 'react-router/dom';

import router from './router';

function PageLoader() {
  return (
    <div className='flex h-screen items-center justify-center bg-primary'>
      <div className='h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent' />
    </div>
  );
}

export function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
