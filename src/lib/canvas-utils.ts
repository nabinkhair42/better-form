export type Point = {
  x: number;
  y: number;
};

export const MIN_ZOOM = 50;
export const MAX_ZOOM = 200;
export const DEFAULT_ZOOM = 100;
export const ZOOM_BUTTON_STEP = 10;
const WHEEL_SENSITIVITY = 0.002;
const PAN_GUARD_SELECTOR =
  "input,textarea,button,select,[contenteditable='true'],[role='textbox'],[data-stop-canvas-pan]";

export function clampZoom(
  value: number,
  min = MIN_ZOOM,
  max = MAX_ZOOM,
): number {
  return Math.min(Math.max(value, min), max);
}

export function getDistance(a: Point, b: Point): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function getMidpoint(a: Point, b: Point): Point {
  return {
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
  };
}

export function getCanvasCenterPoint(rect: DOMRect): Point {
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}

export function getWheelScale(
  deltaY: number,
  sensitivity = WHEEL_SENSITIVITY,
): number {
  const scale = Math.exp(-deltaY * sensitivity);
  return Number.isFinite(scale) && scale > 0 ? scale : 1;
}

export function computeOffsetForZoom(params: {
  client: Point;
  rect: DOMRect;
  offset: Point;
  previousZoom: number;
  nextZoom: number;
}): Point {
  const { client, rect, offset, previousZoom, nextZoom } = params;

  const previousScale = previousZoom / 100;
  const nextScale = nextZoom / 100;

  if (previousScale <= 0 || nextScale <= 0) {
    return offset;
  }

  const relativeX = client.x - rect.left;
  const relativeY = client.y - rect.top;

  const contentX = (relativeX - offset.x) / previousScale;
  const contentY = (relativeY - offset.y) / previousScale;

  return {
    x: relativeX - contentX * nextScale,
    y: relativeY - contentY * nextScale,
  };
}

export function isPanStartAllowed(target: HTMLElement | null): boolean {
  if (!target) {
    return false;
  }

  return !target.closest(PAN_GUARD_SELECTOR);
}
