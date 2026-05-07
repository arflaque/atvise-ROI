import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './styles/globals.css';
import './lib/i18n';
import App from './App';

// SPA redirect — pick up the path that 404.html stashed in `?p=...`
// (only relevant on first load when GH Pages serves 404.html for a deep link).
(function restoreSpaPath() {
  const search = window.location.search;
  if (search.indexOf('?p=') !== -1 || search.indexOf('&p=') !== -1) {
    const params: Record<string, string> = {};
    search
      .slice(1)
      .split('&')
      .forEach((kv) => {
        const [k, v = ''] = kv.split('=');
        params[k] = v;
      });
    if (params.p !== undefined) {
      const path = params.p.replace(/~and~/g, '&');
      const query = params.q ? '?' + params.q.replace(/~and~/g, '&') : '';
      window.history.replaceState(null, '', path + query + window.location.hash);
    }
  }
})();

const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </StrictMode>
);
