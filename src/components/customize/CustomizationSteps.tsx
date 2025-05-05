interface CustomizationStepsProps {
  currentStep: 1 | 2 | 3;
  startWith: 'setting' | 'diamond';
  settingComplete?: boolean;
  diamondComplete?: boolean;
}

export default function CustomizationSteps({
  currentStep,
  startWith,
  settingComplete = false,
  diamondComplete = false
}: CustomizationStepsProps) {
  // Determine the order of steps based on starting point
  const steps = startWith === 'setting' 
    ? [
        { name: 'Setting', step: 1 },
        { name: 'Diamond', step: 2 },
        { name: 'Complete Ring', step: 3 }
      ]
    : [
        { name: 'Diamond', step: 1 },
        { name: 'Setting', step: 2 },
        { name: 'Complete Ring', step: 3 }
      ];

  return (
    <div className="mb-8 bg-amber-50 p-6 rounded-lg">
      <div className="flex items-center justify-center">
        {steps.map((step, index) => (
          <div key={step.name} className="flex items-center">
            {index > 0 && (
              <div className="mx-4 border-t-2 border-amber-200 w-16" />
            )}
            <div className="flex items-center">
              <div 
                className={`
                  rounded-full h-8 w-8 flex items-center justify-center text-white font-bold
                  ${(currentStep > step.step) || 
                    (step.name === 'Setting' && settingComplete) || 
                    (step.name === 'Diamond' && diamondComplete)
                    ? 'bg-amber-500' 
                    : currentStep === step.step
                    ? 'bg-amber-500'
                    : 'bg-gray-300'
                  }
                `}
              >
                {(currentStep > step.step) || 
                 (step.name === 'Setting' && settingComplete) || 
                 (step.name === 'Diamond' && diamondComplete)
                  ? '✓'
                  : step.step
                }
              </div>
              <span className={`ml-2 font-medium ${currentStep === step.step ? 'text-amber-700' : 'text-gray-500'}`}>
                {step.step === 3 
                  ? 'Complete Ring'
                  : currentStep > step.step || 
                    (step.name === 'Setting' && settingComplete) || 
                    (step.name === 'Diamond' && diamondComplete)
                    ? `${step.name} Selected`
                    : currentStep === step.step
                    ? `Select ${step.name === 'Setting' ? 'a' : step.name === 'Diamond' ? 'a' : ''} ${step.name}`
                    : step.name
                }
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}