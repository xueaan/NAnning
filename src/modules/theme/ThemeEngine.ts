import { GradientConfig, ColorStop, Theme } from './types';

export class ThemeEngine {
  /**
   * Preset gradient themes inspired by Anning's design
   */
  static readonly PRESET_GRADIENTS = {
    aurora: {
      angle: 135,
      stops: [
        { color: '#667eea', position: 0 },
        { color: '#f093fb', position: 50 },
        { color: '#f5576c', position: 100 }
      ]
    },
    sunset: {
      angle: 120,
      stops: [
        { color: '#ff6b6b', position: 0 },
        { color: '#ffa500', position: 33 },
        { color: '#ff7b9c', position: 66 },
        { color: '#c77dff', position: 100 }
      ]
    },
    ocean: {
      angle: 160,
      stops: [
        { color: '#2e3192', position: 0 },
        { color: '#1bffff', position: 50 },
        { color: '#00a8e8', position: 100 }
      ]
    },
    forest: {
      angle: 145,
      stops: [
        { color: '#134e4a', position: 0 },
        { color: '#059669', position: 50 },
        { color: '#34d399', position: 100 }
      ]
    },
    midnight: {
      angle: 135,
      stops: [
        { color: '#1a1a2e', position: 0 },
        { color: '#16213e', position: 33 },
        { color: '#0f3460', position: 66 },
        { color: '#533483', position: 100 }
      ]
    }
  };

  /**
   * Glass opacity levels matching Anning's 4-level system
   */
  static readonly GLASS_LEVELS = {
    deco: { opacity: 0.01, blur: 15, borderOpacity: 0.08 },
    panel: { opacity: 0.08, blur: 16, borderOpacity: 0.15 },
    content: { opacity: 0.25, blur: 12, borderOpacity: 0.3 },
    modal: { opacity: 0.75, blur: 20, borderOpacity: 0.3 }
  };
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

    // 根据模式设置正确的颜色变量
    const isLight = theme.mode === 'light';
    const colors = isLight ? this.getLightModeColors(theme.colors) : theme.colors;

    // 同步颜色变量（RGB 三元组 + 十六进制备用）
    const toTriplet = (hex: string) => {
      const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      if (!m) return hex;
      const r = parseInt(m[1], 16);
      const g = parseInt(m[2], 16);
      const b = parseInt(m[3], 16);
      return `${r} ${g} ${b}`;
    };

    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, toTriplet(value));
      root.style.setProperty(`--color-${key}`, value);
    });

    // 根据模式调整玻璃参数
    const glassConfig = isLight ? {
      opacity: 0.35,
      blur: 12,
      borderOpacity: 0.25
    } : theme.glass;

    // 同步玻璃拟态参数
    root.style.setProperty('--glass-opacity', glassConfig.opacity.toString());
    root.style.setProperty('--glass-blur', `${glassConfig.blur}px`);
    root.style.setProperty('--glass-border-opacity', glassConfig.borderOpacity.toString());

    // 设置 4 级玻璃透明度系统（根据模式调整）
    const glassLevels = isLight ? {
      deco: { opacity: 0.05, blur: 12, borderOpacity: 0.12 },
      panel: { opacity: 0.15, blur: 14, borderOpacity: 0.2 },
      content: { opacity: 0.35, blur: 10, borderOpacity: 0.35 },
      modal: { opacity: 0.85, blur: 18, borderOpacity: 0.35 }
    } : this.GLASS_LEVELS;

    root.style.setProperty('--glass-deco-opacity', glassLevels.deco.opacity.toString());
    root.style.setProperty('--glass-panel-opacity', glassLevels.panel.opacity.toString());
    root.style.setProperty('--glass-content-opacity', glassLevels.content.opacity.toString());
    root.style.setProperty('--glass-modal-opacity', glassLevels.modal.opacity.toString());

    // 设置模糊级别
    root.style.setProperty('--glass-blur-light', '12px');
    root.style.setProperty('--glass-blur-medium', '16px');
    root.style.setProperty('--glass-blur-heavy', '20px');
    root.style.setProperty('--glass-blur-ultra', '24px');

    // Don't override user-controlled gradient opacity here
    // Just set default noise levels based on mode
    if (!root.style.getPropertyValue('--bg-gradient-opacity')) {
      root.style.setProperty('--bg-gradient-opacity', isLight ? '0.3' : '0.6');
    }
    if (!root.style.getPropertyValue('--noise-opacity')) {
      root.style.setProperty('--noise-opacity', isLight ? '0.04' : '0.08');
    }

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
   * 获取浅色模式颜色
   */
  private static getLightModeColors(darkColors: any): any {
    // 如果已经是浅色配置，直接返回
    if (darkColors.background && darkColors.background.startsWith('#F') || darkColors.background?.startsWith('#f')) {
      return darkColors;
    }

    // 转换为浅色模式
    return {
      primary: darkColors.primary,
      secondary: darkColors.secondary,
      accent: darkColors.accent,
      background: '#FFFFFF',
      foreground: '#1A1A1A',
      muted: '#F4F4F5',
      border: '#E4E4E7'
    };
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
   * 生成动态渐变动画 CSS
   */
  static generateAnimatedGradient(gradients: GradientConfig[], duration: number = 10): string {
    const keyframeName = `gradient-shift-${Date.now()}`;
    const percentageStep = 100 / (gradients.length - 1);

    const keyframes = gradients.map((gradient, index) => {
      const percentage = index * percentageStep;
      return `${percentage}% { background: ${this.generateGradientCSS(gradient)}; }`;
    }).join(' ');

    const style = document.createElement('style');
    style.textContent = `
      @keyframes ${keyframeName} {
        ${keyframes}
      }
      .animated-gradient {
        animation: ${keyframeName} ${duration}s ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);

    return keyframeName;
  }

  /**
   * 创建渐变混合效果
   */
  static blendGradients(gradient1: GradientConfig, gradient2: GradientConfig, factor: number = 0.5): GradientConfig {
    const blendedStops: ColorStop[] = [];
    const maxStops = Math.max(gradient1.stops.length, gradient2.stops.length);

    for (let i = 0; i < maxStops; i++) {
      const stop1 = gradient1.stops[i] || gradient1.stops[gradient1.stops.length - 1];
      const stop2 = gradient2.stops[i] || gradient2.stops[gradient2.stops.length - 1];

      blendedStops.push({
        color: this.interpolateColor(stop1.color, stop2.color, factor),
        position: stop1.position * (1 - factor) + stop2.position * factor
      });
    }

    return {
      angle: gradient1.angle * (1 - factor) + gradient2.angle * factor,
      stops: blendedStops
    };
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

  /**
   * 应用预设主题
   */
  static applyPresetTheme(presetName: keyof typeof ThemeEngine.PRESET_GRADIENTS, mode: 'light' | 'dark' = 'dark'): void {
    const gradient = this.PRESET_GRADIENTS[presetName];
    if (!gradient) return;

    const colors = this.extractPalette(gradient);
    const complementary = this.generateComplementaryColors(colors[0]);

    const theme: Theme = {
      id: `preset-${presetName}`,
      name: presetName.charAt(0).toUpperCase() + presetName.slice(1),
      mode,
      gradient,
      colors: {
        ...complementary,
        background: mode === 'dark' ? '#0a0a0f' : '#ffffff',
        foreground: mode === 'dark' ? '#e5e5e7' : '#1a1a1a',
        muted: mode === 'dark' ? '#27272a' : '#f4f4f5',
        border: mode === 'dark' ? '#3f3f46' : '#e4e4e7'
      },
      glass: mode === 'dark' ? this.GLASS_LEVELS.panel : this.GLASS_LEVELS.content
    };

    this.applyTheme(theme, true);
  }
}

