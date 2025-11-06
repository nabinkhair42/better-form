"use client";

import { Button } from "@/components/ui/shadcn/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/shadcn/popover";
import { HelpCircle } from "lucide-react";

export function CanvasTips() {
  return (
    <div className="absolute bottom-4 left-4 z-10" data-stop-canvas-pan>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Canvas tips</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          side="top"
          align="start"
          className="w-64 text-xs space-y-2"
          data-stop-canvas-pan
        >
          <p className="font-medium text-foreground">Quick navigation</p>
          <ol className="space-y-2 text-muted-foreground">
            <li>Use Ctrl/Cmd + scroll or pinch to zoom</li>
            <li>Drag empty space or two fingers to pan the canvas</li>
            <li>Drag fields to reorder, click to edit details</li>
          </ol>
        </PopoverContent>
      </Popover>
    </div>
  );
}
