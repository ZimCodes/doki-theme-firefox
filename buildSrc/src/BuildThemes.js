var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { constructNamedColorTemplate, dictionaryReducer, evaluateTemplates, readJson, resolveColor, resolvePaths, toRGBArray, walkDir } from "doki-build-source";
import omit from "lodash/omit";
import fs from "fs";
import path from "path";
const { repoDirectory, masterThemeDefinitionDirectoryPath, appTemplatesDirectoryPath } = resolvePaths(__dirname);
function buildColors(dokiThemeDefinition, dokiTemplateDefinitions, dokiThemeChromeDefinition) {
    var _a, _b;
    const namedColors = constructNamedColorTemplate(dokiThemeDefinition, dokiTemplateDefinitions);
    const themeOverrides = dokiThemeChromeDefinition.overrides.theme &&
        dokiThemeChromeDefinition.overrides.theme.colors || {};
    const colorsOverride = Object.assign(Object.assign(Object.assign(Object.assign({}, namedColors), themeOverrides), dokiThemeChromeDefinition.colors), { editorAccentColor: ((_b = (_a = dokiThemeDefinition.overrides) === null || _a === void 0 ? void 0 : _a.editorScheme) === null || _b === void 0 ? void 0 : _b.colors.accentColor) ||
            dokiThemeDefinition.colors.accentColor });
    return Object.entries(colorsOverride).reduce((accum, [colorName, colorValue]) => (Object.assign(Object.assign({}, accum), { [colorName]: resolveColor(colorValue, namedColors) })), {});
}
const toPairs = require("lodash/toPairs");
function replaceValues(itemToReplace, valueConstructor) {
    return toPairs(itemToReplace)
        .map(([key, value]) => ([key, valueConstructor(key, value)]))
        .reduce(dictionaryReducer, {});
}
function buildFireFoxTheme(dokiThemeDefinition, dokiTemplateDefinitions, dokiThemeChromeDefinition, manifestTemplate) {
    const namedColors = constructNamedColorTemplate(dokiThemeDefinition, dokiTemplateDefinitions);
    const colorsOverride = dokiThemeChromeDefinition.overrides.theme &&
        dokiThemeChromeDefinition.overrides.theme.colors || {};
    const colorScheme = dokiThemeDefinition.dark ? "dark" : "light";
    return Object.assign(Object.assign({}, manifestTemplate), { colors: replaceValues(manifestTemplate.colors, (key, color) => toRGBArray(resolveColor(colorsOverride[key] || color, namedColors))), properties: {
            color_scheme: colorScheme,
            content_color_scheme: colorScheme,
        } });
}
function buildTemplateVariables(dokiThemeDefinition, masterTemplateDefinitions, dokiThemeAppDefinition) {
    var _a;
    const namedColors = constructNamedColorTemplate(dokiThemeDefinition, masterTemplateDefinitions);
    const colorsOverride = ((_a = dokiThemeAppDefinition.overrides.theme) === null || _a === void 0 ? void 0 : _a.colors) || {};
    const cleanedColors = Object.entries(namedColors)
        .reduce((accum, [colorName, colorValue]) => (Object.assign(Object.assign({}, accum), { [colorName]: colorValue })), {});
    return Object.assign(Object.assign({}, cleanedColors), colorsOverride);
}
const excludedSecondaryContentThemes = new Set([
    'b93ab4ea-ff96-4459-8fa2-0caae5bc7116', // Kanna's are the same
    'ea9a13f6-fa7f-46a4-ba6e-6cefe1f55160' // I lack culture...
]);
function hasExcludedSecondaryContent(masterThemeDefinition) {
    return excludedSecondaryContentThemes.has(masterThemeDefinition.id);
}
function sanitizeStickers(masterThemeDefinition) {
    if (hasExcludedSecondaryContent(masterThemeDefinition)) {
        return {
            default: masterThemeDefinition.stickers.default
        };
    }
    return masterThemeDefinition.stickers;
}
function createDokiTheme(masterThemeDefinitionPath, masterThemeDefinition, appTemplateDefinitions, appThemeDefinition, masterTemplateDefinitions, firefoxTemplate) {
    try {
        return {
            path: masterThemeDefinitionPath,
            definition: Object.assign(Object.assign({}, masterThemeDefinition), { colors: buildColors(masterThemeDefinition, masterTemplateDefinitions, appThemeDefinition), stickers: sanitizeStickers(masterThemeDefinition) }),
            templateVariables: buildTemplateVariables(masterThemeDefinition, masterTemplateDefinitions, appThemeDefinition),
            appThemeDefinition: appThemeDefinition,
            fireFoxTheme: buildFireFoxTheme(masterThemeDefinition, masterTemplateDefinitions, appThemeDefinition, fireFoxTemplate)
        };
    }
    catch (e) {
        throw new Error(`Unable to build ${masterThemeDefinition.name}'s theme for reasons ${e}`);
    }
}
function resolveStickerPath(themeDefinitionPath, sticker) {
    const stickerPath = path.resolve(path.resolve(themeDefinitionPath, ".."), sticker);
    return stickerPath.substring(masterThemeDefinitionDirectoryPath.length + "/definitions".length);
}
console.log("Preparing to generate themes.");
const fireFoxTemplate = readJson(path.resolve(appTemplatesDirectoryPath, "firefox.theme.template.json"));
const firefoxBackgroundAssets = path.resolve(repoDirectory, "public", "backgrounds");
function walkAndCopyAssets() {
    return __awaiter(this, void 0, void 0, function* () {
        const assetDir = path.resolve(repoDirectory, "..", "doki-theme-assets", "backgrounds", "wallpapers");
        const assetsToCopy = yield walkDir(assetDir);
        assetsToCopy.filter(assetPath => assetPath.indexOf("transparent") < 0 && assetPath.indexOf("checksum") < 0)
            .forEach(assetPath => {
            fs.copyFileSync(assetPath, path.join(firefoxBackgroundAssets, assetPath.substring(assetPath.lastIndexOf(path.sep) + 1)));
        });
        // special case where the wallpaper isn't the one I
        // want to use as the background.
        const bestGirl = 'zero_two_obsidian.png';
        fs.copyFileSync(path.resolve(assetDir, '..', bestGirl), path.join(firefoxBackgroundAssets, bestGirl));
    });
}
function scrubDefinition(masterThemeDefinition) {
    if (masterThemeDefinition.id === "b0340303-0a5a-4a20-9b9c-fc8ce9880078") {
        masterThemeDefinition.displayName = "Sayori";
    }
    return masterThemeDefinition;
}
walkAndCopyAssets().then(() => evaluateTemplates({
    appName: "firefox",
    currentWorkingDirectory: __dirname
}, (masterThemeDefinitionPath, masterThemeDefinition, appTemplateDefinitions, appThemeDefinition, masterTemplateDefinitions) => createDokiTheme(masterThemeDefinitionPath, scrubDefinition(masterThemeDefinition), appTemplateDefinitions, appThemeDefinition, masterTemplateDefinitions, fireFoxTemplate)))
    .then((dokiThemes) => {
    // write things for extension
    const dokiThemeDefinitions = dokiThemes.map(dokiTheme => {
        const dokiDefinition = dokiTheme.definition;
        return {
            information: Object.assign({}, omit(dokiDefinition, [
                "colors",
                "overrides",
                "ui",
                "icons"
            ])),
            colors: dokiDefinition.colors,
            fireFoxTheme: dokiTheme.fireFoxTheme
        };
    }).reduce((accum, definition) => {
        accum[definition.information.id] = definition;
        return accum;
    }, {});
    const finalDokiDefinitions = JSON.stringify(dokiThemeDefinitions);
    fs.writeFileSync(path.resolve(repoDirectory, "src", "DokiThemeDefinitions.ts"), `export default ${finalDokiDefinitions};`);
})
    .then(() => {
    console.log("Theme Generation Complete!");
});
