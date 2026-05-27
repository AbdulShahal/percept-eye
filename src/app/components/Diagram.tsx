import diagramDark from "../../imports/main-diagram.svg?raw";
import diagramLight from "../../imports/main-diagram-light.svg?raw";
import { useTheme } from "./ThemeProvider";

export function Diagram() {
  const { theme } = useTheme();
  const markup = theme === "light" ? diagramLight : diagramDark;

  return (
    <div
      key={theme}
      className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:max-h-full"
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}
