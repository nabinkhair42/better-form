"use client";

import { LivePreview } from "./live-preview";

export function PreviewContent() {
  return (
    <div className="flex-1 bg-sidebar overflow-hidden">
      <div className="h-full flex flex-col">
        <div className="space-y-2 border-b p-4 h-[93px] shrink-0">
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Live Preview
          </h2>
          <p className="text-sm text-muted-foreground">
            This is how your form will look and behave
          </p>
        </div>
        <div className="flex-1 overflow-y-auto max-w-xl mx-left rounded-lg">
          <LivePreview />
        </div>
      </div>
    </div>
  );
}
