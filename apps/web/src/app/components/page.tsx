import { getAllConfigurations } from '@/lib/contentful';
import { ComponentListRenderer } from '@/components/DynamicComponentRenderer';

export default async function ComponentsPage() {
  let configurations = [];
  let error = null;

  try {
    const result = await getAllConfigurations({ limit: 20 });
    configurations = result.items;
  } catch (err) {
    error = err;
    console.error('Error fetching configurations:', err);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Dynamic Components</h1>
            <nav className="space-x-6">
              <a href="/" className="text-gray-600 hover:text-gray-900">Home</a>
              <a href="/components" className="text-blue-600 font-medium">Components</a>
              <a href="/about" className="text-gray-600 hover:text-gray-900">About</a>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Component Showcase
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Dynamic components built with Contentful configurations. 
            Each component is configured through the editor and rendered dynamically.
          </p>
        </div>

        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-medium text-red-800 mb-2">
              Unable to load components
            </h3>
            <p className="text-red-600">
              Please check your Contentful configuration and try again.
            </p>
          </div>
        ) : configurations.length > 0 ? (
          <ComponentListRenderer configurations={configurations} />
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No components configured
            </h3>
            <p className="text-gray-500 mb-4">
              Use the editor to create and configure dynamic components.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto">
              <h4 className="font-semibold text-blue-900 mb-2">Getting Started:</h4>
              <ol className="text-left text-blue-800 space-y-1">
                <li>1. Open the editor app at http://localhost:5173</li>
                <li>2. Switch to "Component Editor" mode</li>
                <li>3. Create components like Cards, Heroes, Banners, etc.</li>
                <li>4. Save your configurations to Contentful</li>
                <li>5. Refresh this page to see your components</li>
              </ol>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500">
            <p>&copy; 2024 Dynamic Components. Powered by Contentful.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}