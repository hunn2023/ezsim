export interface CartItem {
  id: string;
  name: string;
  slug: string;
  href?: string;
  image: string;
  price: number;
  quantity: number;
  stock: number;
  // IDs for order API mapping
  productId?: string;
  productVariantId?: string;
  esimPackageId?: string;
  phoneCardId?: string;
  itemType?: number; // 1=EsimPackage, 2=PhoneCard
}

export interface CartState {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalQuantity: () => number;
  getTotalAmount: () => number;
}
