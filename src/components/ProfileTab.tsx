import React, { useState } from 'react';
import { 
  User, 
  Palette, 
  Smartphone, 
  Moon, 
  Sun, 
  ShieldCheck, 
  Package, 
  Truck, 
  ChevronRight, 
  Check, 
  Info,
  Sliders,
  BellRing,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Ban
} from 'lucide-react';
import { AndroidTheme, AndroidThemeId, Order, PriceAlert } from '../types';
import { ANDROID_THEMES } from '../data/mockProducts';
import { hapticAddToCart, hapticPurchaseSuccess, triggerAndroidHaptic } from '../utils/haptics';

interface ProfileTabProps {
  userEmail: string;
  currentTheme: AndroidTheme;
  onChangeTheme: (themeId: AndroidThemeId) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  showPhoneFrame: boolean;
  onTogglePhoneFrame: () => void;
  orders: Order[];
  onOpenOrderTracking: (order: Order) => void;
  onCancelOrder?: (orderId: string) => void;
  priceAlerts?: PriceAlert[];
  onSelectProductById?: (productId: string) => void;
  onRemovePriceAlert?: (productId: string) => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  userEmail,
  currentTheme,
  onChangeTheme,
  isDarkMode,
  onToggleDarkMode,
  showPhoneFrame,
  onTogglePhoneFrame,
  orders,
  onOpenOrderTracking,
  onCancelOrder,
  priceAlerts = [],
  onSelectProductById,
  onRemovePriceAlert,
}) => {
  // Segmented control filter state: 'active' | 'delivered' | 'cancelled'
  const [orderFilter, setOrderFilter] = useState<'active' | 'delivered' | 'cancelled'>('active');

  // Filter calculations
  const activeOrders = orders.filter(
    (o) => o.status === 'placed' || o.status === 'packing' || o.status === 'in_transit'
  );
  const deliveredOrders = orders.filter((o) => o.status === 'delivered');
  const cancelledOrders = orders.filter((o) => o.status === 'cancelled');

  const filteredOrders =
    orderFilter === 'active'
      ? activeOrders
      : orderFilter === 'delivered'
      ? deliveredOrders
      : cancelledOrders;
  return (
    <div className="flex flex-col gap-5 p-4 pb-20">
      {/* Account Card */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 border border-stone-200/80 dark:border-stone-800 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3 truncate">
          <div className="w-12 h-12 rounded-2xl bg-amber-600/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold text-lg shrink-0">
            {userEmail.charAt(0).toUpperCase()}
          </div>
          <div className="truncate">
            <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              Nest Member
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 truncate">
              {userEmail}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 px-2.5 py-1 rounded-full text-[11px] font-semibold shrink-0">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>GPay Synced</span>
        </div>
      </div>

      {/* Active Price Drop Notifications Watchlist */}
      {priceAlerts.length > 0 && (
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between px-1">
            <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
              <BellRing className="w-3.5 h-3.5 text-amber-500" />
              <span>Active Price Drop Watchers ({priceAlerts.length})</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {priceAlerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-white dark:bg-stone-900 rounded-2xl p-3.5 border border-amber-800/30 dark:border-stone-800 flex items-center justify-between shadow-xs"
              >
                <div 
                  onClick={() => onSelectProductById?.(alert.productId)}
                  className="flex-1 cursor-pointer pr-3"
                >
                  <div className="text-xs font-bold text-stone-900 dark:text-stone-100 line-clamp-1">
                    {alert.productName}
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                    Target: <strong className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">${alert.targetPrice}</strong> · Current: ${alert.currentPrice}
                  </div>
                  <div className="text-[10px] text-stone-400 mt-0.5">
                    Notification to {alert.userEmail}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectProductById?.(alert.productId)}
                    className="px-2.5 py-1 text-xs font-semibold bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-800 dark:text-stone-200 rounded-lg transition-colors"
                  >
                    View
                  </button>
                  <button
                    onClick={() => onRemovePriceAlert?.(alert.productId)}
                    className="p-1.5 text-stone-400 hover:text-red-500 rounded-lg transition-colors"
                    title="Remove alert"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Orders Filter Section with Material 3 Segmented Control */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5 text-stone-500" />
            <span>Orders History</span>
          </div>
          <span className="text-[11px] font-mono text-stone-400">
            {orders.length} Total
          </span>
        </div>

        {/* Material 3 Segmented Control */}
        <div
          role="tablist"
          aria-label="Order Status Filter"
          className="bg-stone-100 dark:bg-stone-800/90 p-1 rounded-2xl flex items-center border border-stone-200/80 dark:border-stone-700/60"
        >
          <button
            type="button"
            role="tab"
            aria-selected={orderFilter === 'active'}
            onClick={() => {
              triggerAndroidHaptic('lightTick');
              setOrderFilter('active');
            }}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
              orderFilter === 'active'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 font-semibold shadow-xs'
                : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <span>Active</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                orderFilter === 'active'
                  ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300'
                  : 'bg-stone-200/70 dark:bg-stone-700 text-stone-600 dark:text-stone-400'
              }`}
            >
              {activeOrders.length}
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={orderFilter === 'delivered'}
            onClick={() => {
              triggerAndroidHaptic('lightTick');
              setOrderFilter('delivered');
            }}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
              orderFilter === 'delivered'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 font-semibold shadow-xs'
                : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <span>Delivered</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                orderFilter === 'delivered'
                  ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                  : 'bg-stone-200/70 dark:bg-stone-700 text-stone-600 dark:text-stone-400'
              }`}
            >
              {deliveredOrders.length}
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={orderFilter === 'cancelled'}
            onClick={() => {
              triggerAndroidHaptic('lightTick');
              setOrderFilter('cancelled');
            }}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
              orderFilter === 'cancelled'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 font-semibold shadow-xs'
                : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <span>Cancelled</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                orderFilter === 'cancelled'
                  ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300'
                  : 'bg-stone-200/70 dark:bg-stone-700 text-stone-600 dark:text-stone-400'
              }`}
            >
              {cancelledOrders.length}
            </span>
          </button>
        </div>

        {/* Filtered Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 text-xs text-stone-500 dark:text-stone-400 text-center flex flex-col items-center gap-1.5">
            {orderFilter === 'active' && (
              <>
                <Truck className="w-6 h-6 text-stone-400 mb-1" />
                <p className="font-medium text-stone-800 dark:text-stone-200">No active shipments in transit</p>
                <p className="text-[11px] text-stone-400 max-w-xs">New purchases made with Google Pay appear here with live GPS driver tracking.</p>
              </>
            )}
            {orderFilter === 'delivered' && (
              <>
                <CheckCircle2 className="w-6 h-6 text-emerald-500 mb-1" />
                <p className="font-medium text-stone-800 dark:text-stone-200">No delivered orders yet</p>
                <p className="text-[11px] text-stone-400 max-w-xs">Completed packages and signed delivery receipts will be archived here.</p>
              </>
            )}
            {orderFilter === 'cancelled' && (
              <>
                <Ban className="w-6 h-6 text-stone-400 mb-1" />
                <p className="font-medium text-stone-800 dark:text-stone-200">No cancelled orders</p>
                <p className="text-[11px] text-stone-400 max-w-xs">Orders you choose to cancel and refund will be displayed here.</p>
              </>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {filteredOrders.map((order) => {
              const isOrderActive = order.status === 'placed' || order.status === 'packing' || order.status === 'in_transit';
              const isDelivered = order.status === 'delivered';
              const isCancelled = order.status === 'cancelled';

              return (
                <div
                  key={order.id}
                  className="bg-white dark:bg-stone-900 rounded-2xl p-4 border border-stone-200/80 dark:border-stone-800 flex flex-col gap-3 shadow-xs hover:border-stone-300 dark:hover:border-stone-700 transition-colors"
                >
                  <div 
                    onClick={() => onOpenOrderTracking(order)}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                          isOrderActive
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                            : isDelivered
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'bg-stone-500/10 text-stone-500 dark:text-stone-400'
                        }`}
                      >
                        {isOrderActive ? (
                          <Truck className="w-5 h-5" />
                        ) : isDelivered ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <XCircle className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-stone-900 dark:text-stone-100">
                            {order.id}
                          </span>
                          {isOrderActive && (
                            <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.2 rounded font-medium">
                              {order.status === 'in_transit' ? 'In Transit' : order.status === 'packing' ? 'Packing' : 'Confirmed'}
                            </span>
                          )}
                          {isDelivered && (
                            <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.2 rounded font-medium">
                              Delivered
                            </span>
                          )}
                          {isCancelled && (
                            <span className="text-[10px] bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 px-1.5 py-0.2 rounded font-medium">
                              Cancelled
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                          {order.items.length} {order.items.length === 1 ? 'item' : 'items'} · Total ${order.total.toFixed(2)} · {order.date}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                      <span>{isOrderActive ? 'Live Map' : isDelivered ? 'Receipt' : 'Details'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Contextual notes / cancellation / details */}
                  {isOrderActive && (
                    <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                      <div className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        <span>ETA: {order.estimatedDelivery || 'In Progress'}</span>
                      </div>
                      {onCancelOrder && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            triggerAndroidHaptic('error');
                            onCancelOrder(order.id);
                          }}
                          className="text-[11px] text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors underline underline-offset-2"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  )}

                  {isCancelled && order.cancelReason && (
                    <div className="pt-2 border-t border-stone-100 dark:border-stone-800 text-[11px] text-rose-600 dark:text-rose-400/90 bg-rose-50/50 dark:bg-rose-950/20 px-2.5 py-1.5 rounded-xl">
                      {order.cancelReason}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Android Material You Theming */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 border border-stone-200/80 dark:border-stone-800 shadow-sm flex flex-col gap-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-stone-900 dark:text-stone-100">
          <Palette className="w-4 h-4 text-amber-600" />
          <span>Material You Dynamic Theme</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {ANDROID_THEMES.map((th) => (
            <button
              key={th.id}
              onClick={() => {
                if (navigator.vibrate) navigator.vibrate(10);
                onChangeTheme(th.id);
              }}
              className={`flex items-center gap-2.5 p-3 rounded-2xl border text-left transition-all ${
                currentTheme.id === th.id
                  ? 'border-stone-900 dark:border-stone-100 bg-stone-50 dark:bg-stone-800 font-semibold text-stone-900 dark:text-stone-100 ring-2 ring-stone-900/10'
                  : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
              }`}
            >
              <div
                className="w-5 h-5 rounded-full shadow-sm shrink-0 border border-black/10"
                style={{ backgroundColor: th.colorHex }}
              />
              <span className="text-xs truncate">{th.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Android Device Presentation Preferences */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 border border-stone-200/80 dark:border-stone-800 shadow-sm flex flex-col gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-stone-900 dark:text-stone-100">
          <Smartphone className="w-4 h-4 text-amber-600" />
          <span>Android Hardware & Layout</span>
        </div>

        {/* Pixel 9 Pro Frame Toggle */}
        <div className="flex items-center justify-between py-2 border-b border-stone-100 dark:border-stone-800">
          <div>
            <div className="text-xs font-semibold text-stone-900 dark:text-stone-100">
              Pixel 9 Pro Device Frame
            </div>
            <div className="text-[11px] text-stone-500 dark:text-stone-400">
              Show hardware chassis with punch hole and curved bezels
            </div>
          </div>
          <button
            onClick={onTogglePhoneFrame}
            className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
              showPhoneFrame ? 'bg-stone-900 dark:bg-stone-100' : 'bg-stone-300 dark:bg-stone-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white dark:bg-stone-900 shadow-sm transition-transform ${
                showPhoneFrame ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Dark / Light Theme Toggle */}
        <div className="flex items-center justify-between py-2">
          <div>
            <div className="text-xs font-semibold text-stone-900 dark:text-stone-100">
              Dark Mode (AMOLED Black)
            </div>
            <div className="text-[11px] text-stone-500 dark:text-stone-400">
              Pure black battery saver styling
            </div>
          </div>
          <button
            onClick={onToggleDarkMode}
            className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
              isDarkMode ? 'bg-stone-900 dark:bg-stone-100' : 'bg-stone-300 dark:bg-stone-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white dark:bg-stone-900 shadow-sm transition-transform ${
                isDarkMode ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Android System Haptic Tester */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 border border-stone-200/80 dark:border-stone-800 shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-900 dark:text-stone-100">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Android System Haptics (navigator.vibrate)</span>
          </div>
          <span className="text-[10px] text-stone-400 font-mono">Hardware Linked</span>
        </div>

        <p className="text-xs text-stone-500 dark:text-stone-400">
          Mimicking native Android 15 vibration patterns on key cart and purchase interactions:
        </p>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => hapticAddToCart()}
            className="flex flex-col items-start p-2.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/80 text-left hover:border-stone-400 active:scale-95 transition-all"
          >
            <span className="text-xs font-bold text-stone-900 dark:text-stone-100">Add to Cart Pulse</span>
            <span className="text-[10px] text-stone-500 font-mono">[22ms, 45ms, 18ms]</span>
          </button>

          <button
            onClick={() => hapticPurchaseSuccess()}
            className="flex flex-col items-start p-2.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/80 text-left hover:border-stone-400 active:scale-95 transition-all"
          >
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">Confirm Purchase</span>
            <span className="text-[10px] text-stone-500 font-mono">[45ms, 60ms, 30ms...]</span>
          </button>
        </div>
      </div>

      {/* Android System Spec Info */}
      <div className="bg-stone-50 dark:bg-stone-800/40 rounded-3xl p-4 border border-stone-200/80 dark:border-stone-800 text-xs flex flex-col gap-2">
        <div className="flex items-center gap-1.5 font-semibold text-stone-700 dark:text-stone-300">
          <Info className="w-3.5 h-3.5 text-stone-400" />
          <span>ShopNest Android OS Build</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-500 dark:text-stone-400">
          <div>Package: <span className="font-mono text-stone-800 dark:text-stone-200">com.shopnest.android</span></div>
          <div>Version: <span className="font-mono text-stone-800 dark:text-stone-200">v2.4.0 (Release)</span></div>
          <div>Target SDK: <span className="font-mono text-stone-800 dark:text-stone-200">Android 15 (API 35)</span></div>
          <div>Biometrics: <span className="font-mono text-emerald-600 dark:text-emerald-400">KeyStore Armed</span></div>
        </div>
      </div>
    </div>
  );
};
