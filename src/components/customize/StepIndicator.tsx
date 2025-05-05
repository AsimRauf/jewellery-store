'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface StepIndicatorProps {
  currentStep: 'setting' | 'diamond';
  startWith: 'setting' | 'diamond';
  category?: string;
  selectedItemId?: string;
}

export default function StepIndicator({ currentStep, startWith, category, selectedItemId }: StepIndicatorProps) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  // Determine the steps based on the starting point
  const steps = startWith === 'setting' 
    ? ['Select Setting', 'Select Diamond', 'Complete Ring'] 
    : ['Select Diamond', 'Select Setting', 'Complete Ring'];
  
  // Determine current step number (0-based index)
  const currentStepIndex = currentStep === startWith ? 0 : 1;
  
  // Generate URLs for each step
  const getStepUrl = (stepIndex: number) => {
    if (!selectedItemId) {
      // If no item is selected yet, just return the current category page
      if (stepIndex === 0) {
        return startWith === 'setting' 
          ? `/settings/${category || 'all'}?start=${startWith}` 
          : `/diamond/${category || 'all'}?start=${startWith}`;
      }
      return '#'; // Disabled link if no selection yet
    }

    // If an item is selected, generate the appropriate URL
    if (stepIndex === 0) {
      // First step URL (return to current selection)
      return startWith === 'setting' 
        ? `/settings/${category || 'all'}?start=${startWith}` 
        : `/diamond/${category || 'all'}?start=${startWith}`;
    } else if (stepIndex === 1) {
      // Second step URL (go to the other component selection)
      return startWith === 'setting'
        ? `/diamond/all?start=${startWith}&settingId=${selectedItemId}`
        : `/settings/all?start=${startWith}&diamondId=${selectedItemId}`;
    } else {
      // Final step URL (complete the ring)
      return startWith === 'setting'
        ? `/customize/complete?start=${startWith}&settingId=${selectedItemId}&diamondId=select`
        : `/customize/complete?start=${startWith}&diamondId=${selectedItemId}&settingId=select`;
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-4 mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div className="flex items-center w-full">
              {/* Step circle */}
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm
                  ${index < currentStepIndex + 1 
                    ? 'bg-amber-500 text-white' 
                    : 'bg-gray-200 text-gray-500'}`}
              >
                {index + 1}
              </div>
              
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div 
                  className={`h-1 flex-1 mx-2
                    ${index < currentStepIndex ? 'bg-amber-500' : 'bg-gray-200'}`}
                />
              )}
            </div>
            
            {/* Step label */}
            <span 
              className={`mt-2 text-sm font-medium
                ${index <= currentStepIndex ? 'text-gray-900' : 'text-gray-500'}`}
            >
              {step}
            </span>
            
            {/* Navigation link */}
            {index !== currentStepIndex && (
              <Link 
                href={getStepUrl(index)}
                className={`mt-1 text-xs ${index < currentStepIndex 
                  ? 'text-amber-500 hover:text-amber-600' 
                  : index === currentStepIndex + 1 
                    ? 'text-blue-500 hover:text-blue-600' 
                    : 'text-gray-400 pointer-events-none'}`}
                onClick={(e) => {
                  // Disable navigation to future steps if current step not completed
                  if (index > currentStepIndex + 1 || (index === currentStepIndex + 1 && !selectedItemId)) {
                    e.preventDefault();
                  }
                }}
              >
                {index < currentStepIndex 
                  ? 'Change' 
                  : index === currentStepIndex + 1 && selectedItemId 
                    ? 'Continue' 
                    : 'Not available yet'}
              </Link>
            )}
          </div>
        ))}
      </div>
      
      {/* Current selection info */}
      {selectedItemId && (
        <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-600">
          {startWith === 'setting' && currentStepIndex === 0 && (
            <p>Setting selected: ID {selectedItemId.substring(0, 8)}... <button className="text-red-500 hover:text-red-700" onClick={() => router.push(`/settings/${category || 'all'}?start=${startWith}`)}>Clear</button></p>
          )}
          {startWith === 'diamond' && currentStepIndex === 0 && (
            <p>Diamond selected: ID {selectedItemId.substring(0, 8)}... <button className="text-red-500 hover:text-red-700" onClick={() => router.push(`/diamond/${category || 'all'}?start=${startWith}`)}>Clear</button></p>
          )}
        </div>
      )}
    </div>
  );
}