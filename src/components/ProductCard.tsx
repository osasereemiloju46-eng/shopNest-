import React, { useState } from 'react';
import { Heart, Plus, Sparkles, Check } from 'lucide-react';
import { Product, AndroidTheme } from '../types';
import { hapticAddToCart, triggerAndroidHaptic } from '../utils/haptics';

interface ProductCardProps {
  product: Product;
  isSaved: boolean;
  onToggleSave: (productId: string) => void;
  onSelect: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  theme: AndroidTheme;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isSaved,
  onToggleSave,
  onSelect,
  onQuickAdd,
  theme,
}) => {
  const [imageError, setImageError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleQuickAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    hapticAddToCart();
    setJustAdded(true);
    onQuickAdd(product);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerAndroidHaptic('lightTick');
    onToggleSave(product.id);
  };

  return (
    <article
      onClick={() => onSelect(product)}
      className="group relative flex flex-col bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/80 dark:border-stone-800 overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.985]"
    >
      {/* Top Media Slot */}
      <div className="relative aspect-[4/3] w-full bg-stone-100 dark:bg-stone-800/60 overflow-hidden">
        {!imageError ? (
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-stone-100 to-stone-200 dark:from-stone-800 dark:to-stone-900 text-stone-500">
            <span className="text-xs font-medium text-center">{product.name}</span>
          </div>
        )}

        {/* Favorite Heart Button */}
        <button
          onClick={handleSaveClick}
          aria-label={isSaved ? 'Remove from saved' : 'Save to wishlist'}
          className="absolute top-2.5 right-2.5 w-9 h-9 rounded-full bg-white/90 dark:bg-stone-900/90 backdrop-blur-md flex items-center justify-center text-stone-700 dark:text-stone-300 hover:text-red-500 dark:hover:text-red-400 transition-colors shadow-sm z-10"
        >
          <Heart
            className={`w-4 h-4 transition-transform active:scale-125 ${
              isSaved ? 'fill-red-500 text-red-500' : 'stroke-[2]'
            }`}
          />
        </button>

        {/* AR Ready Indicator */}
        {product.arCompatible && (
          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 bg-stone-900/80 text-white backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-medium tracking-wide">
            <Sparkles className="w-2.5 h-2.5 text-amber-300" />
            <span>AR Room</span>
          </div>
        )}
      </div>

      {/* Card Content & Metadata */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2">
        <div className="flex flex-col gap-1">
          {/* Category & Rating as clean unboxed text */}
          <div className="flex items-center gap-1.5 text-[11px] text-stone-500 dark:text-stone-400">
            <span>{product.categoryLabel}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono">★ {product.rating.toFixed(1)}</span>
            <span className="opacity-70">({product.reviewCount})</span>
          </div>

          <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100 line-clamp-1 leading-snug">
            {product.name}
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-1">
            {product.subtitle}
          </p>
        </div>

        {/* Price & Quick Add Button */}
        <div className="flex items-center justify-between pt-1 border-t border-stone-100 dark:border-stone-800/80 mt-1">
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-base font-bold text-stone-900 dark:text-stone-100 tabular-nums">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="font-mono text-xs text-stone-400 line-through tabular-nums">
                ${product.originalPrice}
              </span>
            )}
          </div>

          <button
            onClick={handleQuickAddClick}
            aria-label={`Add ${product.name} to bag`}
            className={`min-h-[36px] min-w-[36px] px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 shadow-sm transition-all duration-150 ${
              justAdded
                ? 'bg-emerald-600 text-white'
                : `${theme.accentBg}`
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span className="text-[11px]">Added</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span className="text-[11px]">Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};
