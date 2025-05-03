import { useState } from 'react';

interface FilterBarProps {
  filters: {
    shapes: string[];
    colors: string[];
    fancyColors: string[];
    clarities: string[];
    cuts: string[];
    caratRange: [number, number] | null;
    priceRange: [number, number] | null;
    types: string[];
    polish: string[];
    symmetry: string[];
    fluorescence: string[];
  };
  availableFilters: {
    shapes: string[];
    colors: string[];
    fancyColors: string[];
    clarities: string[];
    cuts: string[];
    caratRanges: Array<[number, number]>;
    priceRanges: Array<[number, number]>;
    types: string[];
    polish: string[];
    symmetry: string[];
    fluorescence: string[];
  };
  activeFilterSection: string | null;
  toggleFilterSection: (section: string) => void;
  toggleShape: (shape: string) => void;
  toggleColor: (color: string) => void;
  toggleFancyColor: (color: string) => void;
  toggleClarity: (clarity: string) => void;
  toggleCut: (cut: string) => void;
  toggleType: (type: string) => void;
  togglePolish: (polish: string) => void;
  toggleSymmetry: (symmetry: string) => void;
  toggleFluorescence: (fluorescence: string) => void;
  setCaratRange: (range: [number, number] | null) => void;
  setPriceRange: (range: [number, number] | null) => void;
  clearAllFilters: () => void;
  applyFilters: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  availableFilters,
  activeFilterSection,
  toggleFilterSection,
  toggleShape,
  toggleColor,
  toggleFancyColor,
  toggleClarity,
  toggleCut,
  toggleType,
  togglePolish,
  toggleSymmetry,
  toggleFluorescence,
  setCaratRange,
  setPriceRange,
  clearAllFilters,
  applyFilters
}) => {
  // Count total active filters
  const activeFilterCount = 
    filters.shapes.length + 
    filters.colors.length + 
    filters.fancyColors.length +
    filters.clarities.length + 
    filters.cuts.length + 
    filters.types.length + 
    filters.polish.length + 
    filters.symmetry.length + 
    filters.fluorescence.length + 
    (filters.caratRange ? 1 : 0) + 
    (filters.priceRange ? 1 : 0);

  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200">
      {/* Filter Sections Tabs */}
      <div className="flex flex-wrap gap-2 p-4 border-b border-gray-200">
        <button 
          onClick={() => toggleFilterSection('shape')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeFilterSection === 'shape' 
              ? 'bg-amber-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          } ${filters.shapes.length > 0 ? 'ring-2 ring-amber-300' : ''}`}
        >
          Shape {filters.shapes.length > 0 && `(${filters.shapes.length})`}
        </button>
        
        <button 
          onClick={() => toggleFilterSection('carat')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeFilterSection === 'carat' 
              ? 'bg-amber-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          } ${filters.caratRange ? 'ring-2 ring-amber-300' : ''}`}
        >
          Carat {filters.caratRange && '(1)'}
        </button>
        
        <button 
          onClick={() => toggleFilterSection('color')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeFilterSection === 'color' 
              ? 'bg-amber-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          } ${(filters.colors.length > 0 || filters.fancyColors.length > 0) ? 'ring-2 ring-amber-300' : ''}`}
        >
          Color {(filters.colors.length + filters.fancyColors.length) > 0 && 
            `(${filters.colors.length + filters.fancyColors.length})`}
        </button>
        
        <button 
          onClick={() => toggleFilterSection('clarity')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeFilterSection === 'clarity' 
              ? 'bg-amber-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          } ${filters.clarities.length > 0 ? 'ring-2 ring-amber-300' : ''}`}
        >
          Clarity {filters.clarities.length > 0 && `(${filters.clarities.length})`}
        </button>
        
        <button 
          onClick={() => toggleFilterSection('cut')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeFilterSection === 'cut' 
              ? 'bg-amber-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          } ${filters.cuts.length > 0 ? 'ring-2 ring-amber-300' : ''}`}
        >
          Cut {filters.cuts.length > 0 && `(${filters.cuts.length})`}
        </button>
        
        <button 
          onClick={() => toggleFilterSection('price')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeFilterSection === 'price' 
              ? 'bg-amber-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          } ${filters.priceRange ? 'ring-2 ring-amber-300' : ''}`}
        >
          Price {filters.priceRange && '(1)'}
        </button>
        
        <button 
          onClick={() => toggleFilterSection('type')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeFilterSection === 'type' 
              ? 'bg-amber-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          } ${filters.types.length > 0 ? 'ring-2 ring-amber-300' : ''}`}
        >
          Type {filters.types.length > 0 && `(${filters.types.length})`}
        </button>
        
        <button 
          onClick={() => toggleFilterSection('advanced')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeFilterSection === 'advanced' 
              ? 'bg-amber-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          } ${(filters.polish.length + filters.symmetry.length + filters.fluorescence.length) > 0 ? 'ring-2 ring-amber-300' : ''}`}
        >
          Advanced {(filters.polish.length + filters.symmetry.length + filters.fluorescence.length) > 0 && 
            `(${filters.polish.length + filters.symmetry.length + filters.fluorescence.length})`}
        </button>
      </div>
      
      {/* Filter Content */}
      {activeFilterSection && (
        <div className="p-5 bg-gray-50 rounded-b-lg">
          {activeFilterSection === 'shape' && (
            <div>
              <h3 className="font-medium text-gray-800 mb-3">Diamond Shape</h3>
              <div className="grid grid-cols-5 gap-3">
                {availableFilters.shapes.map((shape) => (
                  <button
                    key={shape}
                    onClick={() => toggleShape(shape)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium flex flex-col items-center justify-center transition-all ${
                      filters.shapes.includes(shape)
                        ? 'bg-amber-500 text-white shadow-md transform scale-105'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-amber-300 hover:shadow'
                    }`}
                  >
                    <div className="mb-2">
                      {/* Simple shape icons - you can replace with actual SVG icons */}
                      {shape === 'Round' && <div className="w-8 h-8 rounded-full border-2 border-current mx-auto"></div>}
                      {shape === 'Princess' && <div className="w-8 h-8 rotate-45 border-2 border-current mx-auto"></div>}
                      {shape === 'Cushion' && <div className="w-8 h-8 rounded-lg border-2 border-current mx-auto"></div>}
                      {shape === 'Emerald' && <div className="w-8 h-8 rounded-sm border-2 border-current mx-auto"></div>}
                      {shape === 'Oval' && <div className="w-8 h-8 rounded-full border-2 border-current mx-auto" style={{width: '24px', height: '32px'}}></div>}
                      {shape === 'Radiant' && <div className="w-8 h-8 border-2 border-current mx-auto" style={{clipPath: 'polygon(10% 0%, 90% 0%, 100% 20%, 100% 80%, 90% 100%, 10% 100%, 0% 80%, 0% 20%)'}}></div>}
                      {shape === 'Pear' && <div className="w-8 h-8 border-2 border-current mx-auto" style={{clipPath: 'ellipse(50% 50% at 50% 50%)', borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%'}}></div>}
                      {shape === 'Heart' && <div className="w-8 h-8 border-2 border-current mx-auto" style={{clipPath: 'path("M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z")'}}></div>}
                      {shape === 'Marquise' && <div className="w-8 h-8 border-2 border-current mx-auto" style={{borderRadius: '50% / 50%'}}></div>}
                      {shape === 'Asscher' && <div className="w-8 h-8 border-2 border-current mx-auto" style={{clipPath: 'polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%)'}}></div>}
                    </div>
                    {shape}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {activeFilterSection === 'carat' && (
            <div>
              <h3 className="font-medium text-gray-800 mb-3">Carat Weight</h3>
              <div className="grid grid-cols-4 gap-3 mb-6">
                {availableFilters.caratRanges.map((range, index) => (
                  <button
                    key={index}
                    onClick={() => setCaratRange(filters.caratRange && 
                      filters.caratRange[0] === range[0] && filters.caratRange[1] === range[1] 
                        ? null 
                        : range
                    )}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      filters.caratRange && 
                      filters.caratRange[0] === range[0] && 
                      filters.caratRange[1] === range[1]
                        ? 'bg-amber-500 text-white shadow-md'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-amber-300 hover:shadow'
                    }`}
                  >
                    {range[0]} - {range[1]} ct
                  </button>
                ))}
              </div>
              
              {/* Custom carat range input */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Custom Carat Range</h4>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">Min Carat</label>
                    <input 
                      type="number" 
                      placeholder="Min" 
                      min="0.1" 
                      step="0.1"
                      value={filters.caratRange ? filters.caratRange[0] : ''}
                      onChange={(e) => {
                        const min = parseFloat(e.target.value);
                        const max = filters.caratRange ? filters.caratRange[1] : 10;
                        if (!isNaN(min)) {
                          setCaratRange([min, max]);
                        }
                      }}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  <span className="text-gray-400">to</span>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">Max Carat</label>
                    <input 
                      type="number" 
                      placeholder="Max" 
                      min="0.1" 
                      step="0.1"
                      value={filters.caratRange ? filters.caratRange[1] : ''}
                      onChange={(e) => {
                        const max = parseFloat(e.target.value);
                        const min = filters.caratRange ? filters.caratRange[0] : 0.1;
                        if (!isNaN(max)) {
                          setCaratRange([min, max]);
                        }
                      }}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  <button
                    onClick={() => setCaratRange(null)}
                    className="px-3 py-2 text-amber-500 hover:text-amber-600 text-sm font-medium"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeFilterSection === 'color' && (
            <div>
              <div className="mb-6">
                <h3 className="font-medium text-gray-800 mb-3">Diamond Color</h3>
                <div className="grid grid-cols-5 gap-3">
                  {availableFilters.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => toggleColor(color)}
                      className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                        filters.colors.includes(color)
                          ? 'bg-amber-500 text-white shadow-md'
                          : 'bg-white text-gray-700 border border-gray-200 hover:border-amber-300 hover:shadow'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-800 mb-3">Fancy Colors</h3>
                <div className="grid grid-cols-4 gap-3">
                  {availableFilters.fancyColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => toggleFancyColor(color)}
                      className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                        filters.fancyColors.includes(color)
                          ? 'bg-amber-500 text-white shadow-md'
                          : 'bg-white text-gray-700 border border-gray-200 hover:border-amber-300 hover:shadow'
                      }`}
                      style={{
                        backgroundColor: filters.fancyColors.includes(color) ? '' : 
                          color.toLowerCase() === 'yellow' ? '#FEF9C3' :
                          color.toLowerCase() === 'pink' ? '#FCE7F3' :
                          color.toLowerCase() === 'blue' ? '#DBEAFE' :
                          color.toLowerCase() === 'green' ? '#DCFCE7' :
                          color.toLowerCase() === 'brown' ? '#F7E9D7' :
                          color.toLowerCase() === 'orange' ? '#FFEDD5' :
                          color.toLowerCase() === 'purple' ? '#F3E8FF' :
                          color.toLowerCase() === 'black' ? '#F3F4F6' : '',
                        color: filters.fancyColors.includes(color) ? '' :
                          color.toLowerCase() === 'black' ? '#111827' : '#4B5563'
                      }}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {activeFilterSection === 'clarity' && (
            <div>
              <h3 className="font-medium text-gray-800 mb-3">Diamond Clarity</h3>
              <div className="grid grid-cols-4 gap-3">
                {availableFilters.clarities.map((clarity) => (
                  <button
                    key={clarity}
                    onClick={() => toggleClarity(clarity)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      filters.clarities.includes(clarity)
                        ? 'bg-amber-500 text-white shadow-md'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-amber-300 hover:shadow'
                    }`}
                  >
                    {clarity}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {activeFilterSection === 'cut' && (
            <div>
              <h3 className="font-medium text-gray-800 mb-3">Diamond Cut</h3>
              <div className="grid grid-cols-3 gap-3">
                {availableFilters.cuts.map((cut) => (
                  <button
                    key={cut}
                    onClick={() => toggleCut(cut)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      filters.cuts.includes(cut)
                        ? 'bg-amber-500 text-white shadow-md'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-amber-300 hover:shadow'
                    }`}
                  >
                    {cut}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {activeFilterSection === 'price' && (
            <div>
              <h3 className="font-medium text-gray-800 mb-3">Price Range</h3>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {availableFilters.priceRanges.map((range, index) => (
                  <button
                    key={index}
                    onClick={() => setPriceRange(filters.priceRange && 
                      filters.priceRange[0] === range[0] && filters.priceRange[1] === range[1] 
                        ? null 
                        : range
                    )}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      filters.priceRange && 
                      filters.priceRange[0] === range[0] && 
                      filters.priceRange[1] === range[1]
                        ? 'bg-amber-500 text-white shadow-md'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-amber-300 hover:shadow'
                    }`}
                  >
                    ${range[0].toLocaleString()} - ${range[1].toLocaleString()}
                  </button>
                ))}
              </div>
              
              {/* Custom price range input */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Custom Price Range</h4>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">Min Price ($)</label>
                    <input 
                      type="number" 
                      placeholder="Min" 
                      min="0" 
                      step="100"
                      value={filters.priceRange ? filters.priceRange[0] : ''}
                      onChange={(e) => {
                        const min = parseInt(e.target.value);
                        const max = filters.priceRange ? filters.priceRange[1] : 100000;
                        if (!isNaN(min)) {
                          setPriceRange([min, max]);
                        }
                      }}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  <span className="text-gray-400">to</span>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">Max Price ($)</label>
                    <input 
                      type="number" 
                      placeholder="Max" 
                      min="0" 
                      step="100"
                      value={filters.priceRange ? filters.priceRange[1] : ''}
                      onChange={(e) => {
                        const max = parseInt(e.target.value);
                        const min = filters.priceRange ? filters.priceRange[0] : 0;
                        if (!isNaN(max)) {
                          setPriceRange([min, max]);
                        }
                      }}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  <button
                    onClick={() => setPriceRange(null)}
                    className="px-3 py-2 text-amber-500 hover:text-amber-600 text-sm font-medium"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeFilterSection === 'type' && (
            <div>
              <h3 className="font-medium text-gray-800 mb-3">Diamond Type</h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => toggleType('natural')}
                  className={`p-4 rounded-lg text-sm font-medium transition-all flex flex-col items-center ${
                    filters.types.includes('natural')
                      ? 'bg-amber-500 text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-amber-300 hover:shadow'
                  }`}
                >
                  <div className="w-12 h-12 mb-2 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
                      <path d="M11.584 2.376a.75.75 0 01.832 0l9 6a.75.75 0 11-.832 1.248L12 3.901 3.416 9.624a.75.75 0 01-.832-1.248l9-6z" />
                      <path fillRule="evenodd" d="M20.25 10.332v9.918H21a.75.75 0 010 1.5H3a.75.75 0 010-1.5h.75v-9.918a.75.75 0 01.634-.74A49.109 49.109 0 0112 9c2.59 0 5.134.202 7.616.592a.75.75 0 01.634.74zm-7.5 2.418a.75.75 0 00-1.5 0v6.75a.75.75 0 001.5 0v-6.75zm3-.75a.75.75 0 01.75.75v6.75a.75.75 0 01-1.5 0v-6.75a.75.75 0 01.75-.75zM9 12.75a.75.75 0 00-1.5 0v6.75a.75.75 0 001.5 0v-6.75z" clipRule="evenodd" />
                      <path d="M12 7.875a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z" />
                    </svg>
                  </div>
                  Natural Diamond
                </button>
                <button
                  onClick={() => toggleType('lab')}
                  className={`p-4 rounded-lg text-sm font-medium transition-all flex flex-col items-center ${
                    filters.types.includes('lab')
                      ? 'bg-amber-500 text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-amber-300 hover:shadow'
                  }`}
                >
                  <div className="w-12 h-12 mb-2 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
                      <path fillRule="evenodd" d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 01.75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 019.75 22.5a.75.75 0 01-.75-.75v-4.131A15.838 15.838 0 016.382 15H2.25a.75.75 0 01-.75-.75 6.75 6.75 0 017.815-6.666zM15 6.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" clipRule="evenodd" />
                      <path d="M5.26 17.242a.75.75 0 10-.897-1.203 5.243 5.243 0 00-2.05 5.022.75.75 0 00.625.627 5.243 5.243 0 005.022-2.051.75.75 0 10-1.202-.897 3.744 3.744 0 01-3.008 1.51c0-1.23.592-2.323 1.51-3.008z" />
                    </svg>
                  </div>
                  Lab Grown Diamond
                </button>
              </div>
            </div>
          )}
          
          {activeFilterSection === 'advanced' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-medium text-gray-800 mb-3">Polish</h3>
                <div className="space-y-2 bg-white p-3 rounded-lg border border-gray-200">
                  {availableFilters.polish.map((polish) => (
                    <div key={polish} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`polish-${polish}`}
                        checked={filters.polish.includes(polish)}
                        onChange={() => togglePolish(polish)}
                        className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`polish-${polish}`} className="ml-2 text-sm text-gray-700">
                        {polish}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-3">Symmetry</h3>
                <div className="space-y-2 bg-white p-3 rounded-lg border border-gray-200">
                  {availableFilters.symmetry.map((symmetry) => (
                    <div key={symmetry} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`symmetry-${symmetry}`}
                        checked={filters.symmetry.includes(symmetry)}
                        onChange={() => toggleSymmetry(symmetry)}
                        className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`symmetry-${symmetry}`} className="ml-2 text-sm text-gray-700">
                        {symmetry}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-800 mb-3">Fluorescence</h3>
                <div className="space-y-2 bg-white p-3 rounded-lg border border-gray-200">
                  {availableFilters.fluorescence.map((fluorescence) => (
                    <div key={fluorescence} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`fluorescence-${fluorescence}`}
                        checked={filters.fluorescence.includes(fluorescence)}
                        onChange={() => toggleFluorescence(fluorescence)}
                        className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`fluorescence-${fluorescence}`} className="ml-2 text-sm text-gray-700">
                        {fluorescence}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Filter Actions */}
      {activeFilterCount > 0 && (
        <div className="flex justify-between items-center p-4 border-t border-gray-200 bg-white rounded-b-lg">
          <button
            onClick={clearAllFilters}
            className="text-amber-500 hover:text-amber-600 font-medium text-sm flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear All Filters ({activeFilterCount})
          </button>
          <button
            onClick={applyFilters}
            className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors shadow-sm font-medium text-sm flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Apply Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterBar;

