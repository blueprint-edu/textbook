// CJS mock for ESM-only unist-util-visit
// Used in Jest tests for the remark plugin

export type Visitor = (node: unknown, index: number | null, parent: unknown) => void;

export function visit(tree: unknown, type: string, visitor: Visitor): void {
  function walk(node: Record<string, unknown>, parent: unknown): void {
    if (node["type"] === type) {
      visitor(node, null, parent);
    }
    const children = node["children"];
    if (Array.isArray(children)) {
      for (const child of children) {
        walk(child as Record<string, unknown>, node);
      }
    }
  }
  walk(tree as Record<string, unknown>, null);
}

export const CONTINUE = true;
export const EXIT = false;
export const SKIP = "skip";
