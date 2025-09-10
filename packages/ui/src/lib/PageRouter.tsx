import { Button, Card, Hero, MyImage } from "ui";
import GenericPage from "./pageTemplates/Generic";
import HomePage from "./pageTemplates/Home";
import InsightsPage from "./pageTemplates/Insights";
import PressReleasePage from "./pageTemplates/PressReleases";

export const PageRouter=(props:any)=>{
    console.log("propspppppp",props.config.data.template)

switch (props.config.data.template) {
  case "generic":
    return <GenericPage config={props.config} data={props.data} />;

  case "home":
    return <HomePage config={props.config} data={props.data} />;

  case "insights":
    return <InsightsPage config={props.config} data={props.data} />;

  case "pressrelease":
    return <PressReleasePage config={props.config} data={props.data} />;

  default:
    return <GenericPage config={props.config} data={props.data} />;
}

}
