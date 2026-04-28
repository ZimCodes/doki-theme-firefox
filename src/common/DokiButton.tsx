import React, { CSSProperties, FC } from "react";
import { FireFoxDokiTheme, ThemeContext } from "./DokiThemeProvider";

interface Props {
  variant?: "primary" | "default";
}

const DokiButton: FC<
  Props &
    React.DetailedHTMLProps<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >
> = (props) => {
  const dokiThemeCtx = React.useContext(ThemeContext);
  function createStyles(theme: FireFoxDokiTheme): CSSProperties {
    const colors = theme.colors;
    return props.variant === "primary"
      ? {
          backgroundColor: colors.selectionBackground,
          color: colors.selectionForeground,
        }
      : {
          backgroundColor: colors.buttonColor,
          color: colors.buttonFont,
        };
  }
  return (
    <>
      <button
        {...props}
        style={{
          ...props.style,
          padding: "0.5rem 1rem",
          border: `solid ${dokiThemeCtx.theme.colors.borderColor} 1px`,
          borderRadius: 0,
          fontWeight: 500,
          cursor: "pointer",
          ...(props.disabled
            ? { opacity: 0.5, cursor: "not-allowed" }
            : {}),
          ...createStyles(dokiThemeCtx.theme),
        }}
      >
        {props.children}
      </button>
    </>
  );
};

export default DokiButton;
