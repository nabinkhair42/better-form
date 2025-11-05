"use client";

import { CodeBlockClient } from "@/components/ui/extended/code-block-client";
import { Snippet } from "@/components/ui/extended/snippet";
import type { FilePlan } from "@/lib/codegen/types";
import type { DependencyPlan } from "@/lib/dependencies";

interface ManualTabProps {
  filePlan: FilePlan;
  dependencyPlan: DependencyPlan;
}

export function ManualTab({ filePlan, dependencyPlan }: ManualTabProps) {
  const allFiles = [
    filePlan.schema,
    filePlan.form,
    ...filePlan.customComponents,
  ];

  return (
    <div className="space-y-8">
      {/* Dependencies */}
      <section className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-1">
            Install Dependencies
          </h3>
          <p className="text-sm text-muted-foreground">
            Run these commands to install required dependencies.
          </p>
        </div>

        {/* shadcn components */}
        {dependencyPlan.shadcn.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">shadcn/ui components</p>
            <Snippet
              label="Install shadcn/ui components"
              value={`npx shadcn@latest add ${dependencyPlan.shadcn
                .map((item) => item.slug)
                .join(" ")}`}
            />
            {/*  No One is interested in explaination  */}

            {/* <ul className="text-xs text-muted-foreground space-y-1 pl-4">
              {dependencyPlan.shadcn.map((item) => (
                <li key={item.slug}>
                  • <span className="font-medium">{item.slug}</span> –{" "}
                  {item.reason}
                </li>
              ))}
            </ul> */}
          </div>
        )}

        {/* npm packages */}
        {dependencyPlan.packages.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">npm packages</p>
            <Snippet
              label="Install npm packages"
              value={`npm install ${dependencyPlan.packages
                .map((pkg) => pkg.name)
                .join(" ")}`}
            />

            {/*  No One is interested in explaination  */}

            {/* <ul className="text-xs text-muted-foreground space-y-1 pl-4">
              {dependencyPlan.packages.map((pkg) => (
                <li key={pkg.name}>
                  • <span className="font-medium">{pkg.name}</span> –{" "}
                  {pkg.reason}
                </li>
              ))}
            </ul> */}
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
            Generated Files
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
