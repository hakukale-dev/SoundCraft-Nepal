import ReactDOM from 'react-dom/client';
import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import App from './App';

// ----------------------------------------------------------------------

const root = ReactDOM.createRoot( document.getElementById( 'root' ) );

root.render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter basename="/">
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);
