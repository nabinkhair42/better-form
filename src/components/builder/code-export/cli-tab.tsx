"use client";

import { CodeBlockClient } from "@/components/ui/code-block";
import {
  type PackageManager,
  PackageManagerSelector,
} from "@/components/ui/package-manager-selector";
import { useRegistryGenerator } from "@/hooks/use-registry-generator";
import type { DependencyPlan } from "@/lib/dependencies";
import type { FilePlan } from "@/types/codegen";
import { useEffect, useState } from "react";

interface CliTabProps {
  formName: string;
  filePlan: FilePlan;
  dependencyPlan: DependencyPlan;
}

export function CliTab({ formName, filePlan, dependencyPlan }: CliTabProps) {
  const [packageManager, setPackageManager] = useState<PackageManager>("npm");
  const [registryUrl, setRegistryUrl] = useState<string | null>(null);
  const [uniqueId] = useState(() => {
    // Generate unique ID once on mount (timestamp + random)
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 7);
    return `${timestamp}-${random}`;
  });
  const { generateRegistryItem, isGenerating } = useRegistryGenerator();

  const itemName = formName
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();

  // Auto-generate and store registry on mount
  useEffect(() => {
    const generateAndStoreRegistry = async () => {
      try {
        const registryItem = await generateRegistryItem(
          formName,
          filePlan,
          dependencyPlan,
        );

        if (registryItem) {
          const registryId = `${itemName}-${uniqueId}`;

          // Store the registry
          const storeResponse = await fetch("/api/r/store", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ registryId, registryItem }),
          });

          if (storeResponse.ok) {
            const { url } = await storeResponse.json();
            setRegistryUrl(url);
          } else {
            console.error("Failed to store registry");
          }
        }
      } catch (error) {
        console.error("Failed to generate registry:", error);
      }
    };

    generateAndStoreRegistry();
  }, [
    formName,
    filePlan,
    dependencyPlan,
    itemName,
    uniqueId,
    generateRegistryItem,
  ]);

  const getInstallCommand = (pm: PackageManager): string => {
    if (!registryUrl) return "";

    switch (pm) {
      case "npm":
        return `npx shadcn@latest add ${registryUrl}`;
      case "pnpm":
        return `pnpm dlx shadcn@latest add ${registryUrl}`;
      case "yarn":
        return `yarn dlx shadcn@latest add ${registryUrl}`;
      case "bun":
        return `bunx shadcn@latest add ${registryUrl}`;
      default:
        return `npx shadcn@latest add ${registryUrl}`;
    }
  };

  const installCommand = getInstallCommand(packageManager);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">One-Command Installation</h2>
        <p className="text-sm text-muted-foreground">
          Install this form component directly into your project with a single
          CLI command. This will automatically add all files, install
          dependencies, and configure shadcn/ui components.
        </p>
      </div>

      {/* Package Manager Selector */}
      <PackageManagerSelector
        value={packageManager}
        onValueChange={setPackageManager}
      />

      {/* Main Installation Command */}
      <section className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-1">
            Installation Command
          </h3>
          <p className="text-sm text-muted-foreground">
            Run this command in your project root to install everything:
          </p>
        </div>

        {isGenerating || !registryUrl ? (
          <div className="rounded-lg border border-dashed border-muted-foreground/30 bg-muted/50 p-4 text-center">
            <p className="text-sm text-muted-foreground">
              Generating registry...
            </p>
          </div>
        ) : (
          <CodeBlockClient
            code={installCommand}
            language="bash"
            label={`Install with ${packageManager}`}
          />
        )}
      </section>

      {/* What Gets Installed */}
      <section className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-1">
            What Gets Installed
          </h3>
          <p className="text-sm text-muted-foreground">
            This command will automatically:
          </p>
        </div>

        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
            <span>
              Install {dependencyPlan.shadcn.length} shadcn/ui component
              {dependencyPlan.shadcn.length !== 1 ? "s" : ""} (
              {dependencyPlan.shadcn.map((c) => c.slug).join(", ")})
            </span>
          </li>
          {dependencyPlan.packages.length > 0 && (
            <li className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400 mt-0.5">
                ✓
              </span>
              <span>
                Install {dependencyPlan.packages.length} npm package
                {dependencyPlan.packages.length !== 1 ? "s" : ""} (
                {dependencyPlan.packages.map((p) => p.name).join(", ")})
              </span>
            </li>
          )}
          <li className="flex items-start gap-2">
            <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
            <span>
              Create {filePlan.customComponents.length + 2} file
              {filePlan.customComponents.length + 2 !== 1 ? "s" : ""}: schema,
              form component
              {filePlan.customComponents.length > 0 &&
                `, and ${filePlan.customComponents.length} custom component${
                  filePlan.customComponents.length !== 1 ? "s" : ""
                }`}
            </span>
          </li>
        </ul>
      </section>

      {/* Note about hosting */}
      <div className="rounded-md border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 px-3 py-3 space-y-2">
        <p className="text-xs font-semibold text-blue-900 dark:text-blue-200">
          � Setup Required
        </p>
        <p className="text-xs text-blue-900 dark:text-blue-200">
          The API route at{" "}
          <code className="px-1 py-0.5 rounded bg-blue-100 dark:bg-blue-900">
            {registryUrl}
          </code>{" "}
          needs to return the registry JSON for this command to work.
        </p>
      </div>
    </div>
  );
}
