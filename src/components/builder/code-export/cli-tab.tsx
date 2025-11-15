"use client";

import { Snippet } from "@/components/ui/snippet";
import type { DependencyPlan } from "@/lib/dependencies";
import type { PackageManager } from "@/stores/package-manager-store";
import { useRegistryStore } from "@/stores/registry-store";
import type { FilePlan } from "@/types/codegen";
import { useEffect, useMemo, useRef } from "react";

const PACKAGE_MANAGERS: PackageManager[] = ["npm", "pnpm", "yarn", "bun"];
const DEBOUNCE_DELAY = 300;

interface CliTabProps {
  formName: string;
  filePlan: FilePlan;
  dependencyPlan: DependencyPlan;
}

export function CliTab({ formName, filePlan, dependencyPlan }: CliTabProps) {
  const {
    registryUrl,
    formHash: storedFormHash,
    isGenerating,
    error,
    generateRegistry,
  } = useRegistryStore();
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMountRef = useRef(true);

  // Create a simple hash to detect changes
  const formHash = useMemo(() => {
    return JSON.stringify({
      formName,
      schema: filePlan.schema.code,
      form: filePlan.form.code,
      deps: dependencyPlan.packages.map((p) => p.name).sort(),
    });
  }, [formName, filePlan, dependencyPlan]);

  // Auto-generate registry when form changes (debounced)
  useEffect(() => {
    // If hash matches and we have a URL, do nothing
    if (storedFormHash === formHash && registryUrl) {
      isInitialMountRef.current = false;
      return;
    }

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    const generate = () => {
      generateRegistry(formName, filePlan, dependencyPlan, formHash);
      isInitialMountRef.current = false;
    };

    // Generate immediately on initial mount (user just switched to Code tab)
    // Debounce for subsequent form changes to avoid excessive API calls
    if (isInitialMountRef.current) {
      generate();
    } else {
      debounceTimerRef.current = setTimeout(generate, DEBOUNCE_DELAY);
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [
    formHash,
    formName,
    filePlan,
    dependencyPlan,
    generateRegistry,
    storedFormHash,
    registryUrl,
  ]);

  const installCommands = useMemo(() => {
    // Show "Generating..." when loading, no URL, or hash mismatch
    const isValid = storedFormHash === formHash && registryUrl;
    if (isGenerating || !isValid) {
      return PACKAGE_MANAGERS.reduce<Partial<Record<PackageManager, string>>>(
        (acc, pm) => {
          acc[pm] = "Generating registry...";
          return acc;
        },
        {},
      );
    }

    // Show actual commands
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
  }, [registryUrl, isGenerating, storedFormHash, formHash]);

  return (
    <div className="space-y-6">
      {error && (
        <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20">
          <p className="font-medium">Failed to generate registry</p>
          <p className="text-xs mt-1">{error}</p>
        </div>
      )}

      <section className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-1">
            1. Installation Command
          </h3>
          <p className="text-sm text-muted-foreground">
            Run this command in your project root to install everything:
          </p>
        </div>

        <Snippet commands={installCommands} />
      </section>
    </div>
  );
}
