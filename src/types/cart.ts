// Update your CartItem interface to include productType and customization details
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
  productType?: 'engagement' | 'wedding' | 'setting' | 'diamond' | 'gemstone';
  cartItemId?: string;
  customization?: {
    isCustomized: boolean;
    customizationType?: 'setting-diamond' | 'setting-gemstone' | 'preset';
    diamondId?: string;
    gemstoneId?: string;
    settingId?: string;
    metalType?: string;
    size?: number;
    notes?: string;
    componentPrices?: {
      stone?: number;
      setting?: number;
    };
    // Added for admin panel visibility
    customizationDetails?: {
      stone?: {
        type: string;
        carat: number;
        color?: string;
        clarity?: string;
        cut?: string;
        price?: number;
        image?: string; // Added image property for stone
      };
      setting?: {
        style: string;
        metalType: string;
        settingType: string;
        price?: number;
      };
    };
  };
}