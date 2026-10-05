import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { createTheme, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import './styles.css';

const App = lazy(() => import('./App'));

const theme = createTheme({
  primaryColor: 'teal',
  defaultRadius: 'md',
  fontFamily: '"Pretendard", "Noto Sans KR", system-ui, sans-serif',
  headings: { fontFamily: 'inherit' },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
      <Suspense fallback={<div role="status" style={{ padding: 32 }}>불러오는 중 / Loading…</div>}><App /></Suspense>
    </MantineProvider>
  </React.StrictMode>,
);
