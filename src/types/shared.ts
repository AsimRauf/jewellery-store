export interface BaseMetalOption {
  _id?: string;
  karat: string;
  color: string;
  price: number;
  finish_type?: string | null;
  isDefault?: boolean;
}

export interface BaseProduct {
  _id: string;
  title: string;
  SKU: string;
  metalOptions: BaseMetalOption[];
  metalColorImages?: {
    [color: string]: Array<{
      url: string;
      publicId: string;
      _id?: string;
    }>;
  };
  style: string[];
  type: string[];
  subcategory?: string;
  media: {
    images: Array<{
      url: string;
      publicId: string;
      _id: string;
    }>;
    video?: {
      url: string;
      publicId: string;
    };
  };
}