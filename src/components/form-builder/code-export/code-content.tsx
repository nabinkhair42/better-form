"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { CodeExport } from "./code-export";

export function CodeContent() {
  return (
    <div className="flex-1 bg-sidebar overflow-hidden">
      <div className="h-full flex flex-col">
        <div className="space-y-2 border-b p-4 h-[93px] shrink-0">
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Export Code
          </h2>
          <p className="text-sm text-muted-foreground">
            Copy the generated code to use in your project
          </p>
        </div>
        <ScrollArea className="flex-1">
          <CodeExport />
        </ScrollArea>
      </div>
    </div>
  );
}
