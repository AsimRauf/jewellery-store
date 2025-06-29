import mongoose from 'mongoose';
import { extractIdFromSlug, isValidSlug } from './slugify';

/**
 * Find a document by slug or ID
 * @param model - Mongoose model
 * @param identifier - Either a slug or ObjectId
 * @returns Promise<Document | null>
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function findBySlugOrId(model: mongoose.Model<any>, identifier: string) {
  try {
    // If it's a valid ObjectId, search by ID directly
    if (mongoose.Types.ObjectId.isValid(identifier) && identifier.length === 24) {
      return await model.findById(identifier).lean();
    }
    
    // If it looks like a slug with an ID at the end, extract and search by ID
    const extractedId = extractIdFromSlug(identifier);
    if (extractedId && extractedId !== identifier && mongoose.Types.ObjectId.isValid(extractedId)) {
      return await model.findById(extractedId).lean();
    }
    
    // Search by slug field if it exists
    const docBySlug = await model.findOne({ slug: identifier }).lean();
    if (docBySlug) {
      return docBySlug;
    }
    
    // If slug is valid format but not found, try searching by ID anyway
    // This handles cases where slug doesn't match exactly
    if (isValidSlug(identifier)) {
      // Try to find by partial slug match or other fields
      return await model.findOne({
        $or: [
          { slug: { $regex: identifier, $options: 'i' } },
          { _id: identifier } // fallback
        ]
      }).lean();
    }
    
    return null;
  } catch (error) {
    console.error('Error in findBySlugOrId:', error);
    return null;
  }
}

/**
 * Generate search query for slug or ID
 * @param identifier - Either a slug or ObjectId
 * @returns MongoDB query object
 */
export function getSlugOrIdQuery(identifier: string) {
  const query: Record<string, unknown>[] = [];
  
  // Add ObjectId search if valid
  if (mongoose.Types.ObjectId.isValid(identifier) && identifier.length === 24) {
    query.push({ _id: identifier });
  }
  
  // Add slug search
  query.push({ slug: identifier });
  
  // Try to extract ID from slug
  const extractedId = extractIdFromSlug(identifier);
  if (extractedId && extractedId !== identifier && mongoose.Types.ObjectId.isValid(extractedId)) {
    query.push({ _id: extractedId });
  }
  
  return query.length > 1 ? { $or: query } : query[0] || {};
}
