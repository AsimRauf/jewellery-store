import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/utils/db';
import EngagementRing from '@/models/EngagementRing';

export async function GET(
  request: NextRequest,
  { params }: { params: { category: string } }
) {
  try {
    await connectDB();
    const { category } = params;
    const searchParams = request.nextUrl.searchParams;
    
    // Base query
    let query: any = { isActive: true };

    // Handle initial category filter
    if (category !== 'all') {
      if (category.startsWith('metal-')) {
        const metalColor = category.replace('metal-', '').replace(/-/g, ' ');
        const formattedColor = metalColor.split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        const fullColor = formattedColor.includes('Gold') ? formattedColor : `${formattedColor} Gold`;
        query['metalOptions.color'] = fullColor;
      } else if (category.startsWith('style-')) {
        const style = category.replace('style-', '').replace(/-/g, ' ');
        const formattedStyle = style.charAt(0).toUpperCase() + style.slice(1);
        query.style = formattedStyle;
      } else {
        const type = category.charAt(0).toUpperCase() + category.slice(1);
        query.type = type;
      }
    }

    // Apply additional filters if present
    const styles = searchParams.get('styles')?.split(',');
    if (styles?.length) {
      query.style = { $in: styles };
    }

    const metals = searchParams.get('metalColors')?.split(',');
    if (metals?.length) {
      query['metalOptions.color'] = { $in: metals };
    }

    const types = searchParams.get('types')?.split(',');
    if (types?.length) {
      query.type = { $in: types };
    }

    // Get sort parameter
    const sort = searchParams.get('sort') || 'price-asc';
    let sortOptions = {};
    switch (sort) {
      case 'price-desc':
        sortOptions = { basePrice: -1 };
        break;
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      default:
        sortOptions = { basePrice: 1 };
    }

    const products = await EngagementRing.find(query)
      .select('_id title SKU basePrice metalOptions media main_stone style type')
      .sort(sortOptions)
      .lean();

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching engagement rings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch engagement rings' },
      { status: 500 }
    );
  }
}
