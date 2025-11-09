"use client";

import { useEffect, useMemo } from "react";

import { BunIcon, NpmIcon, PnpmIcon, YarnIcon } from "@/assets/icons";
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

  const renderIcon = (pm: PackageManager) => {
    const iconClassName = "size-4";

    switch (pm) {
      case "npm":
        return <NpmIcon className={iconClassName} />;
      case "pnpm":
        return <PnpmIcon className={iconClassName} />;
      case "yarn":
        return <YarnIcon className={iconClassName} />;
      case "bun":
        return <BunIcon className={iconClassName} />;
      default:
        return null;
    }
  };

  return (
    <CodeBlock className={className}>
      <CodeBlockGroup className="p-1">
        <div className="flex items-center">
          {providers.map((pm) => {
            const isActive = pm === activeProvider;
            return (
              <Button
                key={pm}
                className={cn(
                  "flex items-center gap-2 rounded-none rounded-t bg-transparent text-foreground px-3 py-2",
                  {
                    "border-b": isActive,
                    "border-none": !isActive,
                  }
                )}
                variant="ghost"
                onClick={() => setSelectedManager(pm)}
              >
                {renderIcon(pm)}
                <span className="text-sm capitalize hidden md:flex">{pm}</span>
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
