/**
 * Global MDX component overrides.
 * Registers components so they are available in all MDX files
 * without requiring a per-file import.
 */
import MDXComponents from "@theme-original/MDXComponents";
import LiveCodeExample from "@site/src/components/LiveCodeExample";
import Email from "@site/src/components/Email";

export default {
  ...MDXComponents,
  LiveCodeExample,
  Email,
};
