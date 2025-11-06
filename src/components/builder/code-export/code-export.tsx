"use client";

import { Button } from "@/components/ui/shadcn/button";
import { ScrollArea } from "@/components/ui/shadcn/scroll-area";
import { useState, type ReactNode } from "react";
import { CliTab } from "./cli-tab";
import { CodeExportEmptyState } from "./code-export-empty-state";
import { ManualTab } from "./manual-tab";
import { useCodeExportData } from "./use-code-export-data";

type CodeTabId = "manual" | "cli";

const CODE_TABS: { id: CodeTabId; label: string }[] = [
  { id: "cli", label: "CLI" },
  { id: "manual", label: "Manual" },
];

export function CodeExport() {
  const { hasFields, filePlan, dependencyPlan, formConfig } =
    useCodeExportData();
  const [activeTab, setActiveTab] = useState<CodeTabId>(
    CODE_TABS[0]?.id ?? "cli",
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
    <ScrollArea className="p-4! h-screen">
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
      <div className="space-y-4 max-w-4xl pb-40">{panels[activeTab]}</div>
    </ScrollArea>
  );
}
