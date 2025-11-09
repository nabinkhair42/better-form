"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useMemo, useState } from "react";
import { codeToHtml } from "shiki";

export type CodeBlockProps = {
  children?: React.ReactNode;
  className?: string;
} & React.HTMLProps<HTMLDivElement>;

function CodeBlock({ children, className, ...props }: CodeBlockProps) {
  return (
    <div
      className={cn(
        "not-prose flex w-full min-w-0 flex-col overflow-hidden rounded-xl border max-w-[calc(100vw-2rem)] lg:max-w-lg xl:max-w-xl 2xl:max-w-5xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

type CodeBlockTheme =
  | string
  | {
      light?: string;
      dark?: string;
    };

const PRE_BASE_CLASSES =
  "relative min-w-0 max-h-[500px] overflow-auto bg-muted px-4 py-4 text-foreground [scrollbar-width:thin] [scrollbar-color:hsl(var(--border))_transparent] [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-border/80";

const CODE_BASE_CLASSES = "block min-w-max whitespace-pre";

const enhanceHighlightedHtml = (html: string) => {
  let next = html;

  if (/<pre[^>]*class="/.test(next)) {
    next = next.replace(
      /<pre([^>]*)class="([^"]*)"/,
      `<pre$1class="$2 ${PRE_BASE_CLASSES}"`
    );
  } else {
    next = next.replace("<pre", `<pre class=\"${PRE_BASE_CLASSES}\"`);
  }

  if (/<code[^>]*class="/.test(next)) {
    next = next.replace(
      /<code([^>]*)class="([^"]*)"/,
      `<code$1class="$2 ${CODE_BASE_CLASSES}"`
    );
  } else {
    next = next.replace("<code", `<code class=\"${CODE_BASE_CLASSES}\"`);
  }

  next = next.replace(/background-color:\s*[^;"']+;?/gi, "");

  return next;
};

export type CodeBlockCodeProps = {
  code: string;
  language?: string;
  theme?: CodeBlockTheme;
  className?: string;
} & React.HTMLProps<HTMLDivElement>;

function CodeBlockCode({
  code,
  language = "tsx",
  theme = { light: "github-light", dark: "github-dark" },
  className,
  style,
  ...rest
}: CodeBlockCodeProps) {
  const [highlightedHtml, setHighlightedHtml] = useState<string | null>(null);
  const [, setBackgroundColor] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const root = document.documentElement;

    const computeIsDark = () => {
      if (root.classList.contains("dark")) {
        return true;
      }
      if (root.classList.contains("light")) {
        return false;
      }
      return mediaQuery.matches;
    };

    const handleChange = () => {
      setIsDarkMode(computeIsDark());
    };

    handleChange();

    const observer =
      typeof MutationObserver !== "undefined"
        ? new MutationObserver(handleChange)
        : null;

    observer?.observe(root, { attributes: true, attributeFilter: ["class"] });

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      observer?.disconnect();
      if (typeof mediaQuery.removeEventListener === "function") {
        mediaQuery.removeEventListener("change", handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  const resolvedTheme = useMemo(() => {
    if (typeof theme === "string") {
      return theme;
    }

    const lightTheme = theme?.light ?? "github-light";
    const darkTheme = theme?.dark ?? "github-dark";

    return isDarkMode ? darkTheme : lightTheme;
  }, [theme, isDarkMode]);

  useEffect(() => {
    let isMounted = true;

    const highlight = async () => {
      if (!code) {
        if (isMounted) {
          setHighlightedHtml("<pre><code></code></pre>");
          setBackgroundColor(null);
        }
        return;
      }

      try {
        const html = await codeToHtml(code, {
          lang: language,
          theme: resolvedTheme,
        });

        if (isMounted) {
          setHighlightedHtml(enhanceHighlightedHtml(html));
          const backgroundMatch = html.match(/background-color:\s*([^;"']+)/i);
          setBackgroundColor(
            backgroundMatch ? backgroundMatch[1].trim() : null
          );
        }
      } catch (error) {
        if (isMounted) {
          setHighlightedHtml(
            enhanceHighlightedHtml("<pre><code></code></pre>")
          );
          setBackgroundColor(null);
        }
        console.error("Failed to highlight code", error);
      }
    };

    highlight();

    return () => {
      isMounted = false;
    };
  }, [code, language, resolvedTheme]);

  const classNames = cn("relative min-w-0 w-full text-[13px]", className);

  // SSR fallback: render plain code if not hydrated yet
  return highlightedHtml ? (
    <div
      className={classNames}
      dangerouslySetInnerHTML={{ __html: highlightedHtml }}
      style={style}
      {...rest}
    />
  ) : (
    <div className={classNames} style={style} {...rest}>
      <pre className={PRE_BASE_CLASSES}>
        <code className={CODE_BASE_CLASSES}>{code}</code>
      </pre>
    </div>
  );
}

export type CodeBlockGroupProps = React.HTMLAttributes<HTMLDivElement>;

function CodeBlockGroup({
  children,
  className,
  ...props
}: CodeBlockGroupProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { CodeBlock, CodeBlockCode, CodeBlockGroup };
