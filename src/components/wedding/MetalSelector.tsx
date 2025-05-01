import Image from 'next/image';

interface MetalOption {
  karat: string;
  color: string;
  price: number;
  finish_type?: string | null;
  isDefault?: boolean;
}

interface MetalSelectorProps {
  options: MetalOption[];
  selectedMetal: MetalOption | null;
  onChange: (metal: MetalOption) => void;
}

// Metal color to image/icon mapping
const METAL_ICONS: Record<string, string> = {
  'Yellow Gold': '/icons/metals/yellow.webp',
  'White Gold': '/icons/metals/white.webp',
  'Rose Gold': '/icons/metals/rose.webp',
  'Two Tone Gold': '/icons/metals/two-tone.webp'
};

export default function MetalSelector({ options, selectedMetal, onChange }: MetalSelectorProps) {
  // Group options by color
  const groupedOptions: Record<string, MetalOption[]> = {};
  
  options.forEach(option => {
    if (!groupedOptions[option.color]) {
      groupedOptions[option.color] = [];
    }
    groupedOptions[option.color].push(option);
  });
  
  return (
    <div className="space-y-6">
      {/* Color selection first */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Select Metal Color</h3>
        <div className="flex flex-wrap gap-3">
          {Object.keys(groupedOptions).map((color) => (
            <button
              key={color}
              onClick={() => {
                // Find default option for this color or first one
                const colorOptions = groupedOptions[color];
                const defaultOption = colorOptions.find(opt => opt.isDefault) || colorOptions[0];
                onChange(defaultOption);
              }}
              className={`
                relative flex flex-col items-center p-2 rounded-lg transition-all
                ${selectedMetal?.color === color 
                  ? 'ring-2 ring-amber-500 scale-105 bg-amber-50' 
                  : 'ring-1 ring-gray-200 hover:ring-amber-300 hover:bg-amber-50/50'
                }
              `}
            >
              <div className="w-12 h-12 rounded-full overflow-hidden mb-1 border border-gray-200">
                <Image 
                  src={METAL_ICONS[color] || '/icons/metals/yellow.webp'} 
                  alt={color}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xs font-medium text-center mt-1">{color}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Karat options for selected color */}
      {selectedMetal && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Select Karat</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap gap-3">
            {groupedOptions[selectedMetal.color].map((option) => (
              <button
                key={`${option.karat}-${option.color}`}
                onClick={() => onChange(option)}
                className={`
                  py-3 px-4 rounded-lg text-sm font-medium transition-colors relative
                  ${selectedMetal?.karat === option.karat && selectedMetal?.color === option.color
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'bg-white border border-gray-300 text-gray-700 hover:border-amber-500 hover:bg-amber-50'
                  }
                `}
              >
                <div className="flex flex-col items-center">
                  <span className="text-base font-semibold">{option.karat}</span>
                  {option.finish_type && (
                    <span className="text-xs mt-1 opacity-80">{option.finish_type}</span>
                  )}
                  <span className="mt-2 font-medium">
                    ${option.price.toLocaleString()}
                  </span>
                </div>
                
                {/* Selected indicator */}
                {selectedMetal?.karat === option.karat && selectedMetal?.color === option.color && (
                  <div className="absolute -top-1 -right-1 bg-amber-500 rounded-full w-5 h-5 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Selected metal summary */}
      {selectedMetal && (
        <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-100">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full overflow-hidden mr-3 border border-amber-200">
              <Image 
                src={METAL_ICONS[selectedMetal.color] || '/icons/metals/yellow.webp'} 
                alt={selectedMetal.color}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-medium text-amber-800">
                {selectedMetal.karat} {selectedMetal.color}
                {selectedMetal.finish_type && ` - ${selectedMetal.finish_type}`}
              </p>
              <p className="text-amber-600 font-semibold">${selectedMetal.price.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}