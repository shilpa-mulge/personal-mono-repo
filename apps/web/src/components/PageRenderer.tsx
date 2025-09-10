import React from "react";
import { getPageBySlug } from "../lib/contentful"; // adjust path as needed

// import your UI components from packages/ui
import { Hero, Card, Button, MyImage, ComponentsRouter, PageRouter } from "ui";


// Types
type PageConfig = {
  id: string;
  type: string;
  data: {
    [key: string]: any;
  };
};
type componentData = {
  type: string;          // "Hero", "Card", etc.
  data?: Record<string, any>; // the props for that component
};
type PageData = {
  id: string;
  type: string;
  configId: string;
  data:componentData[]
};

type Page = {
  config: PageConfig;
  data: PageData;
};



// Async server component (Next.js 13+/14) or just React.FC
export default async function PageRenderer({ slug }: { slug: string }) {
  const page: Page | undefined = await getPageBySlug(slug);

  if (!page) {
    return <div className="p-6 text-center text-white">Page not found</div>;
  }

  const { config, data } = page;
console.log("configconfigconfigconfigconfigconfig",config?.data,data.data)
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="p-6 border-b bg-white shadow">
        <h1 className="text-2xl font-bold">{config.data.title}</h1>
      </header>

      <main className="p-6 space-y-6">
        <PageRouter config={config} data={data} />
      </main>
    </div> 
  );
}
