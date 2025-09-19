export interface ColorStop {
  color: string;
  position: number; // 0-100
}

export interface GradientConfig {
  angle: number; // 0-360 degrees
  stops: ColorStop[];
  blendMode?: 'normal' | 'multiply' | 'screen' | 'overlay';
  intensity?: number; // 0-1
}

export interface Theme {
  id: string;
  name: string;
  mode: 'light' | 'dark' | 'auto';
  gradient: GradientConfig;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    muted: string;
    border: string;
  };
  glass: {
    opacity: number; // 0-1
    blur: number; // px
    borderOpacity: number; // 0-1
  };
  isPreset?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PresetTheme extends Omit<Theme, 'id' | 'createdAt' | 'updatedAt'> {
  key: string;
  icon?: string;
}

export interface ThemeState {
  currentTheme: Theme;
  presets: PresetTheme[];
  customThemes: Theme[];
  mode: 'light' | 'dark' | 'auto';

  // Controls
  gradientAngle: number;
  gradientStops: number; // Position of color stops
  blendIntensity: number;

  // Actions
  setTheme: (theme: Theme) => void;
  applyPreset: (presetKey: string) => void;
  updateGradient: (config: Partial<GradientConfig>) => void;
  saveCustomTheme: (name: string) => void;
  deleteCustomTheme: (id: string) => void;
  setMode: (mode: 'light' | 'dark' | 'auto') => void;
}