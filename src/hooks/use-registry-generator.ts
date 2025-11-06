"use client";

import type { DependencyPlan } from "@/lib/dependencies";
import type { RegistryItem } from "@/lib/registry/registry-builder";
import type { FilePlan } from "@/types/codegen";
import { useState } from "react";

export function useRegistryGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateRegistryItem = async (
    formName: string,
    filePlan: FilePlan,
    dependencyPlan: DependencyPlan,
  ): Promise<RegistryItem | null> => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/registry/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formName,
          filePlan,
          dependencyPlan,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate registry item");
      }

      const registryItem: RegistryItem = await response.json();
      return registryItem;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateRegistryItem,
    isGenerating,
    error,
  };
}
