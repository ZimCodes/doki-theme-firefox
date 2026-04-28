import React, { FC } from "react";
import Switch, { ReactSwitchProps } from "react-switch";
import { ThemeContext } from "../../common/DokiThemeProvider";

type htmlInputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;
type excludedHTMLInputProps =
  | "onFocus"
  | "onBlur"
  | "onKeyUp"
  | "onChange"
  | "ref"
  | keyof ReactSwitchProps;
type allowedHTMLinputProps = Omit<htmlInputProps, excludedHTMLInputProps>;
const ThemedSwitch: FC<ReactSwitchProps & allowedHTMLinputProps> = (props) => {
  const dokiThemeCtx = React.useContext(ThemeContext);
  return (
    <Switch
      {...props}
      uncheckedIcon={false}
      checkedIcon={false}
      offColor={dokiThemeCtx.theme.colors.disabledColor}
      onColor={dokiThemeCtx.theme.colors.accentColor}
      onHandleColor={dokiThemeCtx.theme.colors.buttonColor}
      offHandleColor={dokiThemeCtx.theme.colors.buttonColor}
      activeBoxShadow={`0 0 2px 3px ${dokiThemeCtx.theme.colors.accentColor}`}
    />
  );
};

export default ThemedSwitch;
