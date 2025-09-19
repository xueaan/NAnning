import { PresetTheme } from './types';

export const presetThemes: PresetTheme[] = [
  {
    key: 'pastel',
    name: '粉彩',
    mode: 'light',
    gradient: {
      angle: 135,
      stops: [
        { color: '#FFE5E5', position: 0 },
        { color: '#FFD6E8', position: 25 },
        { color: '#E8DAFF', position: 50 },
        { color: '#D6F0FF', position: 75 },
        { color: '#E5FFE5', position: 100 }
      ]
    },
    colors: {
      primary: '#FF69B4',
      secondary: '#9370DB',
      accent: '#87CEEB',
      background: '#FFFFFF',
      foreground: '#333333',
      muted: '#F5F5F5',
      border: '#E0E0E0'
    },
    glass: {
      opacity: 0.25,
      blur: 12,
      borderOpacity: 0.3
    },
    isPreset: true
  },
  {
    key: 'cool',
    name: '炫酷',
    mode: 'dark',
    gradient: {
      angle: 45,
      stops: [
        { color: '#667EEA', position: 0 },
        { color: '#764BA2', position: 50 },
        { color: '#F093FB', position: 100 }
      ]
    },
    colors: {
      primary: '#667EEA',
      secondary: '#F093FB',
      accent: '#764BA2',
      background: '#1A1A2E',
      foreground: '#EAEAEA',
      muted: '#16213E',
      border: '#2E3A59'
    },
    glass: {
      opacity: 0.15,
      blur: 20,
      borderOpacity: 0.2
    },
    isPreset: true
  },
  {
    key: 'bright',
    name: '鲜亮',
    mode: 'light',
    gradient: {
      angle: 90,
      stops: [
        { color: '#FF0080', position: 0 },
        { color: '#FF8C00', position: 33 },
        { color: '#40E0D0', position: 66 },
        { color: '#FF0080', position: 100 }
      ]
    },
    colors: {
      primary: '#FF0080',
      secondary: '#40E0D0',
      accent: '#FF8C00',
      background: '#FFFFFF',
      foreground: '#1A1A1A',
      muted: '#F8F8F8',
      border: '#E5E5E5'
    },
    glass: {
      opacity: 0.2,
      blur: 10,
      borderOpacity: 0.25
    },
    isPreset: true
  },
  {
    key: 'collection',
    name: '收藏',
    mode: 'light',
    gradient: {
      angle: 180,
      stops: [
        { color: '#FFD700', position: 0 },
        { color: '#FFA500', position: 50 },
        { color: '#FF6347', position: 100 }
      ]
    },
    colors: {
      primary: '#FFD700',
      secondary: '#FFA500',
      accent: '#FF6347',
      background: '#FFFAF0',
      foreground: '#2F4F4F',
      muted: '#FFF8DC',
      border: '#F0E68C'
    },
    glass: {
      opacity: 0.25,
      blur: 15,
      borderOpacity: 0.35
    },
    isPreset: true
  },
  {
    key: 'ocean',
    name: '海洋',
    mode: 'light',
    gradient: {
      angle: 160,
      stops: [
        { color: '#43E97B', position: 0 },
        { color: '#38F9D7', position: 50 },
        { color: '#4FACFE', position: 100 }
      ]
    },
    colors: {
      primary: '#4FACFE',
      secondary: '#43E97B',
      accent: '#38F9D7',
      background: '#F0FFFF',
      foreground: '#1E3A5F',
      muted: '#E0F7FA',
      border: '#B2EBF2'
    },
    glass: {
      opacity: 0.2,
      blur: 12,
      borderOpacity: 0.3
    },
    isPreset: true
  },
  {
    key: 'sunset',
    name: '日落',
    mode: 'light',
    gradient: {
      angle: 225,
      stops: [
        { color: '#FA709A', position: 0 },
        { color: '#FEE140', position: 50 },
        { color: '#FA709A', position: 100 }
      ]
    },
    colors: {
      primary: '#FA709A',
      secondary: '#FEE140',
      accent: '#FF6B6B',
      background: '#FFF5F5',
      foreground: '#4A4A4A',
      muted: '#FFE5E5',
      border: '#FFB3B3'
    },
    glass: {
      opacity: 0.25,
      blur: 14,
      borderOpacity: 0.3
    },
    isPreset: true
  },
  {
    key: 'aurora',
    name: '极光',
    mode: 'dark',
    gradient: {
      angle: 0,
      stops: [
        { color: '#00F260', position: 0 },
        { color: '#0575E6', position: 33 },
        { color: '#FF00E6', position: 66 },
        { color: '#00F260', position: 100 }
      ]
    },
    colors: {
      primary: '#00F260',
      secondary: '#0575E6',
      accent: '#FF00E6',
      background: '#0A0E27',
      foreground: '#E8F4F8',
      muted: '#1A1E3A',
      border: '#2A2E4A'
    },
    glass: {
      opacity: 0.15,
      blur: 18,
      borderOpacity: 0.2
    },
    isPreset: true
  },
  {
    key: 'forest',
    name: '森林',
    mode: 'light',
    gradient: {
      angle: 120,
      stops: [
        { color: '#134E5E', position: 0 },
        { color: '#71B280', position: 50 },
        { color: '#A8E063', position: 100 }
      ]
    },
    colors: {
      primary: '#71B280',
      secondary: '#A8E063',
      accent: '#134E5E',
      background: '#F4FFF4',
      foreground: '#2D5016',
      muted: '#E8F5E9',
      border: '#C8E6C9'
    },
    glass: {
      opacity: 0.2,
      blur: 12,
      borderOpacity: 0.3
    },
    isPreset: true
  },
  {
    key: 'candy',
    name: '糖果',
    mode: 'light',
    gradient: {
      angle: 270,
      stops: [
        { color: '#FF9A9E', position: 0 },
        { color: '#FECFEF', position: 25 },
        { color: '#FFA6F6', position: 50 },
        { color: '#C3A6FF', position: 75 },
        { color: '#A6D0FF', position: 100 }
      ]
    },
    colors: {
      primary: '#FF9A9E',
      secondary: '#A6D0FF',
      accent: '#FFA6F6',
      background: '#FFFAFA',
      foreground: '#4A3C4E',
      muted: '#FFF0F5',
      border: '#FFE0EC'
    },
    glass: {
      opacity: 0.25,
      blur: 10,
      borderOpacity: 0.35
    },
    isPreset: true
  },
  {
    key: 'purple-dream',
    name: '紫梦',
    mode: 'dark',
    gradient: {
      angle: 315,
      stops: [
        { color: '#4E54C8', position: 0 },
        { color: '#8F94FB', position: 50 },
        { color: '#B06AB3', position: 100 }
      ]
    },
    colors: {
      primary: '#8F94FB',
      secondary: '#B06AB3',
      accent: '#4E54C8',
      background: '#1A1A2E',
      foreground: '#E8E8F8',
      muted: '#252540',
      border: '#3A3A5E'
    },
    glass: {
      opacity: 0.18,
      blur: 16,
      borderOpacity: 0.25
    },
    isPreset: true
  },
  {
    key: 'flame',
    name: '烈焰',
    mode: 'dark',
    gradient: {
      angle: 45,
      stops: [
        { color: '#F37335', position: 0 },
        { color: '#FDC830', position: 50 },
        { color: '#FF416C', position: 100 }
      ]
    },
    colors: {
      primary: '#F37335',
      secondary: '#FDC830',
      accent: '#FF416C',
      background: '#2A1A1A',
      foreground: '#FFE5CC',
      muted: '#3A2020',
      border: '#5A3030'
    },
    glass: {
      opacity: 0.15,
      blur: 14,
      borderOpacity: 0.2
    },
    isPreset: true
  },
  {
    key: 'spice',
    name: '辛香',
    mode: 'light',
    gradient: {
      angle: 200,
      stops: [
        { color: '#8E2DE2', position: 0 },
        { color: '#4A00E0', position: 33 },
        { color: '#FF6B9D', position: 66 },
        { color: '#FEC860', position: 100 }
      ]
    },
    colors: {
      primary: '#8E2DE2',
      secondary: '#FF6B9D',
      accent: '#FEC860',
      background: '#FFF8F0',
      foreground: '#3E2C41',
      muted: '#F8E8FF',
      border: '#E8CCFF'
    },
    glass: {
      opacity: 0.22,
      blur: 13,
      borderOpacity: 0.32
    },
    isPreset: true
  }
];