import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { createTheme, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import './styles.css';
import Landing from './Landing';
import LoadingScreen from './LoadingScreen';

const App = lazy(() => import('./App'));

const theme = createTheme({
  primaryColor: 'teal',
  defaultRadius: 'md',
  fontFamily: '"Pretendard", "Noto Sans KR", system-ui, sans-serif',
  headings: { fontFamily: 'inherit' },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider theme={theme} forceColorScheme="dark">
      <Suspense fallback={<LoadingScreen />}>{new URLSearchParams(location.search).has('lesson') ? <App /> : <Landing />}</Suspense>
    </MantineProvider>
  </React.StrictMode>,
);
