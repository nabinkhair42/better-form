"use client";

import { ScrollArea } from "@/components/ui/shadcn/scroll-area";
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
        <ScrollArea className="flex-1 h-0">
          <div className="max-w-4xl">
            <LivePreview />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
