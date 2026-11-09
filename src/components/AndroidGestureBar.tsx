import React from 'react';

interface AndroidGestureBarProps {
  onBackGesture?: () => void;
  onHomeGesture?: () => void;
  darkSurface?: boolean;
}

export const AndroidGestureBar: React.FC<AndroidGestureBarProps> = ({
  onBackGesture,
  onHomeGesture,
  darkSurface = false,
}) => {
  return (
    <div
      className={`w-full h-5 flex items-center justify-center select-none cursor-pointer transition-colors ${
        darkSurface
          ? 'bg-stone-900 text-stone-600'
          : 'bg-stone-50 dark:bg-stone-900 text-stone-300 dark:text-stone-700'
      }`}
      onClick={onHomeGesture}
      title="Android Gesture Pill (Tap for Home, Swipe/Click for System Return)"
    >
      {/* Android 15 Navigation Pill */}
      <div className="w-32 h-1 bg-stone-300 dark:bg-stone-600 rounded-full hover:bg-stone-400 dark:hover:bg-stone-500 transition-colors" />
    </div>
  );
};
