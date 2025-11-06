"use client";

import type { ProjectComponentDependency } from "@/lib/dependencies";
import { DependencySummary } from "@/lib/dependencies";

interface DependenciesListProps {
  summary: DependencySummary;
  projectComponents?: ProjectComponentDependency[];
}

export function DependenciesList({ summary, projectComponents }: DependenciesListProps) {
  const { shadcn, packages } = summary;

  return (
    <div className="space-y-4 text-sm">
      <div>
        <p className="font-medium mb-2">shadcn/ui components</p>
        {shadcn.length === 0 ? (
          <p className="text-muted-foreground">No UI components required.</p>
        ) : (
          <ul className="list-disc pl-5 text-muted-foreground">
            {shadcn.map((component) => (
              <li key={component}>{component}</li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <p className="font-medium mb-2">npm packages</p>
        {packages.length === 0 ? (
          <p className="text-muted-foreground">
            No additional packages required.
          </p>
        ) : (
          <ul className="list-disc pl-5 text-muted-foreground">
            {packages.map((pkg) => (
              <li key={pkg.name}>
                <span className="font-semibold">{pkg.name}</span> – {pkg.reason}
              </li>
            ))}
          </ul>
        )}
      </div>
      {projectComponents && projectComponents.length > 0 && (
        <div>
          <p className="font-medium mb-2">project components</p>
          <ul className="list-disc pl-5 text-muted-foreground">
            {projectComponents.map((component) => (
              <li key={component.name}>
                <span className="font-semibold">{component.name}</span> – {component.reason}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
