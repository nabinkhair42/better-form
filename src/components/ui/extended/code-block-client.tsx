"use client";

import { CopyButton } from "@/components/ui/extended/copy-button";
import { useEffect, useState } from "react";
import { type BundledLanguage, codeToHtml } from "shiki";

type HighlightLanguage = BundledLanguage | "text";

const LANGUAGE_ALIASES: Record<string, HighlightLanguage> = {
  ts: "ts",
  tsx: "tsx",
  typescript: "ts",
  js: "javascript",
  jsx: "javascript",
};

const LANGUAGE_LABELS: Record<string, string> = {
  ts: "TypeScript",
  tsx: "TSX",
  typescript: "TypeScript",
  js: "JavaScript",
  jsx: "JavaScript",
};

const FALLBACK_LANGUAGE: HighlightLanguage = "typescript";

function resolveLanguage(language?: string): HighlightLanguage {
  if (!language) {
    return FALLBACK_LANGUAGE;
  }

  const normalised = language.toLowerCase();

  if (normalised in LANGUAGE_ALIASES) {
    return LANGUAGE_ALIASES[normalised];
  }

  return normalised as BundledLanguage;
}

function extractTitle(meta?: string | null): string | null {
  if (!meta) {
    return null;
  }

  const match = meta.match(/title\s*=\s*("|')(.*?)(\1)/);

  if (!match) {
    return null;
  }

  return match[2];
}

function formatLanguageLabel(
  original?: string | null,
  resolved?: HighlightLanguage,
): string {
  const source = (
    original ?? (typeof resolved === "string" ? resolved : null)
  )?.toLowerCase();

  if (!source) {
    return "Code";
  }

  return LANGUAGE_LABELS[source] ?? source.toUpperCase();
}

interface CodeBlockClientProps {
  code: string;
  language?: string | null;
  meta?: string | null;
}

export function CodeBlockClient({
  code,
  language,
  meta,
}: CodeBlockClientProps) {
  const [html, setHtml] = useState<string>("");
  const lang = resolveLanguage(language ?? undefined);
  const title = extractTitle(meta);
  const displayLabel = title ?? formatLanguageLabel(language, lang);
  const normalizedCode = code.replace(/[\r\n]*$/u, "");

  useEffect(() => {
    async function highlight() {
      const highlightedHtml = await codeToHtml(normalizedCode, {
        lang: lang as unknown as BundledLanguage,
        themes: {
          light: "github-light",
          dark: "github-dark",
        },
        defaultColor: false,
      });
      setHtml(highlightedHtml);
    }
    highlight();
  }, [normalizedCode, lang]);

  return (
    <figure
      className="not-prose overflow-hidden rounded border border-border bg-muted/20"
      data-language={language ?? lang}
    >
      <figcaption className="flex items-center justify-between border-b bg-muted/40 px-2 py-1 text-xs font-medium text-muted-foreground">
        <span className="truncate">{displayLabel}</span>
        <CopyButton value={normalizedCode} />
      </figcaption>
      <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-280px)] bg-[#ffffff] dark:bg-[#0d1117]">
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </figure>
  );
}
