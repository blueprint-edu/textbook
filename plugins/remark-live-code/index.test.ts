import {
  parseMeta,
  tokenizeMeta,
  escapeForTemplateLiteral,
  normaliseLanguage,
  resetSeenIds,
} from "./index";

describe("tokenizeMeta", () => {
  it("parses a bare flag", () => {
    const m = tokenizeMeta("live");
    expect(m.has("live")).toBe(true);
    expect(m.get("live")).toBeUndefined();
  });

  it("parses key=value", () => {
    const m = tokenizeMeta("live id=ch1-s5-foo");
    expect(m.get("id")).toBe("ch1-s5-foo");
  });

  it('parses key="quoted value"', () => {
    const m = tokenizeMeta('live title="My Example"');
    expect(m.get("title")).toBe("My Example");
  });

  it("parses multiple keys", () => {
    const m = tokenizeMeta('live id=foo title="Bar" expect=pass run=auto');
    expect(m.get("id")).toBe("foo");
    expect(m.get("title")).toBe("Bar");
    expect(m.get("expect")).toBe("pass");
    expect(m.get("run")).toBe("auto");
  });
});

describe("parseMeta", () => {
  beforeEach(() => resetSeenIds());

  it("returns null for non-live blocks", () => {
    expect(parseMeta("typescript", "test.md", 1)).toBeNull();
  });

  it("returns null when live flag is absent even with other keys", () => {
    expect(parseMeta("id=foo", "test.md", 1)).toBeNull();
  });

  it("parses a minimal valid live block", () => {
    const meta = parseMeta('live id=test-1 title="Hello"', "test.md", 5);
    expect(meta).not.toBeNull();
    expect(meta?.id).toBe("test-1");
    expect(meta?.title).toBe("Hello");
    expect(meta?.expect).toBe("pass");
    expect(meta?.run).toBe("auto");
    expect(meta?.errorCodes).toEqual([]);
  });

  it("throws when id is missing", () => {
    expect(() => parseMeta("live", "test.md", 3)).toThrow(/Missing required id=/);
  });

  it("throws on unknown metadata key", () => {
    expect(() => parseMeta("live id=foo unknownKey=bar", "test.md", 1)).toThrow(
      /Unknown metadata key "unknownKey"/,
    );
  });

  it("throws when expect=type-error but no errors=", () => {
    expect(() => parseMeta("live id=foo expect=type-error", "test.md", 1)).toThrow(
      /expect=type-error requires errors=/,
    );
  });

  it("parses expect=type-error with errors=", () => {
    const meta = parseMeta("live id=foo expect=type-error errors=2322,2339", "test.md", 1);
    expect(meta?.errorCodes).toEqual([2322, 2339]);
  });

  it("throws when run=skip but no skipReason", () => {
    expect(() => parseMeta("live id=foo run=skip", "test.md", 1)).toThrow(
      /run=skip requires skipReason/,
    );
  });

  it("parses run=skip with skipReason", () => {
    const meta = parseMeta('live id=foo run=skip skipReason="Needs browser API"', "test.md", 1);
    expect(meta?.run).toBe("skip");
    expect(meta?.skipReason).toBe("Needs browser API");
  });

  it("parses height as integer", () => {
    const meta = parseMeta("live id=foo height=400", "test.md", 1);
    expect(meta?.height).toBe(400);
  });

  it("throws on invalid height", () => {
    expect(() => parseMeta("live id=foo height=abc", "test.md", 1)).toThrow(
      /height must be a positive integer/,
    );
  });

  it("throws on invalid expect value", () => {
    expect(() => parseMeta("live id=foo expect=kaboom", "test.md", 1)).toThrow(
      /Invalid expect="kaboom"/,
    );
  });

  it("throws on invalid run value", () => {
    expect(() => parseMeta("live id=foo run=always", "test.md", 1)).toThrow(/Invalid run="always"/);
  });
});

describe("escapeForTemplateLiteral", () => {
  it("escapes backticks", () => {
    expect(escapeForTemplateLiteral("a`b")).toBe("a\\`b");
  });

  it("escapes template literal expressions", () => {
    expect(escapeForTemplateLiteral("${x}")).toBe("\\${x}");
  });

  it("escapes backslashes", () => {
    expect(escapeForTemplateLiteral("a\\b")).toBe("a\\\\b");
  });
});

describe("normaliseLanguage", () => {
  it("returns tsx for tsx", () => {
    expect(normaliseLanguage("tsx")).toBe("tsx");
  });

  it("returns tsx for jsx", () => {
    expect(normaliseLanguage("jsx")).toBe("tsx");
  });

  it("returns ts for ts", () => {
    expect(normaliseLanguage("ts")).toBe("ts");
  });

  it("returns ts for typescript", () => {
    expect(normaliseLanguage("typescript")).toBe("ts");
  });
});
