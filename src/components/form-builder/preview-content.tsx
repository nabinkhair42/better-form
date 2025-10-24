"use client";

import { LivePreview } from "./live-preview";

export function PreviewContent() {
  return (
    <div className="flex-1 bg-sidebar">
      <div className="h-full space-y-6">
        <div className="space-y-2 border-b p-4 h-[93px]">
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Live Preview
          </h2>
          <p className="text-sm text-muted-foreground">
            This is how your form will look and behave
          </p>
        </div>
        <div className="flex-1 overflow-y-auto max-w-xl mx-auto bg-background rounded-lg">
          <LivePreview />
        </div>
      </div>
    </div>
  );
}
