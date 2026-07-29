// Mock for @docusaurus/* imports
export const useDocusaurusContext = () => ({
  siteConfig: {
    title: "Blueprint Textbook",
    tagline: "An interactive software engineering textbook",
    url: "https://example.github.io",
    baseUrl: "/textbook/",
  },
});

export const useColorMode = () => ({ colorMode: "light", setColorMode: jest.fn() });

export const Link = ({
  children,
  to,
  href,
}: {
  children: React.ReactNode;
  to?: string;
  href?: string;
}) => {
  const React = require("react");
  return React.createElement("a", { href: to ?? href }, children);
};

export default {};
