// pages/index.tsx
import React from "react";
import { ComponentsRouter } from "../ComponetRouter";
export default function GenericPage(props) {

  return (
    <main className="p-8 space-y-6">
      {props.data.data.data.map((comp,i) => {
          const [key, value] = Object.entries(comp)[0]; 
            console.log("pagegeggegg",value)

       return <ComponentsRouter key={i} {...value} />
})}
    </main>
  );
}
