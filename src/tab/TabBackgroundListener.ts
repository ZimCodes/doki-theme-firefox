import { DokiTheme, DokiThemes } from "../common/DokiTheme";
import { svgToPng } from "../background/svgTools";
import { DiscreetModePayload, PluginEvent, PluginEventTypes, TabAttachedEventPayload, ThemeSetEventPayload } from "../Events";
import { pluginSettings } from "../Storage";

export function setThemedFavicon(dokiTheme: DokiTheme | null) {
  const faviconOptions = { width: 32, height: 32 };
  if (dokiTheme){
    svgToPng(dokiTheme, faviconOptions).then((imgData: any) => {
      let link: HTMLLinkElement | null =
        document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = imgData;
    });
  }else {
    let link: HTMLLinkElement | null =
      document.querySelector("link[rel~='icon']");
    if (link) {
      link.remove();
    }
  }
}

function themeFavicon(themeId: string | null) {
  if (!themeId) {
    setThemedFavicon(null);
  }else {
    const currentTheme = DokiThemes[themeId];
    if (currentTheme) {
      setThemedFavicon(currentTheme);
    }
  }
}

export const notifyTabAttached = () => {
  browser.tabs.getCurrent().then((tab) => {
    if (tab?.id == null) {
      return;
    }

    const tabAttachedEvent: PluginEvent<TabAttachedEventPayload> = {
      type: PluginEventTypes.TAB_ATTACHED,
      payload: {
        tabId: tab.id,
      },
    };
    return browser.runtime.sendMessage(tabAttachedEvent);
  });
};

export const attachBackgroundListener = () => {
  browser.runtime.onMessage.addListener( async (event: PluginEvent<any>) => {
    if (event.type === PluginEventTypes.THEME_SET) {
      const {isDiscreet} = await pluginSettings.getAll();
      if (!isDiscreet){
        const themeSetPayload: ThemeSetEventPayload = event.payload;
        themeFavicon(themeSetPayload.themeId);
      }else {
        themeFavicon(null);
      }
    } else if (event.type === PluginEventTypes.DISCREET_MODE_SET) {
      const discreetPayload: DiscreetModePayload = event.payload;
      if (discreetPayload) {
        themeFavicon(null);
      }else {
        const {currentTheme} = await pluginSettings.getAll();
        themeFavicon(currentTheme);
      }
    }
  });
};
