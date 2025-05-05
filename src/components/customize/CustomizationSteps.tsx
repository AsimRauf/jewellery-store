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
    <div className="mb-6 bg-amber-50 px-3 py-4 md:p-6 rounded-lg">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between max-w-3xl mx-auto">
        {steps.map((step, index) => (
          <div key={step.name} className="flex flex-col md:flex-row items-center w-full md:flex-1">
            <div className="flex items-center w-full md:w-auto justify-start">
              <div 
                className={`
                  rounded-full h-7 w-7 md:h-8 md:w-8 flex-shrink-0 flex items-center justify-center text-white font-bold text-sm md:text-base
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
              
              <span className={`ml-3 font-medium text-sm md:text-base flex-shrink-0 ${currentStep === step.step ? 'text-amber-700' : 'text-gray-500'}`}>
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

            {index < steps.length - 1 && (
              <>
                <div className="md:hidden h-6 w-0.5 bg-amber-200 my-1 mx-auto" />
                <div className="hidden md:block flex-grow mx-4 border-t-2 border-amber-200 min-w-[2rem]" />
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}