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

// A simplified function to create search terms for suggestions
function createSimpleSearchTerms(query: string): string[] {
    const terms = query.toLowerCase().split(' ').filter(Boolean);
    const expandedTerms = new Set<string>(terms);

    const synonymMap: { [key: string]: string[] } = {
        'ring': ['band', 'setting'],
        'necklace': ['pendant', 'choker'],
        'choker': ['necklace'],
    };

    terms.forEach(term => {
        if (synonymMap[term]) {
            synonymMap[term].forEach(synonym => expandedTerms.add(synonym));
        }
    });

    return Array.from(expandedTerms);
}

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');

        if (!query || query.trim().length < 2) {
            return NextResponse.json([]);
        }

        const searchTerms = createSimpleSearchTerms(query);
        const searchRegex = new RegExp(searchTerms.join('|'), 'i');
        const limit = 10;

        const suggestions = new Set<string>();

        // Helper to add suggestions and respect the limit
        const addSuggestion = (suggestion: string) => {
            if (suggestions.size < limit) {
                suggestions.add(suggestion);
            }
        };

        // Search across different models for titles, categories, styles, etc.
        const modelsToSearch = [
            { model: Setting, fields: ['title', 'category', 'style', 'type'] },
            { model: WeddingRing, fields: ['title', 'category', 'style', 'type', 'subcategory'] },
            { model: EngagementRing, fields: ['title', 'category', 'style', 'type'] },
            { model: Diamond, fields: ['shape', 'color', 'type'] },
            { model: Gemstone, fields: ['type', 'shape', 'color'] },
            { model: Bracelet, fields: ['name', 'type', 'style', 'metal'] },
            { model: Earring, fields: ['name', 'type', 'style', 'metal'] },
            { model: Necklace, fields: ['name', 'type', 'style', 'metal'] },
            { model: MensJewelry, fields: ['name', 'type', 'style', 'metal'] },
        ];

        for (const { model, fields } of modelsToSearch) {
            if (suggestions.size >= limit) break;
            if (!model) continue;

            for (const field of fields) {
                if (suggestions.size >= limit) break;
                
                try {
                    const distinctValues = await (model as any).distinct(field, { [field]: searchRegex });
                    
                    distinctValues.forEach((value: string | string[]) => {
                        if (Array.isArray(value)) {
                            value.forEach(v => addSuggestion(v));
                        } else if (typeof value === 'string') {
                            addSuggestion(value);
                        }
                    });
                } catch (error) {
                    // This can happen if a field doesn't exist on a model, which is fine.
                }
            }
        }

        return NextResponse.json(Array.from(suggestions));

    } catch (error) {
        console.error('Search suggestions API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
