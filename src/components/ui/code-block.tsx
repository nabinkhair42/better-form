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
        "not-prose flex w-full flex-col overflow-clip rounded-xl border",
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
  const [backgroundColor, setBackgroundColor] = useState<string | null>(null);
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
          setHighlightedHtml(html);
          const backgroundMatch = html.match(/background-color:\s*([^;"']+)/i);
          setBackgroundColor(backgroundMatch ? backgroundMatch[1].trim() : null);
        }
      } catch (error) {
        if (isMounted) {
          setHighlightedHtml("<pre><code></code></pre>");
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

  const classNames = cn(
    "w-full overflow-x-auto text-[13px] [&>pre]:px-4 [&>pre]:py-4",
    className
  );

  const combinedStyle = backgroundColor
    ? { backgroundColor, ...style }
    : style;

  // SSR fallback: render plain code if not hydrated yet
  return highlightedHtml ? (
    <div
      className={classNames}
      dangerouslySetInnerHTML={{ __html: highlightedHtml }}
      style={combinedStyle}
      {...rest}
    />
  ) : (
    <div className={classNames} style={combinedStyle} {...rest}>
      <pre>
        <code>{code}</code>
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
      className={cn("flex items-center justify-between", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export { CodeBlock, CodeBlockCode, CodeBlockGroup };
