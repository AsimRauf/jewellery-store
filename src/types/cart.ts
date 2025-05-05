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
    // Added for admin panel visibility
    customizationDetails?: {
      stone?: {
        type: string;
        carat: number;
        color?: string;
        clarity?: string;
        cut?: string;
      };
      setting?: {
        style: string;
        metalType: string;
        settingType: string;
      };
    };
  };
}