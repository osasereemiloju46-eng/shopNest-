import React from 'react';
import { Compass, Layers, Sparkles, Bookmark, ShoppingBag } from 'lucide-react';
import { AndroidTheme } from '../types';
import { triggerAndroidHaptic } from '../utils/haptics';

export type TabId = 'explore' | 'nests' | 'ar' | 'saved' | 'cart' | 'profile';

interface AndroidNavBarProps {
  activeTab: TabId;
  onChangeTab: (tab: TabId) => void;
  cartCount: number;
  savedCount: number;
  theme: AndroidTheme;
}

export const AndroidNavBar: React.FC<AndroidNavBarProps> = ({
  activeTab,
  onChangeTab,
  cartCount,
  savedCount,
  theme,
}) => {
  const tabs = [
    {
      id: 'explore' as TabId,
      label: 'Explore',
      icon: Compass,
    },
    {
      id: 'nests' as TabId,
      label: 'Nests',
      icon: Layers,
    },
    {
      id: 'ar' as TabId,
      label: 'AR Room',
      icon: Sparkles,
      highlight: true,
    },
    {
      id: 'saved' as TabId,
      label: 'Saved',
      icon: Bookmark,
      badge: savedCount,
    },
    {
      id: 'cart' as TabId,
      label: 'Bag',
      icon: ShoppingBag,
      badge: cartCount,
    },
  ];

  return (
    <nav
      aria-label="Android Material 3 Navigation"
      className="w-full bg-stone-50/95 dark:bg-stone-900/95 backdrop-blur-lg border-t border-stone-200/80 dark:border-stone-800/80 px-2 pt-1 pb-1 z-30 select-none shadow-[0_-4px_20px_rgba(0,0,0,0.03)]"
    >
      <div className="grid grid-cols-5 items-center justify-items-center h-14">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => {
                triggerAndroidHaptic('lightTick');
                onChangeTab(tab.id);
              }}
              className="flex flex-col items-center justify-center w-full min-h-[48px] py-1 transition-all group focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 rounded-xl"
            >
              {/* Material 3 Active Pill Container */}
              <div
                className={`relative px-4 py-1 rounded-full transition-all duration-200 flex items-center justify-center ${
                  isActive
                    ? theme.navActiveBg
                    : 'text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200'
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-105 stroke-[2.2]' : 'scale-100 stroke-[1.8]'
                  }`}
                />

                {/* Badge indicator for Bag / Saved */}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-amber-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-sm font-mono">
                    {tab.badge > 9 ? '9+' : tab.badge}
                  </span>
                )}
              </div>

              {/* Tab Label */}
              <span
                className={`text-[10px] mt-0.5 tracking-tight font-medium transition-colors ${
                  isActive
                    ? 'font-semibold text-stone-900 dark:text-stone-100'
                    : 'text-stone-500 dark:text-stone-400'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
