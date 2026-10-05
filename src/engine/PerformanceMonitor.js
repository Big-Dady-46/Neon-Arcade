/**
 * PerformanceMonitor - Monitors real-time FPS and frame times to adapt visual effects on lower-end devices.
 */
export class PerformanceMonitor {
  constructor() {
    this.fps = 60;
    this.frameTime = 16.6;
    this.history = [];
    this.historySize = 30;
    this.lastFrameTimestamp = performance.now();
    this.dropCount = 0;
  }

  recordFrame(timestamp = performance.now()) {
    const delta = timestamp - this.lastFrameTimestamp;
    this.lastFrameTimestamp = timestamp;

    if (delta > 0) {
      const currentFps = 1000 / delta;
      this.history.push({ fps: currentFps, delta });
      if (this.history.length > this.historySize) {
        this.history.shift();
      }

      // Calculate averages
      let totalFps = 0;
      let totalDelta = 0;
      for (const entry of this.history) {
        totalFps += entry.fps;
        totalDelta += entry.delta;
      }
      this.fps = Math.round(totalFps / this.history.length);
      this.frameTime = +(totalDelta / this.history.length).toFixed(2);

      if (delta > 33.3) {
        this.dropCount++;
      }
    }
  }

  getQualityTier() {
    if (this.fps >= 50) return 'high';
    if (this.fps >= 30) return 'medium';
    return 'low';
  }

  reset() {
    this.history = [];
    this.dropCount = 0;
    this.lastFrameTimestamp = performance.now();
  }
}

export const performanceMonitor = new PerformanceMonitor();
