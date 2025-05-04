import { SortOrder } from 'mongoose';

// Define valid MongoDB metadata sort options
type MongoDBMetaSort = 'textScore' | 'indexKey';

export interface MongoDBFilter {
  $in?: string[];
  $gte?: number;
  $lte?: number;
  $ne?: null;
}

export interface DiamondQuery {
  isActive: boolean;
  type?: string | { $in: string[] };
  shape?: string | { $in: string[] };
  color?: string | { $in: string[] };
  clarity?: string | { $in: string[] };
  cut?: { $in: string[] };
  carat?: {
    $gte?: number;
    $lte?: number;
  };
  price?: MongoDBFilter;
  salePrice?: MongoDBFilter & { $ne?: null };
  polish?: { $in: string[] };
  symmetry?: { $in: string[] };
  fluorescence?: { $in: string[] };
  fancyColor?: string;
  $or?: Array<{
    price?: MongoDBFilter;
    salePrice?: MongoDBFilter & { $ne?: null };
  }>;
}

export interface SortOptions {
  [key: string]: SortOrder | { $meta: MongoDBMetaSort };
}