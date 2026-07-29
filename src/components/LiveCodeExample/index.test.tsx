/**
 * LiveCodeExample component tests.
 */
import React from "react";
import { render } from "@testing-library/react";
import LiveCodeExample from "./index";

// Mock livecodes/react to avoid ESM/JSDOM issues
jest.mock("livecodes/react", () => ({
  __esModule: true,
  default: ({ title }: { title?: string }) => <div data-testid="livecodes-mock" title={title} />,
}));

// Mock useColorMode hook
jest.mock("@docusaurus/theme-classic/lib/theme/hooks/useColorMode", () => ({
  useColorMode: () => ({ colorMode: "light" }),
}));

const defaultProps = {
  id: "test-example",
  language: "ts" as const,
  source: 'const x: string = "hello";\nconsole.log(x);',
  title: "Test Example",
};

describe("LiveCodeExample", () => {
  it("renders the SSR fallback with source code before mount", () => {
    // Component starts unmounted (mounted=false) on initial render
    const { container } = render(<LiveCodeExample {...defaultProps} />);
    // Should contain the source code in the fallback pre block
    expect(container.querySelector("pre")).toBeTruthy();
    expect(container.textContent).toContain('const x: string = "hello"');
  });

  it("has correct aria-label when title is provided", () => {
    const { container } = render(<LiveCodeExample {...defaultProps} />);
    const figure = container.querySelector("figure");
    expect(figure?.getAttribute("aria-label")).toBe("Interactive code example: Test Example");
  });

  it("has generic aria-label when no title", () => {
    const { container } = render(<LiveCodeExample {...defaultProps} title={undefined} />);
    const figure = container.querySelector("figure");
    expect(figure?.getAttribute("aria-label")).toBe("Interactive code example");
  });

  it("sets data-example-id attribute", () => {
    const { container } = render(<LiveCodeExample {...defaultProps} />);
    const figure = container.querySelector("figure");
    expect(figure?.getAttribute("data-example-id")).toBe("test-example");
  });

  it("shows diagnostics panel when diagnostics are provided", () => {
    const diagnostics = [
      {
        code: 2322,
        severity: "error" as const,
        message: "Type 'string' is not assignable to type 'number'.",
        line: 1,
        column: 7,
      },
    ];
    const { container } = render(
      <LiveCodeExample
        {...defaultProps}
        expect="type-error"
        errorCodes={[2322]}
        diagnostics={diagnostics}
      />,
    );
    expect(container.textContent).toContain("TS2322");
    expect(container.textContent).toContain("Type 'string' is not assignable to type 'number'.");
  });

  it("shows intentional badge for type-error examples with diagnostics", () => {
    const diagnostics = [
      {
        code: 2322,
        severity: "error" as const,
        message: "Type error",
        line: 1,
        column: 1,
      },
    ];
    const { container } = render(
      <LiveCodeExample {...defaultProps} expect="type-error" diagnostics={diagnostics} />,
    );
    expect(container.textContent).toContain("Intentional teaching error");
  });

  it("shows skip notice when run=skip", () => {
    const { container } = render(
      <LiveCodeExample {...defaultProps} run="skip" skipReason="Requires browser API" />,
    );
    expect(container.textContent).toContain("Execution skipped");
    expect(container.textContent).toContain("Requires browser API");
  });
});
