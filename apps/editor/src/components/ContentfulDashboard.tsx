import { getEntriesByContentType } from '../lib/contentful';
import React, { useState, useEffect } from 'react';
import { Card, Carousel, ComponentsRouter, Form, Hero, MyImage, PageRouter } from 'ui';

// Types
type PageConfig = {
  id: string;
  internalName: string;
  type: string;
  data: {
    [key: string]: any;
  };
};
type ComponentData = {
  type: string; // "Hero", "Card", etc.
  data?: Record<string, any>;
  config?: {
    [key: string]: any;
  };
};
type PageData = {
  internalName: string;
  type: string;
  configId: string;
  data: ComponentData[];
};

type Item = {
  config: PageConfig;
  data: PageData;
};

const ContentfulDashboard: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const selectItem = (id: string) => {
    setSelectedTemplate(id);
    const found = items.find(t => t.config.id === id);
    setSelectedItem(found ?? null);
  };

  useEffect(() => {
    async function fetchData() {
      const configEntries = await getEntriesByContentType('configuartions');
      const dataEntries = await getEntriesByContentType('data');

      const configMap = new Map(
        configEntries.map((entry: any) => [entry.sys.id, entry])
      );

      const mergedPages: Item[] = dataEntries.map((dataEntry: any) => {
        const configId = dataEntry.fields?.configId;
        const config = configMap.get(configId);

        return {
          config: {
            id: configId,
            internalName: config?.fields?.internalName,
            type: config?.fields?.type,
            data: config?.fields?.data ?? {},
          },
          data: {
            internalName: dataEntry?.fields?.internalName,
            type: dataEntry.fields?.type,
            configId,
            data: dataEntry.fields?.data ?? [],
          },
        };
      });

      setItems(mergedPages);
    }

    fetchData();
  }, []);

  return (
    <div style={{ padding: '20px', display: 'flex', gap: '20px', height: '100vh' }}>
      {/* Sidebar */}
      <div style={{ width: '250px', border: '1px solid #ccc', padding: '10px', borderRadius: '4px' }}>
        <h3>Existing content types</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => selectItem(item.config.id)}
              style={{
                padding: '8px',
                backgroundColor: selectedTemplate === item.config.id ? '#007bff' : '#f8f9fa',
                color: selectedTemplate === item.config.id ? 'white' : 'black',
                border: '1px solid #ccc',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {item.data.internalName}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ flex: 1, border: '1px solid #ccc', padding: '10px', borderRadius: '4px' }}>
          <h2>Live Preview</h2>
          <div
            style={{
              minHeight: '500px',
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              position: 'relative',
              boxShadow: '0 0 20px rgba(0,0,0,0.1)',
              overflow: 'hidden'
            }}
          >
            <div style={{ padding: '20px', minHeight: '400px' }}>
              {selectedItem ? (
                selectedItem.config.type === 'Page' ? (
                  <PageRouter
                    key={selectedItem.config.id}
                    config={selectedItem.config}
                    data={selectedItem.data}
                  />
                ) : (
                  <ComponentsRouter
                    key={selectedItem.config.id}
                    config={selectedItem.config}
                    data={selectedItem.data.data}
                  />
                )
              ) : (
                <p style={{ color: '#999' }}>Select a template to preview</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentfulDashboard;
