"use client";

import { Snippet } from "@/components/ui/snippet";
import type { PackageManager } from "@/stores/package-manager-store";
import { useRegistryGenerator } from "@/hooks/use-registry-generator";
import type { DependencyPlan } from "@/lib/dependencies";
import type { FilePlan } from "@/types/codegen";
import { useEffect, useMemo, useRef, useState } from "react";

const PACKAGE_MANAGERS: PackageManager[] = ["npm", "pnpm", "yarn", "bun"];

interface CliTabProps {
  formName: string;
  filePlan: FilePlan;
  dependencyPlan: DependencyPlan;
}

export function CliTab({ formName, filePlan, dependencyPlan }: CliTabProps) {
  const [registryUrl, setRegistryUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uniqueId] = useState(() => {
    // Generate unique ID once on mount (timestamp + random)
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 7);
    return `${timestamp}-${random}`;
  });
  const { generateRegistryItem } = useRegistryGenerator();

  // Track if we've already generated to prevent duplicate calls
  const hasGeneratedRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const itemName = formName
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();

  // Auto-generate and store registry on mount
  useEffect(() => {
    // Prevent duplicate calls
    if (hasGeneratedRef.current) {
      return;
    }

    const generateAndStoreRegistry = async () => {
      // Cancel any in-flight request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller for this request
      abortControllerRef.current = new AbortController();

      setIsLoading(true);

      try {
        const registryItem = await generateRegistryItem(
          formName,
          filePlan,
          dependencyPlan
        );

        if (registryItem) {
          const registryId = `${itemName}-${uniqueId}`;

          // Store the registry with abort signal
          const storeResponse = await fetch("/api/r/store", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ registryId, registryItem }),
            signal: abortControllerRef.current.signal,
          });

          if (storeResponse.ok) {
            const { url } = await storeResponse.json();
            setRegistryUrl(url);
            hasGeneratedRef.current = true; // Mark as successfully generated
          } else {
            console.error("Failed to store registry");
          }
        }
      } catch (error) {
        // Ignore abort errors
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }
        console.error("Failed to generate registry:", error);
      } finally {
        setIsLoading(false);
      }
    };

    generateAndStoreRegistry();

    // Cleanup: abort any in-flight requests when component unmounts
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
    // Only run once on mount - we use refs to prevent re-runs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const installCommands = useMemo(() => {
    if (!registryUrl) {
      return {} as Partial<Record<PackageManager, string>>;
    }

    return PACKAGE_MANAGERS.reduce<Partial<Record<PackageManager, string>>>(
      (acc, pm) => {
        switch (pm) {
          case "npm":
            acc[pm] = `npx shadcn@latest add ${registryUrl}`;
            break;
          case "pnpm":
            acc[pm] = `pnpm dlx shadcn@latest add ${registryUrl}`;
            break;
          case "yarn":
            acc[pm] = `yarn dlx shadcn@latest add ${registryUrl}`;
            break;
          case "bun":
            acc[pm] = `bunx shadcn@latest add ${registryUrl}`;
            break;
        }
        return acc;
      },
      {},
    );
  }, [registryUrl]);

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

        {isLoading || !registryUrl ? (
          <div className="rounded-lg border border-dashed border-muted-foreground/30 bg-muted/50 p-4 text-center">
            <p className="text-sm text-muted-foreground">
              Generating registry...
            </p>
          </div>
        ) : (
          <Snippet commands={installCommands} />
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
    </div>
  );
}
