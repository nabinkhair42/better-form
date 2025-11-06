"use client";

import { useState } from "react";

export type PackageManager = "npm" | "pnpm" | "yarn" | "bun";

const PACKAGE_MANAGERS: PackageManager[] = ["npm", "pnpm", "yarn", "bun"];

interface PackageManagerSelectorProps {
  value?: PackageManager;
  onValueChange?: (value: PackageManager) => void;
}

export function PackageManagerSelector({
  value: controlledValue,
  onValueChange,
}: PackageManagerSelectorProps) {
  const [internalValue, setInternalValue] = useState<PackageManager>("npm");
  const value = controlledValue ?? internalValue;

  const handleChange = (pm: PackageManager) => {
    if (onValueChange) {
      onValueChange(pm);
    } else {
      setInternalValue(pm);
    }
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-muted-foreground">
        Package Manager
      </p>
      <div className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/30 p-1">
        {PACKAGE_MANAGERS.map((pm) => (
          <button
            key={pm}
            type="button"
            onClick={() => handleChange(pm)}
            className={`rounded-sm px-3 py-1.5 text-xs font-medium transition-colors ${
              value === pm
                ? "bg-background text-foreground shadow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {pm}
          </button>
        ))}
      </div>
    </div>
  );
}

export function buildShadcnCommand(
  pm: PackageManager,
  resources: string,
): string {
  if (!resources) return "";

  switch (pm) {
    case "npm":
      return `npx shadcn@latest add ${resources}`;
    case "pnpm":
      return `pnpm dlx shadcn@latest add ${resources}`;
    case "yarn":
      return `yarn dlx shadcn@latest add ${resources}`;
    case "bun":
      return `bunx shadcn@latest add ${resources}`;
    default:
      return `npx shadcn@latest add ${resources}`;
  }
}

export function buildNpmCommand(pm: PackageManager, packages: string): string {
  if (!packages) return "";

  switch (pm) {
    case "npm":
      return `npm install ${packages}`;
    case "pnpm":
      return `pnpm add ${packages}`;
    case "yarn":
      return `yarn add ${packages}`;
    case "bun":
      return `bun add ${packages}`;
    default:
      return `npm install ${packages}`;
  }
}
