"use client";

import { PanelSection } from "@/components/builder/layout/panel-section";
import { LivePreview } from "./live-preview";

export function PreviewContent() {
  return (
    <PanelSection title="Live Preview">
      <LivePreview />
    </PanelSection>
  );
}
