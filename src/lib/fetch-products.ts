import Product, { IProduct } from '@/models/Product';
import { connectDB } from '@/utils/db';

export async function getProductsByCategory(): Promise<IProduct[]> {
  await connectDB();
  const products = await Product.find({}).lean();
  return JSON.parse(JSON.stringify(products));
}

export async function getProductsByStyle(): Promise<IProduct[]> {
  await connectDB();
  const products = await Product.find({}).lean();
  return JSON.parse(JSON.stringify(products));
}