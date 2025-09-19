import { GradientConfig, ColorStop, Theme } from './types';

export class ThemeEngine {
  /**
   * 生成 CSS 渐变字符串
   */
  static generateGradientCSS(config: GradientConfig): string {
    const { angle, stops } = config;

    const sortedStops = [...stops].sort((a, b) => a.position - b.position);
    const stopStrings = sortedStops
      .map(stop => `${stop.color} ${stop.position}%`)
      .join(', ');

    return `linear-gradient(${angle}deg, ${stopStrings})`;
  }

  /**
   * 在两种颜色之间插值
   */
  static interpolateColor(color1: string, color2: string, factor: number): string {
    const hex2rgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 0, g: 0, b: 0 };
    };

    const rgb2hex = (r: number, g: number, b: number) => {
      return '#' + [r, g, b].map(x => {
        const hex = Math.round(x).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      }).join('');
    };

    const c1 = hex2rgb(color1);
    const c2 = hex2rgb(color2);

    const r = c1.r + (c2.r - c1.r) * factor;
    const g = c1.g + (c2.g - c1.g) * factor;
    const b = c1.b + (c2.b - c1.b) * factor;

    return rgb2hex(r, g, b);
  }

  /**
   * 生成平滑的多段渐变
   */
  static generateSmoothGradient(
    baseColors: string[],
    stops: number = 5,
    angle: number = 135
  ): GradientConfig {
    const colorStops: ColorStop[] = [];
    const segmentSize = 100 / (baseColors.length - 1);

    for (let i = 0; i < baseColors.length - 1; i++) {
      const startColor = baseColors[i];
      const endColor = baseColors[i + 1];
      const stopsPerSegment = Math.ceil(stops / (baseColors.length - 1));

      for (let j = 0; j < stopsPerSegment; j++) {
        const localFactor = j / (stopsPerSegment - 1);
        const globalPosition = (i * segmentSize) + (localFactor * segmentSize);

        if (globalPosition <= 100) {
          colorStops.push({
            color: this.interpolateColor(startColor, endColor, localFactor),
            position: globalPosition
          });
        }
      }
    }

    // 确保最后一个颜色在 100% 位置
    colorStops.push({
      color: baseColors[baseColors.length - 1],
      position: 100
    });

    // 去重
    const uniqueStops = colorStops.filter((stop, index, self) =>
      index === self.findIndex(s => s.position === stop.position)
    );

    return {
      angle,
      stops: uniqueStops
    };
  }

  /**
   * 旋转渐变角度
   */
  static rotateGradient(config: GradientConfig, degrees: number): GradientConfig {
    return {
      ...config,
      angle: (config.angle + degrees) % 360
    };
  }

  /**
   * 调整停靠点位置
   */
  static adjustStops(config: GradientConfig, factor: number): GradientConfig {
    const adjustedStops = config.stops.map((stop, index) => {
      if (index === 0) return { ...stop, position: 0 };
      if (index === config.stops.length - 1) return { ...stop, position: 100 };

      const basePosition = (index / (config.stops.length - 1)) * 100;
      const adjustment = (stop.position - basePosition) * factor;
      const newPosition = basePosition + adjustment;

      return {
        ...stop,
        position: Math.max(0, Math.min(100, newPosition))
      };
    });

    return {
      ...config,
      stops: adjustedStops
    };
  }

  /**
   * 将主题应用到 DOM
   */
  static applyTheme(theme: Theme, animate: boolean = true): void {
    const root = document.documentElement;

    // 开启动画过渡
    if (animate && typeof window !== 'undefined') {
      this.startTransition();
    }

    // 设置渐变背景
    root.style.setProperty('--gradient', this.generateGradientCSS(theme.gradient));

    // 同步颜色变量（RGB 三元组 + 十六进制备用）
    const toTriplet = (hex: string) => {
      const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      if (!m) return hex;
      const r = parseInt(m[1], 16);
      const g = parseInt(m[2], 16);
      const b = parseInt(m[3], 16);
      return `${r} ${g} ${b}`;
    };

    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, toTriplet(value));
      root.style.setProperty(`--color-${key}`, value);
    });

    // 同步玻璃拟态参数
    root.style.setProperty('--glass-opacity', theme.glass.opacity.toString());
    root.style.setProperty('--glass-blur', `${theme.glass.blur}px`);
    root.style.setProperty('--glass-border-opacity', theme.glass.borderOpacity.toString());

    // 切换 body 上的 theme class
    document.body.className = document.body.className
      .replace(/theme-\w+/, '')
      .concat(` theme-${theme.mode}`);

    // 结束过渡
    if (animate && typeof window !== 'undefined') {
      setTimeout(() => this.endTransition(), 600);
    }
  }

  /**
   * 开始主题切换过渡
   */
  private static startTransition(): void {
    // 过渡层
    const transitionLayer = document.createElement('div');
    transitionLayer.className = 'theme-transition';
    transitionLayer.id = 'theme-transition-layer';
    transitionLayer.style.background = getComputedStyle(document.documentElement).getPropertyValue('--gradient');
    document.body.appendChild(transitionLayer);

    // 启动透明层 fade-in
    requestAnimationFrame(() => {
      transitionLayer.classList.add('active');
    });

    // 将状态 class 加到 body 和 wrapper（用于 ::before 波纹动画）
    document.body.classList.add('theme-switching');
    const wrapper = document.querySelector('.theme-switch-wrapper');
    if (wrapper) {
      wrapper.classList.add('switching');
    }
  }

  /**
   * 结束主题切换过渡
   */
  private static endTransition(): void {
    const transitionLayer = document.getElementById('theme-transition-layer');
    if (transitionLayer) {
      transitionLayer.classList.remove('active');
      setTimeout(() => {
        transitionLayer.remove();
      }, 300);
    }
    document.body.classList.remove('theme-switching');
    const wrapper = document.querySelector('.theme-switch-wrapper');
    if (wrapper) {
      wrapper.classList.remove('switching');
    }
  }

  /**
   * 从 CSS 颜色值提取色板
   */
  static extractPalette(gradient: GradientConfig): string[] {
    return gradient.stops
      .sort((a, b) => a.position - b.position)
      .map(stop => stop.color);
  }

  /**
   * 基于主色生成互补色
   */
  static generateComplementaryColors(baseColor: string): {
    primary: string;
    secondary: string;
    accent: string;
  } {
    // 简化的 HSL 互补计算
    const hex2hsl = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      if (!result) return { h: 0, s: 0, l: 0 };

      let r = parseInt(result[1], 16) / 255;
      let g = parseInt(result[2], 16) / 255;
      let b = parseInt(result[3], 16) / 255;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0, s = 0, l = (max + min) / 2;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
          case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
          case g: h = ((b - r) / d + 2) / 6; break;
          case b: h = ((r - g) / d + 4) / 6; break;
        }
      }

      return { h: h * 360, s: s * 100, l: l * 100 };
    };

    const hsl2hex = (h: number, s: number, l: number) => {
      s /= 100;
      l /= 100;

      const c = (1 - Math.abs(2 * l - 1)) * s;
      const x = c * (1 - Math.abs((h / 60) % 2 - 1));
      const m = l - c / 2;

      let r = 0, g = 0, b = 0;

      if (h >= 0 && h < 60) { r = c; g = x; b = 0; }
      else if (h >= 60 && h < 120) { r = x; g = c; b = 0; }
      else if (h >= 120 && h < 180) { r = 0; g = c; b = x; }
      else if (h >= 180 && h < 240) { r = 0; g = x; b = c; }
      else if (h >= 240 && h < 300) { r = x; g = 0; b = c; }
      else if (h >= 300 && h < 360) { r = c; g = 0; b = x; }

      r = Math.round((r + m) * 255);
      g = Math.round((g + m) * 255);
      b = Math.round((b + m) * 255);

      return '#' + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      }).join('');
    };

    const hsl = hex2hsl(baseColor);

    return {
      primary: baseColor,
      secondary: hsl2hex((hsl.h + 120) % 360, hsl.s, hsl.l),
      accent: hsl2hex((hsl.h + 240) % 360, hsl.s, hsl.l)
    };
  }
}

