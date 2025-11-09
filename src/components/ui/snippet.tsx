"use client";

import { useEffect, useMemo } from "react";

import {
  CodeBlock,
  CodeBlockCode,
  CodeBlockGroup,
} from "@/components/ui/code-block";
import { CopyButton } from "@/components/ui/copy-button";
import { Button } from "@/components/ui/shadcn/button";
import { cn } from "@/lib/utils";
import {
  usePackageManagerStore,
  type PackageManager,
} from "@/stores/package-manager-store";

interface SnippetProps {
  commands: Partial<Record<PackageManager, string>>;
  language?: string;
  className?: string;
}

export function Snippet({
  commands,
  language = "bash",
  className,
}: SnippetProps) {
  const providers = useMemo<PackageManager[]>(
    () =>
      (Object.keys(commands) as PackageManager[]).filter(
        (pm): pm is PackageManager => Boolean(commands[pm]?.trim())
      ),
    [commands]
  );

  const { selectedManager, setSelectedManager } = usePackageManagerStore();

  useEffect(() => {
    if (!providers.length) {
      return;
    }

    if (!providers.includes(selectedManager)) {
      setSelectedManager(providers[0]);
    }
  }, [providers, selectedManager, setSelectedManager]);

  const activeProvider = useMemo<PackageManager | null>(() => {
    if (!providers.length) {
      return null;
    }

    return providers.includes(selectedManager) ? selectedManager : providers[0];
  }, [providers, selectedManager]);

  if (!providers.length || !activeProvider) {
    return null;
  }

  const activeCommand = commands[activeProvider]?.trim() ?? "";

  return (
    <CodeBlock className={className}>
      <CodeBlockGroup className="p-1">
        <div className="flex items-center gap-2">
          {providers.map((pm) => {
            const isActive = pm === activeProvider;
            return (
              <Button
                key={pm}
                className={cn(
                  "p-2 rounded-none bg-transparent text-foreground",
                  {
                    "border-b": isActive,
                    "border-none": !isActive,
                  }
                )}
                variant="ghost"
                onClick={() => setSelectedManager(pm)}
              >
                {pm}
              </Button>
            );
          })}
        </div>
        <CopyButton value={activeCommand} aria-label="Copy command" />
      </CodeBlockGroup>
      <CodeBlockCode code={activeCommand} language={language} />
    </CodeBlock>
  );
}
