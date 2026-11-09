import React, { useState } from 'react';
import { X, Camera, Sparkles, Upload, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS } from '../data/mockProducts';

interface VisualSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export const VisualSearchModal: React.FC<VisualSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
}) => {
  if (!isOpen) return null;

  const [scanning, setScanning] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [matchedProducts, setMatchedProducts] = useState<Product[]>(PRODUCTS.slice(0, 3));

  const presets = [
    { label: 'Bouclé Lounge Chair', targetId: 'sn-chair-01' },
    { label: 'Ceramic Pendant Lamp', targetId: 'sn-lamp-02' },
    { label: 'Walnut Audio Speaker', targetId: 'sn-audio-03' },
    { label: 'Fluted Terracotta Vase', targetId: 'sn-vase-04' },
  ];

  const handleSelectPreset = (targetId: string, label: string) => {
    setSelectedPreset(label);
    setScanning(true);
    if (navigator.vibrate) navigator.vibrate(20);

    setTimeout(() => {
      setScanning(false);
      const match = PRODUCTS.find((p) => p.id === targetId);
      if (match) {
        setMatchedProducts([match, ...PRODUCTS.filter((p) => p.id !== targetId).slice(0, 2)]);
      }
    }, 600);
  };

  const handleSimulateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setScanning(true);
      setSelectedPreset('Uploaded Image');
      setTimeout(() => {
        setScanning(false);
        setMatchedProducts(PRODUCTS.slice(0, 3));
      }, 700);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex flex-col justify-end animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md mx-auto bg-stone-900 text-stone-100 rounded-t-3xl shadow-2xl p-6 flex flex-col gap-4 border-t border-stone-800 animate-in slide-in-from-bottom duration-250 max-h-[88vh] overflow-y-auto no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Grab bar */}
        <div className="w-12 h-1 bg-stone-700 rounded-full mx-auto" />

        {/* Lens Header */}
        <div className="flex items-center justify-between pb-2 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-sm tracking-tight flex items-center gap-1.5">
                <span>ShopNest Lens</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-mono">
                  Android AI
                </span>
              </div>
              <div className="text-[11px] text-stone-400">Scan real interiors or upload to match furniture</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera Reticle Scanner Box */}
        <div className="relative aspect-[16/9] w-full rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-center overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80"
            alt="Interior view"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover filter brightness-75"
          />

          {/* Scanner Overlay Line */}
          {scanning ? (
            <div className="absolute inset-0 flex flex-col justify-center items-center bg-black/40">
              <div className="w-full h-0.5 bg-amber-400 shadow-[0_0_12px_#fbbf24] animate-pulse" />
              <span className="text-xs font-mono text-amber-300 mt-2 font-semibold">
                Analyzing visual aesthetic...
              </span>
            </div>
          ) : (
            <div className="absolute inset-4 border border-dashed border-white/40 rounded-xl pointer-events-none flex items-center justify-center">
              <div className="text-[11px] text-white/80 bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
                Point at any furniture or decor
              </div>
            </div>
          )}
        </div>

        {/* Preset quick pills */}
        <div className="flex flex-col gap-1.5">
          <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
            Quick Visual Presets
          </div>
          <div className="flex flex-wrap gap-2">
            {presets.map((preset) => (
              <button
                key={preset.targetId}
                onClick={() => handleSelectPreset(preset.targetId, preset.label)}
                className={`text-xs px-3 py-1.5 rounded-xl border transition-all ${
                  selectedPreset === preset.label
                    ? 'border-amber-400 bg-amber-950/40 text-amber-200'
                    : 'border-stone-800 bg-stone-800/60 text-stone-300 hover:border-stone-700'
                }`}
              >
                {preset.label}
              </button>
            ))}
            <label className="text-xs px-3 py-1.5 rounded-xl border border-stone-800 bg-stone-800/60 text-stone-300 hover:border-stone-700 flex items-center gap-1.5 cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>Gallery Photo</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleSimulateUpload}
              />
            </label>
          </div>
        </div>

        {/* Matched Catalog Items */}
        <div className="flex flex-col gap-2 pt-1 border-t border-stone-800">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span className="font-semibold text-stone-300">Catalog Matches</span>
            <span className="font-mono text-emerald-400 text-[11px]">96%+ Match</span>
          </div>

          <div className="flex flex-col gap-2">
            {matchedProducts.map((prod) => (
              <div
                key={prod.id}
                onClick={() => {
                  onClose();
                  onSelectProduct(prod);
                }}
                className="flex items-center gap-3 p-2.5 rounded-2xl bg-stone-800/70 hover:bg-stone-800 border border-stone-700/60 cursor-pointer transition-colors"
              >
                <img
                  src={prod.image}
                  alt={prod.name}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-xl object-cover bg-stone-900 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-stone-400">{prod.categoryLabel}</div>
                  <div className="text-xs font-semibold text-white truncate">{prod.name}</div>
                  <div className="font-mono text-xs text-stone-200 font-bold">${prod.price}</div>
                </div>
                <button
                  aria-label="View product"
                  className="w-8 h-8 rounded-full bg-stone-700 hover:bg-stone-600 flex items-center justify-center text-white shrink-0"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
