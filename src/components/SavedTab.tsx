import React from 'react';
import { Bookmark, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Product, AndroidTheme } from '../types';
import { PRODUCTS } from '../data/mockProducts';

interface SavedTabProps {
  savedIds: string[];
  onToggleSave: (productId: string) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onExplore: () => void;
  theme: AndroidTheme;
}

export const SavedTab: React.FC<SavedTabProps> = ({
  savedIds,
  onToggleSave,
  onSelectProduct,
  onAddToCart,
  onExplore,
  theme,
}) => {
  const savedProducts = PRODUCTS.filter((p) => savedIds.includes(p.id));
  const totalValue = savedProducts.reduce((sum, p) => sum + p.price, 0);

  return (
    <div className="flex flex-col gap-5 p-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 dark:text-stone-400">
            <Bookmark className="w-3.5 h-3.5 text-amber-600" />
            <span>Personal Wishlist</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-stone-900 dark:text-stone-100 tracking-tight mt-0.5">
            Saved Pieces ({savedProducts.length})
          </h1>
        </div>

        {savedProducts.length > 0 && (
          <div className="text-right">
            <span className="text-[10px] text-stone-400">Nest Value</span>
            <div className="font-mono text-sm font-bold text-stone-900 dark:text-stone-100">
              ${totalValue}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      {savedProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center gap-3 bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200/80 dark:border-stone-800">
          <div className="w-14 h-14 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400">
            <Bookmark className="w-6 h-6 stroke-[1.5]" />
          </div>
          <h3 className="font-bold text-stone-800 dark:text-stone-200">
            No saved pieces yet
          </h3>
          <p className="text-xs text-stone-500 max-w-xs leading-relaxed">
            Tap the heart icon on any armchair, pendant lamp, or hi-fi speaker to curate your personal nest.
          </p>
          <button
            onClick={onExplore}
            className="mt-2 px-5 py-2.5 rounded-xl bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 text-xs font-semibold active:scale-95 transition-transform"
          >
            Explore Catalog
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {savedProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => onSelectProduct(product)}
              className="flex items-center gap-3.5 p-3 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 cursor-pointer shadow-sm hover:shadow transition-shadow"
            >
              <img
                src={product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-20 h-20 rounded-xl object-cover bg-stone-100 shrink-0"
              />

              <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5">
                <div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400">
                    {product.categoryLabel}
                  </div>
                  <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">
                    {product.name}
                  </h4>
                  <div className="font-mono text-xs font-bold text-stone-900 dark:text-stone-100 mt-1">
                    ${product.price}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(product);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 ${theme.accentBg}`}
                  >
                    <ShoppingBag className="w-3 h-3" />
                    <span>Move to Bag</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSave(product.id);
                    }}
                    className="p-1.5 text-stone-400 hover:text-red-500 transition-colors"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
