import { Layer, Point, Shape } from "@/painter/stores/painterType";

interface ShapeHitResult {
  layerId: string;
  shape: Shape;
}

export interface ShapeBounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

const HIT_TOLERANCE = 6;

function distanceToSegment(point: Point, start: Point, end: Point) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;

  if (dx === 0 && dy === 0) {
    return Math.hypot(point.x - start.x, point.y - start.y);
  }

  const t = Math.max(
    0,
    Math.min(
      1,
      ((point.x - start.x) * dx + (point.y - start.y) * dy) / (dx * dx + dy * dy)
    )
  );

  const projectionX = start.x + t * dx;
  const projectionY = start.y + t * dy;
  return Math.hypot(point.x - projectionX, point.y - projectionY);
}

function isPointInPolygon(point: Point, points: Point[]) {
  let inside = false;

  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const xi = points[i].x;
    const yi = points[i].y;
    const xj = points[j].x;
    const yj = points[j].y;

    const intersects =
      yi > point.y !== yj > point.y &&
      point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;

    if (intersects) {
      inside = !inside;
    }
  }

  return inside;
}

export function getShapeBounds(shape: Shape): ShapeBounds {
  switch (shape.type) {
    case "line": {
      const { start, end, strokeWidth } = shape.data;
      const padding = Math.max(strokeWidth, HIT_TOLERANCE);
      return {
        minX: Math.min(start.x, end.x) - padding,
        minY: Math.min(start.y, end.y) - padding,
        maxX: Math.max(start.x, end.x) + padding,
        maxY: Math.max(start.y, end.y) + padding,
      };
    }

    case "square": {
      const { x, y, width, height, strokeWidth } = shape.data;
      const padding = Math.max(strokeWidth, 2);
      return {
        minX: x - padding,
        minY: y - padding,
        maxX: x + width + padding,
        maxY: y + height + padding,
      };
    }

    case "ellipse": {
      const { x, y, radiusX, radiusY, strokeWidth } = shape.data;
      const padding = Math.max(strokeWidth, 2);
      return {
        minX: x - radiusX - padding,
        minY: y - radiusY - padding,
        maxX: x + radiusX + padding,
        maxY: y + radiusY + padding,
      };
    }

    case "polygon": {
      const xs = shape.data.points.map((point) => point.x);
      const ys = shape.data.points.map((point) => point.y);
      const padding = Math.max(shape.data.strokeWidth, 2);
      return {
        minX: Math.min(...xs) - padding,
        minY: Math.min(...ys) - padding,
        maxX: Math.max(...xs) + padding,
        maxY: Math.max(...ys) + padding,
      };
    }
  }
}

export function hitTestShape(point: Point, shape: Shape) {
  switch (shape.type) {
    case "line":
      return (
        distanceToSegment(point, shape.data.start, shape.data.end) <=
        Math.max(shape.data.strokeWidth, HIT_TOLERANCE)
      );

    case "square": {
      const { x, y, width, height } = shape.data;
      return point.x >= x && point.x <= x + width && point.y >= y && point.y <= y + height;
    }

    case "ellipse": {
      const { x, y, radiusX, radiusY } = shape.data;
      if (radiusX === 0 || radiusY === 0) return false;
      const normalized =
        ((point.x - x) * (point.x - x)) / (radiusX * radiusX) +
        ((point.y - y) * (point.y - y)) / (radiusY * radiusY);
      return normalized <= 1;
    }

    case "polygon":
      return isPointInPolygon(point, shape.data.points);
  }
}

export function findShapeAtPoint(
  point: Point,
  layers: Layer[]
): ShapeHitResult | null {
  for (let layerIndex = layers.length - 1; layerIndex >= 0; layerIndex--) {
    const layer = layers[layerIndex];
    if (!layer.visible) continue;

    for (let shapeIndex = layer.shapes.length - 1; shapeIndex >= 0; shapeIndex--) {
      const shape = layer.shapes[shapeIndex];
      if (shape.visible === false) continue;

      if (hitTestShape(point, shape)) {
        return {
          layerId: layer.id,
          shape,
        };
      }
    }
  }

  return null;
}

export function translateShape(shape: Shape, deltaX: number, deltaY: number): Shape {
  switch (shape.type) {
    case "line":
      return {
        ...shape,
        data: {
          ...shape.data,
          start: {
            x: shape.data.start.x + deltaX,
            y: shape.data.start.y + deltaY,
          },
          end: {
            x: shape.data.end.x + deltaX,
            y: shape.data.end.y + deltaY,
          },
        },
      };

    case "square":
      return {
        ...shape,
        data: {
          ...shape.data,
          x: shape.data.x + deltaX,
          y: shape.data.y + deltaY,
        },
      };

    case "ellipse":
      return {
        ...shape,
        data: {
          ...shape.data,
          x: shape.data.x + deltaX,
          y: shape.data.y + deltaY,
        },
      };

    case "polygon":
      return {
        ...shape,
        data: {
          ...shape.data,
          points: shape.data.points.map((point) => ({
            x: point.x + deltaX,
            y: point.y + deltaY,
          })),
        },
      };
  }
}
