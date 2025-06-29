import slugify from 'slugify';

/**
 * Generate a URL-friendly slug from a string
 */
export function generateSlug(text: string, options?: {
  replacement?: string;
  remove?: RegExp;
  lower?: boolean;
  strict?: boolean;
  locale?: string;
  trim?: boolean;
}): string {
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

/**
 * Generate a unique slug by appending timestamp or counter if needed
 */
export function generateUniqueSlug(
  baseText: string, 
  existingSlugs: string[] = [], 
  options?: Parameters<typeof generateSlug>[1]
): string {
  const baseSlug = generateSlug(baseText, options);
  
  // If base slug is unique, return it
  if (!existingSlugs.includes(baseSlug)) {
    return baseSlug;
  }
  
  // Find a unique variant by appending numbers
  let counter = 1;
  let uniqueSlug = `${baseSlug}-${counter}`;
  
  while (existingSlugs.includes(uniqueSlug)) {
    counter++;
    uniqueSlug = `${baseSlug}-${counter}`;
  }
  
  return uniqueSlug;
}

/**
 * Generate a product slug with enhanced SEO-friendly format
 */
export function generateProductSlug(
  title: string,
  category?: string,
  additionalInfo?: string,
  id?: string
): string {
  const parts: string[] = [];
  
  if (category) {
    parts.push(category);
  }
  
  parts.push(title);
  
  if (additionalInfo) {
    parts.push(additionalInfo);
  }
  
  // Create base slug from combined parts
  const baseSlug = generateSlug(parts.join(' '));
  
  // Optionally append shortened ID for uniqueness
  if (id) {
    const shortId = id.slice(-8); // Last 8 characters of ID
    return `${baseSlug}-${shortId}`;
  }
  
  return baseSlug;
}

/**
 * Extract ID from slug (if ID is appended)
 */
export function extractIdFromSlug(slug: string): string | null {
  // Look for pattern ending with dash and 8+ characters (MongoDB ObjectId pattern)
  const match = slug.match(/-([a-f0-9]{8,})$/i);
  if (match) {
    return match[1];
  }
  
  // If no ID found in slug, return the slug itself (might be used for lookup)
  return slug;
}

/**
 * Validate if a string is a valid slug
 */
export function isValidSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
}
