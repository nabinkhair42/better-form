"use client";

import { Button } from "@/components/ui/button";
import { CodeBlockClient } from "@/components/ui/extended/code-block-client";
import { type ReactNode, useState } from "react";
import { CodeExportEmptyState } from "./code-export-empty-state";
import { DependenciesList } from "./dependencies-list";
import { useCodeExportData } from "./use-code-export-data";

type CodeTabId = "schema" | "component" | "deps";

const CODE_TABS: { id: CodeTabId; label: string }[] = [
  { id: "schema", label: "Zod Schema" },
  { id: "component", label: "React Component" },
  { id: "deps", label: "Dependencies" },
];

export function CodeExport() {
  const { hasFields, schema, component, dependencies } = useCodeExportData();
  const [activeTab, setActiveTab] = useState<CodeTabId>(
    CODE_TABS[0]?.id ?? "schema",
  );

  if (!hasFields) {
    return <CodeExportEmptyState />;
  }

  const panels: Record<CodeTabId, ReactNode> = {
    schema: (
      <CodeBlockClient
        code={schema}
        language="typescript"
        meta='title="schema.ts"'
      />
    ),
    component: (
      <CodeBlockClient
        code={component}
        language="tsx"
        meta='title="form-component.tsx"'
      />
    ),
    deps: <DependenciesList summary={dependencies} />,
  };

  return (
    <div className="p-4">
      <div className="flex items-center gap-1 bg-muted p-1 rounded-lg mb-6 max-w-fit">
        {CODE_TABS.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab(tab.id)}
            className="h-8"
          >
            {tab.label}
          </Button>
        ))}
      </div>

      <div className="space-y-4">{panels[activeTab]}</div>
    </div>
  );
}
