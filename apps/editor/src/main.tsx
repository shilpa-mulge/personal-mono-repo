import React from 'react';
import ReactDOM from 'react-dom/client';
import { init } from "@contentful/app-sdk";
import App from './App';
import './index.css';


// Function to render App
function renderApp(sdk?: any) {
  const root = ReactDOM.createRoot(document.getElementById("root")!);
  root.render(
    <React.StrictMode>
      <App sdk={sdk} />
    </React.StrictMode>
  );
}

// Check if inside Contentful iframe
if (window.self !== window.top) {
  // Inside Contentful
  init((sdk) => {
    renderApp(sdk);
  });
} else {
  // Standalone mode
  renderApp(undefined); // or pass a mock SDK if App expects sdk
}