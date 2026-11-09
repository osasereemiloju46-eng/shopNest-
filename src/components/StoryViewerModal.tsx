import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ShoppingBag, Eye } from 'lucide-react';
import { Story, Product } from '../types';
import { PRODUCTS } from '../data/mockProducts';

interface StoryViewerModalProps {
  stories: Story[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({
  stories,
  initialIndex,
  isOpen,
  onClose,
  onSelectProduct,
}) => {
  if (!isOpen || stories.length === 0) return null;

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const activeStory = stories[currentIndex];
  const linkedProduct = activeStory?.productId
    ? PRODUCTS.find((p) => p.id === activeStory.productId)
    : null;

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setProgress(0);
  }, [initialIndex, isOpen]);

  useEffect(() => {
    if (isPaused) return;

    const step = 100 / (activeStory.durationSeconds * 20);
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentIndex < stories.length - 1) {
            setCurrentIndex((c) => c + 1);
            return 0;
          } else {
            onClose();
            return 100;
          }
        }
        return prev + step;
      });
    }, 50);

    return () => clearInterval(timer);
  }, [currentIndex, isPaused, activeStory, stories.length, onClose]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((c) => c + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((c) => c - 1);
      setProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center select-none overflow-hidden animate-in fade-in duration-200">
      {/* Background Story Image */}
      <img
        src={activeStory.image}
        alt={activeStory.title}
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover filter brightness-90"
      />

      {/* Top Scrim with Progress bars */}
      <div className="absolute top-0 inset-x-0 p-4 pt-6 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex flex-col gap-3 z-30">
        {/* Progress bar indicators */}
        <div className="flex items-center gap-1.5 w-full">
          {stories.map((st, idx) => {
            const width =
              idx < currentIndex ? '100%' : idx === currentIndex ? `${progress}%` : '0%';
            return (
              <div
                key={st.id}
                className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
              >
                <div
                  className="h-full bg-white transition-all duration-75"
                  style={{ width }}
                />
              </div>
            );
          })}
        </div>

        {/* Story Author / Brand lockup */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-white">
            <div className="w-8 h-8 rounded-full border border-white/60 overflow-hidden bg-stone-800">
              <img
                src={activeStory.thumbnail}
                alt="thumb"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="text-xs font-bold leading-tight">ShopNest Drops</div>
              <div className="text-[10px] text-white/70">Android Exclusive</div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-colors"
            aria-label="Close story"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Touch Tap Zones for Previous & Next */}
      <div
        className="absolute inset-y-24 left-0 w-1/3 z-10 cursor-pointer"
        onClick={handlePrev}
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      />
      <div
        className="absolute inset-y-24 right-0 w-2/3 z-10 cursor-pointer"
        onClick={handleNext}
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      />

      {/* Bottom Story Card & Shop CTA */}
      <div className="absolute bottom-6 inset-x-4 p-5 bg-black/60 backdrop-blur-md rounded-3xl border border-white/20 text-white flex flex-col gap-3 z-30">
        <div>
          <span className="text-[11px] font-mono uppercase text-amber-300 font-semibold tracking-wider">
            Featured Nest Drop
          </span>
          <h2 className="text-xl font-bold font-display">{activeStory.title}</h2>
          <p className="text-xs text-white/80">{activeStory.tagline}</p>
        </div>

        {linkedProduct && (
          <div className="flex items-center justify-between pt-2 border-t border-white/20">
            <div className="flex items-center gap-2.5">
              <img
                src={linkedProduct.image}
                alt={linkedProduct.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-xl object-cover bg-stone-900 border border-white/20"
              />
              <div className="text-xs">
                <div className="font-semibold line-clamp-1">{linkedProduct.name}</div>
                <div className="font-mono font-bold text-amber-300">${linkedProduct.price}</div>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onSelectProduct(linkedProduct);
              }}
              className="px-4 py-2 rounded-xl bg-white text-stone-900 text-xs font-bold flex items-center gap-1.5 shadow-lg active:scale-95 transition-transform"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Shop Look</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
