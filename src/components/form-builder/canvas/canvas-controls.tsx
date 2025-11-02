"use client";

import { Button } from "@/components/ui/button";
import { RotateCcw, ZoomIn, ZoomOut } from "lucide-react";

type CanvasControlsProps = {
  zoom: number;
  minZoom: number;
  maxZoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
};

export function CanvasControls({
  zoom,
  minZoom,
  maxZoom,
  onZoomIn,
  onZoomOut,
  onReset,
}: CanvasControlsProps) {
  const disableZoomOut = zoom <= minZoom;
  const disableZoomIn = zoom >= maxZoom;

  return (
    <div className="absolute bottom-4 right-4 z-10">
      <div className="flex items-center gap-2 bg-card border rounded-lg p-2 shadow-sm">
        <Button
          variant="ghost"
          size="sm"
          onClick={onZoomOut}
          disabled={disableZoomOut}
          className="h-8 w-8 p-0"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium min-w-12 text-center">
          {Math.round(zoom)}%
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onZoomIn}
          disabled={disableZoomIn}
          className="h-8 w-8 p-0"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <div className="w-px h-4 bg-border mx-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-8 w-8 p-0"
          title="Reset zoom and position"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
