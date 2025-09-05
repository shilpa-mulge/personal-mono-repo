import React from 'react';
import { locations } from '@contentful/app-sdk';
import './index.css';
import { SidebarDemo } from 'ui';
import ContentfulDashboard from './components/ContentfulDashboard';

/* eslint-disable @typescript-eslint/no-explicit-any */
interface AppProps {
  sdk: any; // Contentful SDK - different types based on location
}
/* eslint-enable @typescript-eslint/no-explicit-any */

const App: React.FC<AppProps> = ({ sdk }) => {

  if (!sdk) {
    return <>
      <ContentfulDashboard />
    </>;
  }
  // Detect where app is running and render appropriate component
  if (sdk.location.is(locations.LOCATION_APP_CONFIG)) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">⚙️ App Configuration</h1>
        <p className="text-gray-600">
          Configure your custom Contentful editor settings here.
        </p>
        {/* Add configuration form here if needed */}
      </div>
    );
  }

  if (sdk.location.is(locations.LOCATION_ENTRY_EDITOR)) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">📝 Custom Entry Editor</h2>
        <p className="text-gray-600 mb-4">
          Entry ID: <code className="bg-gray-100 px-2 py-1 rounded">{sdk.entry.getSys().id}</code>
        </p>
        {/* Add custom entry editor components here */}
        <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
          <p className="text-yellow-800">
            Custom entry editor functionality can be implemented here.
          </p>
        </div>
      </div>
    );
  }

  if (sdk.location.is(locations.LOCATION_HOME)) {
    return <>
    <ContentfulDashboard/>
    </>;
  }

  // Default fallback
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🏠 Contentful Custom Editor</h1>
      <p className="text-gray-600">
        Welcome to your custom Contentful editor dashboard.
      </p>
      <div className="mt-6">
         <h2> This is home</h2>;
      </div>
    </div>
  );
};

export default App;