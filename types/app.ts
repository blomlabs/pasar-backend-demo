export type AuthExpiryKey = "7d" | "1w" | "1m";

export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  website: string;
  country: string;
  state_of_origin: string;
  gender: string;
  phone_number: string;
  account_type: "seller" | "buyer";
  is_admin: boolean;
  created_at: string;
  updated_at: string;
  password?: string;
}

export interface Product {
  id: string;
  user_id: number;
  name: string;
  category_id: number;
  sub_category_id: number;
  images: any[];
  price: number;
  desc: string;
  slug: string;
  rating: number;
  // Add more types
  created_at: string;
  updated_at: string;
  color: string;
  brand_id: number;
  quantity: number;
  shipping_fee: number;
}

export interface CartProps {
  id: string;
  user_id: number;
  cart_items: CartItemProps[];
  created_at: string;
  updated_at: string;
}

export interface CartItemProps {
  id: string;
  quantity: number;
  product: Product;
  created_at: string;
  updated_at: string;
}

export interface CategoryProps {
  id: number;
  category_name: string;
  category_slug: string;
  created_at: string;
  updated_at: string;
}

export interface Feedback {
  id: number;
  product_id: number;
  comment: string;
  rating: number;
  username: string;
  profile_image: object;
  created_at: string;
  user_id: number;
}

export interface Orders {
  id: number;
  shipping_fees: number;
  total: number;
  user_id: number;
  items: CartItemProps[];
  order_number: string;
  status: "pending" | "cancelled" | "delivered";
  payment_method: "fiat" | "crypto";
  created_at: string;
}

export type PaymentMethod = "crypto" | "fiat";
