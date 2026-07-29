/**
 * Global MDX component overrides.
 * Registers LiveCodeExample so it is available in all MDX files
 * without requiring a per-file import.
 */
import MDXComponents from "@theme-original/MDXComponents";
import LiveCodeExample from "@site/src/components/LiveCodeExample";

export default {
  ...MDXComponents,
  LiveCodeExample,
};
