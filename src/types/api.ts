export type LoginPayload = {
  email?: string;
  username?: string;
  phone?: string;
  password: string;
};

export type ProductPayload = {
  name: string;
  description?: string;
  price: number;
  stock: number;
  category?: number | string | null;
  is_active: boolean;
  image?: File | null;
};

export type ApiState<T> = {
  loading: boolean;
  data: T | null;
  error: string | null;
};
