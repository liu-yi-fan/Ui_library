// strategies/PolygonStrategy.ts
import { DrawingStrategy, DrawingContext } from "./DrawingStrategy";
import { Point } from "@/painter/stores/painterType";

/**
 * 多邊形繪製狀態
 */
enum PolygonState {
  IDLE, // 未開始繪製
  DRAWING, // 正在繪製中（已有至少 2 個點）
  CLOSING, // 正在封閉（滑鼠靠近起始點）
}

/**
 * 多邊形繪製策略
 *
 * 使用方法：
 * 1. 點擊畫布開始第一個點
 * 2. 繼續點擊新增頂點
 * 3. 點擊起始點附近完成多邊形
 * 4. 按 ESC 取消繪製
 * 5. 按 Enter 強制完成
 */
export class PolygonStrategy implements DrawingStrategy {
  name = "polygon";
  isDrawing = false;

  private state: PolygonState = PolygonState.IDLE;
  private points: Point[] = []; // 已確定的頂點
  private tempPoint: Point | null = null; // 當前滑鼠位置（用於預覽）

  // 配置參數
  private snapDistance = 8; // 自動封閉的距離（像素）
  private minPoints = 3; // 最少需要幾個點才能完成

  /**
   * 開始繪製或新增頂點
   */
  onStart(
    point: Point,
    context: DrawingContext,
    tempCanvas?: HTMLCanvasElement,
  ) {
    if (!tempCanvas) return;
    console.log("PolygonStrategy.onStart", { point, state: this.state });
    switch (this.state) {
      case PolygonState.IDLE:
        // 第一個點：開始繪製
        this.isDrawing = true;
        this.state = PolygonState.DRAWING;
        this.points = [point];
        console.log("開始繪製多邊形，第一個點:", point);
        this.drawPreview(tempCanvas, context);

        break;

      case PolygonState.DRAWING:
        // 檢查是否要封閉多邊形
        if (this.shouldClosePolygon(point)) {
          // 封閉並完成
          console.log("封閉多邊形");
          this.completePolygon(context);
        } else {
          // 新增頂點
          this.points.push(point);
          console.log(`新增頂點 ${this.points.length}:`, point);
        }

        this.drawPreview(tempCanvas, context);

        break;

      case PolygonState.CLOSING:
        // 正在封閉狀態，點擊完成
        console.log("完成多邊形（CLOSING 狀態）");
        this.completePolygon(context);
        break;
    }
  }

  /**
   * 繪製中（滑鼠移動，用於預覽）
   */
  onMove(
    point: Point,
    context: DrawingContext,
    tempCanvas?: HTMLCanvasElement,
  ) {}

  /**
   * 結束繪製（通常是按 ESC 或點擊完成後）
   */
  onEnd(point: Point | null, context: DrawingContext) {
    console.log("PolygonStrategy.onEnd", {
      point,
      pointsCount: this.points.length,
    });

    // 如果點數足夠，完成多邊形
    if (this.points.length >= this.minPoints) {
      this.completePolygon(context);
    } else {
      // 點數不足，取消繪製
      this.onCancel();
      console.log("多邊形點數不足，取消繪製");
    }
  }

  /**
   * 取消繪製（清除所有暫存數據）
   */
  onCancel() {
    this.isDrawing = false;
    this.state = PolygonState.IDLE;
    this.points = [];
    this.tempPoint = null;
  }

  /**
   * 獲取遊標樣式
   */
  getCursor(): string {
    switch (this.state) {
      case PolygonState.IDLE:
        return "crosshair";
      case PolygonState.DRAWING:
        return "crosshair";
      case PolygonState.CLOSING:
        return "pointer";
      default:
        return "default";
    }
  }

  /**
   * 檢查是否應該封閉多邊形（滑鼠靠近起始點）
   */
  private shouldClosePolygon(currentPoint: Point): boolean {
    if (this.points.length < 2) return false;
    return this.isNearStartPoint(currentPoint);
  }

  /**
   * 檢查是否靠近起始點
   */
  private isNearStartPoint(point: Point): boolean {
    if (this.points.length === 0) return false;

    const firstPoint = this.points[0];
    const distance = Math.hypot(point.x - firstPoint.x, point.y - firstPoint.y);
    // console.log("distance to start point:", distance)
    return distance < this.snapDistance;
  }

  /**
   * 完成多邊形並儲存到 store
   */
  private completePolygon(context: DrawingContext) {
    if (this.points.length < this.minPoints) {
      console.warn("點數不足，無法完成多邊形");
      this.onCancel();
      return;
    }

    console.log("完成多邊形，點數:", this.points.length);

    // 計算多邊形邊界
    const bounds = this.getPolygonBounds();

    // 建立形狀數據
    const shape = {
      type: "polygon",
      data: {
        id: `polygon-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        points: [...this.points], // 複製一份，避免後續修改
        bounds: bounds,
        color: context.color,
        strokeWidth: context.strokeWidth,
        fill: false, // 預設不填充
        fillColor: context.color,
        closed: true,
        createdAt: Date.now(),
      },
    };

    // 呼叫回調儲存到 store
    context.onDrawComplete(shape);

    // 重置狀態
    this.onCancel();
  }

  /**
   * 獲得多邊形邊界
   */
  private getPolygonBounds(): {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  } {
    const xs = this.points.map((p) => p.x);
    const ys = this.points.map((p) => p.y);

    return {
      minX: Math.min(...xs),
      maxX: Math.max(...xs),
      minY: Math.min(...ys),
      maxY: Math.max(...ys),
    };
  }

  /**
   * 在臨時 canvas 上繪製預覽
   */
  private drawPreview(canvas: HTMLCanvasElement, context: DrawingContext) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = "#9E7A7A";
    ctx.fillStyle = `${context.color}`; // 半透明填充
    ctx.lineWidth = context.strokeWidth;
    ctx.setLineDash([5, 5]); // 虛線表示正在繪製
    // console.log('drawPreview', { points: this.points, tempPoint: this.tempPoint })
    // 繪製已確定的邊
    if (this.points.length > 0) {
      ctx.beginPath();
      ctx.moveTo(this.points[0].x, this.points[0].y);

      for (let i = 1; i < this.points.length; i++) {
        ctx.lineTo(this.points[i].x, this.points[i].y);
      }

      ctx.stroke();

      // 如果點數 >= 3，顯示半透明填充預覽
      if (this.points.length >= 3 && this.tempPoint) {
        ctx.closePath();
        ctx.fill();
      }
    }

    // 繪製頂點（小圓點）
    ctx.setLineDash([]);
    ctx.fillStyle = context.color;

    for (let i = 0; i < this.points.length; i++) {
      const point = this.points[i];

      // 外圈
      ctx.beginPath();
      ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
      ctx.fill();

      // 內圈（白色，表示可拖拽）
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
      ctx.fill();

      // 恢復顏色
      ctx.fillStyle = context.color;

      // 顯示頂點編號
      ctx.font = "12px Arial";
      ctx.fillStyle = "#000";
      ctx.shadowBlur = 0;
      ctx.fillText(`${i + 1}`, point.x + 8, point.y - 5);
      ctx.fillStyle = context.color;
    }

    // 如果正在封閉狀態，高亮起始點
    if (this.state === PolygonState.CLOSING && this.points.length > 0) {
      const firstPoint = this.points[0];
      ctx.beginPath();
      ctx.arc(firstPoint.x, firstPoint.y, 10, 0, 2 * Math.PI);
      ctx.strokeStyle = "#ff0000";
      ctx.lineWidth = 2;
      ctx.stroke();

      // 顯示提示文字
      ctx.font = "12px Arial";
      ctx.fillStyle = "#ff0000";
      ctx.shadowBlur = 0;
      ctx.fillText("點擊完成", firstPoint.x + 12, firstPoint.y - 8);
    }

    ctx.restore();
  }

  /**
   * 輔助方法：檢查點是否在多邊形內（用於後續的點擊選擇）
   */
  containsPoint(point: Point, polygonPoints: Point[]): boolean {
    let inside = false;
    for (
      let i = 0, j = polygonPoints.length - 1;
      i < polygonPoints.length;
      j = i++
    ) {
      const xi = polygonPoints[i].x,
        yi = polygonPoints[i].y;
      const xj = polygonPoints[j].x,
        yj = polygonPoints[j].y;

      const intersect =
        yi > point.y != yj > point.y &&
        point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  }

  /**
   * 輔助方法：移動多邊形（用於拖拽）
   */
  translatePolygon(points: Point[], deltaX: number, deltaY: number): Point[] {
    return points.map((point) => ({
      x: point.x + deltaX,
      y: point.y + deltaY,
    }));
  }

  /**
   * 輔助方法：獲取多邊形中心點
   */
  getCenter(points: Point[]): Point {
    const bounds = this.getPolygonBoundsFromPoints(points);
    return {
      x: (bounds.minX + bounds.maxX) / 2,
      y: (bounds.minY + bounds.maxY) / 2,
    };
  }

  private getPolygonBoundsFromPoints(points: Point[]) {
    const xs = points.map((p) => p.x);
    const ys = points.map((p) => p.y);
    return {
      minX: Math.min(...xs),
      maxX: Math.max(...xs),
      minY: Math.min(...ys),
      maxY: Math.max(...ys),
    };
  }
}
