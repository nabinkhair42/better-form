import { create } from "zustand";

export type PackageManager = "npm" | "pnpm" | "yarn" | "bun";

type PackageManagerState = {
  selectedManager: PackageManager;
  setSelectedManager: (manager: PackageManager) => void;
};

const DEFAULT_MANAGER: PackageManager = "npm";

export const usePackageManagerStore = create<PackageManagerState>((set) => ({
  selectedManager: DEFAULT_MANAGER,
  setSelectedManager: (manager) => set({ selectedManager: manager }),
}));
