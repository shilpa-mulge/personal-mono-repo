// pages/index.tsx
import React from "react";
import { ComponentsRouter } from "../ComponetRouter";
export default function InsightsPage(props) {

  return (
    <main className="p-8 space-y-6">
      {props.map((comp) => (
        <ComponentsRouter key={comp.config.id} {...comp} />
      ))}
    </main>
  );
}
