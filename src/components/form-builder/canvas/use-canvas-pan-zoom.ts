"use client";

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
import type { PointerEvent as ReactPointerEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

type PanState = {
  pointerId: number;
  startPoint: Point;
  startOffset: Point;
  active: boolean;
};

type PinchState = {
  lastDistance: number;
  lastMidpoint: Point;
};

type UseCanvasPanZoomOptions = {
  minZoom?: number;
  maxZoom?: number;
  defaultZoom?: number;
  zoomStep?: number;
};

type CanvasWheelEvent = Pick<
  WheelEvent,
  "ctrlKey" | "metaKey" | "deltaX" | "deltaY" | "clientX" | "clientY"
> & {
  preventDefault: () => void;
};

export function useCanvasPanZoom(options: UseCanvasPanZoomOptions = {}) {
  const minZoom = options.minZoom ?? MIN_ZOOM;
  const maxZoom = options.maxZoom ?? MAX_ZOOM;
  const defaultZoom = options.defaultZoom ?? DEFAULT_ZOOM;
  const zoomStep = options.zoomStep ?? ZOOM_BUTTON_STEP;

  const [zoom, setZoom] = useState(defaultZoom);
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef(zoom);
  const offsetRef = useRef(offset);
  const activePointers = useRef(new Map<number, Point>());
  const pinchState = useRef<PinchState | null>(null);
  const panState = useRef<PanState | null>(null);

  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);

  useEffect(() => {
    offsetRef.current = offset;
  }, [offset]);

  const syncZoom = useCallback((value: number) => {
    zoomRef.current = value;
    setZoom(value);
  }, []);

  const syncOffset = useCallback((value: Point) => {
    offsetRef.current = value;
    setOffset(value);
  }, []);

  const applyZoom = useCallback(
    (value: number, focalPoint?: Point) => {
      const clamped = clampZoom(value, minZoom, maxZoom);
      const previousZoom = zoomRef.current;

      if (!canvasRef.current) {
        if (clamped !== previousZoom) {
          syncZoom(clamped);
        }
        return;
      }

      if (clamped === previousZoom) {
        return;
      }

      const rect = canvasRef.current.getBoundingClientRect();
      const client = focalPoint ?? getCanvasCenterPoint(rect);

      const nextOffset = computeOffsetForZoom({
        client,
        rect,
        offset: offsetRef.current,
        previousZoom,
        nextZoom: clamped,
      });

      syncOffset(nextOffset);
      syncZoom(clamped);
    },
    [minZoom, maxZoom, syncOffset, syncZoom],
  );

  const zoomIn = useCallback(() => {
    applyZoom(zoomRef.current + zoomStep);
  }, [applyZoom, zoomStep]);

  const zoomOut = useCallback(() => {
    applyZoom(zoomRef.current - zoomStep);
  }, [applyZoom, zoomStep]);

  const resetView = useCallback(() => {
    panState.current = null;
    pinchState.current = null;
    setIsDragging(false);
    syncOffset({ x: 0, y: 0 });
    syncZoom(defaultZoom);
  }, [defaultZoom, syncOffset, syncZoom]);

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (event.pointerType === "mouse" && event.button !== 0) {
        return;
      }

      const target = event.target as HTMLElement | null;
      if (!isPanStartAllowed(target)) {
        return;
      }

      activePointers.current.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY,
      });

      if (activePointers.current.size === 1) {
        panState.current = {
          pointerId: event.pointerId,
          startPoint: { x: event.clientX, y: event.clientY },
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
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!activePointers.current.has(event.pointerId)) {
        return;
      }

      activePointers.current.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY,
      });

      if (pinchState.current && activePointers.current.size >= 2) {
        const points = Array.from(activePointers.current.values());
        const distance = getDistance(points[0], points[1]);
        const midpoint = getMidpoint(points[0], points[1]);
        const previousDistance = pinchState.current.lastDistance || distance;

        if (previousDistance === 0) {
          pinchState.current = {
            lastDistance: distance,
            lastMidpoint: midpoint,
          };
          return;
        }

        const previousZoom = zoomRef.current;
        const scaleDelta = distance / previousDistance;

        if (!Number.isFinite(scaleDelta) || scaleDelta === 0) {
          pinchState.current = {
            lastDistance: distance,
            lastMidpoint: midpoint,
          };
          return;
        }

        const proposedZoom = previousZoom * scaleDelta;
        const clamped = clampZoom(proposedZoom, minZoom, maxZoom);
        const appliedScale = previousZoom === 0 ? 1 : clamped / previousZoom;

        if (canvasRef.current && clamped !== previousZoom) {
          const rect = canvasRef.current.getBoundingClientRect();
          const nextOffset = computeOffsetForZoom({
            client: midpoint,
            rect,
            offset: offsetRef.current,
            previousZoom,
            nextZoom: clamped,
          });
          syncOffset(nextOffset);
        }

        syncZoom(clamped);

        const adjustedDistance =
          appliedScale === 0 ? previousDistance : distance / appliedScale;
        pinchState.current = {
          lastDistance: adjustedDistance,
          lastMidpoint: midpoint,
        };
        return;
      }

      if (panState.current?.pointerId === event.pointerId) {
        const { startPoint, startOffset, active } = panState.current;
        const dx = event.clientX - startPoint.x;
        const dy = event.clientY - startPoint.y;

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
          event.currentTarget.setPointerCapture?.(event.pointerId);
        }

        event.preventDefault();
        const nextOffset = {
          x: startOffset.x + dx,
          y: startOffset.y + dy,
        };
        syncOffset(nextOffset);
      }
    },
    [maxZoom, minZoom, syncOffset, syncZoom],
  );

  const endPointerInteraction = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (activePointers.current.has(event.pointerId)) {
        activePointers.current.delete(event.pointerId);
      }

      if (panState.current?.pointerId === event.pointerId) {
        if (panState.current.active) {
          event.preventDefault();
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

      event.currentTarget.releasePointerCapture?.(event.pointerId);
    },
    [],
  );

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

  return {
    canvasRef,
    zoom,
    offset,
    isDragging,
    minZoom,
    maxZoom,
    zoomIn,
    zoomOut,
    resetView,
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: endPointerInteraction,
    onPointerCancel: endPointerInteraction,
    onPointerLeave: endPointerInteraction,
  };
}
