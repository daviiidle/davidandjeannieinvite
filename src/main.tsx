import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './styles/heroOpener.css';
import App from './App.tsx';
import { LanguageProvider } from './context/LanguageContext.tsx';
import { initHeroOpener } from './heroOpener';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>,
);

const startHeroOpener = () => {
  initHeroOpener({
    rootSelector: '.hero-opener-root',
    nameSelector: '.hero-opener__names',
    dateSelector: '.hero-opener__date',
    dividerSelector: '.hero-opener__divider',
    backgroundSelector: '.hero-opener__background',
  });
};

if (document.readyState === 'complete') {
  startHeroOpener();
} else {
  window.addEventListener('load', startHeroOpener, { once: true });
}
