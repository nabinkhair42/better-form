import type { DependencyPlan } from "@/lib/dependencies";
import type { FilePlan } from "@/types/codegen";

export interface RegistryItem {
  $schema?: string;
  name: string;
  type: string;
  title: string;
  description: string;
  dependencies?: string[];
  registryDependencies?: string[];
  files: Array<{
    path: string;
    content: string;
    type: string;
    target?: string;
  }>;
  meta?: Record<string, unknown>;
}

export interface Registry {
  $schema: string;
  name: string;
  homepage: string;
  items: Array<{
    name: string;
    type: string;
    title: string;
    description: string;
  }>;
}

export function buildRegistryItem(
  formName: string,
  filePlan: FilePlan,
  dependencyPlan: DependencyPlan,
): RegistryItem {
  const itemName = formName
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();

  /**
   * Files to include in the registry:
   * 1. Schema file (validation)
   * 2. Form component file
   * 3. Custom components (built on top of shadcn, but NOT in shadcn registry)
   *    - Examples: phone-input, country-dropdown, file-upload, etc.
   *    - These are distributed as files, not as registryDependencies
   *    - This ensures they work even if not published to a shadcn registry
   */
  const files = [
    {
      path: `components/better-form/schema/${itemName}.ts`,
      content: filePlan.schema.code,
      type: "registry:lib",
      target: `components/better-form/schema/${itemName}.ts`,
    },
    {
      path: `components/better-form/form/${itemName}.tsx`,
      content: filePlan.form.code,
      type: "registry:component",
      target: `components/better-form/form/${itemName}.tsx`,
    },
    // Add custom components (built on top of shadcn but not in shadcn registry)
    ...filePlan.customComponents.map((component) => ({
      path: component.path,
      content: component.code,
      type: "registry:ui",
      target: component.path,
    })),
  ];

  // Collect npm package dependencies
  const dependencies = dependencyPlan.packages.map((pkg) => pkg.name);

  /**
   * Registry dependencies: ONLY include shadcn/ui components from the official registry.
   * Custom project components (like phone-input, country-dropdown) are distributed
   * as files above, NOT as registryDependencies.
   */
  const registryDependencies = dependencyPlan.shadcn.map((item) => item.slug);

  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: itemName,
    type: "registry:block",
    title: formName,
    description: `A form component for ${formName}`,
    dependencies: dependencies.length > 0 ? dependencies : undefined,
    registryDependencies:
      registryDependencies.length > 0 ? registryDependencies : undefined,
    files: files.map((file) => ({
      path: file.path,
      content: file.content,
      type: file.type,
      target: file.target,
    })),
    meta: {
      generatedBy: "better-form",
      version: "1.2.0",
    },
  };
}

export function buildRegistry(
  items: Array<{
    name: string;
    type: string;
    title: string;
    description: string;
  }>,
): Registry {
  return {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "better-form",
    homepage: typeof window !== "undefined" ? window.location.origin : "",
    items,
  };
}
