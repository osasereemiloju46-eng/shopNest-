import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Truck, Package, Clock, MapPin, Phone, Download, Navigation } from 'lucide-react';
import { Order } from '../types';

interface OrderTrackingModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !order) return null;

  // Courier progress animation on map
  const [courierProgress, setCourierProgress] = useState(65);

  useEffect(() => {
    const timer = setInterval(() => {
      setCourierProgress((prev) => (prev >= 90 ? 60 : prev + 1));
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex flex-col justify-end animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg mx-auto bg-stone-900 text-stone-100 rounded-t-3xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden border-t border-stone-800 animate-in slide-in-from-bottom duration-250"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Grab Handle */}
        <div className="w-12 h-1 bg-stone-700 rounded-full mx-auto my-3" />

        {/* Header */}
        <div className="px-5 pb-3 flex items-center justify-between border-b border-stone-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-white font-mono">{order.id}</span>
              <span className="text-[11px] bg-emerald-950 text-emerald-400 border border-emerald-800/40 px-2 py-0.5 rounded-full font-medium">
                Live Courier Tracker
              </span>
            </div>
            <div className="text-xs text-stone-400">Estimated Delivery: {order.estimatedDelivery}</div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4 no-scrollbar">
          {/* Simulated Live GPS Map Viewport */}
          <div className="relative w-full aspect-[16/9] rounded-2xl bg-stone-950 border border-stone-800 overflow-hidden shadow-inner flex items-center justify-center">
            {/* Stylized Dark Grid Map SVG */}
            <svg className="w-full h-full object-cover opacity-80" viewBox="0 0 400 220">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#262626" strokeWidth="0.7" />
                </pattern>
              </defs>
              <rect width="400" height="220" fill="#141414" />
              <rect width="400" height="220" fill="url(#grid)" />

              {/* Arterial Roads */}
              <path d="M 0 110 Q 150 140 280 90 T 400 60" fill="none" stroke="#333333" strokeWidth="8" />
              <path d="M 80 0 L 140 220" fill="none" stroke="#2b2b2b" strokeWidth="6" />
              <path d="M 250 0 L 290 220" fill="none" stroke="#2b2b2b" strokeWidth="6" />

              {/* Active Delivery Route in Emerald Neon */}
              <path
                d="M 50 110 Q 150 140 280 90 L 320 150"
                fill="none"
                stroke="#10b981"
                strokeWidth="4"
                strokeDasharray="6,4"
              />

              {/* Destination Point (Your Nest) */}
              <g transform="translate(320, 150)">
                <circle r="12" fill="#10b981" opacity="0.3" className="animate-ping" />
                <circle r="7" fill="#10b981" />
                <circle r="3" fill="#ffffff" />
              </g>

              {/* Moving Courier Van Icon along the path */}
              <g
                transform={`translate(${50 + (320 - 50) * (courierProgress / 100)}, ${
                  110 + (150 - 110) * (courierProgress / 100)
                })`}
              >
                <circle r="14" fill="#000000" opacity="0.6" />
                <circle r="9" fill="#f59e0b" />
                <circle r="3" fill="#ffffff" />
              </g>
            </svg>

            {/* Live Status Overlay Pill */}
            <div className="absolute top-3 left-3 bg-stone-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-stone-700/60 flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-medium text-stone-200">Express Courier is 3 stops away</span>
            </div>

            <div className="absolute bottom-3 right-3 bg-stone-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-stone-700/60 text-[10px] text-stone-400 font-mono">
              GPS Lat: 37.77 · Lng: -122.41
            </div>
          </div>

          {/* Courier Info Card */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-800/60 border border-stone-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Nest Delivery Partner</div>
                <div className="text-[11px] text-stone-400">Driver: Marcus V. · White Mercedes Sprinter</div>
              </div>
            </div>
            <button
              onClick={() => {
                if (navigator.vibrate) navigator.vibrate(20);
                alert('Calling ShopNest Courier Support...');
              }}
              className="p-2.5 rounded-xl bg-stone-700 hover:bg-stone-600 text-white"
              title="Call driver"
            >
              <Phone className="w-4 h-4" />
            </button>
          </div>

          {/* Step-by-Step Delivery Progress */}
          <div className="flex flex-col gap-3 p-4 rounded-2xl bg-stone-800/40 border border-stone-800/80">
            <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
              Shipment Milestones
            </div>

            <div className="flex flex-col gap-4">
              {/* Step 1 */}
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-semibold text-stone-200">Order Placed & Verified</div>
                  <div className="text-[11px] text-stone-400">Paid via Google Pay · Order {order.id}</div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-semibold text-stone-200">Artisan Nest Inspection & Packing</div>
                  <div className="text-[11px] text-stone-400">Carefully boxed in recyclable honey-comb wrap</div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3">
                <div className="w-4 h-4 rounded-full border-2 border-amber-400 bg-amber-400/20 shrink-0 mt-0.5 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                </div>
                <div className="text-xs">
                  <div className="font-semibold text-amber-300">Out for Delivery with Courier</div>
                  <div className="text-[11px] text-stone-400">On route to 248 Nordic Way, Apt 4B</div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex items-start gap-3 opacity-40">
                <div className="w-4 h-4 rounded-full border border-stone-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-semibold text-stone-300">Delivered to Front Door</div>
                  <div className="text-[11px] text-stone-500">Signature not required · Photo confirmation</div>
                </div>
              </div>
            </div>
          </div>

          {/* Itemized Order Summary */}
          <div className="flex flex-col gap-2 p-3.5 rounded-2xl bg-stone-800/40 border border-stone-800/80 text-xs">
            <span className="font-semibold text-stone-400">Package Items</span>
            {order.items.map((it) => (
              <div key={it.product.id} className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2 truncate">
                  <img
                    src={it.product.image}
                    alt={it.product.name}
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-lg object-cover bg-stone-700 shrink-0"
                  />
                  <span className="text-stone-300 truncate">
                    {it.quantity}× {it.product.name}
                  </span>
                </div>
                <span className="font-mono text-stone-200 shrink-0">
                  ${(it.product.price * it.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            <div className="flex justify-between font-bold text-sm text-white pt-2 border-t border-stone-800">
              <span>Total Paid:</span>
              <span className="font-mono">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-stone-900 border-t border-stone-800 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              if (navigator.vibrate) navigator.vibrate(15);
              alert(`Receipt for Order #${order.id} downloaded.`);
            }}
            className="flex-1 h-11 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download Invoice</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 h-11 rounded-xl bg-white text-stone-900 text-xs font-bold uppercase tracking-wider flex items-center justify-center"
          >
            Back to App
          </button>
        </div>
      </div>
    </div>
  );
};
