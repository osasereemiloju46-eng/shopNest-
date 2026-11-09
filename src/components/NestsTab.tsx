import React from 'react';
import { Sparkles, ArrowRight, Layers, Check } from 'lucide-react';
import { Product, AndroidTheme } from '../types';
import { PRODUCTS, HERO_IMAGE, LAMP_IMAGE, SPEAKER_IMAGE, VASE_IMAGE } from '../data/mockProducts';
import { hapticAddToCart } from '../utils/haptics';

interface NestsTabProps {
  onSelectProduct: (product: Product) => void;
  onAddBundleToCart: (products: Product[]) => void;
  theme: AndroidTheme;
}

export const NestsTab: React.FC<NestsTabProps> = ({
  onSelectProduct,
  onAddBundleToCart,
  theme,
}) => {
  const bundles = [
    {
      id: 'bundle-nordic-living',
      title: 'The Nordic Living Room Edit',
      subtitle: 'Complete comfort collection: Bouclé chair, ceramic glow pendant & tactile vessel',
      image: HERO_IMAGE,
      productIds: ['sn-chair-01', 'sn-lamp-02', 'sn-vase-04'],
      originalTotal: 920,
      bundlePrice: 780,
      savings: 140,
    },
    {
      id: 'bundle-studio-sound',
      title: 'The Acoustic Sanctuary Nest',
      subtitle: 'Walnut Hi-Fi speaker paired with ambient stoneware lighting',
      image: SPEAKER_IMAGE,
      productIds: ['sn-audio-03', 'sn-lamp-02'],
      originalTotal: 505,
      bundlePrice: 430,
      savings: 75,
    },
  ];

  return (
    <div className="flex flex-col gap-6 p-4 pb-20">
      {/* Tab Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 dark:text-stone-400">
          <Layers className="w-3.5 h-3.5 text-amber-600" />
          <span>Curated Spaces</span>
        </div>
        <h1 className="text-2xl font-bold font-display text-stone-900 dark:text-stone-100 tracking-tight mt-1">
          Curated Nests
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Harmoniously styled room edits. Purchase bundled sets for an exclusive 15% nest savings.
        </p>
      </div>

      {/* Bundles */}
      <div className="flex flex-col gap-5">
        {bundles.map((bundle) => {
          const bundleProducts = PRODUCTS.filter((p) => bundle.productIds.includes(p.id));

          return (
            <div
              key={bundle.id}
              className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200/80 dark:border-stone-800 overflow-hidden shadow-sm flex flex-col gap-4 p-4"
            >
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800">
                <img
                  src={bundle.image}
                  alt={bundle.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-stone-900/85 backdrop-blur-md text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded-md">
                  SAVE ${bundle.savings} BUNDLE
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                  {bundle.title}
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  {bundle.subtitle}
                </p>
              </div>

              {/* Items in this nest bundle */}
              <div className="flex flex-col gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                  Included in this Nest:
                </span>
                <div className="grid grid-cols-1 gap-2">
                  {bundleProducts.map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() => onSelectProduct(prod)}
                      className="flex items-center justify-between p-2 rounded-xl bg-stone-50 dark:bg-stone-800/60 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          referrerPolicy="no-referrer"
                          className="w-9 h-9 rounded-lg object-cover bg-stone-200 shrink-0"
                        />
                        <span className="text-xs font-medium text-stone-800 dark:text-stone-200 truncate">
                          {prod.name}
                        </span>
                      </div>
                      <span className="font-mono text-xs text-stone-500 dark:text-stone-400 shrink-0">
                        ${prod.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bundle Pricing & Add Action */}
              <div className="flex items-center justify-between pt-3 border-t border-stone-100 dark:border-stone-800">
                <div>
                  <div className="text-[11px] text-stone-400">Bundle Price</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-mono font-bold text-stone-900 dark:text-stone-100 tabular-nums">
                      ${bundle.bundlePrice}
                    </span>
                    <span className="text-xs font-mono text-stone-400 line-through tabular-nums">
                      ${bundle.originalTotal}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    hapticAddToCart();
                    onAddBundleToCart(bundleProducts);
                  }}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform ${theme.accentBg}`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Add Nest Bundle</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
