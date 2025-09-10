import { Button, Card, Hero, MyImage } from "ui";
import { PageRouter } from "./PageRouter";

export const ComponentsRouter=(props:any)=>{
  const { config, data } = props;
   
    console.log("Resolved component:", config, data,props);

switch (config.type) {
  case "Hero":
    return <Hero config={config} data={data} />;

  case "Card":
    return <Card config={config} data={data}  />;

  case "Image":
    return <MyImage config={config} data={data}  />;

  case "Button":
    return <Button config={config} data={data}  />;
  default:
    return <div>Unknown component: {config.type}</div>;
}

}
