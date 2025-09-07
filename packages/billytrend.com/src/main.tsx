import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
// Self-hosted variable fonts to avoid Google Fonts CSS payload
import '@fontsource-variable/plus-jakarta-sans/index.css';
import '@fontsource-variable/space-grotesk/index.css';
import '@fontsource-variable/jetbrains-mono/index.css';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
