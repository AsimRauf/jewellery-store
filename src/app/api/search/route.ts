import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/utils/db';
import Setting from '@/models/Setting';
import WeddingRing from '@/models/WeddingRing';
import EngagementRing from '@/models/EngagementRing';
import Diamond from '@/models/Diamond';
import Gemstone from '@/models/Gemstone';
import Bracelet from '@/models/Bracelet';
import Earring from '@/models/Earring';
import Necklace from '@/models/Necklace';
import MensJewelry from '@/models/MensJewelry';

interface SearchProduct {
  _id: string;
  title: string;
  slug?: string;
  price: number;
  salePrice?: number;
  image: string;
  category: string;
  productType: string;
  description?: string;
  isAvailable: boolean;
  metalOption?: {
    karat: string;
    color: string;
    price: number;
  };
  carat?: number;
  shape?: string;
  color?: string;
  clarity?: string;
  type?: string;
  style?: string[];
  metal?: string;
  gemstones?: Array<{
    type: string;
    carat?: number;
  }>;
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const sortBy = searchParams.get('sortBy') || 'relevance';
    
    // Filters
    const categories = searchParams.get('category')?.split(',').filter(Boolean) || [];
    const metals = searchParams.get('metal')?.split(',').filter(Boolean) || [];
    const styles = searchParams.get('style')?.split(',').filter(Boolean) || [];
    const shapes = searchParams.get('shape')?.split(',').filter(Boolean) || [];
    const gemstoneTypes = searchParams.get('gemstoneType')?.split(',').filter(Boolean) || [];
    const minPrice = parseFloat(searchParams.get('minPrice') || '0');
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '999999');
    const availability = searchParams.get('availability') === 'true';

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Search all product types
    const searchResults: SearchProduct[] = [];
    
    // Create advanced search terms with synonyms and related terms
    const searchTerms = createAdvancedSearchTerms(query);
    const searchRegex = searchTerms.length > 0 ? new RegExp(searchTerms.join('|'), 'i') : null;
    const lowerCaseQuery = query.toLowerCase().trim();
 
     // Search Settings (Ring Settings)
     if (!categories.length || categories.includes('Settings') || categories.includes('Rings')) {
       try {
         let settingQuery: any = { isActive: true };
         
        if (['setting', 'settings'].includes(lowerCaseQuery)) {
            // No additional query needed, will fetch all settings
        } else if (searchRegex) {
           settingQuery.$or = [
             { title: searchRegex },
             { description: searchRegex },
             { style: { $in: [searchRegex] } },
             { type: { $in: [searchRegex] } }
           ];
         }

        if (styles.length) {
          settingQuery.style = { $in: styles };
        }

        const settings = await Setting.find(settingQuery).lean();
        
        for (const setting of settings) {
          // Expand each setting with its metal options
          for (const metalOption of setting.metalOptions || []) {
            if (metals.length && !metals.includes(metalOption.color)) continue;
            if (metalOption.price < minPrice || metalOption.price > maxPrice) continue;
            if (availability && !setting.isActive) continue;

            // Get image for this metal color
            let image = '';
            if (setting.metalColorImages && setting.metalColorImages[metalOption.color] && setting.metalColorImages[metalOption.color].length > 0) {
              image = setting.metalColorImages[metalOption.color][0].url;
            } else if (setting.media?.images?.length > 0) {
              image = setting.media.images[0].url;
            }

            searchResults.push({
              _id: `${setting._id}-${metalOption.karat}-${metalOption.color}`,
              title: setting.title,
              slug: setting.slug,
              price: metalOption.price,
              salePrice: setting.salePrice,
              image,
              category: setting.category || 'Settings',
              productType: 'setting',
              description: setting.description,
              isAvailable: setting.isActive,
              metalOption: {
                karat: metalOption.karat,
                color: metalOption.color,
                price: metalOption.price
              },
              style: setting.style
            });
          }
        }
      } catch (error) {
        console.error('Error searching settings:', error);
      }
    }

    // Search Wedding Rings
    if (!categories.length || categories.includes('Wedding') || categories.includes('Rings')) {
      try {
        let weddingQuery: any = { isActive: true };
        
        if (['ring', 'rings', 'wedding ring', 'wedding rings', 'wedding band', 'wedding bands'].includes(lowerCaseQuery)) {
            // No additional query needed, will fetch all wedding rings
        } else if (searchRegex) {
          weddingQuery.$or = [
            { title: searchRegex },
            { description: searchRegex },
            { style: { $in: [searchRegex] } },
            { type: { $in: [searchRegex] } },
            { subcategory: searchRegex }
          ];
        }

        if (styles.length) {
          weddingQuery.style = { $in: styles };
        }

        const weddingRings = await WeddingRing.find(weddingQuery).lean();
        
        for (const ring of weddingRings) {
          for (const metalOption of ring.metalOptions || []) {
            if (metals.length && !metals.includes(metalOption.color)) continue;
            if (metalOption.price < minPrice || metalOption.price > maxPrice) continue;
            if (availability && !ring.isActive) continue;

            let image = '';
            if (ring.metalColorImages && ring.metalColorImages[metalOption.color] && ring.metalColorImages[metalOption.color].length > 0) {
              image = ring.metalColorImages[metalOption.color][0].url;
            } else if (ring.media?.images?.length > 0) {
              image = ring.media.images[0].url;
            }

            searchResults.push({
              _id: `${ring._id}-${metalOption.karat}-${metalOption.color}`,
              title: ring.title,
              slug: ring.slug,
              price: metalOption.price,
              salePrice: ring.salePrice,
              image,
              category: ring.category || 'Wedding',
              productType: 'wedding',
              description: ring.description,
              isAvailable: ring.isActive,
              metalOption: {
                karat: metalOption.karat,
                color: metalOption.color,
                price: metalOption.price
              },
              style: ring.style
            });
          }
        }
      } catch (error) {
        console.error('Error searching wedding rings:', error);
      }
    }

    // Search Engagement Rings
    if (!categories.length || categories.includes('Engagement') || categories.includes('Rings')) {
      try {
        let engagementQuery: any = { isActive: true };
        
        if (['ring', 'rings', 'engagement ring', 'engagement rings'].includes(lowerCaseQuery)) {
            // No additional query needed, will fetch all engagement rings
        } else if (searchRegex) {
          engagementQuery.$or = [
            { title: searchRegex },
            { description: searchRegex },
            { style: { $in: [searchRegex] } },
            { type: { $in: [searchRegex] } }
          ];
        }

        if (styles.length) {
          engagementQuery.style = { $in: styles };
        }

        const engagementRings = await EngagementRing.find(engagementQuery).lean();
        
        for (const ring of engagementRings) {
          for (const metalOption of ring.metalOptions || []) {
            if (metals.length && !metals.includes(metalOption.color)) continue;
            if (metalOption.price < minPrice || metalOption.price > maxPrice) continue;
            if (availability && !ring.isActive) continue;

            let image = '';
            if (ring.metalColorImages && ring.metalColorImages[metalOption.color] && ring.metalColorImages[metalOption.color].length > 0) {
              image = ring.metalColorImages[metalOption.color][0].url;
            } else if (ring.media?.images?.length > 0) {
              image = ring.media.images[0].url;
            }

            searchResults.push({
              _id: `${ring._id}-${metalOption.karat}-${metalOption.color}`,
              title: ring.title,
              slug: ring.slug,
              price: metalOption.price,
              salePrice: ring.salePrice,
              image,
              category: ring.category || 'Engagement',
              productType: 'engagement',
              description: ring.description,
              isAvailable: ring.isActive,
              metalOption: {
                karat: metalOption.karat,
                color: metalOption.color,
                price: metalOption.price
              },
              style: ring.style
            });
          }
        }
      } catch (error) {
        console.error('Error searching engagement rings:', error);
      }
    }

    // Search Diamonds
    if (!categories.length || categories.includes('Diamond') || categories.includes('Diamonds')) {
      try {
        let diamondQuery: any = { isAvailable: true };
        
        if (['diamond', 'diamonds'].includes(lowerCaseQuery)) {
            // No additional query needed, will fetch all diamonds
        } else if (searchRegex) {
          diamondQuery.$or = [
            { shape: searchRegex },
            { color: searchRegex },
            { clarity: searchRegex },
            { type: searchRegex }
          ];
        }

        if (shapes.length) {
          diamondQuery.shape = { $in: shapes };
        }

        if (diamondQuery.price || minPrice > 0 || maxPrice < 999999) {
          diamondQuery.price = { $gte: minPrice, $lte: maxPrice };
        }

        const diamonds = await Diamond.find(diamondQuery).lean();
        
        for (const diamond of diamonds) {
          if (availability && !diamond.isAvailable) continue;

          let image = '';
          if (diamond.images?.length > 0) {
            image = diamond.images[0].url;
          }

          searchResults.push({
            _id: String(diamond._id),
            title: `${diamond.shape} ${diamond.carat}ct ${diamond.color} ${diamond.clarity} Diamond`,
            slug: diamond.slug,
            price: diamond.salePrice || diamond.price,
            salePrice: diamond.salePrice,
            image,
            category: 'Diamond',
            productType: 'diamond',
            description: `${diamond.carat} carat ${diamond.shape} ${diamond.color} ${diamond.clarity} diamond`,
            isAvailable: diamond.isAvailable,
            carat: diamond.carat,
            shape: diamond.shape,
            color: diamond.color,
            clarity: diamond.clarity,
            type: diamond.type
          });
        }
      } catch (error) {
        console.error('Error searching diamonds:', error);
      }
    }

    // Search Gemstones
    if (!categories.length || categories.includes('Gemstone') || categories.includes('Gemstones')) {
      try {
        let gemstoneQuery: any = { isAvailable: true };
        
        if (['gemstone', 'gemstones'].includes(lowerCaseQuery)) {
            // No additional query needed, will fetch all gemstones
        } else if (searchRegex) {
          gemstoneQuery.$or = [
            { type: searchRegex },
            { shape: searchRegex },
            { color: searchRegex },
            { clarity: searchRegex }
          ];
        }

        if (gemstoneTypes.length) {
          gemstoneQuery.type = { $in: gemstoneTypes };
        }

        if (shapes.length) {
          gemstoneQuery.shape = { $in: shapes };
        }

        if (gemstoneQuery.price || minPrice > 0 || maxPrice < 999999) {
          gemstoneQuery.price = { $gte: minPrice, $lte: maxPrice };
        }

        const gemstones = await Gemstone.find(gemstoneQuery).lean();
        
        for (const gemstone of gemstones) {
          if (availability && !gemstone.isAvailable) continue;

          let image = '';
          if (gemstone.images && gemstone.images.length > 0) {
            image = gemstone.images[0].url;
          }

          searchResults.push({
            _id: String(gemstone._id),
            title: `${gemstone.carat}ct ${gemstone.color} ${gemstone.type}`,
            slug: gemstone.slug,
            price: gemstone.salePrice || gemstone.price,
            salePrice: gemstone.salePrice,
            image,
            category: 'Gemstone',
            productType: 'gemstone',
            description: `${gemstone.carat} carat ${gemstone.color} ${gemstone.type}`,
            isAvailable: gemstone.isAvailable,
            carat: gemstone.carat,
            shape: gemstone.shape,
            color: gemstone.color,
            clarity: gemstone.clarity,
            type: gemstone.type
          });
        }
      } catch (error) {
        console.error('Error searching gemstones:', error);
      }
    }

    // Search other jewelry types (Bracelets, Earrings, Necklaces, Men's Jewelry)
    const jewelryTypes = [
      { model: Bracelet, category: 'Bracelet', type: 'bracelet' },
      { model: Earring, category: 'Earring', type: 'earring' },
      { model: Necklace, category: 'Necklace', type: 'necklace' },
      { model: MensJewelry, category: 'Men\'s Jewelry', type: 'mens-jewelry' }
    ];

    for (const { model, category, type } of jewelryTypes) {
      if (!categories.length || categories.includes(category) || categories.includes('Fine Jewellery')) {
        try {
          if (!model) continue;
          
          let jewelryQuery: any = { isAvailable: true };
          
          if (
            (category === 'Bracelet' && ['bracelet', 'bracelets'].includes(lowerCaseQuery)) ||
            (category === 'Earring' && ['earring', 'earrings'].includes(lowerCaseQuery)) ||
            (category === 'Necklace' && ['necklace', 'necklaces'].includes(lowerCaseQuery)) ||
            (category === 'Men\'s Jewelry' && ["men's jewelry", "mens jewelry", "men's", "mens"].includes(lowerCaseQuery))
          ) {
            // No additional query needed, will fetch all items of this type
          } else if (searchRegex) {
            jewelryQuery.$or = [
              { name: searchRegex },
              { type: searchRegex },
              { metal: searchRegex },
              { style: searchRegex },
              { description: searchRegex },
              { 'gemstones.type': searchRegex }
            ];
          }

          if (metals.length) {
            jewelryQuery.metal = { $in: metals };
          }

          if (jewelryQuery.price || minPrice > 0 || maxPrice < 999999) {
            jewelryQuery.price = { $gte: minPrice, $lte: maxPrice };
          }

          const Model = model as any; // Use type assertion to bypass the error
          const items = await Model.find(jewelryQuery).lean();
          
          for (const item of items) {
            if (availability && !item.isAvailable) continue;

            let image = '';
            if (item.images && item.images.length > 0) {
              image = item.images[0].url;
            }

            searchResults.push({
              _id: String(item._id),
              title: item.name || category,
              slug: item.slug,
              price: item.salePrice || item.price,
              salePrice: item.salePrice,
              image,
              category,
              productType: type,
              description: item.description,
              isAvailable: item.isAvailable,
              metal: item.metal,
              type: item.type,
              gemstones: item.gemstones
            });
          }
        } catch (error) {
          console.error(`Error searching ${type}:`, error);
        }
      }
    }

    // Sort results
    const sortedResults = sortResults(searchResults, sortBy, query);

    // Paginate results
    const totalCount = sortedResults.length;
    const paginatedResults = sortedResults.slice(skip, skip + limit);
    const hasMore = skip + limit < totalCount;

    // Generate filter options from all results
    const filterOptions = generateFilterOptions(searchResults);

    return NextResponse.json({
      products: paginatedResults,
      totalCount,
      hasMore,
      filters: filterOptions
    });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function createAdvancedSearchTerms(query: string): string[] {
  const terms = query.toLowerCase().split(' ').filter(Boolean);
  const expandedTerms = new Set<string>(terms);

  const synonymMap: { [key: string]: string[] } = {
    'ring': ['band', 'solitaire', 'halo', 'setting'],
    'rings': ['band', 'solitaire', 'halo', 'setting'],
    'wedding': ['bridal', 'nuptial'],
    'engagement': ['proposal', 'bridal'],
    'diamond': ['brilliant', 'ice'],
    'necklace': ['pendant', 'choker', 'chain', 'lariat', 'collar'],
    'choker': ['collar', 'necklace'],
    'earring': ['stud', 'hoop', 'dangle'],
    'bracelet': ['bangle', 'cuff'],
  };

  terms.forEach(term => {
    if (synonymMap[term]) {
      synonymMap[term].forEach(synonym => expandedTerms.add(synonym));
    }
  });

  return Array.from(expandedTerms);
}

function sortResults(results: SearchProduct[], sortBy: string, query: string): SearchProduct[] {
  switch (sortBy) {
    case 'price-low':
      return results.sort((a, b) => a.price - b.price);
    case 'price-high':
      return results.sort((a, b) => b.price - a.price);
    case 'newest':
      return results; // Assuming results are already in creation order
    case 'relevance':
    default:
      // Simple relevance scoring based on title match
      if (!query) return results;
      
      return results.sort((a, b) => {
        const aScore = calculateRelevanceScore(a, query);
        const bScore = calculateRelevanceScore(b, query);
        return bScore - aScore;
      });
  }
}

function calculateRelevanceScore(product: SearchProduct, query: string): number {
  let score = 0;
  const queryLower = query.toLowerCase();
  const titleLower = product.title.toLowerCase();
  
  // Exact title match gets highest score
  if (titleLower === queryLower) score += 100;
  
  // Title starts with query
  if (titleLower.startsWith(queryLower)) score += 50;
  
  // Title contains query
  if (titleLower.includes(queryLower)) score += 25;
  
  // Check other fields
  if (product.category?.toLowerCase().includes(queryLower)) score += 10;
  if (product.type?.toLowerCase().includes(queryLower)) score += 10;
  if (product.description?.toLowerCase().includes(queryLower)) score += 5;
  
  return score;
}

function generateFilterOptions(results: SearchProduct[]) {
  const categories = new Set<string>();
  const metals = new Set<string>();
  const styles = new Set<string>();
  const shapes = new Set<string>();
  const gemstoneTypes = new Set<string>();
  let minPrice = Infinity;
  let maxPrice = 0;

  for (const product of results) {
    categories.add(product.category);
    
    if (product.metalOption?.color) {
      metals.add(product.metalOption.color);
    }
    if (product.metal) {
      metals.add(product.metal);
    }
    
    if (product.style) {
      product.style.forEach(s => styles.add(s));
    }
    
    if (product.shape) {
      shapes.add(product.shape);
    }
    
    if (product.type && (product.productType === 'gemstone' || product.gemstones)) {
      gemstoneTypes.add(product.type);
    }
    
    if (product.gemstones) {
      product.gemstones.forEach(g => gemstoneTypes.add(g.type));
    }
    
    minPrice = Math.min(minPrice, product.price);
    maxPrice = Math.max(maxPrice, product.price);
  }

  return {
    categories: Array.from(categories).sort(),
    metals: Array.from(metals).sort(),
    styles: Array.from(styles).sort(),
    shapes: Array.from(shapes).sort(),
    gemstoneTypes: Array.from(gemstoneTypes).sort(),
    priceRange: {
      min: minPrice === Infinity ? 0 : Math.floor(minPrice),
      max: Math.ceil(maxPrice)
    }
  };
}
