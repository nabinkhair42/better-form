"use client";

import { CodeBlock, CodeBlockCode, CodeBlockGroup } from "@/components/ui/code-block";
import { CopyButton } from "@/components/ui/copy-button";
import { Snippet } from "@/components/ui/snippet";
import type { DependencyPlan } from "@/lib/dependencies";
import type { FilePlan } from "@/types/codegen";

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

  const shadcnResources = dependencyPlan.shadcn
    .map((item) => item.slug)
    .join(" ");

  const npmCommands = dependencyPlan.packages.reduce(
    (acc, pkg) => {
      acc.npm = acc.npm
        ? `${acc.npm} ${pkg.name}`
        : `npm install ${pkg.name}`;
      acc.pnpm = acc.pnpm
        ? `${acc.pnpm} ${pkg.name}`
        : `pnpm add ${pkg.name}`;
      acc.yarn = acc.yarn
        ? `${acc.yarn} ${pkg.name}`
        : `yarn add ${pkg.name}`;
      acc.bun = acc.bun
        ? `${acc.bun} ${pkg.name}`
        : `bun add ${pkg.name}`;
      return acc;
    },
    {
      npm: "" as string,
      pnpm: "" as string,
      yarn: "" as string,
      bun: "" as string,
    },
  );

  const shadcnCommands = shadcnResources
    ? {
        npm: `npx shadcn@latest add ${shadcnResources}`,
        pnpm: `pnpm dlx shadcn@latest add ${shadcnResources}`,
        yarn: `yarn dlx shadcn@latest add ${shadcnResources}`,
        bun: `bunx shadcn@latest add ${shadcnResources}`,
      }
    : {};

  return (
    <div className="space-y-8">
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
            <Snippet commands={npmCommands} />
          </div>
        )}

        {/* shadcn components */}
        {dependencyPlan.shadcn.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">shadcn/ui components</p>
            <Snippet commands={shadcnCommands} />
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
              <CodeBlock>
                <CodeBlockGroup className="border-b border-border bg-muted/40 px-4 py-2">
                  <span className="text-xs font-medium text-muted-foreground">
                    {file.displayPath}
                  </span>
                  <CopyButton
                    value={file.code}
                    aria-label={`Copy ${file.displayPath}`}
                  />
                </CodeBlockGroup>
                <CodeBlockCode
                  code={file.code}
                  language={file.language ?? "tsx"}
                />
              </CodeBlock>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
