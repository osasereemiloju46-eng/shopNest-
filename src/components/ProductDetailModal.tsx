import React, { useState, useEffect } from 'react';
import { 
  X, 
  Heart, 
  Sparkles, 
  Check, 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  ArrowRight,
  BellRing,
  TrendingDown,
  Trash2,
  Bell,
  Star,
  MessageSquare,
  PenLine,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { Product, AndroidTheme, PriceAlert, ProductReview } from '../types';
import { hapticAddToCart, triggerAndroidHaptic } from '../utils/haptics';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (productId: string) => void;
  onAddToCart: (product: Product, quantity: number, selectedColor?: string) => void;
  onBuyWithGPay: (product: Product, quantity: number, selectedColor?: string) => void;
  onLaunchAR: (product: Product) => void;
  theme: AndroidTheme;
  userEmail?: string;
  activePriceAlert?: PriceAlert | null;
  onSavePriceAlert?: (alert: {
    productId: string;
    productName: string;
    currentPrice: number;
    targetPrice: number;
    userEmail: string;
  }) => void;
  onRemovePriceAlert?: (productId: string) => void;
  reviews?: ProductReview[];
  onAddReview?: (review: Omit<ProductReview, 'id' | 'date'>) => void;
  hasPurchased?: boolean;
  onSimulatePurchase?: (productId: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  isSaved,
  onToggleSave,
  onAddToCart,
  onBuyWithGPay,
  onLaunchAR,
  theme,
  userEmail = 'user@example.com',
  activePriceAlert = null,
  onSavePriceAlert,
  onRemovePriceAlert,
  reviews = [],
  onAddReview,
  hasPurchased = false,
  onSimulatePurchase,
}) => {
  if (!product) return null;

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || '');
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Price Drop Alert State
  const [showPriceAlertForm, setShowPriceAlertForm] = useState(false);
  const [alertEmail, setAlertEmail] = useState(userEmail);
  const [targetPrice, setTargetPrice] = useState<number>(() => {
    return activePriceAlert?.targetPrice ?? Math.round(product.price * 0.9);
  });
  const [alertSuccessToast, setAlertSuccessToast] = useState(false);

  // Review Submission State
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewSubmittedToast, setReviewSubmittedToast] = useState(false);

  // Native Android Share State
  const [shareSuccessToast, setShareSuccessToast] = useState<string | null>(null);

  // Filter reviews for this item
  const productReviews = reviews.filter((r) => r.productId === product.id);
  const userHasReviewed = productReviews.some(
    (r) => r.userEmail === userEmail || r.authorName.toLowerCase().includes('you')
  );

  const averageRating = productReviews.length > 0
    ? productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length
    : product.rating;

  useEffect(() => {
    if (activePriceAlert) {
      setTargetPrice(activePriceAlert.targetPrice);
      setAlertEmail(activePriceAlert.userEmail);
    } else {
      setTargetPrice(Math.round(product.price * 0.9));
      setAlertEmail(userEmail);
      setShowPriceAlertForm(false);
    }
    setShowReviewForm(false);
    setReviewComment('');
    setReviewRating(5);
    setReviewAuthor(userEmail.split('@')[0] || 'Nest Buyer');
  }, [product.id, activePriceAlert, userEmail]);

  const handleAdd = () => {
    hapticAddToCart();
    setAddedAnimation(true);
    onAddToCart(product, quantity, selectedColor);
    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
    }, 700);
  };

  const handleGPayClick = () => {
    triggerAndroidHaptic('heavyClick');
    onBuyWithGPay(product, quantity, selectedColor);
  };

  const handleSaveAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertEmail.trim() || targetPrice <= 0) return;
    if (navigator.vibrate) navigator.vibrate([20, 40]);

    onSavePriceAlert?.({
      productId: product.id,
      productName: product.name,
      currentPrice: product.price,
      targetPrice,
      userEmail: alertEmail.trim(),
    });

    setShowPriceAlertForm(false);
    setAlertSuccessToast(true);
    setTimeout(() => setAlertSuccessToast(false), 3000);
  };

  const handleRemoveAlert = () => {
    if (navigator.vibrate) navigator.vibrate(15);
    onRemovePriceAlert?.(product.id);
    setShowPriceAlertForm(false);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    hapticAddToCart();

    onAddReview?.({
      productId: product.id,
      authorName: reviewAuthor.trim() || 'Verified Nest Member',
      rating: reviewRating,
      comment: reviewComment.trim(),
      verifiedPurchase: true,
      userEmail,
    });

    setShowReviewForm(false);
    setReviewComment('');
    setReviewSubmittedToast(true);
    setTimeout(() => setReviewSubmittedToast(false), 3000);
  };

  const presetDiscounts = [
    { label: '5% off', price: Math.round(product.price * 0.95) },
    { label: '10% off', price: Math.round(product.price * 0.90) },
    { label: '15% off', price: Math.round(product.price * 0.85) },
  ];

  // Native navigator.share Handler
  const handleShare = async () => {
    triggerAndroidHaptic('lightTick');

    const shareUrl = typeof window !== 'undefined'
      ? `${window.location.origin}#item=${product.id}`
      : 'https://shopnest.android';

    const shareData = {
      title: `${product.name} | shopNest Android`,
      text: `Take a look at ${product.name} (${product.subtitle}) on shopNest:`,
      url: shareUrl,
    };

    if (typeof navigator !== 'undefined' && 'share' in navigator && typeof navigator.share === 'function') {
      try {
        await navigator.share(shareData);
        setShareSuccessToast('Shared successfully!');
        setTimeout(() => setShareSuccessToast(null), 3000);
      } catch (err: unknown) {
        // User dismissed share sheet or unsupported format
        if ((err as Error)?.name !== 'AbortError') {
          copyShareLink(shareUrl);
        }
      }
    } else {
      // Fallback for desktop/unsupported browsers
      copyShareLink(shareUrl);
    }
  };

  const copyShareLink = async (url: string) => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setShareSuccessToast('Product link copied to clipboard!');
      } else {
        setShareSuccessToast('Link ready to share');
      }
    } catch {
      setShareSuccessToast('Link ready to share');
    }
    setTimeout(() => setShareSuccessToast(null), 3000);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg mx-auto bg-white dark:bg-stone-900 rounded-t-3xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-250 border-t border-stone-200 dark:border-stone-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Grab Handle */}
        <div className="w-full pt-3 pb-1 flex items-center justify-center shrink-0">
          <div className="w-12 h-1.5 bg-stone-300 dark:bg-stone-700 rounded-full" />
        </div>

        {/* Header Controls */}
        <div className="px-5 py-2 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
            <span>{product.categoryLabel}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono">★ {averageRating.toFixed(1)}</span>
            <span className="opacity-70">({productReviews.length} reviews)</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleShare}
              aria-label="Share product"
              className="p-2 rounded-full text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              title="Share piece via Android Share Sheet"
            >
              <Share2 className="w-5 h-5 stroke-[1.8]" />
            </button>
            <button
              onClick={() => onToggleSave(product.id)}
              aria-label="Toggle wishlist"
              className="p-2 rounded-full text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <Heart
                className={`w-5 h-5 ${
                  isSaved ? 'fill-red-500 text-red-500' : 'stroke-[2]'
                }`}
              />
            </button>
            <button
              onClick={onClose}
              aria-label="Close sheet"
              className="p-2 rounded-full text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Share Feedback Toast */}
        {shareSuccessToast && (
          <div className="mx-5 mb-2 px-3.5 py-2.5 rounded-2xl bg-stone-900/95 text-white text-xs font-medium flex items-center justify-between shadow-md border border-stone-700/60 animate-in slide-in-from-top-2">
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{shareSuccessToast}</span>
            </div>
            <button
              onClick={() => setShareSuccessToast(null)}
              className="text-stone-400 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Alert Success Toast */}
        {alertSuccessToast && (
          <div className="mx-5 mb-2 px-3.5 py-2.5 rounded-2xl bg-emerald-900/90 text-emerald-100 text-xs font-medium flex items-center justify-between shadow-md border border-emerald-700/60 animate-in slide-in-from-top-2">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-300" />
              <span>Price drop tracker active for ${targetPrice}!</span>
            </div>
            <button
              onClick={() => setAlertSuccessToast(false)}
              className="text-emerald-300 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Review Submitted Toast */}
        {reviewSubmittedToast && (
          <div className="mx-5 mb-2 px-3.5 py-2.5 rounded-2xl bg-emerald-900/90 text-emerald-100 text-xs font-medium flex items-center justify-between shadow-md border border-emerald-700/60 animate-in slide-in-from-top-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Thank you! Your verified 5-star review has been published.</span>
            </div>
            <button
              onClick={() => setReviewSubmittedToast(false)}
              className="text-emerald-300 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto px-5 pb-6 flex flex-col gap-5 no-scrollbar">
          {/* Main Visual */}
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 shadow-inner">
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />

            {/* AR Button Overlay */}
            {product.arCompatible && (
              <button
                onClick={() => onLaunchAR(product)}
                className="absolute bottom-3 right-3 flex items-center gap-2 px-3 py-2 bg-stone-900/90 text-white rounded-xl text-xs font-semibold backdrop-blur-md shadow-lg active:scale-95 transition-transform"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>View in Your Room (AR)</span>
              </button>
            )}
          </div>

          {/* Title & Price Header */}
          <div className="flex flex-col gap-1">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 leading-tight">
                {product.name}
              </h2>
              <div className="flex items-baseline gap-2 shrink-0">
                <span className="text-2xl font-mono font-bold text-stone-900 dark:text-stone-100 tabular-nums">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-sm font-mono text-stone-400 line-through tabular-nums">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {product.subtitle}
            </p>
          </div>

          {/* Price Drop Notification Module */}
          <div className="rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-800/40 p-3.5 flex flex-col gap-3">
            {activePriceAlert && !showPriceAlertForm ? (
              /* Active Alert Status View */
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <BellRing className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                      <span>Tracking active at ${activePriceAlert.targetPrice}</span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                        (-${product.price - activePriceAlert.targetPrice})
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                      Notifications sent to {activePriceAlert.userEmail}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => setShowPriceAlertForm(true)}
                    className="px-2.5 py-1 text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-200/70 dark:hover:bg-stone-700 rounded-lg transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleRemoveAlert}
                    className="p-1.5 text-stone-400 hover:text-red-500 rounded-lg transition-colors"
                    title="Remove alert"
                    aria-label="Remove price alert"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : !showPriceAlertForm ? (
              /* Trigger Button View */
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-stone-700 dark:text-stone-300">
                  <TrendingDown className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Waiting for a sale or discount?</span>
                </div>
                <button
                  onClick={() => setShowPriceAlertForm(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 border border-stone-200/80 dark:border-stone-700 text-xs font-semibold shadow-xs hover:border-stone-400 dark:hover:border-stone-500 active:scale-95 transition-all"
                >
                  <Bell className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Notify me when price drops</span>
                </button>
              </div>
            ) : (
              /* Expandable Set Price Alert Form */
              <form onSubmit={handleSaveAlert} className="flex flex-col gap-3 pt-0.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900 dark:text-stone-100">
                    <BellRing className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>Set Price Drop Notification</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPriceAlertForm(false)}
                    className="text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                  >
                    Cancel
                  </button>
                </div>

                {/* Target Price Presets */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
                    <span>Target Price</span>
                    <span className="font-mono">Current: ${product.price}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {presetDiscounts.map((preset) => (
                      <button
                        type="button"
                        key={preset.label}
                        onClick={() => setTargetPrice(preset.price)}
                        className={`py-1.5 px-2 rounded-xl text-xs font-medium border transition-all text-center ${
                          targetPrice === preset.price
                            ? 'border-stone-900 dark:border-stone-100 bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-bold'
                            : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                        }`}
                      >
                        <div className="text-[10px] opacity-75">{preset.label}</div>
                        <div className="font-mono font-bold">${preset.price}</div>
                      </button>
                    ))}
                  </div>

                  {/* Custom Target Price Input */}
                  <div className="mt-1 flex items-center gap-2 bg-white dark:bg-stone-800 rounded-xl px-3 py-1.5 border border-stone-200/80 dark:border-stone-700">
                    <span className="text-xs font-mono text-stone-400">$</span>
                    <input
                      type="number"
                      min="1"
                      max={product.price - 1}
                      value={targetPrice}
                      onChange={(e) => setTargetPrice(Math.max(1, parseInt(e.target.value) || 0))}
                      placeholder="Custom target price"
                      className="w-full bg-transparent text-xs font-mono font-semibold text-stone-900 dark:text-stone-100 focus:outline-none"
                    />
                    <span className="text-[10px] text-stone-400 whitespace-nowrap">
                      {product.price > targetPrice
                        ? `Save $${product.price - targetPrice}`
                        : 'Must be below current price'}
                    </span>
                  </div>
                </div>

                {/* Email Address Input */}
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] text-stone-500 dark:text-stone-400">
                    Notification Email (Android Account)
                  </label>
                  <input
                    type="email"
                    required
                    value={alertEmail}
                    onChange={(e) => setAlertEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-stone-400"
                  />
                </div>

                {/* Action Button */}
                <button
                  type="submit"
                  className={`w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] transition-transform ${theme.accentBg}`}
                >
                  <BellRing className="w-3.5 h-3.5" />
                  <span>Start Price Tracking (${targetPrice})</span>
                </button>
              </form>
            )}
          </div>

          {/* Description */}
          <div className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
            {product.description}
          </div>

          {/* Color Variants */}
          {product.colors.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-medium text-stone-700 dark:text-stone-300">
                <span>Color Finishes</span>
                <span className="text-stone-500 dark:text-stone-400">{selectedColor}</span>
              </div>
              <div className="flex items-center gap-3">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
                      selectedColor === c.name
                        ? 'border-stone-900 dark:border-stone-100 bg-stone-50 dark:bg-stone-800'
                        : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-stone-300 shadow-sm"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Specifications Grid */}
          <div className="bg-stone-50 dark:bg-stone-800/60 rounded-2xl p-4 border border-stone-200/80 dark:border-stone-800 flex flex-col gap-2.5 text-xs">
            <div className="font-semibold text-stone-900 dark:text-stone-100">
              Dimensions & Craft
            </div>
            <div className="grid grid-cols-1 gap-1.5 text-stone-600 dark:text-stone-300">
              <div>
                <span className="text-stone-400">Dimensions: </span>
                <span className="font-mono">{product.dimensions}</span>
              </div>
              <div>
                <span className="text-stone-400">Materials: </span>
                <span>{product.materials.join(' · ')}</span>
              </div>
            </div>
          </div>

          {/* Trust points */}
          <div className="grid grid-cols-2 gap-3 text-xs text-stone-600 dark:text-stone-400 pt-1">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Complimentary insured shipping over $150</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
              <span>30-day nest in-home trial & return</span>
            </div>
          </div>

          {/* Share Piece with Friends Card */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/70 dark:border-stone-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Share2 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                  Share this piece with friends
                </div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400">
                  Share via Android Sheet or copy product link
                </div>
              </div>
            </div>
            <button
              onClick={handleShare}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 text-xs font-semibold hover:border-stone-400 active:scale-95 transition-all shadow-xs"
            >
              Share Link
            </button>
          </div>

          {/* Reviews & Star Ratings Section */}
          <section className="flex flex-col gap-4 pt-2 border-t border-stone-200 dark:border-stone-800">
            {/* Reviews Header & Overall Score */}
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 dark:text-stone-400">
                  <MessageSquare className="w-3.5 h-3.5 text-amber-500" />
                  <span>Customer Opinions</span>
                </div>
                <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                  Reviews & Ratings ({productReviews.length})
                </h3>
              </div>

              {/* Action Button: Review or Verify */}
              {hasPurchased ? (
                !showReviewForm && (
                  <button
                    onClick={() => {
                      triggerAndroidHaptic('lightTick');
                      setShowReviewForm(true);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-xs active:scale-95 transition-transform ${theme.accentBg}`}
                  >
                    <PenLine className="w-3.5 h-3.5" />
                    <span>{userHasReviewed ? 'Add Another Review' : 'Write a Review'}</span>
                  </button>
                )
              ) : (
                <button
                  onClick={() => {
                    triggerAndroidHaptic('mediumTick');
                    onSimulatePurchase?.(product.id);
                  }}
                  className="flex items-center gap-1 text-[11px] font-medium text-amber-700 dark:text-amber-400 hover:underline"
                  title="Simulate verified purchase to test leaving a review"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verify Purchase</span>
                </button>
              )}
            </div>

            {/* Rating Summary Card */}
            <div className="bg-stone-50 dark:bg-stone-800/50 rounded-2xl p-4 border border-stone-200/80 dark:border-stone-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="text-3xl font-mono font-bold text-stone-900 dark:text-stone-100 tabular-nums">
                  {averageRating.toFixed(1)}
                </div>
                <div className="flex flex-col">
                  {/* Star Glyphs */}
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${
                          s <= Math.round(averageRating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-stone-300 dark:text-stone-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                    {productReviews.length} verified buyer comments
                  </span>
                </div>
              </div>

              {hasPurchased ? (
                <div className="flex items-center gap-1 bg-emerald-100/80 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-2.5 py-1 rounded-full text-[11px] font-semibold border border-emerald-300 dark:border-emerald-800">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Owner</span>
                </div>
              ) : (
                <div className="text-right text-[11px] text-stone-400">
                  Purchasers can submit 5★ reviews
                </div>
              )}
            </div>

            {/* Review Submission Form (Only for verified purchasers) */}
            {hasPurchased && showReviewForm && (
              <form
                onSubmit={handleSubmitReview}
                className="bg-white dark:bg-stone-800 rounded-2xl p-4 border-2 border-stone-900/10 dark:border-stone-700 flex flex-col gap-3 shadow-md animate-in slide-in-from-top-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                    <PenLine className="w-3.5 h-3.5 text-amber-500" />
                    <span>Your Verified Review</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                  >
                    Cancel
                  </button>
                </div>

                {/* 5-Star Rating Selector */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                    Tap to Select Rating
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((starVal) => (
                      <button
                        type="button"
                        key={starVal}
                        onClick={() => {
                          triggerAndroidHaptic('lightTick');
                          setReviewRating(starVal);
                        }}
                        className="p-1 rounded-lg hover:scale-110 active:scale-95 transition-transform"
                        title={`${starVal} Star`}
                      >
                        <Star
                          className={`w-6 h-6 transition-colors ${
                            starVal <= reviewRating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-stone-300 dark:text-stone-600'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-mono font-bold text-stone-800 dark:text-stone-200 ml-2">
                      {reviewRating} of 5 Stars
                    </span>
                  </div>
                </div>

                {/* Your Name */}
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                    Display Name
                  </label>
                  <input
                    type="text"
                    required
                    value={reviewAuthor}
                    onChange={(e) => setReviewAuthor(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200/80 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-stone-400"
                  />
                </div>

                {/* Short Comment Text */}
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                    Your Review & Experience
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Tell other nest collectors about the craftsmanship, tactile texture, acoustic clarity or ambiance..."
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200/80 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-stone-400 resize-none leading-relaxed"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className={`w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] transition-transform ${theme.accentBg}`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Submit Verified Review</span>
                </button>
              </form>
            )}

            {/* Individual Reviews List */}
            <div className="flex flex-col gap-3">
              {productReviews.length === 0 ? (
                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 text-center text-xs text-stone-500">
                  No customer reviews yet. Be the first to leave a review once delivered!
                </div>
              ) : (
                productReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-3.5 rounded-2xl bg-stone-50/80 dark:bg-stone-800/40 border border-stone-200/70 dark:border-stone-800/80 flex flex-col gap-2"
                  >
                    {/* Reviewer Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 flex items-center justify-center font-bold text-xs shrink-0">
                          {rev.authorName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                            {rev.authorName}
                          </span>
                          {rev.verifiedPurchase && (
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium ml-1.5 inline-flex items-center gap-0.5">
                              <ShieldCheck className="w-3 h-3" />
                              <span>Verified Nest Buyer</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <span className="text-[10px] text-stone-400 font-mono">{rev.date}</span>
                    </div>

                    {/* Star glyphs */}
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= rev.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-stone-300 dark:text-stone-600'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Comment prose */}
                    <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                      "{rev.comment}"
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* Sticky Purchase Bar */}
        <div className="p-4 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 flex flex-col gap-2.5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] shrink-0">
          <div className="flex items-center gap-3">
            {/* Quantity Stepper */}
            <div className="flex items-center bg-stone-100 dark:bg-stone-800 rounded-xl p-1 border border-stone-200 dark:border-stone-700 shrink-0">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700"
              >
                -
              </button>
              <span className="w-8 text-center font-mono font-semibold text-sm tabular-nums">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700"
              >
                +
              </button>
            </div>

            {/* Standard Add to Bag */}
            <button
              onClick={handleAdd}
              className={`flex-1 h-11 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-transform active:scale-[0.98] ${
                addedAnimation
                  ? 'bg-emerald-600 text-white'
                  : 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900'
              }`}
            >
              {addedAnimation ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Nest</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag · ${(product.price * quantity).toFixed(0)}</span>
                </>
              )}
            </button>
          </div>

          {/* Native Android Google Pay Button */}
          <button
            onClick={handleGPayClick}
            className="w-full h-11 rounded-xl bg-black hover:bg-stone-950 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md border border-stone-800 active:scale-[0.98] transition-transform"
          >
            <span className="font-medium tracking-tight text-stone-300">Fast checkout with</span>
            <div className="flex items-center gap-1 font-bold tracking-tighter text-sm">
              <span className="text-white">G</span>
              <span className="text-blue-400">P</span>
              <span className="text-red-400">a</span>
              <span className="text-amber-400">y</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
