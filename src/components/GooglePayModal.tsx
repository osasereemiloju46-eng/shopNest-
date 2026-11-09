import React, { useState } from 'react';
import { X, Fingerprint, CheckCircle2, ShieldCheck, ChevronRight, CreditCard, MapPin } from 'lucide-react';
import { CartItem, Order } from '../types';
import { hapticPurchaseSuccess, triggerAndroidHaptic } from '../utils/haptics';

interface GooglePayModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  discount: number;
  onPaymentSuccess: (order: Order) => void;
  userEmail?: string;
}

export const GooglePayModal: React.FC<GooglePayModalProps> = ({
  isOpen,
  onClose,
  items,
  discount,
  onPaymentSuccess,
  userEmail = 'user@gmail.com',
}) => {
  if (!isOpen || items.length === 0) return null;

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'gpay_balance'>('card');
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const subtotal = items.reduce((acc, it) => acc + it.product.price * it.quantity, 0);
  const shipping = subtotal > 150 ? 0 : 15;
  const total = Math.max(0, subtotal - discount + shipping);

  const handleAuthorize = () => {
    triggerAndroidHaptic('biometricScan');
    setIsAuthorizing(true);

    setTimeout(() => {
      setIsAuthorizing(false);
      setIsSuccess(true);
      hapticPurchaseSuccess();

      const newOrder: Order = {
        id: `SN-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        items: [...items],
        subtotal,
        discount,
        shipping,
        total,
        status: 'in_transit',
        estimatedDelivery: 'Tomorrow by 2:00 PM',
        trackingNumber: `TRK-AND-${Math.floor(100000 + Math.random() * 900000)}`,
        courier: 'Nest Courier Express',
        courierLocation: {
          lat: 37.7749,
          lng: -122.4194,
          address: 'Market St & 5th Ave (Approaching your nest)',
        },
      };

      setTimeout(() => {
        onPaymentSuccess(newOrder);
        setIsSuccess(false);
        onClose();
      }, 1200);
    }, 1500);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex flex-col justify-end animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md mx-auto bg-stone-900 text-stone-100 rounded-t-3xl shadow-2xl p-6 flex flex-col gap-5 border-t border-stone-800 animate-in slide-in-from-bottom duration-250"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Grab bar */}
        <div className="w-12 h-1 bg-stone-700 rounded-full mx-auto" />

        {/* GPay Header */}
        <div className="flex items-center justify-between pb-2 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight">G</span>
            <span className="text-xl font-bold tracking-tight text-blue-400">P</span>
            <span className="text-xl font-bold tracking-tight text-red-400">a</span>
            <span className="text-xl font-bold tracking-tight text-amber-400">y</span>
            <span className="text-xs text-stone-400 ml-1">· Android Express</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Account / Email */}
        <div className="flex items-center justify-between text-xs bg-stone-800/60 p-3 rounded-2xl border border-stone-700/60">
          <div className="flex items-center gap-2.5 truncate">
            <div className="w-7 h-7 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">
              {userEmail.charAt(0).toUpperCase()}
            </div>
            <div className="truncate">
              <div className="font-semibold text-stone-200">Google Account</div>
              <div className="text-stone-400 truncate">{userEmail}</div>
            </div>
          </div>
          <span className="text-[11px] text-emerald-400 font-medium shrink-0">Verified</span>
        </div>

        {/* Payment Methods */}
        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
            Payment Method
          </span>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setPaymentMethod('card')}
              className={`flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                paymentMethod === 'card'
                  ? 'border-blue-500 bg-blue-950/20 text-white'
                  : 'border-stone-800 bg-stone-800/40 text-stone-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-blue-400" />
                <div>
                  <div className="text-xs font-semibold">Chase Sapphire •••• 4821</div>
                  <div className="text-[11px] text-stone-400">Exp 08/29</div>
                </div>
              </div>
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                paymentMethod === 'card' ? 'border-blue-500 bg-blue-500' : 'border-stone-600'
              }`}>
                {paymentMethod === 'card' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
            </button>

            <button
              onClick={() => setPaymentMethod('gpay_balance')}
              className={`flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                paymentMethod === 'gpay_balance'
                  ? 'border-blue-500 bg-blue-950/20 text-white'
                  : 'border-stone-800 bg-stone-800/40 text-stone-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <div>
                  <div className="text-xs font-semibold">Google Pay Balance</div>
                  <div className="text-[11px] text-stone-400">$450.00 available</div>
                </div>
              </div>
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                paymentMethod === 'gpay_balance' ? 'border-blue-500 bg-blue-500' : 'border-stone-600'
              }`}>
                {paymentMethod === 'gpay_balance' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
            </button>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="flex items-center justify-between text-xs p-3 rounded-2xl bg-stone-800/40 border border-stone-800">
          <div className="flex items-center gap-2.5">
            <MapPin className="w-4 h-4 text-stone-400" />
            <div>
              <div className="font-semibold text-stone-200">Delivery Address</div>
              <div className="text-stone-400">248 Nordic Way, Apt 4B, San Francisco, CA</div>
            </div>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="flex items-center justify-between pt-2 border-t border-stone-800">
          <div>
            <span className="text-xs text-stone-400">ShopNest Total:</span>
            <div className="text-2xl font-mono font-bold text-white tabular-nums">
              ${total.toFixed(2)}
            </div>
          </div>
          {shipping === 0 && (
            <span className="text-[11px] font-medium text-emerald-400 bg-emerald-950/50 px-2.5 py-1 rounded-lg border border-emerald-800/40">
              Free Express Delivery
            </span>
          )}
        </div>

        {/* Biometric Pay Action */}
        <button
          onClick={handleAuthorize}
          disabled={isAuthorizing || isSuccess}
          className="w-full h-13 rounded-2xl bg-white hover:bg-stone-200 text-stone-900 font-bold text-sm flex items-center justify-center gap-3 shadow-xl active:scale-[0.98] transition-all disabled:opacity-80"
        >
          {isAuthorizing ? (
            <div className="flex items-center gap-2 text-stone-800 font-medium">
              <div className="w-5 h-5 border-2 border-stone-800 border-t-transparent rounded-full animate-spin" />
              <span>Verifying Biometrics...</span>
            </div>
          ) : isSuccess ? (
            <div className="flex items-center gap-2 text-emerald-700 font-bold">
              <CheckCircle2 className="w-5 h-5" />
              <span>Payment Authorized</span>
            </div>
          ) : (
            <>
              <Fingerprint className="w-5 h-5 text-stone-800" />
              <span>Hold Fingerprint to Pay</span>
            </>
          )}
        </button>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-400 text-center">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
          <span>Secured with Android Biometric Key & GPay Tokenization</span>
        </div>
      </div>
    </div>
  );
};
