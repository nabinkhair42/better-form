"use client";

import { Button } from "@/components/ui/shadcn/button";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface CopyButtonProps {
  value: string;
  onCopy?: () => void;
  resetDelayMs?: number;
}

export function CopyButton({
  value,
  onCopy,
  resetDelayMs = 2000,
}: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const clipboardSupported =
    typeof navigator !== "undefined" && "clipboard" in navigator;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleCopy = async () => {
    if (!value || !clipboardSupported) return;

    try {
      await navigator.clipboard.writeText(value);
      setIsCopied(true);
      onCopy?.();

      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = window.setTimeout(() => {
        setIsCopied(false);
        timeoutRef.current = null;
      }, resetDelayMs);
    } catch (error) {
      console.error("Failed to copy value", error);
    }
  };

  if (!clipboardSupported) {
    return null;
  }

  return (
    <Button
      type="button"
      onClick={handleCopy}
      variant="ghost"
      size="icon"
      aria-label={isCopied ? "Copied" : "Copy"}
      className="h-7 w-7"
    >
      {isCopied ? <CheckIcon size={4} /> : <CopyIcon size={4} />}
    </Button>
  );
}
