import React, { useState } from 'react';
import { Search, Mic, Camera, SlidersHorizontal, Sparkles, ArrowRight, Bell, Tag } from 'lucide-react';
import { Product, CategoryId, Story, AndroidTheme } from '../types';
import { CATEGORIES, STORIES, HERO_IMAGE } from '../data/mockProducts';
import { ProductCard } from './ProductCard';

interface ExploreTabProps {
  products: Product[];
  activeCategory: CategoryId;
  onChangeCategory: (cat: CategoryId) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenLens: () => void;
  onOpenNotifications: () => void;
  unreadNotifications: number;
  onOpenStory: (index: number) => void;
  savedIds: string[];
  onToggleSave: (productId: string) => void;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  theme: AndroidTheme;
}

export const ExploreTab: React.FC<ExploreTabProps> = ({
  products,
  activeCategory,
  onChangeCategory,
  searchQuery,
  onSearchChange,
  onOpenLens,
  onOpenNotifications,
  unreadNotifications,
  onOpenStory,
  savedIds,
  onToggleSave,
  onSelectProduct,
  onQuickAdd,
  theme,
}) => {
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [showPromo, setShowPromo] = useState(true);

  const handleVoiceSearch = () => {
    if (navigator.vibrate) navigator.vibrate(20);
    setIsVoiceActive(true);
    // Simulate Android Google Speech to Text recognition
    setTimeout(() => {
      onSearchChange('Ceramic');
      setIsVoiceActive(false);
    }, 1200);
  };

  const filteredProducts = products.filter((prod) => {
    const matchesCat = activeCategory === 'all' || prod.category === activeCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-4 pb-20">
      {/* Android Top Search Bar */}
      <div className="px-4 pt-2 flex items-center gap-2.5">
        {/* Search Pill */}
        <div className="flex-1 flex items-center bg-white dark:bg-stone-800 rounded-full px-3.5 py-2.5 shadow-sm border border-stone-200/80 dark:border-stone-700/80 text-xs">
          <Search className="w-4 h-4 text-stone-400 mr-2 shrink-0" />
          <input
            type="text"
            placeholder={isVoiceActive ? 'Listening...' : 'Search pieces, materials, lighting...'}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-transparent text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none text-xs"
          />

          {/* Voice Search Button */}
          <button
            onClick={handleVoiceSearch}
            className={`p-1 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors ${
              isVoiceActive ? 'text-amber-500 animate-pulse' : ''
            }`}
            title="Search with Google Voice"
            aria-label="Search with voice"
          >
            <Mic className="w-4 h-4" />
          </button>

          {/* Lens Camera AI Button */}
          <button
            onClick={onOpenLens}
            className="p-1 ml-1 text-amber-700 dark:text-amber-400 hover:opacity-80 transition-opacity"
            title="ShopNest Lens (Visual Search)"
            aria-label="ShopNest Lens visual search"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>

        {/* Android Notification Bell */}
        <button
          onClick={onOpenNotifications}
          aria-label="Notifications"
          className="relative w-10 h-10 rounded-full bg-white dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700/80 flex items-center justify-center text-stone-700 dark:text-stone-300 shadow-sm active:scale-95 transition-transform shrink-0"
        >
          <Bell className="w-4 h-4" />
          {unreadNotifications > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white dark:ring-stone-800" />
          )}
        </button>
      </div>

      {/* Nest Drops / Stories Carousel */}
      {!searchQuery && (
        <div className="flex flex-col gap-1.5 pt-1">
          <div className="flex items-center justify-between px-4 text-xs">
            <span className="font-bold text-stone-900 dark:text-stone-100 font-display">
              Nest Drops & Edits
            </span>
            <span className="text-[11px] text-stone-400">Tap to preview</span>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar px-4 py-1">
            {STORIES.map((story, index) => (
              <button
                key={story.id}
                onClick={() => onOpenStory(index)}
                className="flex flex-col items-center gap-1 shrink-0 group focus:outline-none"
              >
                {/* Story Gradient Ring */}
                <div className="p-0.5 rounded-full bg-gradient-to-tr from-amber-600 via-emerald-600 to-amber-300 group-active:scale-95 transition-transform shadow-sm">
                  <div className="p-0.5 bg-stone-50 dark:bg-stone-900 rounded-full">
                    <img
                      src={story.thumbnail}
                      alt={story.title}
                      referrerPolicy="no-referrer"
                      className="w-13 h-13 rounded-full object-cover"
                    />
                  </div>
                </div>
                <span className="text-[10px] font-medium text-stone-700 dark:text-stone-300 max-w-[62px] truncate text-center">
                  {story.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Promotional Banner (Dismissible) */}
      {showPromo && !searchQuery && (
        <div className="mx-4 p-3 rounded-2xl bg-gradient-to-r from-stone-900 to-stone-800 text-white flex items-center justify-between shadow-sm border border-stone-700/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold shrink-0">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold leading-tight">Android Exclusive: 10% Off</div>
              <div className="text-[10px] text-stone-300">
                Use code <span className="font-mono text-amber-300 font-bold">NEST10</span> at checkout
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowPromo(false)}
            className="text-[10px] text-stone-400 hover:text-white px-2 py-1 rounded"
          >
            ✕
          </button>
        </div>
      )}

      {/* Hero Showcase Card */}
      {!searchQuery && activeCategory === 'all' && (
        <div className="mx-4 relative aspect-[16/9] rounded-3xl overflow-hidden shadow-md group cursor-pointer border border-stone-200/80 dark:border-stone-800"
          onClick={() => {
            const chair = products.find((p) => p.id === 'sn-chair-01');
            if (chair) onSelectProduct(chair);
          }}
        >
          <img
            src={HERO_IMAGE}
            alt="Autumn Nest Collection"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent flex flex-col justify-end p-5 text-white">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-amber-300 uppercase tracking-wider font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Autumn Craft Collection</span>
            </div>
            <h2 className="text-lg font-bold font-display leading-tight mt-0.5">
              The Sculpted Bouclé Lounge
            </h2>
            <p className="text-xs text-white/80 line-clamp-1 mt-0.5">
              Organic European white oak contours with cloud comfort.
            </p>
            <div className="mt-2.5 flex items-center gap-2 text-xs font-semibold text-white">
              <span>View Piece · $640</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      )}

      {/* Category Pills (Material 3 Segmented Filter) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar px-4 pt-1">
        {CATEGORIES.map((cat) => {
          const isSelected = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                if (navigator.vibrate) navigator.vibrate(8);
                onChangeCategory(cat.id as CategoryId);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                isSelected
                  ? `${theme.navActiveBg} ring-1 ring-black/5 shadow-sm`
                  : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200/70 dark:border-stone-700/70 hover:bg-stone-100'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Product Section Title & Count */}
      <div className="px-4 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
        <span className="font-semibold text-stone-900 dark:text-stone-100">
          {searchQuery ? `Search Results for "${searchQuery}"` : 'Curated Nest Pieces'}
        </span>
        <span className="font-mono text-[11px]">({filteredProducts.length})</span>
      </div>

      {/* Product Grid (2-columns on mobile, fluid touch spacing) */}
      <div className="px-4 grid grid-cols-2 gap-3.5">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isSaved={savedIds.includes(product.id)}
            onToggleSave={onToggleSave}
            onSelect={onSelectProduct}
            onQuickAdd={onQuickAdd}
            theme={theme}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="mx-4 p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 flex flex-col items-center justify-center text-center gap-2">
          <Search className="w-8 h-8 text-stone-400 stroke-[1.5]" />
          <h3 className="font-bold text-sm text-stone-800 dark:text-stone-200">
            No matching nest pieces
          </h3>
          <p className="text-xs text-stone-500 max-w-xs">
            We couldn't find items matching "{searchQuery}". Try searching for chair, lamp, speaker, or ceramic.
          </p>
          <button
            onClick={() => onSearchChange('')}
            className="mt-2 px-4 py-1.5 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-semibold"
          >
            Reset Search
          </button>
        </div>
      )}
    </div>
  );
};
