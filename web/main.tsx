import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { createTheme, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import './styles.css';
import Landing from './Landing';

const App = lazy(() => import('./App'));

function LoadingScreen() {
  return (
    <main className="studio-loading" aria-label="이젠 아무래도 좋을 알고리즘">
      <div className="loading-content">
        <div className="brand loading-brand">
          <svg width="32" height="32" viewBox="0 0 64 64" aria-hidden="true">
            <rect width="64" height="64" rx="16" fill="#196d53" />
            <g fill="#e5f2e9">
              <rect x="14" y="33" width="9" height="17" rx="2" />
              <rect x="28" y="24" width="9" height="26" rx="2" />
              <rect x="42" y="14" width="9" height="36" rx="2" />
            </g>
            <circle cx="18.5" cy="24" r="4.5" fill="#efbd77" />
          </svg>
          {new URLSearchParams(location.search).get('lang') === 'en' ? 'Algorithms, for what it’s worth' : '이젠 아무래도 좋을 알고리즘'}
        </div>
        <svg className="loading-array" viewBox="0 0 264 144" fill="none" aria-hidden="true">
          <path d="M8 128H256" stroke="#c9d2cc" strokeDasharray="3 4" />
          <g fill="#afc5b5">
            <rect x="16" y="48" width="28" height="80" rx="5" />
            <rect x="56" y="96" width="28" height="32" rx="5" />
            <rect x="96" y="64" width="28" height="64" rx="5" />
            <rect x="136" y="112" width="28" height="16" rx="5" />
            <rect x="176" y="80" width="28" height="48" rx="5" />
            <rect x="216" y="32" width="28" height="96" rx="5" />
          </g>
        </svg>
        <div className="loading-status" role="status" aria-live="polite">
          <p>불러오는 중<span className="loading-ellipsis" aria-hidden="true">…</span></p>
          <span lang="en">Loading…</span>
        </div>
      </div>
    </main>
  );
}

const theme = createTheme({
  primaryColor: 'teal',
  defaultRadius: 'md',
  fontFamily: '"Pretendard", "Noto Sans KR", system-ui, sans-serif',
  headings: { fontFamily: 'inherit' },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
      <Suspense fallback={<LoadingScreen />}>{new URLSearchParams(location.search).has('lesson') ? <App /> : <Landing />}</Suspense>
    </MantineProvider>
  </React.StrictMode>,
);
