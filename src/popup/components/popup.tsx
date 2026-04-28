import React, { useEffect, useState } from "react";
import { DokiThemeContext, ThemeContext } from "../../common/DokiThemeProvider";
import ThemedSelect from "./ThemedSelect";
import { PluginMode, pluginSettings } from "../../Storage";
import { OptionSwitch } from "./optionSwitch";
import { ThemeStuff } from "../../common/ThemeTools";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import "./popup.css";
import {
  ModeSetEventPayload,
  PluginEvent,
  PluginEventTypes,
} from "../../Events";
import FeaturesSettings from "./FeaturesSettings";
import { FeatureContext, PluginFeatureContext } from "../../common/FeatureProvider";

const options: { value: PluginMode; label: string }[] = [
  { value: PluginMode.SINGLE, label: "Individual" },
  { value: PluginMode.DEVICE_MATCH, label: "Device Match" },
  { value: PluginMode.MIXED, label: "Mixed" },
];

const Popup = () => {
  const [currentMode, setCurrentMode] = useState<PluginMode>(options[0].value);
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    pluginSettings.getAll().then(({ currentMode }) => {
      setCurrentMode(currentMode);
      setInitialized(true);
    });
  }, []);
  const dokiThemeCtx:DokiThemeContext = React.useContext(ThemeContext);
  const pluginFeatCtx: PluginFeatureContext = React.useContext(FeatureContext);
  const colors = dokiThemeCtx.theme.colors;
  const handleModeChange = (thing: any) => {
    setCurrentMode(thing!.value);
    const modeSetEvent: PluginEvent<ModeSetEventPayload> = {
      type: PluginEventTypes.MODE_SET,
      payload: {
        mode: thing!.value,
      },
    };
    browser.runtime.sendMessage(modeSetEvent).catch((e) => {
      console.warn("Unable to send mode set message", e);
    });
  };
  const title = pluginFeatCtx.features.isDiscreet ? "Settings" : "Doki Theme";
  return (
    <div
      style={{
        backgroundColor: colors.baseBackground,
        color: colors.foregroundColor,
        padding: "1rem",
        minHeight: "500px",
        minWidth: "250px",
      }}
    >
      <ThemeStuff theme={dokiThemeCtx.theme}></ThemeStuff>
      {initialized ? (
        <>
          <header
            style={{
              marginBottom: "0.5rem"
            }}
          >
            <h1 style={{ margin: "0 0 1rem 0", textAlign: "center", fontWeight: 600 }}>
              {title}
            </h1>
          </header>
          <Tabs>
            <TabList className="doki-tabs__tab-list">
              <Tab selectedClassName="doki-tabs__tab--selected">
                Themes
              </Tab>
              <Tab selectedClassName="doki-tabs__tab--selected">
                Features
              </Tab>
            </TabList>
            <TabPanel>
              <label>
                      <span
                        style={{
                          fontWeight: "500",
                          fontSize: "1.25",
                        }}
                      >
                        Plugin Mode
                      </span>
                <br style={{ marginBottom: "0.5rem" }} />
                <ThemedSelect
                  options={options}
                  onChange={handleModeChange}
                  defaultValue={
                    options.find(
                      (option) => option.value === currentMode
                    )!
                  }
                />
              </label>
              <hr
                style={{
                  marginTop: "1rem",
                  borderColor: colors.infoForeground,
                  borderStyle: "dotted",
                }}
              />
              <OptionSwitch pluginMode={currentMode} />
            </TabPanel>
            <TabPanel>
              <FeaturesSettings />
            </TabPanel>
          </Tabs>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Popup;
