import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './styles/heroOpener.css';
import './styles/forms.css';
import './styles/navigation.css';
import './styles/etiquette.css';
import './styles/details.css';
import './styles/photos.css';
import './styles/uploadcare.css';
import './styles/section.css';
import './styles/saveTheDateIntro.css';
import './styles/rsvpIntro.css';
import App from './App.tsx';
import { initHeroOpener } from './heroOpener';

const SPA_REDIRECT_KEY = 'spa:redirect-path';

try {
  const pendingPath = sessionStorage.getItem(SPA_REDIRECT_KEY);
  if (pendingPath) {
    sessionStorage.removeItem(SPA_REDIRECT_KEY);
    if (
      pendingPath !==
      `${window.location.pathname}${window.location.search}${window.location.hash}`
    ) {
      window.history.replaceState({}, '', pendingPath);
    }
  }
} catch (error) {
  console.error('Unable to restore SPA redirect path', error);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
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
