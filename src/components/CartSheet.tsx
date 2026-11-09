import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShieldCheck, Tag, ShoppingBag, Truck } from 'lucide-react';
import { CartItem, Product, AndroidTheme } from '../types';

interface CartSheetProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onOpenGPay: () => void;
  onExplore: () => void;
  discount: number;
  promoCode: string;
  onApplyPromo: (code: string) => boolean;
  theme: AndroidTheme;
}

export const CartSheet: React.FC<CartSheetProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onOpenGPay,
  onExplore,
  discount,
  promoCode,
  onApplyPromo,
  theme,
}) => {
  if (!isOpen) return null;

  const [inputCode, setInputCode] = useState('');
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoSuccess, setPromoSuccess] = useState<string | null>(
    discount > 0 ? `Applied (${promoCode})` : null
  );

  const subtotal = cart.reduce((acc, it) => acc + it.product.price * it.quantity, 0);
  const shippingThreshold = 150;
  const freeShipping = subtotal >= shippingThreshold || cart.length === 0;
  const shippingCost = freeShipping ? 0 : 15;
  const total = Math.max(0, subtotal - discount + shippingCost);
  const progressToFreeShip = Math.min(100, (subtotal / shippingThreshold) * 100);

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const ok = onApplyPromo(inputCode.trim().toUpperCase());
    if (ok) {
      setPromoSuccess(`10% Off Applied!`);
      setPromoError(null);
      setInputCode('');
    } else {
      setPromoError('Invalid code. Try NEST10');
      setPromoSuccess(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg mx-auto bg-white dark:bg-stone-900 rounded-t-3xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden border-t border-stone-200 dark:border-stone-800 animate-in slide-in-from-bottom duration-250"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Grab Handle */}
        <div className="w-full pt-3 pb-1 flex items-center justify-center shrink-0">
          <div className="w-12 h-1.5 bg-stone-300 dark:bg-stone-700 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-5 py-3 flex items-center justify-between border-b border-stone-100 dark:border-stone-800 shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-stone-800 dark:text-stone-200" />
            <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
              Nest Bag ({cart.reduce((a, b) => a + b.quantity, 0)} items)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shipping progress tracker */}
        {cart.length > 0 && (
          <div className="bg-stone-50 dark:bg-stone-800/60 px-5 py-2.5 border-b border-stone-100 dark:border-stone-800 text-xs">
            <div className="flex items-center justify-between text-stone-600 dark:text-stone-300 mb-1">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-emerald-600" />
                {freeShipping ? (
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                    You unlocked Complimentary Express Shipping!
                  </span>
                ) : (
                  <span>
                    Add <strong className="font-mono text-stone-900 dark:text-stone-100">${(shippingThreshold - subtotal).toFixed(0)}</strong> more for Free Shipping
                  </span>
                )}
              </span>
              <span className="font-mono text-[11px] font-bold">{Math.round(progressToFreeShip)}%</span>
            </div>
            <div className="w-full h-1.5 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 transition-all duration-300"
                style={{ width: `${progressToFreeShip}%` }}
              />
            </div>
          </div>
        )}

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3.5 no-scrollbar">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
              <div className="w-14 h-14 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400">
                <ShoppingBag className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div className="font-bold text-stone-800 dark:text-stone-200">
                Your nest bag is empty
              </div>
              <p className="text-xs text-stone-500 max-w-xs leading-relaxed">
                Explore our curated Nordic furniture, ambient ceramics, and studio acoustic pieces.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onExplore();
                }}
                className="mt-2 px-5 py-2 rounded-xl bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 text-xs font-semibold"
              >
                Explore Curated Nests
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={`${item.product.id}-${item.selectedColor || ''}`}
                className="flex items-center gap-3.5 p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/70 dark:border-stone-800"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  referrerPolicy="no-referrer"
                  className="w-18 h-18 rounded-xl object-cover bg-stone-200 dark:bg-stone-700 shrink-0"
                />

                <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">
                        {item.product.name}
                      </h4>
                      {item.selectedColor && (
                        <div className="text-[11px] text-stone-500 dark:text-stone-400">
                          {item.selectedColor}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="text-stone-400 hover:text-red-500 p-1"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <span className="font-mono text-xs font-bold text-stone-900 dark:text-stone-100 tabular-nums">
                      ${item.product.price * item.quantity}
                    </span>

                    {/* Quantity Stepper */}
                    <div className="flex items-center bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-700">
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))
                        }
                        className="w-6 h-6 flex items-center justify-center font-bold text-xs text-stone-700 dark:text-stone-300"
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-mono text-xs font-semibold tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center font-bold text-xs text-stone-700 dark:text-stone-300"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Promo code form */}
          {cart.length > 0 && (
            <form onSubmit={handlePromoSubmit} className="flex flex-col gap-1 pt-2">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Promo code (e.g. NEST10)"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-stone-100 dark:bg-stone-800 rounded-xl text-xs text-stone-900 dark:text-stone-100 uppercase font-mono placeholder:normal-case placeholder:font-sans focus:outline-none focus:ring-1 focus:ring-stone-400"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-stone-800 dark:bg-stone-700 hover:bg-stone-900 text-white rounded-xl text-xs font-semibold shrink-0"
                >
                  Apply
                </button>
              </div>
              {promoSuccess && (
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium px-1">
                  ✓ {promoSuccess}
                </span>
              )}
              {promoError && (
                <span className="text-[11px] text-red-500 font-medium px-1">
                  {promoError}
                </span>
              )}
            </form>
          )}
        </div>

        {/* Checkout Summary & Native Android GPay Action */}
        {cart.length > 0 && (
          <div className="p-4 bg-stone-50 dark:bg-stone-900/90 border-t border-stone-200 dark:border-stone-800 flex flex-col gap-3 shrink-0 shadow-lg">
            <div className="flex flex-col gap-1.5 text-xs text-stone-600 dark:text-stone-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono text-stone-900 dark:text-stone-100 font-semibold tabular-nums">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                  <span>Nest Promo Discount</span>
                  <span className="font-mono tabular-nums">-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="font-mono text-stone-900 dark:text-stone-100 font-semibold tabular-nums">
                  {freeShipping ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-stone-900 dark:text-stone-100 pt-2 border-t border-stone-200 dark:border-stone-800">
                <span>Total Amount</span>
                <span className="font-mono text-lg tabular-nums">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Google Pay Android 1-Click Buy */}
            <button
              onClick={() => {
                onClose();
                onOpenGPay();
              }}
              className="w-full h-12 rounded-xl bg-black hover:bg-stone-950 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-transform"
            >
              <span>Instant Checkout with</span>
              <div className="flex items-center gap-1 font-bold text-sm tracking-tighter">
                <span>G</span>
                <span className="text-blue-400">P</span>
                <span className="text-red-400">a</span>
                <span className="text-amber-400">y</span>
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
