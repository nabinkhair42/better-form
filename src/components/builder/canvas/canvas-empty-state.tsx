"use client";

import { Plus } from "lucide-react";

export function CanvasEmptyState() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center space-y-2">
        <div className="mx-auto bg-muted h-14 w-14 aspect-square rounded flex items-center justify-center">
          <Plus className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="text-lg font-medium text-muted-foreground">
          No fields yet
        </p>
        <p className="text-sm text-muted-foreground">
          Click the + button in the sidebar to add fields
        </p>
      </div>
    </div>
  );
}
