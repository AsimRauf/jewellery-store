require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const slugify = require('slugify');

// Connect to MongoDB
async function connectDB() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jewelry-store';
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error);
    throw error;
  }
}

// Utility functions
function generateSlug(text, options = {}) {
  return slugify(text, {
    replacement: '-',
    remove: /[*+~.()'"!:@]/g,
    lower: true,
    strict: true,
    locale: 'en',
    trim: true,
    ...options
  });
}

function generateUniqueSlug(baseText, existingSlugs = []) {
  const baseSlug = generateSlug(baseText);
  
  if (!existingSlugs.includes(baseSlug)) {
    return baseSlug;
  }
  
  let counter = 1;
  let uniqueSlug = `${baseSlug}-${counter}`;
  
  while (existingSlugs.includes(uniqueSlug)) {
    counter++;
    uniqueSlug = `${baseSlug}-${counter}`;
  }
  
  return uniqueSlug;
}

function generateProductSlug(title, category, additionalInfo, id) {
  const parts = [];
  
  if (category) {
    parts.push(category);
  }
  
  parts.push(title);
  
  if (additionalInfo) {
    parts.push(additionalInfo);
  }
  
  const baseSlug = generateSlug(parts.join(' '));
  
  if (id) {
    const shortId = id.toString().slice(-8);
    return `${baseSlug}-${shortId}`;
  }
  
  return baseSlug;
}

// Define schemas
const WeddingRingSchema = new mongoose.Schema({
  title: String,
  slug: String,
  category: String,
  subcategory: String,
  style: [String],
  type: [String],
  SKU: String,
  basePrice: Number,
  metalOptions: Array,
  metalColorImages: Object,
  sizes: Array,
  side_stone: Object,
  media: Object,
  description: String,
  isActive: Boolean,
  isFeatured: Boolean,
  isNew: Boolean,
  onSale: Boolean,
  originalPrice: Number
}, { timestamps: true });

const EngagementRingSchema = new mongoose.Schema({
  title: String,
  slug: String,
  category: String,
  style: [String],
  type: [String],
  SKU: String,
  basePrice: Number,
  metalOptions: Array,
  metalColorImages: Object,
  sizes: Array,
  main_stone: Object,
  side_stone: Object,
  media: Object,
  description: String,
  isActive: Boolean,
  isFeatured: Boolean,
  isNew: Boolean,
  onSale: Boolean,
  originalPrice: Number
}, { timestamps: true });

const SettingSchema = new mongoose.Schema({
  title: String,
  slug: String,
  category: String,
  style: [String],
  type: [String],
  SKU: String,
  basePrice: Number,
  metalOptions: Array,
  metalColorImages: Object,
  sizes: Array,
  side_stone: Object,
  media: Object,
  description: String,
  isActive: Boolean,
  isFeatured: Boolean,
  isNew: Boolean,
  onSale: Boolean,
  originalPrice: Number,
  canAcceptStone: Boolean,
  compatibleStoneShapes: [String],
  settingHeight: Number,
  bandWidth: Number
}, { timestamps: true });

const GemstoneSchema = new mongoose.Schema({
  sku: String,
  slug: String,
  productNumber: String,
  type: String,
  source: String,
  carat: Number,
  shape: String,
  color: String,
  clarity: String,
  cut: String,
  origin: String,
  treatment: String,
  measurements: String,
  certificateLab: String,
  certificateNumber: String,
  refractive_index: Number,
  hardness: Number,
  price: Number,
  salePrice: Number,
  discountPercentage: Number,
  images: Array,
  isAvailable: Boolean,
  description: String
}, { timestamps: true });

const DiamondSchema = new mongoose.Schema({
  sku: String,
  slug: String,
  productNumber: String,
  type: String,
  carat: Number,
  shape: String,
  color: String,
  fancyColor: String,
  clarity: String,
  cut: String,
  polish: String,
  symmetry: String,
  fluorescence: String,
  measurements: String,
  treatment: String,
  certificateLab: String,
  crownAngle: Number,
  crownHeight: Number,
  pavilionAngle: Number,
  pavilionDepth: Number,
  price: Number,
  salePrice: Number,
  discountPercentage: Number,
  images: Array,
  isAvailable: Boolean
}, { timestamps: true });

// Create models
const WeddingRing = mongoose.models.WeddingRing || mongoose.model('WeddingRing', WeddingRingSchema);
const EngagementRing = mongoose.models.EngagementRing || mongoose.model('EngagementRing', EngagementRingSchema);
const Setting = mongoose.models.Setting || mongoose.model('Setting', SettingSchema);
const Gemstone = mongoose.models.Gemstone || mongoose.model('Gemstone', GemstoneSchema);
const Diamond = mongoose.models.Diamond || mongoose.model('Diamond', DiamondSchema);

// Generation functions
async function generateWeddingRingSlugs() {
  const products = await WeddingRing.find({ slug: { $exists: false } });
  const existingSlugs = await WeddingRing.distinct('slug', { slug: { $exists: true } });
  
  let updated = 0;
  for (const product of products) {
    try {
      const slug = generateProductSlug(
        product.title,
        'wedding-ring',
        product.subcategory,
        product._id
      );
      const uniqueSlug = generateUniqueSlug(slug, existingSlugs);
      
      await WeddingRing.findByIdAndUpdate(product._id, { slug: uniqueSlug });
      existingSlugs.push(uniqueSlug);
      updated++;
    } catch (error) {
      console.error(`Error updating wedding ring ${product._id}:`, error);
    }
  }
  
  console.log(`✅ Updated ${updated} wedding rings with slugs`);
  return updated;
}

async function generateEngagementRingSlugs() {
  const products = await EngagementRing.find({ slug: { $exists: false } });
  const existingSlugs = await EngagementRing.distinct('slug', { slug: { $exists: true } });
  
  let updated = 0;
  for (const product of products) {
    try {
      const slug = generateProductSlug(
        product.title,
        'engagement-ring',
        undefined,
        product._id
      );
      const uniqueSlug = generateUniqueSlug(slug, existingSlugs);
      
      await EngagementRing.findByIdAndUpdate(product._id, { slug: uniqueSlug });
      existingSlugs.push(uniqueSlug);
      updated++;
    } catch (error) {
      console.error(`Error updating engagement ring ${product._id}:`, error);
    }
  }
  
  console.log(`✅ Updated ${updated} engagement rings with slugs`);
  return updated;
}

async function generateSettingSlugs() {
  const products = await Setting.find({ slug: { $exists: false } });
  const existingSlugs = await Setting.distinct('slug', { slug: { $exists: true } });
  
  let updated = 0;
  for (const product of products) {
    try {
      const slug = generateProductSlug(
        product.title,
        'ring-setting',
        undefined,
        product._id
      );
      const uniqueSlug = generateUniqueSlug(slug, existingSlugs);
      
      await Setting.findByIdAndUpdate(product._id, { slug: uniqueSlug });
      existingSlugs.push(uniqueSlug);
      updated++;
    } catch (error) {
      console.error(`Error updating setting ${product._id}:`, error);
    }
  }
  
  console.log(`✅ Updated ${updated} settings with slugs`);
  return updated;
}

async function generateGemstoneSlugs() {
  const products = await Gemstone.find({ slug: { $exists: false } });
  const existingSlugs = await Gemstone.distinct('slug', { slug: { $exists: true } });
  
  let updated = 0;
  for (const product of products) {
    try {
      const title = `${product.type} ${product.carat}ct ${product.color} ${product.shape}`;
      const slug = generateProductSlug(
        title,
        'gemstone',
        product.source,
        product._id
      );
      const uniqueSlug = generateUniqueSlug(slug, existingSlugs);
      
      await Gemstone.findByIdAndUpdate(product._id, { slug: uniqueSlug });
      existingSlugs.push(uniqueSlug);
      updated++;
    } catch (error) {
      console.error(`Error updating gemstone ${product._id}:`, error);
    }
  }
  
  console.log(`✅ Updated ${updated} gemstones with slugs`);
  return updated;
}

async function generateDiamondSlugs() {
  const products = await Diamond.find({ slug: { $exists: false } });
  const existingSlugs = await Diamond.distinct('slug', { slug: { $exists: true } });
  
  let updated = 0;
  for (const product of products) {
    try {
      const title = `${product.shape} ${product.carat}ct ${product.color} ${product.clarity}`;
      const slug = generateProductSlug(
        title,
        'diamond',
        product.type,
        product._id
      );
      const uniqueSlug = generateUniqueSlug(slug, existingSlugs);
      
      await Diamond.findByIdAndUpdate(product._id, { slug: uniqueSlug });
      existingSlugs.push(uniqueSlug);
      updated++;
    } catch (error) {
      console.error(`Error updating diamond ${product._id}:`, error);
    }
  }
  
  console.log(`✅ Updated ${updated} diamonds with slugs`);
  return updated;
}

async function generateAllSlugs() {
  try {
    await connectDB();
    
    console.log('🚀 Starting slug generation for all products...');
    
    const results = await Promise.all([
      generateWeddingRingSlugs(),
      generateEngagementRingSlugs(),
      generateSettingSlugs(),
      generateGemstoneSlugs(),
      generateDiamondSlugs()
    ]);
    
    const totalUpdated = results.reduce((sum, count) => sum + count, 0);
    
    console.log(`\n🎉 Slug generation complete! Updated ${totalUpdated} products total.`);
    console.log('📊 Breakdown:');
    console.log(`   - Wedding Rings: ${results[0]}`);
    console.log(`   - Engagement Rings: ${results[1]}`);
    console.log(`   - Settings: ${results[2]}`);
    console.log(`   - Gemstones: ${results[3]}`);
    console.log(`   - Diamonds: ${results[4]}`);
    
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
  } finally {
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
  }
}

// Run the script
generateAllSlugs()
  .then((result) => {
    console.log('✅ Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
