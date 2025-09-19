'use client';

import { useMemo, useState, useEffect } from 'react';
import { useThemeStore } from '@/stores/themeStore';
import { ThemeEngine } from '@/modules/theme/ThemeEngine';
import { X, Sun, Moon, Heart } from 'lucide-react';

interface ThemePanelProps {
  open: boolean;
  onClose: () => void;
}

function getEdgeColors(stops: { color: string; position: number }[]) {
  const sorted = [...stops].sort((a, b) => a.position - b.position);
  const first = sorted[0]?.color || '#999999';
  const last = sorted[sorted.length - 1]?.color || '#FFFFFF';
  return { first, last };
}

export function ThemePanel({ open, onClose }: ThemePanelProps) {
  const {
    currentTheme,
    mode,
    customThemes,
    gradientAngle,
    overlayOpacity,
    noiseOpacity,
    setMode,
    updateGradient,
    updateGradientAngle,
    updateOverlayOpacity,
    updateNoiseOpacity,
    saveCustomTheme,
    setTheme,
  } = useThemeStore();

  const edge = useMemo(() => getEdgeColors(currentTheme.gradient.stops), [currentTheme.gradient.stops]);
  const [c1, setC1] = useState(edge.first);
  const [c2, setC2] = useState(edge.last);
  const [name, setName] = useState('我的主题');

  useEffect(() => {
    setC1(edge.first);
    setC2(edge.last);
  }, [edge.first, edge.last]);

  const applyColors = (color1: string, color2: string) => {
    setC1(color1);
    setC2(color2);
    updateGradient({
      stops: [
        { color: color1, position: 0 },
        { color: color2, position: 100 },
      ],
    });
  };

  const previewGradient = useMemo(
    () =>
      ThemeEngine.generateGradientCSS({
        angle: gradientAngle,
        stops: [
          { color: c1, position: 0 },
          { color: c2, position: 100 },
        ],
      }),
    [c1, c2, gradientAngle]
  );

  const handleSave = () => {
    saveCustomTheme(name || '我的主题');
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative surface-strong theme-shadow rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMode('light')}
              className={`px-3 py-1.5 rounded-lg border transition-colors text-sm flex items-center gap-1
                ${mode === 'light'
                  ? 'bg-primary/15 border-primary/40 text-foreground'
                  : 'bg-background/40 border-border/40 text-foreground/70 hover:text-foreground'
                }`}
            >
              <Sun className="w-4 h-4" />
              <span>亮色</span>
            </button>
            <button
              onClick={() => setMode('dark')}
              className={`px-3 py-1.5 rounded-lg border transition-colors text-sm flex items-center gap-1
                ${mode === 'dark'
                  ? 'bg-primary/15 border-primary/40 text-foreground'
                  : 'bg-background/40 border-border/40 text-foreground/70 hover:text-foreground'
                }`}
            >
              <Moon className="w-4 h-4" />
              <span>暗色</span>
            </button>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-primary/10 text-foreground/70 hover:text-foreground transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="rounded-xl overflow-hidden mb-6 relative border border-border/30" style={{ background: previewGradient }}>
          <div className="aspect-[4/2] lg:aspect-[4/1.6] w-full"></div>
          <div className="absolute inset-0 flex items-center justify-between px-6">
            <label className="relative w-14 h-14 rounded-full border-4 border-foreground/20 shadow cursor-pointer overflow-hidden">
              <input type="color" value={c1} onChange={(e) => applyColors(e.target.value, c2)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <span className="absolute inset-0 block rounded-full" style={{ background: c1 }} />
            </label>
            <div className="surface-light rounded-full px-4 py-2 text-foreground/80 text-sm border border-border/30">
              角度 {gradientAngle}°
            </div>
            <label className="relative w-14 h-14 rounded-full border-4 border-foreground/20 shadow cursor-pointer overflow-hidden">
              <input type="color" value={c2} onChange={(e) => applyColors(c1, e.target.value)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <span className="absolute inset-0 block rounded-full" style={{ background: c2 }} />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 text-sm text-foreground/70">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span>渐变角度</span>
              <span>{gradientAngle}°</span>
            </div>
            <input
              type="range"
              min={0}
              max={360}
              value={gradientAngle}
              onChange={(e) => updateGradientAngle(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span>背景叠加</span>
              <span>{overlayOpacity}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={80}
              value={overlayOpacity}
              onChange={(e) => updateOverlayOpacity(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span>噪点强度</span>
              <span>{noiseOpacity}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={60}
              value={noiseOpacity}
              onChange={(e) => updateNoiseOpacity(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <input
            className="surface-light border border-border/30 rounded-lg px-3 py-2 text-sm flex-1"
            placeholder="收藏名称"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button onClick={handleSave} className="surface-light border border-primary/30 rounded-lg px-3 py-2 text-sm flex items-center gap-1 text-foreground/80 hover:text-foreground hover:border-primary/50 transition">
            <Heart className="w-4 h-4" /> 收藏
          </button>
        </div>

        <div>
          <div className="text-foreground/70 mb-2 text-sm">我的收藏</div>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
            {customThemes.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t)}
                className="relative rounded-lg overflow-hidden h-20 border border-border/30 hover:border-primary/40 hover:scale-[1.02] transition-transform"
                title={t.name}
                style={{ background: ThemeEngine.generateGradientCSS(t.gradient) }}
              >
                <div className="absolute inset-x-0 bottom-0 p-1 text-[10px] text-foreground/90 truncate bg-background/30 backdrop-blur-xs">
                  {t.name}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
