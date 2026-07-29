// Mock for @theme-original/MDXComponents
import React from "react";
export default {
  code: ({ children }: { children: React.ReactNode }) =>
    React.createElement("code", null, children),
  pre: ({ children }: { children: React.ReactNode }) => React.createElement("pre", null, children),
};
