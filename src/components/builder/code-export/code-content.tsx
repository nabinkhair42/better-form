"use client";

import { PanelSection } from "@/components/builder/layout/panel-section";
import { CodeExport } from "./code-export";

export function CodeContent() {
  return (
    <PanelSection
      title="Export Code"
      description="Copy the generated code to use in your project"
    >
      <CodeExport />
    </PanelSection>
  );
}
