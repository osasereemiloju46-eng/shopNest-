export type CategoryId = 'all' | 'living' | 'audio' | 'lighting' | 'ceramic' | 'apparel';

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: CategoryId;
  categoryLabel: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  secondaryImage?: string;
  badge?: string;
  description: string;
  dimensions: string;
  materials: string[];
  inStock: boolean;
  colors: { name: string; hex: string }[];
  arCompatible: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export type OrderStatus = 'placed' | 'packing' | 'in_transit' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  estimatedDelivery: string;
  trackingNumber: string;
  courier: string;
  courierLocation?: { lat: number; lng: number; address: string };
  cancelReason?: string;
}

export interface Story {
  id: string;
  title: string;
  tagline: string;
  thumbnail: string;
  image: string;
  productId?: string;
  durationSeconds: number;
}

export type AndroidThemeId = 'sage' | 'clay' | 'indigo' | 'amoled';

export interface AndroidTheme {
  id: AndroidThemeId;
  name: string;
  colorHex: string;
  primaryClass: string;
  accentBg: string;
  accentText: string;
  navActiveBg: string;
}export interface PriceAlert {
  id: string;
  productId: string;
  productName: string;
  currentPrice: number;
  targetPrice: number;
  userEmail: string;
  createdAt: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  authorName: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  verifiedPurchase: boolean;
  userEmail?: string;
}
