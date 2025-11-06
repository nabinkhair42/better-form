"use client";

import { CodeBlockClient } from "@/components/ui/code-block";
import type { DependencyPlan } from "@/lib/dependencies";
import type { FilePlan } from "@/types/codegen";
import { useState } from "react";
import {
  type PackageManager,
  PackageManagerSelector,
  buildNpmCommand,
  buildShadcnCommand,
} from "../../ui/package-manager-selector";

interface CliTabProps {
  filePlan: FilePlan;
  dependencyPlan: DependencyPlan;
}

export function CliTab({ filePlan, dependencyPlan }: CliTabProps) {
  const [packageManager, setPackageManager] = useState<PackageManager>("npm");

  const allFiles = [
    filePlan.schema,
    filePlan.form,
    ...filePlan.customComponents,
  ];

  const shadcnResources = dependencyPlan.shadcn
    .map((item) => item.slug)
    .join(" ");
  const npmPackages = dependencyPlan.packages.map((pkg) => pkg.name).join(" ");

  const shadcnCommand = buildShadcnCommand(packageManager, shadcnResources);
  const npmCommand = buildNpmCommand(packageManager, npmPackages);

  return (
    <div className="space-y-8">
      {/* Package Manager Selector */}
      <PackageManagerSelector
        value={packageManager}
        onValueChange={setPackageManager}
      />

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
          <CodeBlockClient
            code={shadcnCommand}
            language="bash"
            label="Install shadcn/ui components"
          />
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
          <CodeBlockClient
            code={npmCommand}
            language="bash"
            label="Install npm packages"
          />
        </section>
      )}

      {/* Step 3: Generated Files */}
      <section className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-1">
            {getStepNumber(dependencyPlan)}. Generated Files
          </h3>
          <p className="text-sm text-muted-foreground">
            Copy these files into your project at the specified paths.
          </p>
        </div>
        <div className="space-y-6">
          {allFiles.map((file) => (
            <div key={file.id} className="space-y-2">
              {file.description && (
                <p className="text-xs text-muted-foreground">
                  {file.description}
                </p>
              )}
              <CodeBlockClient
                code={file.code}
                language={file.language}
                meta={`title="${file.displayPath}"`}
              />
            </div>
          ))}
        </div>
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

function getStepNumber(plan: DependencyPlan): number {
  let step = 1;
  if (plan.shadcn.length > 0) step++;
  if (plan.packages.length > 0) step++;
  return step;
}
