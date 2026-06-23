import * as React from "react";

/**
 * A deliberately small Markdown renderer for the subset that shows up in GitHub
 * release notes: headings, bullet / numbered lists, bold, inline code, and links
 * (including bare URLs). Anything it doesn't recognise degrades to plain text.
 *
 * Kept dependency-free on purpose — release notes are structurally simple and
 * the stack stays lean. If notes ever need full CommonMark, swap in react-markdown.
 */

const INLINE =
  /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|`([^`]+)`|(https?:\/\/[^\s)]+)/g;

const linkClass =
  "font-medium text-foreground underline underline-offset-4 hover:text-caramel";

function renderInline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;
  let match: RegExpExecArray | null;

  INLINE.lastIndex = 0;
  while ((match = INLINE.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    const [, linkText, linkUrl, bold, code, bareUrl] = match;
    if (linkUrl) {
      nodes.push(
        <a key={key++} href={linkUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
          {linkText}
        </a>,
      );
    } else if (bold) {
      nodes.push(
        <strong key={key++} className="font-semibold text-foreground">
          {bold}
        </strong>,
      );
    } else if (code) {
      nodes.push(
        <code key={key++} className="rounded bg-secondary px-1 py-0.5 text-sm text-foreground">
          {code}
        </code>,
      );
    } else if (bareUrl) {
      nodes.push(
        <a key={key++} href={bareUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
          {bareUrl}
        </a>,
      );
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }
  return nodes;
}

type Block =
  | { type: "heading"; text: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "paragraph"; text: string };

function parseBlocks(markdown: string): Block[] {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let paragraph: string[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;

  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push({ type: "paragraph", text: paragraph.join(" ") });
      paragraph = [];
    }
  };
  const flushList = () => {
    if (list) {
      blocks.push({ type: "list", ordered: list.ordered, items: list.items });
      list = null;
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    const heading = /^#{1,6}\s+(.*)$/.exec(line);
    const bullet = /^\s*[-*]\s+(.*)$/.exec(line);
    const ordered = /^\s*\d+\.\s+(.*)$/.exec(line);

    if (line.trim() === "") {
      flushParagraph();
      flushList();
    } else if (heading) {
      flushParagraph();
      flushList();
      blocks.push({ type: "heading", text: heading[1] });
    } else if (bullet) {
      flushParagraph();
      if (!list || list.ordered) {
        flushList();
        list = { ordered: false, items: [] };
      }
      list.items.push(bullet[1]);
    } else if (ordered) {
      flushParagraph();
      if (!list || !list.ordered) {
        flushList();
        list = { ordered: true, items: [] };
      }
      list.items.push(ordered[1]);
    } else {
      flushList();
      paragraph.push(line.trim());
    }
  }
  flushParagraph();
  flushList();
  return blocks;
}

export function MarkdownLite({ children }: { children: string }) {
  const blocks = parseBlocks(children);

  return (
    <div className="space-y-4 leading-relaxed text-muted-foreground">
      {blocks.map((block, i) => {
        if (block.type === "heading") {
          return (
            <h3 key={i} className="font-display text-lg text-foreground">
              {renderInline(block.text)}
            </h3>
          );
        }
        if (block.type === "list" && block.ordered) {
          return (
            <ol key={i} className="list-decimal space-y-2.5 pl-5">
              {block.items.map((item, j) => (
                <li key={j}>{renderInline(item)}</li>
              ))}
            </ol>
          );
        }
        if (block.type === "list") {
          return (
            <ul key={i} className="space-y-2.5">
              {block.items.map((item, j) => (
                <li key={j} className="flex gap-3">
                  <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-caramel" />
                  <span>{renderInline(item)}</span>
                </li>
              ))}
            </ul>
          );
        }
        return <p key={i}>{renderInline(block.text)}</p>;
      })}
    </div>
  );
}
