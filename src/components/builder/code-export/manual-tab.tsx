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

interface ManualTabProps {
  filePlan: FilePlan;
  dependencyPlan: DependencyPlan;
}

export function ManualTab({ filePlan, dependencyPlan }: ManualTabProps) {
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

      {/* Dependencies */}
      <section className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-1">
            1. Install Dependencies
          </h3>
          <p className="text-sm text-muted-foreground">
            Run these commands to install required dependencies.
          </p>
        </div>
        {/* npm packages */}
        {dependencyPlan.packages.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Additional packages</p>
            <CodeBlockClient
              code={npmCommand}
              label="Install npm packages"
              language="bash"
            />
          </div>
        )}

        {/* shadcn components */}
        {dependencyPlan.shadcn.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">shadcn/ui components</p>
            <CodeBlockClient
              code={shadcnCommand}
              label="Install shadcn/ui components"
              language="bash"
            />
          </div>
        )}

        {/* Project components note */}
        {dependencyPlan.projectComponents.length > 0 && (
          <div className="rounded-md border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 px-3 py-2">
            <p className="text-xs text-amber-900 dark:text-amber-200">
              <span className="font-semibold">Note:</span> This form uses custom
              components (
              {dependencyPlan.projectComponents.map((c) => c.name).join(", ")})
              that are included in the generated files above.
            </p>
          </div>
        )}
      </section>

      {/* Generated Files */}
      <section className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-1">
            2. Generated Files
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
    </div>
  );
}
