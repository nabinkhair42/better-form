import type { DependencyPlan } from "@/lib/dependencies";
import type { FilePlan } from "@/types/codegen";
import { create } from "zustand";

interface RegistryStore {
  registryUrl: string | null;
  formHash: string | null; // Track which form this registry belongs to
  isGenerating: boolean;
  error: string | null;

  // Simple function to generate and store registry
  generateRegistry: (
    formName: string,
    filePlan: FilePlan,
    dependencyPlan: DependencyPlan,
    formHash: string,
  ) => Promise<void>;

  // Reset state
  reset: () => void;
}

// Generate unique ID once per session
const uniqueId = (() => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `${timestamp}-${random}`;
})();

export const useRegistryStore = create<RegistryStore>((set) => ({
  registryUrl: null,
  formHash: null,
  isGenerating: false,
  error: null,

  generateRegistry: async (formName, filePlan, dependencyPlan, formHash) => {
    set({ isGenerating: true, error: null });

    try {
      // Single API call: generate + store, returns URL
      const response = await fetch("/api/registry/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formName, filePlan, dependencyPlan, uniqueId }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to generate registry");
      }

      const { url } = await response.json();

      // Update state with the URL and form hash
      set({ registryUrl: url, formHash, isGenerating: false, error: null });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to generate registry";
      set({ error: errorMessage, isGenerating: false });
    }
  },

  reset: () =>
    set({
      registryUrl: null,
      formHash: null,
      isGenerating: false,
      error: null,
    }),
}));
