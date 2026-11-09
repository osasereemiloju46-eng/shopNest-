import React from 'react';
import { Smartphone, Maximize2, Sparkles, Moon, Sun } from 'lucide-react';
import { AndroidTheme } from '../types';

interface AndroidFrameProps {
  children: React.ReactNode;
  showPhoneFrame: boolean;
  onToggleFrame: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  theme: AndroidTheme;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
  showPhoneFrame,
  onToggleFrame,
  isDarkMode,
  onToggleDarkMode,
  theme,
}) => {
  if (!showPhoneFrame) {
    return (
      <div className="w-full min-h-screen bg-stone-100 dark:bg-stone-950 flex flex-col items-center">
        {/* Desktop Quick Bar when frame is disabled */}
        <div className="w-full max-w-md md:max-w-xl mx-auto px-4 py-2 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>ShopNest Android v2.4</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleFrame}
              className="flex items-center gap-1 text-stone-700 dark:text-stone-300 hover:text-stone-900 font-semibold"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Enable Pixel Frame</span>
            </button>
            <button
              onClick={onToggleDarkMode}
              className="p-1 rounded-full text-stone-600 dark:text-stone-300"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Viewport */}
        <div className="w-full max-w-md min-h-[92vh] bg-stone-50 dark:bg-stone-900 shadow-xl flex flex-col relative overflow-hidden">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-stone-200/80 dark:bg-stone-950 py-4 md:py-8 px-2 flex flex-col items-center justify-center transition-colors">
      {/* Desktop Top Control Bar */}
      <aside aria-label="Device presentation settings" className="mb-4 flex items-center gap-4 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-stone-200 dark:border-stone-800 text-xs">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: theme.colorHex }}
          />
          <span className="font-semibold text-stone-800 dark:text-stone-200">
            Pixel 9 Pro · Android 15
          </span>
        </div>

        <div className="h-4 w-px bg-stone-200 dark:bg-stone-700" />

        <button
          onClick={onToggleFrame}
          className="flex items-center gap-1.5 font-medium text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition-colors"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>Full View</span>
        </button>

        <div className="h-4 w-px bg-stone-200 dark:bg-stone-700" />

        <button
          onClick={onToggleDarkMode}
          className="flex items-center gap-1.5 font-medium text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition-colors"
        >
          {isDarkMode ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-slate-700" />
              <span>AMOLED Dark</span>
            </>
          )}
        </button>
      </aside>

      {/* Realistic Pixel 9 Pro Hardware Chassis */}
      <div className="relative w-full max-w-[420px] h-[870px] bg-stone-900 rounded-[52px] p-[10px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35),0_0_0_1px_rgba(255,255,255,0.15)] ring-1 ring-black/40 flex flex-col justify-between">
        {/* Hardware Buttons - Power & Volume Rockers */}
        <div className="absolute -right-[13px] top-28 w-[3px] h-12 bg-stone-700 rounded-r-sm" />
        <div className="absolute -right-[13px] top-44 w-[3px] h-20 bg-stone-700 rounded-r-sm" />

        {/* Screen Bezel Container */}
        <div className="w-full h-full bg-stone-50 dark:bg-stone-900 rounded-[44px] overflow-hidden flex flex-col relative shadow-inner">
          {/* Front Punch-hole Camera */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-black z-40 border border-stone-700 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-stone-800/80" />
          </div>

          {/* Mobile OS Screen Content */}
          <div className="w-full h-full flex flex-col overflow-hidden relative">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
