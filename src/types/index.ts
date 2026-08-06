export type Role = 'USER' | 'ADMIN';

export type PaymentMethod = 'COD' | 'BKASH' | 'NAGAD';

export type PaymentStatus = 'PENDING' | 'VERIFIED' | 'FAILED';

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
  description?: string | null;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  price: number;
  stock: number;
  sku: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  categoryId: string;
  category?: Category;
  basePrice: number;
  stock: number;
  sku: string;
  images: string; // JSON array string
  isActive: boolean;
  unit: string;
  variants?: ProductVariant[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  id: string; // unique cart entry id
  product: Product;
  variant?: ProductVariant | null;
  quantity: number;
  price: number;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product: Product;
  variantId?: string | null;
  variant?: ProductVariant | null;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string | null;
  customerName: string;
  phone: string;
  deliveryAddress: string;
  district: string;
  thana: string;
  totalAmount: number;
  deliveryFee: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  bkashTrxId?: string | null;
  paymentSenderNo?: string | null;
  items: OrderItem[];
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserSession {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  role: Role;
}

export interface CheckoutPayload {
  idempotencyKey: string;
  customerName: string;
  phone: string;
  deliveryAddress: string;
  district: string;
  thana: string;
  paymentMethod: PaymentMethod;
  bkashTrxId?: string;
  paymentSenderNo?: string;
  notes?: string;
  items: Array<{
    productId: string;
    variantId?: string | null;
    quantity: number;
  }>;
}
