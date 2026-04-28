import React, { FC } from "react";
import ThemedSelect from "./ThemedSelect";
import { CharacterTheme, ContentType, DokiTheme } from "../../common/DokiTheme";
import { ThemeContext } from "../../common/DokiThemeProvider";
import DokiRadioButton from "./DokiRadioButton";
import { SingleValue } from "react-select";

function createThemeVariantName(theme: DokiTheme) {
  const trimmedVariant = theme.name
    .replace(theme.displayName, "")
    .replace(":", "")
    .trim();
  return trimmedVariant || (theme.dark ? "Dark" : "Light");
}

type labelType = { label: string; value: DokiTheme };
type ThemeOption = { label: string; value: DokiTheme };

function getThemeSelector(
  values: any,
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void,
  prefix: string,
  theme: DokiTheme
) {
  const options = values[prefix].character.themes
    .map((theme: DokiTheme) => ({
      value: theme,
      label: createThemeVariantName(theme),
    }))
    .sort((a: labelType, b: labelType) => a.label.localeCompare(b.label));
  return (
    <div style={{ marginTop: "1rem" }}>
      <label>
        <span style={{ color: theme.colors.infoForeground }}>
          Theme Variant
        </span>
        <br style={{ marginBottom: "0.5rem" }} />
        <ThemedSelect
          options={options}
          value={{
            value: values[prefix].selectedTheme,
            label: createThemeVariantName(values[prefix].selectedTheme),
          }}
          onChange={(selectedTheme: SingleValue<ThemeOption>) =>
            setFieldValue(`${prefix}.selectedTheme`, selectedTheme!.value)
          }
        />
      </label>
    </div>
  );
}

export type CharacterOption = { label: string; value: CharacterTheme };

interface Props {
  values: any;
  setFieldValue: any;
  prefix: string;
  options: CharacterOption[];
}

const DokiThemeComponent: FC<Props> = ({
  values,
  setFieldValue,
  prefix,
  options,
}) => {
  const dokiThemeCtx = React.useContext(ThemeContext);
  return (
    <div>
      <label>
            <span style={{ color: dokiThemeCtx.theme.colors.infoForeground }}>
              Choose a character
            </span>{" "}
        <br style={{ marginBottom: "0.5rem" }} />
        <ThemedSelect
          options={options}
          value={{
            label: values[prefix].character.name,
            value: values[prefix].character,
          }}
          onChange={(selectedCharacter: SingleValue<CharacterOption>) => {
            const characterValue = selectedCharacter!.value;
            setFieldValue(
              `${prefix}.selectedTheme`,
              characterValue.themes[0]
            );
            return setFieldValue(`${prefix}.character`, characterValue);
          }}
        />
      </label>

      {values[prefix].character.hasMultipleThemes &&
        getThemeSelector(values, setFieldValue, prefix, dokiThemeCtx.theme)}

      {values[prefix].character.hasSecondaryContent && (
        <>
          <div style={{ margin: "1rem 0 0.5rem 0" }} id="contentTypeGroup">
                <span style={{ color: dokiThemeCtx.theme.colors.infoForeground }}>
                  Content Type
                </span>
            <br style={{ marginBottom: "0.5rem" }} />
            <div role="group" aria-labelledby="contentTypeGroup">
              <DokiRadioButton
                type="radio"
                name={`${prefix}.contentType`}
                value={ContentType.PRIMARY}
                onChange={() => {
                  setFieldValue(
                    `${prefix}.contentType`,
                    ContentType.PRIMARY
                  );
                }}
              >
                Primary
              </DokiRadioButton>
              <DokiRadioButton
                type="radio"
                name={`${prefix}.contentType`}
                value={ContentType.SECONDARY}
                onChange={() => {
                  setFieldValue(
                    `${prefix}.contentType`,
                    ContentType.SECONDARY
                  );
                }}
              >
                Secondary
              </DokiRadioButton>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DokiThemeComponent;
