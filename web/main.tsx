import React from 'react';
import ReactDOM from 'react-dom/client';
import { createTheme, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import App from './App';
import './styles.css';

const theme = createTheme({
  primaryColor: 'teal',
  defaultRadius: 'md',
  fontFamily: '"Pretendard", "Noto Sans KR", system-ui, sans-serif',
  headings: { fontFamily: 'inherit' },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
      <App />
    </MantineProvider>
  </React.StrictMode>,
);
