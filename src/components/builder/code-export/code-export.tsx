"use client";

import { CliTab } from "@/components/builder/code-export/cli-tab";
import { CodeExportEmptyState } from "@/components/builder/code-export/code-export-empty-state";
import { ManualTab } from "@/components/builder/code-export/manual-tab";
import { useCodeExportData } from "@/components/builder/code-export/use-code-export-data";
import { Button } from "@/components/ui/shadcn/button";
import { useState, type ReactNode } from "react";

type CodeTabId = "manual" | "cli";

const CODE_TABS: { id: CodeTabId; label: string }[] = [
  { id: "cli", label: "CLI" },
  { id: "manual", label: "Manual" },
];

export function CodeExport() {
  const { hasFields, filePlan, dependencyPlan, formConfig } =
    useCodeExportData();
  const [activeTab, setActiveTab] = useState<CodeTabId>(
    CODE_TABS[0]?.id ?? "cli"
  );

  if (!hasFields) {
    return <CodeExportEmptyState />;
  }

  const panels: Record<CodeTabId, ReactNode> = {
    manual: <ManualTab filePlan={filePlan} dependencyPlan={dependencyPlan} />,
    cli: (
      <CliTab
        formName={formConfig.name}
        filePlan={filePlan}
        dependencyPlan={dependencyPlan}
      />
    ),
  };

  return (
    <div className="flex flex-col gap-4 p-4 max-w-5xl mx-auto">
      <div className="flex items-center gap-1 bg-muted p-1 rounded-lg mb-6 w-fit">
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
      {/* TODO: think of this unusual padding from buttom */}
      <div>{panels[activeTab]}</div>
    </div>
  );
}
