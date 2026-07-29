// Mock for livecodes/react
import React from "react";

interface LivecodesProps {
  config?: Record<string, unknown>;
  style?: React.CSSProperties;
  title?: string;
  [key: string]: unknown;
}

export default function LivecodesReactMock({ title, ...rest }: LivecodesProps): React.JSX.Element {
  return React.createElement("div", {
    "data-testid": "livecodes-mock",
    title,
  });
}
