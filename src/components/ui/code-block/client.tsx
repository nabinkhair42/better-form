"use client";

import {
    CodeBlock,
    CodeBlockBody,
    CodeBlockContent,
    CodeBlockCopyButton,
    CodeBlockHeader,
    CodeBlockItem,
    type BundledLanguage,
} from ".";

interface CodeBlockClientProps {
  code: string;
  language?: BundledLanguage;
  label?: string;
  meta?: string;
}

export function CodeBlockClient({
  code,
  language = "typescript",
  label,
  meta,
}: CodeBlockClientProps) {
  // Parse meta to extract title
  const titleMatch = meta?.match(/title="([^"]*)"/);
  const title = titleMatch ? titleMatch[1] : label;

  return (
    <CodeBlock
      data={[
        {
          language: language,
          filename: title || "",
          code: code,
        },
      ]}
      defaultValue={language}
    >
      <CodeBlockHeader>
        {title && (
          <span className="text-xs text-muted-foreground px-2">{title}</span>
        )}
        <div className="flex-1" />
        <CodeBlockCopyButton />
      </CodeBlockHeader>
      <CodeBlockBody>
        {(item) => (
          <CodeBlockItem
            key={item.language}
            value={item.language}
            lineNumbers={false}
          >
            <CodeBlockContent language={language}>{item.code}</CodeBlockContent>
          </CodeBlockItem>
        )}
      </CodeBlockBody>
    </CodeBlock>
  );
}
