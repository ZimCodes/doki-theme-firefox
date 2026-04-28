import React from "react";
import { ThemeContextContentScript } from "../../common/DokiThemeProviderContentScript";
import { ThemeStuff } from "../../common/ThemeTools";
import SearchWidget from "./SearchWidget";
import { FeatureContextContentScript, PluginFeatureContext } from "../../common/FeatureProviderContentScript";
import { DokiThemeContext } from "../../common/DokiThemeProvider";

const Tab = () => {
  const dokiThemeCtx: DokiThemeContext = React.useContext(ThemeContextContentScript);
  const pluginFeatCtx:PluginFeatureContext = React.useContext(FeatureContextContentScript);
  let context = <></>;
  let styles ={
    color: dokiThemeCtx.theme.colors.foregroundColor,
    width: "100%",
    height: "100%",
  };
  if (!pluginFeatCtx.features.isDiscreet) {
    let cssStyles ={
      backgroundSize: "cover",
      backgroundPosition: dokiThemeCtx.theme.content.anchor,
      backgroundImage: `url(${browser.runtime.getURL(
        "backgrounds/" + dokiThemeCtx.theme.content.name
      )})`,
    };
   styles = Object.assign(styles,cssStyles) ;
  }
  if (dokiThemeCtx.isInitialized) {
    context = (
      <>
        <ThemeStuff theme={dokiThemeCtx.theme}></ThemeStuff>
        <div style={styles}>
          {pluginFeatCtx.isInitialized && pluginFeatCtx.features.showWidget && (
            <SearchWidget theme={dokiThemeCtx.theme}  isDiscreet={pluginFeatCtx.features.isDiscreet} />
          )}
        </div>
      </>
    );
  }
  return context;
};

export default Tab;
