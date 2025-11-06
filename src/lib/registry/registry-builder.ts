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

  // Collect all files
  const files = [
    {
      path: `registry/default/${itemName}/${filePlan.schema.path}`,
      content: filePlan.schema.code,
      type: "registry:lib",
    },
    {
      path: `registry/default/${itemName}/${filePlan.form.path}`,
      content: filePlan.form.code,
      type: "registry:component",
    },
    ...filePlan.customComponents.map((component) => ({
      path: `registry/default/${itemName}/${component.path}`,
      content: component.code,
      type: "registry:ui",
    })),
  ];

  // Collect dependencies
  const dependencies = dependencyPlan.packages.map((pkg) => pkg.name);

  // Collect registry dependencies (shadcn components)
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
    })),
    meta: {
      generatedBy: "better-form",
      version: "1.0.0",
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
