"use client";

import { CopyButton } from "@/components/ui/extended/copy-button";
import type { DependencyPlan } from "@/lib/dependencies";
import type { FilePlan } from "@/lib/codegen/types";
import { useState } from "react";

interface CliTabProps {
  filePlan: FilePlan;
  dependencyPlan: DependencyPlan;
}

type PackageManager = "npm" | "pnpm" | "yarn" | "bun";

const PACKAGE_MANAGERS: PackageManager[] = ["npm", "pnpm", "yarn", "bun"];

export function CliTab({ filePlan, dependencyPlan }: CliTabProps) {
  const [packageManager, setPackageManager] = useState<PackageManager>("npm");

  const allFiles = [
    filePlan.schema,
    filePlan.form,
    ...filePlan.customComponents,
  ];

  const shadcnCommand = buildShadcnCommand(packageManager, dependencyPlan);
  const npmCommand = buildNpmCommand(packageManager, dependencyPlan);
  const scaffoldCommand = buildScaffoldCommand(allFiles);

  return (
    <div className="space-y-8">
      {/* Package Manager Selector */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">
          Package Manager
        </p>
        <div className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/30 p-1">
          {PACKAGE_MANAGERS.map((pm) => (
            <button
              key={pm}
              type="button"
              onClick={() => setPackageManager(pm)}
              className={`rounded-sm px-3 py-1.5 text-xs font-medium transition-colors ${
                packageManager === pm
                  ? "bg-background text-foreground shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {pm}
            </button>
          ))}
        </div>
      </div>

      {/* Step 1: Install shadcn components */}
      {dependencyPlan.shadcn.length > 0 && (
        <section className="space-y-3">
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-1">
              1. Install shadcn/ui Components
            </h3>
            <p className="text-sm text-muted-foreground">
              Add required UI primitives to your project.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-md border border-border bg-muted/20 px-3 py-2">
            <code className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-xs sm:text-sm">
              {shadcnCommand}
            </code>
            <CopyButton value={shadcnCommand} />
          </div>
        </section>
      )}

      {/* Step 2: Install npm packages */}
      {dependencyPlan.packages.length > 0 && (
        <section className="space-y-3">
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-1">
              {dependencyPlan.shadcn.length > 0 ? "2" : "1"}. Install npm
              Packages
            </h3>
            <p className="text-sm text-muted-foreground">
              Install package dependencies for the generated form.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-md border border-border bg-muted/20 px-3 py-2">
            <code className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-xs sm:text-sm">
              {npmCommand}
            </code>
            <CopyButton value={npmCommand} />
          </div>
        </section>
      )}

      {/* Step 3: Scaffold files */}
      <section className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-1">
            {getStepNumber(dependencyPlan)}. Scaffold Form Files
          </h3>
          <p className="text-sm text-muted-foreground">
            Create the directory structure and copy generated files to your
            project.
          </p>
        </div>
        <div className="flex items-start gap-3 rounded-md border border-border bg-muted/20 px-3 py-2">
          <code className="flex-1 overflow-x-auto text-xs whitespace-pre">
            {scaffoldCommand}
          </code>
          <CopyButton value={scaffoldCommand} />
        </div>
        <p className="text-xs text-muted-foreground">
          This command creates the necessary directories and writes all
          generated files to <code className="text-foreground">/components/better-form/</code> in your project.
        </p>
      </section>

      {/* Custom components note */}
      {dependencyPlan.projectComponents.length > 0 && (
        <div className="rounded-md border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 px-3 py-3 space-y-2">
          <p className="text-xs font-semibold text-blue-900 dark:text-blue-200">
            Custom Components Included
          </p>
          <p className="text-xs text-blue-900 dark:text-blue-200">
            This form uses custom composite components (
            {dependencyPlan.projectComponents.map((c) => c.name).join(", ")})
            built on shadcn primitives. The scaffold command above will create
            these files in <code>/components/better-form/components/</code>.
          </p>
        </div>
      )}
    </div>
  );
}

function buildShadcnCommand(
  pm: PackageManager,
  plan: DependencyPlan,
): string {
  if (plan.shadcn.length === 0) return "";

  const resources = plan.shadcn.map((item) => item.slug).join(" ");

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

function buildNpmCommand(pm: PackageManager, plan: DependencyPlan): string {
  if (plan.packages.length === 0) return "";

  const packages = plan.packages.map((pkg) => pkg.name).join(" ");

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

function buildScaffoldCommand(
  files: Array<{ path: string; code: string }>,
): string {
  const commands: string[] = [];

  // Create directories
  const dirs = new Set(
    files.map((f) => f.path.split("/").slice(0, -1).join("/")),
  );
  dirs.forEach((dir) => {
    commands.push(`mkdir -p ${dir}`);
  });

  // Write files
  files.forEach((file) => {
    const escapedCode = file.code
      .replace(/\\/g, "\\\\")
      .replace(/`/g, "\\`")
      .replace(/\$/g, "\\$");
    commands.push(`cat > ${file.path} << 'EOF'\n${file.code}\nEOF`);
  });

  return commands.join(" && \\\n  ");
}

function getStepNumber(plan: DependencyPlan): number {
  let step = 1;
  if (plan.shadcn.length > 0) step++;
  if (plan.packages.length > 0) step++;
  return step;
}
