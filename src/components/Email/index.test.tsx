/**
 * Email component tests.
 */
import React from "react";
import { render } from "@testing-library/react";
import Email from "./index";

describe("Email", () => {
  it("renders from, to, and subject header rows", () => {
    const { container } = render(
      <Email from="Priya Ramachandran" to="You" subject="Work Sample">
        <p>Hi.</p>
      </Email>,
    );
    expect(container.textContent).toContain("Priya Ramachandran");
    expect(container.textContent).toContain("You");
    expect(container.textContent).toContain("Work Sample");
  });

  it("defaults the recipient to You", () => {
    const { container } = render(
      <Email from="Martin Quist" subject="Hello">
        <p>Hi.</p>
      </Email>,
    );
    expect(container.textContent).toContain("You");
  });

  it("renders the date row only when provided", () => {
    const { container: without } = render(
      <Email from="Martin Quist" subject="Hello">
        <p>Hi.</p>
      </Email>,
    );
    expect(without.textContent).not.toContain("Date");

    const { container: withDate } = render(
      <Email from="Martin Quist" subject="Hello" date="Monday, 3:12 AM">
        <p>Hi.</p>
      </Email>,
    );
    expect(withDate.textContent).toContain("Monday, 3:12 AM");
  });

  it("has a descriptive aria-label", () => {
    const { container } = render(
      <Email from="Martin Quist" subject="You Have Been Recommended!">
        <p>Hi.</p>
      </Email>,
    );
    const section = container.querySelector("section");
    expect(section?.getAttribute("aria-label")).toBe(
      "Email from Martin Quist. Subject: You Have Been Recommended!",
    );
  });

  it("renders body children", () => {
    const { container } = render(
      <Email from="Martin Quist" subject="Hello">
        <p>
          Body with <strong>markdown</strong> content.
        </p>
      </Email>,
    );
    expect(container.querySelector("strong")?.textContent).toBe("markdown");
  });
});
