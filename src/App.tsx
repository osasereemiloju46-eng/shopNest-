import React, { useState, useEffect } from 'react';
import { 
  Product, 
  CartItem, 
  Order, 
  CategoryId, 
  AndroidThemeId, 
  AndroidTheme,
  PriceAlert,
  ProductReview
} from './types';
import { PRODUCTS, STORIES, ANDROID_THEMES, MOCK_REVIEWS } from './data/mockProducts';
import { AndroidFrame } from './components/AndroidFrame';
import { AndroidStatusBar } from './components/AndroidStatusBar';
import { AndroidNavBar, TabId } from './components/AndroidNavBar';
import { AndroidGestureBar } from './components/AndroidGestureBar';
import { AndroidNotificationShade } from './components/AndroidNotificationShade';
import { ExploreTab } from './components/ExploreTab';
import { NestsTab } from './components/NestsTab';
import { SavedTab } from './components/SavedTab';
import { ProfileTab } from './components/ProfileTab';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartSheet } from './components/CartSheet';
import { GooglePayModal } from './components/GooglePayModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { ARViewModal } from './components/ARViewModal';
import { VisualSearchModal } from './components/VisualSearchModal';
import { StoryViewerModal } from './components/StoryViewerModal';
import { User, ShoppingBag } from 'lucide-react';
import { hapticAddToCart, hapticPurchaseSuccess } from './utils/haptics';

const STORAGE_KEY_CART = 'shopnest_android_cart_v1';
const STORAGE_KEY_SAVED = 'shopnest_android_saved_v1';
const STORAGE_KEY_ORDERS = 'shopnest_android_orders_v1';
const STORAGE_KEY_THEME = 'shopnest_android_theme_v1';
const STORAGE_KEY_FRAME = 'shopnest_android_frame_v1';
const STORAGE_KEY_ALERTS = 'shopnest_android_price_alerts_v1';
const STORAGE_KEY_REVIEWS = 'shopnest_android_reviews_v1';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<TabId>('explore');
  const [activeCategory, setActiveCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Theming & Hardware Frame
  const [themeId, setThemeId] = useState<AndroidThemeId>('sage');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showPhoneFrame, setShowPhoneFrame] = useState(true);

  // E-commerce state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SAVED);
      return saved ? JSON.parse(saved) : ['sn-chair-01', 'sn-lamp-02'];
    } catch {
      return ['sn-chair-01', 'sn-lamp-02'];
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ORDERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const hasDelivered = parsed.some((o: Order) => o.status === 'delivered');
          const hasCancelled = parsed.some((o: Order) => o.status === 'cancelled');
          if (!hasDelivered || !hasCancelled) {
            return [
              ...parsed,
              ...(!hasDelivered
                ? [
                    {
                      id: 'SN-8812',
                      date: 'Oct 24, 2026',
                      items: [{ product: PRODUCTS[2], quantity: 1, selectedColor: 'Anodized Brass' }],
                      subtotal: 320,
                      discount: 0,
                      shipping: 0,
                      total: 320,
                      status: 'delivered' as const,
                      estimatedDelivery: 'Delivered to Front Door on Oct 24',
                      trackingNumber: 'TRK-AND-811092',
                      courier: 'Nest Courier Express',
                    },
                  ]
                : []),
              ...(!hasCancelled
                ? [
                    {
                      id: 'SN-7204',
                      date: 'Oct 12, 2026',
                      items: [{ product: PRODUCTS[4], quantity: 1, selectedColor: 'Warm Travertine' }],
                      subtotal: 88,
                      discount: 0,
                      shipping: 0,
                      total: 88,
                      status: 'cancelled' as const,
                      estimatedDelivery: 'Order Cancelled',
                      cancelReason: 'Customer requested cancellation · $88.00 refunded to Google Pay',
                      trackingNumber: 'TRK-AND-700142',
                      courier: 'Nest Standard',
                    },
                  ]
                : []),
            ];
          }
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return [
      {
        id: 'SN-9421',
        date: 'Today',
        items: [
          { product: PRODUCTS[0], quantity: 1, selectedColor: 'Ivory Bouclé' },
        ],
        subtotal: 640,
        discount: 0,
        shipping: 0,
        total: 640,
        status: 'in_transit',
        estimatedDelivery: 'Today by 2:30 PM',
        trackingNumber: 'TRK-AND-849201',
        courier: 'Nest Courier Express',
        courierLocation: {
          lat: 37.7749,
          lng: -122.4194,
          address: 'Market St & 5th Ave (Approaching your nest)',
        },
      },
      {
        id: 'SN-8812',
        date: 'Oct 24, 2026',
        items: [
          { product: PRODUCTS[2], quantity: 1, selectedColor: 'Anodized Brass' },
        ],
        subtotal: 320,
        discount: 0,
        shipping: 0,
        total: 320,
        status: 'delivered',
        estimatedDelivery: 'Delivered to Front Door on Oct 24',
        trackingNumber: 'TRK-AND-811092',
        courier: 'Nest Courier Express',
      },
      {
        id: 'SN-7204',
        date: 'Oct 12, 2026',
        items: [
          { product: PRODUCTS[4], quantity: 1, selectedColor: 'Warm Travertine' },
        ],
        subtotal: 88,
        discount: 0,
        shipping: 0,
        total: 88,
        status: 'cancelled',
        estimatedDelivery: 'Order Cancelled',
        cancelReason: 'Customer requested cancellation · $88.00 refunded to Google Pay',
        trackingNumber: 'TRK-AND-700142',
        courier: 'Nest Standard',
      },
    ];
  });

  const [promoDiscount, setPromoDiscount] = useState(0);
  const [appliedPromo, setAppliedPromo] = useState('');

  // Modals & Sheets
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isGPayOpen, setIsGPayOpen] = useState(false);
  const [isAROpen, setIsAROpen] = useState(false);
  const [arTargetProduct, setArTargetProduct] = useState<Product | null>(null);
  const [isLensOpen, setIsLensOpen] = useState(false);
  const [storyViewerIndex, setStoryViewerIndex] = useState<number | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(null);

  const currentTheme = ANDROID_THEMES.find((t) => t.id === themeId) || ANDROID_THEMES[0];
  const userEmail = 'osasereemiloju46@gmail.com';

  // Price Tracking Alerts state
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ALERTS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'alert-initial',
        productId: 'sn-lamp-02',
        productName: 'Kumo Ceramic Glow Pendant',
        currentPrice: 185,
        targetPrice: 160,
        userEmail: 'osasereemiloju46@gmail.com',
        createdAt: 'Today',
      },
    ];
  });

  // Persist state
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(savedIds));
  }, [savedIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ALERTS, JSON.stringify(priceAlerts));
  }, [priceAlerts]);

  const handleSavePriceAlert = (alertData: {
    productId: string;
    productName: string;
    currentPrice: number;
    targetPrice: number;
    userEmail: string;
  }) => {
    setPriceAlerts((prev) => {
      const filtered = prev.filter((a) => a.productId !== alertData.productId);
      const newAlert: PriceAlert = {
        ...alertData,
        id: `alert-${Date.now()}`,
        createdAt: 'Just now',
      };
      return [newAlert, ...filtered];
    });
  };

  const handleRemovePriceAlert = (productId: string) => {
    setPriceAlerts((prev) => prev.filter((a) => a.productId !== productId));
  };

  // Product Reviews state
  const [reviews, setReviews] = useState<ProductReview[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_REVIEWS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return MOCK_REVIEWS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(reviews));
  }, [reviews]);

  const handleAddReview = (newReviewData: Omit<ProductReview, 'id' | 'date'>) => {
    const newRev: ProductReview = {
      ...newReviewData,
      id: `rev-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };
    setReviews((prev) => [newRev, ...prev]);
  };

  // Tracking purchased items for verified review eligibility
  // Pre-seed with sn-chair-01 since initial Mock Order SN-9421 contains the Kvadrat chair
  const [simulatedPurchasedIds, setSimulatedPurchasedIds] = useState<string[]>(['sn-chair-01']);

  const isProductPurchased = (productId: string) => {
    if (simulatedPurchasedIds.includes(productId)) return true;
    return orders.some((order) => order.items.some((item) => item.product.id === productId));
  };

  const handleSimulatePurchase = (productId: string) => {
    setSimulatedPurchasedIds((prev) => (prev.includes(productId) ? prev : [...prev, productId]));
  };

  const handleCancelOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            status: 'cancelled',
            cancelReason: `Cancelled by customer · $${order.total.toFixed(2)} refunded to Google Pay`,
          };
        }
        return order;
      })
    );
  };

  // Sync Dark Mode class with <html>
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // System Back Gesture handler
  const handleSystemBack = () => {
    if (storyViewerIndex !== null) {
      setStoryViewerIndex(null);
      return;
    }
    if (isNotificationsOpen) {
      setIsNotificationsOpen(false);
      return;
    }
    if (activeTrackingOrder) {
      setActiveTrackingOrder(null);
      return;
    }
    if (isAROpen) {
      setIsAROpen(false);
      return;
    }
    if (isLensOpen) {
      setIsLensOpen(false);
      return;
    }
    if (isGPayOpen) {
      setIsGPayOpen(false);
      return;
    }
    if (selectedProduct) {
      setSelectedProduct(null);
      return;
    }
    if (isCartOpen) {
      setIsCartOpen(false);
      return;
    }
    if (activeTab !== 'explore') {
      setActiveTab('explore');
    }
  };

  // Cart operations
  const handleAddToCart = (product: Product, quantity = 1, selectedColor?: string) => {
    hapticAddToCart();
    setCart((prev) => {
      const existing = prev.find(
        (it) => it.product.id === product.id && it.selectedColor === selectedColor
      );
      if (existing) {
        return prev.map((it) =>
          it === existing ? { ...it, quantity: it.quantity + quantity } : it
        );
      }
      return [...prev, { product, quantity, selectedColor }];
    });
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    setCart((prev) =>
      prev
        .map((it) => (it.product.id === productId ? { ...it, quantity } : it))
        .filter((it) => it.quantity > 0)
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((it) => it.product.id !== productId));
  };

  const handleApplyPromo = (code: string) => {
    if (code === 'NEST10') {
      const subtotal = cart.reduce((acc, it) => acc + it.product.price * it.quantity, 0);
      setPromoDiscount(Math.round(subtotal * 0.1));
      setAppliedPromo('NEST10');
      return true;
    }
    return false;
  };

  // Wishlist toggle
  const handleToggleSave = (productId: string) => {
    setSavedIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  // Google Pay Success
  const handlePaymentSuccess = (newOrder: Order) => {
    hapticPurchaseSuccess();
    setOrders((prev) => [newOrder, ...prev]);
    const newlyPurchasedIds = newOrder.items.map((it) => it.product.id);
    setSimulatedPurchasedIds((prev) => Array.from(new Set([...prev, ...newlyPurchasedIds])));
    setCart([]);
    setPromoDiscount(0);
    setAppliedPromo('');
    setActiveTrackingOrder(newOrder);
  };

  const totalCartCount = cart.reduce((acc, it) => acc + it.quantity, 0);

  // Tab switcher
  const handleNavTabChange = (tab: TabId) => {
    if (tab === 'cart') {
      setIsCartOpen(true);
    } else if (tab === 'ar') {
      // Launch AR with first AR compatible item or currently selected
      const target = selectedProduct?.arCompatible
        ? selectedProduct
        : PRODUCTS.find((p) => p.arCompatible) || PRODUCTS[0];
      setArTargetProduct(target);
      setIsAROpen(true);
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <AndroidFrame
      showPhoneFrame={showPhoneFrame}
      onToggleFrame={() => setShowPhoneFrame(!showPhoneFrame)}
      isDarkMode={isDarkMode}
      onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      theme={currentTheme}
    >
      {/* Android System Status Bar */}
      <AndroidStatusBar
        unreadNotificationCount={1 + priceAlerts.length}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        darkSurface={isDarkMode}
      />

      {/* Main App Bar / Brand Header */}
      <header className="px-4 py-2.5 bg-stone-50/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-stone-200/60 dark:border-stone-800/60 flex items-center justify-between shrink-0 z-20">
        <button
          onClick={() => setActiveTab('explore')}
          className="flex items-center gap-1.5 focus:outline-none"
        >
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: currentTheme.colorHex }}
          />
          <span className="font-display text-lg font-bold tracking-tight text-stone-900 dark:text-stone-100">
            shopNest
          </span>
          <span className="text-[10px] font-mono text-stone-400 font-semibold uppercase tracking-wider ml-1">
            Android
          </span>
        </button>

        <div className="flex items-center gap-2">
          {/* Quick Profile Tab trigger */}
          <button
            onClick={() => setActiveTab('profile')}
            aria-label="Profile settings"
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              activeTab === 'profile'
                ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                : 'text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800'
            }`}
          >
            <User className="w-4 h-4" />
          </button>

          {/* Quick Bag trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            aria-label="View bag"
            className="relative w-8 h-8 rounded-full flex items-center justify-center text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            {totalCartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-amber-600 text-white text-[9px] font-mono font-bold flex items-center justify-center shadow-xs">
                {totalCartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Viewport Content Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar relative">
        {activeTab === 'explore' && (
          <ExploreTab
            products={PRODUCTS}
            activeCategory={activeCategory}
            onChangeCategory={setActiveCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onOpenLens={() => setIsLensOpen(true)}
            onOpenNotifications={() => setIsNotificationsOpen(true)}
            unreadNotifications={1}
            onOpenStory={(idx) => setStoryViewerIndex(idx)}
            savedIds={savedIds}
            onToggleSave={handleToggleSave}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onQuickAdd={(p) => handleAddToCart(p, 1)}
            theme={currentTheme}
          />
        )}

        {activeTab === 'nests' && (
          <NestsTab
            onSelectProduct={(p) => setSelectedProduct(p)}
            onAddBundleToCart={(prods) => {
              prods.forEach((p) => handleAddToCart(p, 1));
              setIsCartOpen(true);
            }}
            theme={currentTheme}
          />
        )}

        {activeTab === 'saved' && (
          <SavedTab
            savedIds={savedIds}
            onToggleSave={handleToggleSave}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onAddToCart={(p) => handleAddToCart(p, 1)}
            onExplore={() => setActiveTab('explore')}
            theme={currentTheme}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileTab
            userEmail={userEmail}
            currentTheme={currentTheme}
            onChangeTheme={setThemeId}
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
            showPhoneFrame={showPhoneFrame}
            onTogglePhoneFrame={() => setShowPhoneFrame(!showPhoneFrame)}
            orders={orders}
            onOpenOrderTracking={(ord) => setActiveTrackingOrder(ord)}
            onCancelOrder={handleCancelOrder}
            priceAlerts={priceAlerts}
            onSelectProductById={(id) => {
              const item = PRODUCTS.find((p) => p.id === id);
              if (item) setSelectedProduct(item);
            }}
            onRemovePriceAlert={handleRemovePriceAlert}
          />
        )}
      </main>

      {/* Material 3 Bottom Navigation Bar */}
      <AndroidNavBar
        activeTab={activeTab}
        onChangeTab={handleNavTabChange}
        cartCount={totalCartCount}
        savedCount={savedIds.length}
        theme={currentTheme}
      />

      {/* Android 15 Bottom Gesture Navigation Pill */}
      <AndroidGestureBar
        onHomeGesture={() => setActiveTab('explore')}
        onBackGesture={handleSystemBack}
        darkSurface={isDarkMode}
      />

      {/* Modals & Overlays */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        isSaved={selectedProduct ? savedIds.includes(selectedProduct.id) : false}
        onToggleSave={handleToggleSave}
        onAddToCart={handleAddToCart}
        onBuyWithGPay={(prod, qty, col) => {
          handleAddToCart(prod, qty, col);
          setSelectedProduct(null);
          setIsGPayOpen(true);
        }}
        onLaunchAR={(prod) => {
          setArTargetProduct(prod);
          setIsAROpen(true);
        }}
        theme={currentTheme}
        userEmail={userEmail}
        activePriceAlert={
          selectedProduct
            ? priceAlerts.find((a) => a.productId === selectedProduct.id) || null
            : null
        }
        onSavePriceAlert={handleSavePriceAlert}
        onRemovePriceAlert={handleRemovePriceAlert}
        reviews={reviews}
        onAddReview={handleAddReview}
        hasPurchased={selectedProduct ? isProductPurchased(selectedProduct.id) : false}
        onSimulatePurchase={handleSimulatePurchase}
      />

      <CartSheet
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onOpenGPay={() => {
          setIsCartOpen(false);
          setIsGPayOpen(true);
        }}
        onExplore={() => {
          setIsCartOpen(false);
          setActiveTab('explore');
        }}
        discount={promoDiscount}
        promoCode={appliedPromo}
        onApplyPromo={handleApplyPromo}
        theme={currentTheme}
      />

      <GooglePayModal
        isOpen={isGPayOpen}
        onClose={() => setIsGPayOpen(false)}
        items={cart}
        discount={promoDiscount}
        onPaymentSuccess={handlePaymentSuccess}
        userEmail={userEmail}
      />

      <OrderTrackingModal
        order={activeTrackingOrder}
        isOpen={Boolean(activeTrackingOrder)}
        onClose={() => setActiveTrackingOrder(null)}
      />

      <ARViewModal
        product={arTargetProduct}
        isOpen={isAROpen}
        onClose={() => setIsAROpen(false)}
        onAddToCart={(prod) => handleAddToCart(prod, 1)}
      />

      <VisualSearchModal
        isOpen={isLensOpen}
        onClose={() => setIsLensOpen(false)}
        onSelectProduct={(prod) => setSelectedProduct(prod)}
      />

      {storyViewerIndex !== null && (
        <StoryViewerModal
          stories={STORIES}
          initialIndex={storyViewerIndex}
          isOpen={storyViewerIndex !== null}
          onClose={() => setStoryViewerIndex(null)}
          onSelectProduct={(prod) => setSelectedProduct(prod)}
        />
      )}

      <AndroidNotificationShade
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onSelectProduct={(pId) => {
          const item = PRODUCTS.find((p) => p.id === pId);
          if (item) setSelectedProduct(item);
        }}
        onOpenOrderTracking={(ord) => setActiveTrackingOrder(ord)}
        latestOrder={orders[0] || null}
        priceAlerts={priceAlerts}
      />
    </AndroidFrame>
  );
}
