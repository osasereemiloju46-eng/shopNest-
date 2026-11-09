import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Bell } from 'lucide-react';

interface AndroidStatusBarProps {
  unreadNotificationCount?: number;
  onOpenNotifications?: () => void;
  darkSurface?: boolean;
}

export const AndroidStatusBar: React.FC<AndroidStatusBarProps> = ({
  unreadNotificationCount = 2,
  onOpenNotifications,
  darkSurface = false,
}) => {
  const [timeStr, setTimeStr] = useState<string>('09:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTimeStr(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`w-full px-5 pt-2 pb-1.5 flex items-center justify-between text-xs font-semibold select-none z-30 transition-colors ${
        darkSurface
          ? 'text-white/90 bg-stone-900/90 backdrop-blur-md'
          : 'text-stone-800 dark:text-stone-200 bg-stone-50/80 dark:bg-stone-900/80 backdrop-blur-md'
      }`}
    >
      {/* Left: Clock & optional notification dot */}
      <div className="flex items-center gap-2">
        <span className="font-mono tracking-tight text-[13px]">{timeStr}</span>
        {unreadNotificationCount > 0 && (
          <button
            onClick={onOpenNotifications}
            className="flex items-center gap-1 text-[11px] font-medium text-amber-700 dark:text-amber-400 hover:opacity-80 transition-opacity"
            title="Open Android notifications"
            aria-label="Android notifications"
          >
            <Bell className="w-3.5 h-3.5 fill-current" />
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          </button>
        )}
      </div>

      {/* Right: 5G, Wi-Fi, Battery */}
      <div className="flex items-center gap-2.5">
        <span className="text-[10px] tracking-wider font-mono font-bold opacity-80">5G</span>
        <Wifi className="w-3.5 h-3.5 stroke-[2.2]" />
        <div className="flex items-center gap-1">
          <span className="font-mono text-[11px]">96%</span>
          <BatteryMedium className="w-4 h-4 stroke-[2.2]" />
        </div>
      </div>
    </div>
  );
};
