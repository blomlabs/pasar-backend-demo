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
