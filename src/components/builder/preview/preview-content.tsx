"use client";

import { PanelSection } from "@/components/builder/layout/panel-section";
import { LivePreview } from "./live-preview";

export function PreviewContent() {
  return (
    <PanelSection
      title="Live Preview"
      description="This is how your form will look and behave"
      contentClassName="max-w-4xl"
    >
      <LivePreview />
    </PanelSection>
  );
}
