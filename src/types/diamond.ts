export interface Diamond {
  _id: string;
  sku: string;
  type: 'natural' | 'lab';
  carat: number;
  shape: string;
  color: string;
  fancyColor?: string;
  clarity: string;
  cut: string;
  polish: string;
  symmetry: string;
  fluorescence: string;
  measurements: string;
  treatment?: string;
  certificateLab: string;
  crownAngle?: number;
  crownHeight?: number;
  pavilionAngle?: number;
  pavilionDepth?: number;
  price: number;
  salePrice?: number;
  discountPercentage?: number;
  isActive: boolean;
  images: Array<{ url: string; publicId: string }>;
  createdAt?: Date;
  updatedAt?: Date;
}