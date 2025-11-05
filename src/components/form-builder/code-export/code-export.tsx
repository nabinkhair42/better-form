"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, type ReactNode } from "react";
import { CodeExportEmptyState } from "./code-export-empty-state";
import { ManualTab } from "./manual-tab";
import { useCodeExportData } from "./use-code-export-data";

type CodeTabId = "manual";
// type CodeTabId = "manual" | "cli";

const CODE_TABS: { id: CodeTabId; label: string }[] = [
  { id: "manual", label: "Manual" },
  // { id: "cli", label: "CLI" },
];

export function CodeExport() {
  const { hasFields, filePlan, dependencyPlan } = useCodeExportData();
  const [activeTab, setActiveTab] = useState<CodeTabId>(
    CODE_TABS[0]?.id ?? "manual"
  );

  if (!hasFields) {
    return <CodeExportEmptyState />;
  }

  const panels: Record<CodeTabId, ReactNode> = {
    manual: <ManualTab filePlan={filePlan} dependencyPlan={dependencyPlan} />,
    // cli: <CliTab filePlan={filePlan} dependencyPlan={dependencyPlan} />,
  };

  return (
    <ScrollArea className="p-4! h-screen">
      <div className="flex items-center gap-1 mb-6">
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
