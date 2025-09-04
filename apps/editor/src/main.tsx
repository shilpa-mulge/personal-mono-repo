import React from 'react';
import ReactDOM from 'react-dom/client';
import { init } from '@contentful/app-sdk';
import App from './App';
import './index.css';

// Initialize the Contentful App SDK
init((sdk) => {
  const root = ReactDOM.createRoot(document.getElementById('root')!);

  root.render(
    <React.StrictMode>
      <App sdk={sdk} />
    </React.StrictMode>
  );
});
