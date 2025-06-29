import React from 'react';

interface CustomizationStepsProps {
  currentStep: number;
  startWith: 'setting' | 'diamond' | 'gemstone';
  settingComplete?: boolean;
  diamondComplete?: boolean;
  gemstoneComplete?: boolean;
}

const CustomizationSteps: React.FC<CustomizationStepsProps> = ({
  currentStep,
  startWith,
  settingComplete = false,
  diamondComplete = false,
  gemstoneComplete = false
}) => {
  const getStepStatus = (step: number) => {
    if (step < currentStep) return 'completed';
    if (step === currentStep) return 'current';
    return 'upcoming';
  };

  const getStepIcon = (step: number, status: string) => {
    if (status === 'completed') {
      return '✓';
    }
    return step.toString();
  };

  const getStepLabel = (step: number) => {
    if (startWith === 'setting') {
      switch (step) {
        case 1: return 'Select Setting';
        case 2: return diamondComplete ? 'Diamond Selected' : gemstoneComplete ? 'Gemstone Selected' : 'Select Stone';
        case 3: return 'Complete Ring';
        default: return '';
      }
    } else if (startWith === 'diamond') {
      switch (step) {
        case 1: return 'Select Diamond';
        case 2: return settingComplete ? 'Setting Selected' : 'Select Setting';
        case 3: return 'Complete Ring';
        default: return '';
      }
    } else if (startWith === 'gemstone') {
      switch (step) {
        case 1: return 'Select Gemstone';
        case 2: return settingComplete ? 'Setting Selected' : 'Select Setting';
        case 3: return 'Complete Ring';
        default: return '';
      }
    }
    return '';
  };

  return (
    <div className="mb-4 sm:mb-8 bg-amber-50 p-3 sm:p-6 rounded-lg">
      {/* Mobile: Vertical layout */}
      <div className="flex flex-col sm:hidden">
        {[1, 2, 3].map((step, index) => {
          const status = getStepStatus(step);
          const isLast = index === 2;
          
          return (
            <div key={step} className="relative">
              <div className="flex items-center py-2">
                <div className={`rounded-full h-8 w-8 flex-shrink-0 flex items-center justify-center text-white font-bold text-sm z-10 ${
                  status === 'completed' ? 'bg-amber-500' :
                  status === 'current' ? 'bg-amber-500' :
                  'bg-gray-300'
                }`}>
                  {getStepIcon(step, status)}
                </div>
                <span className={`ml-3 font-medium text-sm ${
                  status === 'completed' || status === 'current' ? 'text-amber-700' : 'text-gray-500'
                }`}>
                  {getStepLabel(step)}
                </span>
              </div>
              {!isLast && (
                <div className={`absolute left-4 top-10 w-0.5 h-6 -mt-2 ${
                  status === 'completed' ? 'bg-amber-200' : 'bg-gray-200'
                }`}></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Desktop/Tablet: Horizontal layout */}
      <div className="hidden sm:flex items-center justify-center">
        {[1, 2, 3].map((step, index) => {
          const status = getStepStatus(step);
          const isLast = index === 2;
          
          return (
            <div key={step} className="flex items-center">
              <div className="flex items-center">
                <div className={`rounded-full h-8 w-8 md:h-10 md:w-10 flex items-center justify-center text-white font-bold text-sm md:text-base ${
                  status === 'completed' ? 'bg-amber-500' :
                  status === 'current' ? 'bg-amber-500' :
                  'bg-gray-300'
                }`}>
                  {getStepIcon(step, status)}
                </div>
                <span className={`ml-2 md:ml-3 font-medium text-sm md:text-base ${
                  status === 'completed' || status === 'current' ? 'text-amber-700' : 'text-gray-500'
                }`}>
                  {getStepLabel(step)}
                </span>
              </div>
              {!isLast && (
                <div className={`mx-2 sm:mx-4 border-t-2 w-8 sm:w-16 ${
                  status === 'completed' ? 'border-amber-200' : 'border-gray-200'
                }`}></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CustomizationSteps;