"use client";

import { CopyButton } from "@/components/ui/extended/copy-button";
import { cn } from "@/lib/utils";

interface SnippetProps {
  value: string;
  label?: string;
  className?: string;
  bodyClassName?: string;
}

export function Snippet({ value, label = "Snippet", className, bodyClassName }: SnippetProps) {
  return (
    <figure
      className={cn(
        "not-prose overflow-hidden rounded border border-border bg-muted/20",
        className,
      )}
    >
      <figcaption className="flex items-center justify-between border-b bg-muted/40 px-2 py-1 text-xs font-medium text-muted-foreground">
        <span className="truncate">{label}</span>
        <CopyButton value={value} />
      </figcaption>
      <pre
        className={cn(
          "max-h-[360px] overflow-x-auto bg-background px-3 py-2 text-xs sm:text-sm",
          bodyClassName,
        )}
      >
        <code className="whitespace-pre-wrap wrap-break-word">{value}</code>
      </pre>
    </figure>
  );
}
