import { createHash } from "node:crypto";

interface HastNode
{
  readonly type: string;
  readonly value?: string;
  readonly children?: HastNode[];
  properties?: Record<string, unknown>;
  readonly tagName?: string;
}

export default function articleParagraphs(): (tree: HastNode) => void
{
  return (tree) =>
  {
    const occurrences = new Map<string, number>();
    visit(tree, (node) =>
    {
      if (node.type !== "element" || node.tagName !== "p")
      {
        return;
      }

      const text = extractText(node).replace(/\s+/g, " ").trim();

      if (text.length < 3)
      {
        return;
      }

      const hash = createHash("sha256").update(text).digest("hex").slice(0, 12);
      const occurrence = (occurrences.get(hash) ?? 0) + 1;
      occurrences.set(hash, occurrence);
      const identifier = `paragraph-${hash}${occurrence > 1 ? `-${occurrence}` : ""}`;
      node.properties = { ...node.properties, id: identifier, dataArticleParagraph: "" };
    });
  };
}

function visit(node: HastNode, visitor: (node: HastNode) => void): void
{
  visitor(node);

  for (const child of node.children ?? [])
  {
    visit(child, visitor);
  }
}

function extractText(node: HastNode): string
{
  if (node.type === "text")
  {
    return node.value ?? "";
  }

  return (node.children ?? []).map(extractText).join("");
}
