interface HastNode
{
  readonly type?: string;
  readonly tagName?: string;
  readonly children?: HastNode[];
  properties?: Record<string, unknown>;
}

const internalHostnames = new Set(["digows.com", "www.digows.com", "blog.digows.com"]);

export default function externalLinks(): (tree: HastNode) => void
{
  return (tree: HastNode): void => visit(tree);
}

function visit(node: HastNode): void
{
  if (node.type === "element" && node.tagName === "a" && node.properties !== undefined)
  {
    const href = node.properties.href;

    if (typeof href === "string" && isExternalHttpLink(href))
    {
      node.properties.target = "_blank";
      node.properties.rel = ["noopener", "noreferrer"];
    }
  }

  for (const child of node.children ?? [])
  {
    visit(child);
  }
}

function isExternalHttpLink(href: string): boolean
{
  try
  {
    const url = new URL(href);
    return (url.protocol === "http:" || url.protocol === "https:") && !internalHostnames.has(url.hostname);
  }
  catch
  {
    return false;
  }
}
