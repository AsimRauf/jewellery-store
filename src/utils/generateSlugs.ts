/**
 * Utility script to generate slugs for existing products
 * Run this script when you first add slug support to populate existing products
 */

import { connectDB } from './db';
import WeddingRing from '../models/WeddingRing';
import EngagementRing from '../models/EngagementRing';
import Setting from '../models/Setting';
import Gemstone from '../models/Gemstone';
import Diamond from '../models/Diamond';

interface ProductWithSlug {
  _id: string;
  slug?: string;
  title?: string;
  [key: string]: unknown;
}

/**
 * Generate slugs for all products that don't have them
 */
export async function generateAllSlugs() {
  try {
    await connectDB();
    
    console.log('Starting slug generation for all products...');
    
    const results = await Promise.all([
      generateWeddingRingSlugs(),
      generateEngagementRingSlugs(),
      generateSettingSlugs(),
      generateGemstoneSlugs(),
      generateDiamondSlugs()
    ]);
    
    const totalUpdated = results.reduce((sum, count) => sum + count, 0);
    
    console.log(`✅ Slug generation complete! Updated ${totalUpdated} products total.`);
    
    return {
      weddingRings: results[0],
      engagementRings: results[1],
      settings: results[2],
      gemstones: results[3],
      diamonds: results[4],
      total: totalUpdated
    };
    
  } catch (error) {
    console.error('❌ Error generating slugs:', error);
    throw error;
  }
}

/**
 * Generate slugs for wedding rings
 */
export async function generateWeddingRingSlugs() {
  const products = await WeddingRing.find({ slug: { $exists: false } }) as ProductWithSlug[];
  
  let updated = 0;
  for (const product of products) {
    try {
      // The pre-save middleware will generate the slug
      await WeddingRing.findByIdAndUpdate(product._id, { $unset: { slug: 1 } });
      const doc = await WeddingRing.findById(product._id);
      if (doc) {
        await doc.save(); // This will trigger the pre-save middleware
        updated++;
      }
    } catch (error) {
      console.error(`Error updating wedding ring ${product._id}:`, error);
    }
  }
  
  console.log(`✅ Updated ${updated} wedding rings with slugs`);
  return updated;
}

/**
 * Generate slugs for engagement rings
 */
export async function generateEngagementRingSlugs() {
  const products = await EngagementRing.find({ slug: { $exists: false } }) as ProductWithSlug[];
  
  let updated = 0;
  for (const product of products) {
    try {
      const doc = await EngagementRing.findById(product._id);
      if (doc) {
        await doc.save(); // This will trigger the pre-save middleware
        updated++;
      }
    } catch (error) {
      console.error(`Error updating engagement ring ${product._id}:`, error);
    }
  }
  
  console.log(`✅ Updated ${updated} engagement rings with slugs`);
  return updated;
}

/**
 * Generate slugs for settings
 */
export async function generateSettingSlugs() {
  const products = await Setting.find({ slug: { $exists: false } }) as ProductWithSlug[];
  
  let updated = 0;
  for (const product of products) {
    try {
      const doc = await Setting.findById(product._id);
      if (doc) {
        await doc.save(); // This will trigger the pre-save middleware
        updated++;
      }
    } catch (error) {
      console.error(`Error updating setting ${product._id}:`, error);
    }
  }
  
  console.log(`✅ Updated ${updated} settings with slugs`);
  return updated;
}

/**
 * Generate slugs for gemstones
 */
export async function generateGemstoneSlugs() {
  const products = await Gemstone.find({ slug: { $exists: false } }) as ProductWithSlug[];
  
  let updated = 0;
  for (const product of products) {
    try {
      const doc = await Gemstone.findById(product._id);
      if (doc) {
        await doc.save(); // This will trigger the pre-save middleware
        updated++;
      }
    } catch (error) {
      console.error(`Error updating gemstone ${product._id}:`, error);
    }
  }
  
  console.log(`✅ Updated ${updated} gemstones with slugs`);
  return updated;
}

/**
 * Generate slugs for diamonds
 */
export async function generateDiamondSlugs() {
  const products = await Diamond.find({ slug: { $exists: false } }) as ProductWithSlug[];
  
  let updated = 0;
  for (const product of products) {
    try {
      const doc = await Diamond.findById(product._id);
      if (doc) {
        await doc.save(); // This will trigger the pre-save middleware
        updated++;
      }
    } catch (error) {
      console.error(`Error updating diamond ${product._id}:`, error);
    }
  }
  
  console.log(`✅ Updated ${updated} diamonds with slugs`);
  return updated;
}

/**
 * Check slug statistics
 */
export async function checkSlugStats() {
  try {
    await connectDB();
    
    const stats = await Promise.all([
      WeddingRing.countDocuments({ slug: { $exists: true } }),
      WeddingRing.countDocuments({}),
      EngagementRing.countDocuments({ slug: { $exists: true } }),
      EngagementRing.countDocuments({}),
      Setting.countDocuments({ slug: { $exists: true } }),
      Setting.countDocuments({}),
      Gemstone.countDocuments({ slug: { $exists: true } }),
      Gemstone.countDocuments({}),
      Diamond.countDocuments({ slug: { $exists: true } }),
      Diamond.countDocuments({})
    ]);
    
    return {
      weddingRings: { withSlug: stats[0], total: stats[1] },
      engagementRings: { withSlug: stats[2], total: stats[3] },
      settings: { withSlug: stats[4], total: stats[5] },
      gemstones: { withSlug: stats[6], total: stats[7] },
      diamonds: { withSlug: stats[8], total: stats[9] }
    };
  } catch (error) {
    console.error('Error checking slug stats:', error);
    throw error;
  }
}

// For CLI usage
if (require.main === module) {
  generateAllSlugs()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
