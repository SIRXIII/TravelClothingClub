import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useOnboardingStore } from '../../store/onboardingStore';
import DateSelectionStep from './steps/DateSelectionStep';
import AuthenticationStep from './steps/AuthenticationStep';
import ProfileSetupStep from './steps/ProfileSetupStep';
import AdditionalUsersStep from './steps/AdditionalUsersStep';
import SummaryStep from './steps/SummaryStep';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const steps = [
  { id: 0, title: 'Select Dates', component: DateSelectionStep },
  { id: 1, title: 'Create Account', component: AuthenticationStep },
  { id: 2, title: 'Your Profile', component: ProfileSetupStep },
  { id: 3, title: 'Additional Users', component: AdditionalUsersStep },
  { id: 4, title: 'Summary', component: SummaryStep },
];

function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const { currentStep, reset } = useOnboardingStore();

  if (!isOpen) return null;

  const handleClose = () => {
    reset();
    onClose();
  };

  const CurrentStepComponent = steps[currentStep]?.component || DateSelectionStep;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-slate-50">
          <div className="flex items-center gap-4">
            <img 
              src="/TCC Cursive.png"
              alt="Travel Clothing Club"
              className="w-8 h-8 object-contain"
            />
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Get Started</h2>
              <p className="text-slate-600">{steps[currentStep]?.title}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-slate-200">
          <div 
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Step Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <CurrentStepComponent onClose={handleClose} />
        </div>
      </div>
    </div>
  );
}

export default OnboardingModal;