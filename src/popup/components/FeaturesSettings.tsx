import React from "react";
import { DokiThemeContext, ThemeContext } from "../../common/DokiThemeProvider";
import { FeatureContext, PluginFeatureContext } from "../../common/FeatureProvider";
import ThemedSwitch from "./ThemedSwitch";
import { DiscreetModePayload, PluginEvent, PluginEventTypes } from "../../Events";

const FeaturesSettings = () => {
  const dokiThemeCtx:DokiThemeContext = React.useContext(ThemeContext);
  const pluginFeatCtx:PluginFeatureContext = React.useContext(FeatureContext);
  const handleWidgetChange = (isSet: boolean) => {
    pluginFeatCtx.setFeatures({
      ...pluginFeatCtx.features,
      showWidget: isSet,
    });
  };
  const handleSelectionInjection = (isSet: boolean) => {
    browser.permissions
      .request({
        permissions: ["tabs", "activeTab"],
        origins: ["<all_urls>"],
      })
      .then((granted) => {
        if (granted) {
          pluginFeatCtx.setFeatures({ ...pluginFeatCtx.features, injectSelection: isSet });
        }
      });
  };
  const handleScrollbarInjection = (isSet: boolean) => {
    browser.permissions
      .request({
        permissions: ["tabs", "activeTab"],
        origins: ["<all_urls>"],
      })
      .then((granted) => {
        if (granted) {
          pluginFeatCtx.setFeatures({ ...pluginFeatCtx.features, injectScrollbars: isSet });
        }
      });
  };
  function handleDiscreetChange(isSet: boolean) {
    browser.permissions
      .request({
        permissions: ["tabs", "activeTab"],
        origins: ["<all_urls>"],
      })
      .then((granted) => {
        if (granted) {
          pluginFeatCtx.setFeatures({
            ...pluginFeatCtx.features,
            isDiscreet: isSet,
          });
          const discreetModeSet: PluginEvent<DiscreetModePayload> = {
            type: PluginEventTypes.DISCREET_MODE_SET,
            payload: {
              isDiscreet: isSet
            }
          };
          browser.runtime.sendMessage(discreetModeSet).catch((e) => {console.warn('Unable to send discreet mode status.',e)});
        }
      });
  }
  return (
    <div style={{ display: "block", flexDirection: "column" }}>
      <label style={{ display: "block", marginBottom: "1rem" }}>
                  <span style={{ color: dokiThemeCtx.theme.colors.infoForeground }}>
                    Show Search Widget
                  </span>
        <br style={{ marginBottom: "0.5rem" }} />
        <ThemedSwitch
          onChange={handleWidgetChange}
          checked={pluginFeatCtx.features.showWidget}
        />
      </label>
      <label style={{ display: "block", marginBottom: "1rem" }}>
                  <span style={{ color: dokiThemeCtx.theme.colors.infoForeground }}>
                    Inject Themed Text Selection
                  </span>
        <br style={{ marginBottom: "0.5rem" }} />
        <ThemedSwitch
          onChange={handleSelectionInjection}
          checked={pluginFeatCtx.features.injectSelection}
        />
      </label>
      <label style={{ display: "block", marginBottom: "1rem" }}>
                  <span style={{ color: dokiThemeCtx.theme.colors.infoForeground }}>
                    Inject Themed Scrollbars
                  </span>
        <br style={{ marginBottom: "0.5rem" }} />
        <ThemedSwitch
          onChange={handleScrollbarInjection}
          checked={pluginFeatCtx.features.injectScrollbars}
        />
      </label>
      <label style={{ display: "block", marginBottom: "1rem" }}>
                  <span style={{ color: dokiThemeCtx.theme.colors.infoForeground }}>
                    Discreet Mode <em>(reload's all tabs!)</em>
                  </span>
        <br style={{ marginBottom: "0.5rem" }} />
        <ThemedSwitch
          onChange={handleDiscreetChange}
          checked={pluginFeatCtx.features.isDiscreet}
        />
      </label>
    </div>
  );
};

export default FeaturesSettings;
