// Mock for @theme/* imports
import React from "react";

export const Layout = ({ children }: { children: React.ReactNode }): React.JSX.Element =>
  React.createElement("div", null, children);

export default Layout;
