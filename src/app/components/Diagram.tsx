import diagramMarkup from "../../imports/main-diagram.svg?raw";

export function Diagram() {
  return (
    <div
      className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:max-h-full"
      dangerouslySetInnerHTML={{ __html: diagramMarkup }}
    />
  );
}
