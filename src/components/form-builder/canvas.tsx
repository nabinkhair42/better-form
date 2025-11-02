"use client";

import { SortableField } from "@/components/form-builder/sortable-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import {
  DEFAULT_ZOOM,
  MAX_ZOOM,
  MIN_ZOOM,
  Point,
  ZOOM_BUTTON_STEP,
  clampZoom,
  computeOffsetForZoom,
  getCanvasCenterPoint,
  getDistance,
  getMidpoint,
  getWheelScale,
  isPanStartAllowed,
} from "@/lib/canvas-utils";
import { cn } from "@/lib/utils";
import { useFormStore } from "@/store/form-store";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Edit2,
  HelpCircle,
  Plus,
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export function Canvas() {
  const { formConfig, updateFormMeta } = useFormStore();
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [isDragging, setIsDragging] = useState(false);
  const [canvasOffset, setCanvasOffset] = useState<Point>({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef(zoom);
  const offsetRef = useRef(canvasOffset);
  const activePointers = useRef(new Map<number, Point>());
  const pinchState = useRef<{
    lastDistance: number;
    lastMidpoint: Point;
  } | null>(null);
  const panState = useRef<{
    pointerId: number;
    startPoint: Point;
    startOffset: Point;
    active: boolean;
  } | null>(null);

  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);

  useEffect(() => {
    offsetRef.current = canvasOffset;
  }, [canvasOffset]);

  const handleTitleSubmit = (value: string) => {
    updateFormMeta({ name: value || "Untitled Form" });
    setEditingTitle(false);
  };

  const handleDescriptionSubmit = (value: string) => {
    updateFormMeta({ description: value || "Form description" });
    setEditingDescription(false);
  };

  const syncZoom = useCallback((value: number) => {
    zoomRef.current = value;
    setZoom(value);
  }, []);

  const syncOffset = useCallback((value: Point) => {
    offsetRef.current = value;
    setCanvasOffset(value);
  }, []);

  const applyZoom = useCallback(
    (value: number, focalPoint?: Point) => {
      const clamped = clampZoom(value, MIN_ZOOM, MAX_ZOOM);
      const prevZoom = zoomRef.current;

      if (!canvasRef.current) {
        if (clamped !== prevZoom) {
          syncZoom(clamped);
        }
        return;
      }

      if (clamped === prevZoom) {
        return;
      }

      const rect = canvasRef.current.getBoundingClientRect();
      const client = focalPoint ?? getCanvasCenterPoint(rect);
      const nextOffset = computeOffsetForZoom({
        client,
        rect,
        offset: offsetRef.current,
        previousZoom: prevZoom,
        nextZoom: clamped,
      });

      syncOffset(nextOffset);
      syncZoom(clamped);
    },
    [syncOffset, syncZoom],
  );

  const handleZoomIn = useCallback(() => {
    applyZoom(zoomRef.current + ZOOM_BUTTON_STEP);
  }, [applyZoom]);

  const handleZoomOut = useCallback(() => {
    applyZoom(zoomRef.current - ZOOM_BUTTON_STEP);
  }, [applyZoom]);

  const handleResetZoom = useCallback(() => {
    panState.current = null;
    pinchState.current = null;
    setIsDragging(false);
    syncOffset({ x: 0, y: 0 });
    syncZoom(DEFAULT_ZOOM);
  }, [syncOffset, syncZoom]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.pointerType === "mouse" && e.button !== 0) {
        return;
      }

      const target = e.target as HTMLElement | null;
      if (!isPanStartAllowed(target)) {
        return;
      }

      activePointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (activePointers.current.size === 1) {
        panState.current = {
          pointerId: e.pointerId,
          startPoint: { x: e.clientX, y: e.clientY },
          startOffset: offsetRef.current,
          active: false,
        };
      } else if (activePointers.current.size === 2) {
        const values = Array.from(activePointers.current.values());
        pinchState.current = {
          lastDistance: getDistance(values[0], values[1]),
          lastMidpoint: getMidpoint(values[0], values[1]),
        };
        panState.current = null;
        setIsDragging(false);
      }
    },
    [],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!activePointers.current.has(e.pointerId)) {
        return;
      }

      activePointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (pinchState.current && activePointers.current.size >= 2) {
        const points = Array.from(activePointers.current.values());
        const distance = getDistance(points[0], points[1]);
        const midpoint = getMidpoint(points[0], points[1]);
        const prevDistance = pinchState.current.lastDistance || distance;
        if (prevDistance === 0) {
          pinchState.current = {
            lastDistance: distance,
            lastMidpoint: midpoint,
          };
          return;
        }

        const prevZoom = zoomRef.current;
        const scaleDelta = distance / prevDistance;

        if (!Number.isFinite(scaleDelta) || scaleDelta === 0) {
          pinchState.current = {
            lastDistance: distance,
            lastMidpoint: midpoint,
          };
          return;
        }

        const proposedZoom = prevZoom * scaleDelta;
        const clamped = clampZoom(proposedZoom, MIN_ZOOM, MAX_ZOOM);
        const appliedScale = prevZoom === 0 ? 1 : clamped / prevZoom;

        if (canvasRef.current && clamped !== prevZoom) {
          const rect = canvasRef.current.getBoundingClientRect();
          const nextOffset = computeOffsetForZoom({
            client: midpoint,
            rect,
            offset: offsetRef.current,
            previousZoom: prevZoom,
            nextZoom: clamped,
          });
          syncOffset(nextOffset);
        }

        syncZoom(clamped);

        const adjustedDistance =
          appliedScale === 0 ? prevDistance : distance / appliedScale;
        pinchState.current = {
          lastDistance: adjustedDistance,
          lastMidpoint: midpoint,
        };
        return;
      }

      if (panState.current?.pointerId === e.pointerId) {
        const { startPoint, startOffset, active } = panState.current;
        const dx = e.clientX - startPoint.x;
        const dy = e.clientY - startPoint.y;

        if (!active) {
          const distanceMoved = Math.hypot(dx, dy);
          if (distanceMoved < 4) {
            return;
          }
          panState.current = {
            ...panState.current,
            active: true,
          };
          setIsDragging(true);
          if (e.currentTarget.setPointerCapture) {
            e.currentTarget.setPointerCapture(e.pointerId);
          }
        }

        e.preventDefault();

        const nextOffset = {
          x: startOffset.x + dx,
          y: startOffset.y + dy,
        };
        syncOffset(nextOffset);
      }
    },
    [syncOffset, syncZoom],
  );

  const endPointerInteraction = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (activePointers.current.has(e.pointerId)) {
        activePointers.current.delete(e.pointerId);
      }

      if (panState.current?.pointerId === e.pointerId) {
        if (panState.current.active) {
          e.preventDefault();
        }
        panState.current = null;
        setIsDragging(false);
      }

      if (pinchState.current && activePointers.current.size < 2) {
        pinchState.current = null;
      }

      if (activePointers.current.size === 1) {
        const [pointerId, point] = Array.from(
          activePointers.current.entries(),
        )[0];
        panState.current = {
          pointerId,
          startPoint: point,
          startOffset: offsetRef.current,
          active: false,
        };
      }

      if (e.currentTarget.hasPointerCapture?.(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    },
    [],
  );

  type CanvasWheelEvent = Pick<
    WheelEvent,
    "ctrlKey" | "metaKey" | "deltaX" | "deltaY" | "clientX" | "clientY"
  > & {
    preventDefault: () => void;
  };

  const handleWheelEvent = useCallback(
    (event: CanvasWheelEvent) => {
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
        const scale = getWheelScale(event.deltaY);
        const nextZoom = zoomRef.current * scale;
        applyZoom(nextZoom, { x: event.clientX, y: event.clientY });
        return;
      }

      event.preventDefault();
      const nextOffset = {
        x: offsetRef.current.x - event.deltaX,
        y: offsetRef.current.y - event.deltaY,
      };
      syncOffset(nextOffset);
    },
    [applyZoom, syncOffset],
  );

  useEffect(() => {
    const node = canvasRef.current;
    if (!node) {
      return;
    }

    const wheelListener = (event: WheelEvent) => {
      handleWheelEvent(event);
    };

    node.addEventListener("wheel", wheelListener, { passive: false });

    return () => {
      node.removeEventListener("wheel", wheelListener);
    };
  }, [handleWheelEvent]);

  return (
    <div className="w-full h-full flex flex-col relative bg-background">
      {/* Zoom Controls - Bottom Right */}
      <div className="absolute bottom-4 right-4 z-10">
        <div className="flex items-center gap-2 bg-card border rounded-lg p-2 shadow-sm">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomOut}
            disabled={zoom <= MIN_ZOOM}
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
            onClick={handleZoomIn}
            disabled={zoom >= MAX_ZOOM}
            className="h-8 w-8 p-0"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <div className="w-px h-4 bg-border mx-1" />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetZoom}
            className="h-8 w-8 p-0"
            title="Reset zoom and position"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Canvas Area with Dotted Background */}
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
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endPointerInteraction}
        onPointerCancel={endPointerInteraction}
        onPointerLeave={endPointerInteraction}
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
      >
        {/* Canvas Content Container */}
        <div
          className="absolute inset-0"
          style={{
            transform: `translate(${canvasOffset.x}px, ${
              canvasOffset.y
            }px) scale(${zoom / 100})`,
            transformOrigin: "0 0",
          }}
        >
          {/* Centered Form Container */}
          <div className="flex items-start justify-center w-full h-full pt-16">
            <div className="w-full max-w-2xl space-y-6">
              {/* Form Header */}
              <div className="rounded-lg p-6 border bg-sidebar ">
                {editingTitle ? (
                  <Input
                    defaultValue={formConfig.name}
                    className="text-2xl font-semibold border-none p-1 h-auto shadow-none rounded-none focus-visible:ring-0 focus-visible:bg-muted/50"
                    onBlur={(e) => handleTitleSubmit(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleTitleSubmit(e.currentTarget.value);
                      }
                      if (e.key === "Escape") {
                        setEditingTitle(false);
                      }
                    }}
                    autoFocus
                  />
                ) : (
                  <div
                    className="group flex items-center gap-2 cursor-pointer"
                    onClick={() => setEditingTitle(true)}
                  >
                    <h2 className="text-2xl font-semibold text-foreground">
                      {formConfig.name}
                    </h2>
                    <Edit2 className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                )}

                {editingDescription ? (
                  <Textarea
                    defaultValue={formConfig.description}
                    className="text-sm text-muted-foreground mt-2 border-none p-1 focus-visible:ring-0 resize-none shadow-none rounded-none focus-visible:bg-muted/50"
                    onBlur={(e) => handleDescriptionSubmit(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleDescriptionSubmit(e.currentTarget.value);
                      }
                      if (e.key === "Escape") {
                        setEditingDescription(false);
                      }
                    }}
                    autoFocus
                    rows={2}
                  />
                ) : (
                  <div
                    className="group flex items-center gap-2 cursor-pointer mt-2"
                    onClick={() => setEditingDescription(true)}
                  >
                    <p className="text-sm text-muted-foreground">
                      {formConfig.description}
                    </p>
                    <Edit2 className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                )}
              </div>

              {/* Form Fields Area */}
              <div
                className="min-h-[500px] rounded-lg p-6 border bg-sidebar"
                style={{ cursor: "default" }}
              >
                {formConfig.fields.length === 0 ? (
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
                ) : (
                  <SortableContext
                    items={formConfig.fields.map((field) => field.id)}
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

      {/* Canvas Quick Tips */}
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
    </div>
  );
}
