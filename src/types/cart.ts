// Update your CartItem interface to include productType
export interface CartItem {
  _id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  metalOption?: {
    karat: string;
    color: string;
  };
  size?: number;
  productType?: string;
  cartItemId?: string;
}