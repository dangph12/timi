import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import App from './App.jsx';

import { ThemeProvider } from '@/components/theme-provider';
import AuthInitializer from '@/components/auth-initializer';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <AuthInitializer>
          <App />
        </AuthInitializer>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
