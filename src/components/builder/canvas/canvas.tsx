"use client";

import { cn } from "@/lib/utils";
import { useFormStore } from "@/store/form-store";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useMemo } from "react";
import { SortableField } from "../sortable-field";
import { CanvasControls } from "./canvas-controls";
import { CanvasEmptyState } from "./canvas-empty-state";
import { CanvasFormHeader } from "./canvas-form-header";
import { CanvasTips } from "./canvas-tips";
import { useCanvasPanZoom } from "./use-canvas-pan-zoom";

export function Canvas() {
  const { formConfig, updateFormMeta } = useFormStore();

  const {
    canvasRef,
    zoom,
    offset,
    isDragging,
    minZoom,
    maxZoom,
    zoomIn,
    zoomOut,
    resetView,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    onPointerLeave,
  } = useCanvasPanZoom();

  const fieldIds = useMemo(
    () => formConfig.fields.map((field) => field.id),
    [formConfig.fields],
  );

  const handleNameSubmit = (value: string) => {
    updateFormMeta({ name: value });
  };

  const handleDescriptionSubmit = (value: string) => {
    updateFormMeta({ description: value });
  };

  return (
    <div className="w-full h-full flex flex-col relative bg-background">
      <CanvasControls
        zoom={zoom}
        minZoom={minZoom}
        maxZoom={maxZoom}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onReset={resetView}
      />

      <div
        ref={canvasRef}
        className={cn(
          "absolute inset-0",
          "bg-size-[20px_20px]",
          "bg-[radial-gradient(#d4d4d4_1px,transparent_1px)]",
          "dark:bg-[radial-gradient(#404040_1px,transparent_1px)]",
        )}
        style={{
          cursor: isDragging ? "grabbing" : "default",
          touchAction: "none",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onPointerLeave={onPointerLeave}
        onContextMenu={(event) => event.preventDefault()}
        onDragStart={(event) => event.preventDefault()}
      >
        <div
          className="absolute inset-0"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${
              zoom / 100
            })`,
            transformOrigin: "0 0",
          }}
        >
          <div className="flex items-start justify-center w-full h-full pt-16">
            <div className="w-full max-w-2xl space-y-6">
              <CanvasFormHeader
                name={formConfig.name}
                description={formConfig.description}
                onNameSubmit={handleNameSubmit}
                onDescriptionSubmit={handleDescriptionSubmit}
              />

              <div className="min-h-[500px] rounded-lg p-6 border bg-sidebar">
                {formConfig.fields.length === 0 ? (
                  <CanvasEmptyState />
                ) : (
                  <SortableContext
                    items={fieldIds}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-4">
                      {formConfig.fields.map((field) => (
                        <SortableField key={field.id} field={field} />
                      ))}
                    </div>
                  </SortableContext>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <CanvasTips />
    </div>
  );
}
