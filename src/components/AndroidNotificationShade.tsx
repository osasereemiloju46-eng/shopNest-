import { X, Sparkles, CreditCard, Truck, Wifi, Bluetooth, Moon, Zap, ChevronUp, BellRing, TrendingDown } from 'lucide-react';
import { Order, PriceAlert } from '../types';

interface AndroidNotificationShadeProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct?: (productId: string) => void;
  onOpenOrderTracking?: (order: Order) => void;
  latestOrder?: Order | null;
  priceAlerts?: PriceAlert[];
}

export const AndroidNotificationShade: React.FC<AndroidNotificationShadeProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  onOpenOrderTracking,
  latestOrder,
  priceAlerts = [],
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex flex-col justify-start animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md mx-auto bg-stone-900 text-stone-100 rounded-b-3xl shadow-2xl p-5 border-b border-stone-800 flex flex-col gap-4 animate-in slide-in-from-top-4 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Android Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xl font-bold text-white">09:41</span>
            <span className="text-xs text-stone-400">· Monday, Nov 9</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            aria-label="Close shade"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Settings Tiles (Material You Pills) */}
        <div className="grid grid-cols-4 gap-2 py-1">
          <div className="flex flex-col items-center gap-1 p-2 rounded-2xl bg-emerald-950/80 text-emerald-300 border border-emerald-800/40">
            <Wifi className="w-4 h-4" />
            <span className="text-[10px] font-medium">ShopNest 5G</span>
          </div>
          <div className="flex flex-col items-center gap-1 p-2 rounded-2xl bg-stone-800 text-stone-200">
            <Bluetooth className="w-4 h-4" />
            <span className="text-[10px] font-medium">Aurum 01</span>
          </div>
          <div className="flex flex-col items-center gap-1 p-2 rounded-2xl bg-stone-800 text-stone-200">
            <Moon className="w-4 h-4" />
            <span className="text-[10px] font-medium">Silent</span>
          </div>
          <div className="flex flex-col items-center gap-1 p-2 rounded-2xl bg-amber-950/80 text-amber-300 border border-amber-800/40">
            <Zap className="w-4 h-4" />
            <span className="text-[10px] font-medium">Fast Charge</span>
          </div>
        </div>

        {/* Notification Cards */}
        <div className="flex flex-col gap-2.5 max-h-[60vh] overflow-y-auto no-scrollbar pt-1">
          <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider px-1">
            Notifications
          </div>

          {/* Notification 1: Order Tracker if active */}
          {latestOrder && (
            <div className="bg-stone-800/90 rounded-2xl p-3 border border-stone-700/60 shadow-sm flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs text-stone-400">
                <div className="flex items-center gap-1.5 font-medium text-stone-200">
                  <Truck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>ShopNest Delivery · Out for Delivery</span>
                </div>
                <span>Just now</span>
              </div>
              <p className="text-xs text-stone-100 font-medium leading-relaxed">
                Your courier is 3 stops away with order #{latestOrder.id.toUpperCase()}. Tap to view live map.
              </p>
              <div className="flex items-center justify-end">
                <button
                  onClick={() => {
                    onClose();
                    onOpenOrderTracking?.(latestOrder);
                  }}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  Track Live Map
                </button>
              </div>
            </div>
          )}

          {/* Notification 2: Flash Nest Offer */}
          <div className="bg-stone-800/90 rounded-2xl p-3 border border-stone-700/60 shadow-sm flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs text-stone-400">
              <div className="flex items-center gap-1.5 font-medium text-stone-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>ShopNest · Nest Member Exclusive</span>
              </div>
              <span>12m ago</span>
            </div>
            <p className="text-xs text-stone-100 font-medium">
              ⚡ Limited drop: 20% off with promo code <span className="font-mono text-amber-300 font-bold">NEST10</span> on Kumo Ceramic Pendant.
            </p>
            <div className="flex items-center justify-end">
              <button
                onClick={() => {
                  onClose();
                  onSelectProduct?.('sn-lamp-02');
                }}
                className="px-3 py-1 bg-stone-700 hover:bg-stone-600 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                View Lamp
              </button>
            </div>
          </div>

          {/* Active Price Drop Watchers */}
          {priceAlerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-stone-800/90 rounded-2xl p-3 border border-amber-800/40 shadow-sm flex flex-col gap-2"
            >
              <div className="flex items-center justify-between text-xs text-stone-400">
                <div className="flex items-center gap-1.5 font-medium text-amber-300">
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>Price Drop Watcher · Active</span>
                </div>
                <span>{alert.createdAt}</span>
              </div>
              <p className="text-xs text-stone-100 font-medium">
                Tracking <strong className="text-white">{alert.productName}</strong> for drop to <span className="font-mono text-emerald-300 font-bold">${alert.targetPrice}</span> (Current: ${alert.currentPrice}).
              </p>
              <div className="flex items-center justify-between text-[11px] text-stone-400 pt-0.5">
                <span className="truncate">Alerting {alert.userEmail}</span>
                <button
                  onClick={() => {
                    onClose();
                    onSelectProduct?.(alert.productId);
                  }}
                  className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg transition-colors shrink-0 ml-2"
                >
                  View Piece
                </button>
              </div>
            </div>
          ))}

          {/* Notification 3: Google Pay */}
          <div className="bg-stone-800/90 rounded-2xl p-3 border border-stone-700/60 shadow-sm flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs text-stone-400">
              <div className="flex items-center gap-1.5 font-medium text-stone-200">
                <CreditCard className="w-3.5 h-3.5 text-blue-400" />
                <span>Google Pay · Biometric Ready</span>
              </div>
              <span>1h ago</span>
            </div>
            <p className="text-xs text-stone-300">
              Instant 1-tap checkout enabled for ShopNest on your Android device.
            </p>
          </div>
        </div>

        {/* Bottom Grab bar */}
        <div className="flex items-center justify-center pt-1">
          <div className="w-12 h-1 bg-stone-700 rounded-full" />
        </div>
      </div>
    </div>
  );
};
