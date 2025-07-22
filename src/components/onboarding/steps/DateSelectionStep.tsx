import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { Calendar, ArrowRight } from 'lucide-react';
import { useOnboardingStore } from '../../../store/onboardingStore';
import "react-datepicker/dist/react-datepicker.css";

interface DateSelectionStepProps {
  onClose: () => void;
}

function DateSelectionStep({ onClose }: DateSelectionStepProps) {
  const { startDate, endDate, setDates, nextStep } = useOnboardingStore();
  const [localStartDate, setLocalStartDate] = useState<Date | null>(startDate);
  const [localEndDate, setLocalEndDate] = useState<Date | null>(endDate);
  const [error, setError] = useState<string | null>(null);

  const handleContinue = () => {
    if (!localStartDate || !localEndDate) {
      setError('Please select both start and end dates');
      return;
    }

    if (localEndDate <= localStartDate) {
      setError('End date must be after start date');
      return;
    }

    if (localStartDate < new Date()) {
      setError('Start date cannot be in the past');
      return;
    }

    setDates(localStartDate, localEndDate);
    nextStep();
  };

  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-2xl font-semibold text-slate-900 mb-2">
            When do you need your outfits?
          </h3>
          <p className="text-slate-600">
            Select your travel dates to see available clothing options
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Start Date (Pick-up)
            </label>
            <DatePicker
              selected={localStartDate}
              onChange={(date) => {
                setLocalStartDate(date);
                setError(null);
              }}
              minDate={minDate}
              maxDate={maxDate}
              placeholderText="Select start date"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              dateFormat="MMMM d, yyyy"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              End Date (Return)
            </label>
            <DatePicker
              selected={localEndDate}
              onChange={(date) => {
                setLocalEndDate(date);
                setError(null);
              }}
              minDate={localStartDate || minDate}
              maxDate={maxDate}
              placeholderText="Select end date"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              dateFormat="MMMM d, yyyy"
            />
          </div>
        </div>

        {localStartDate && localEndDate && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800">
              <strong>Trip Duration:</strong> {Math.ceil((localEndDate.getTime() - localStartDate.getTime()) / (1000 * 60 * 60 * 24))} days
            </p>
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={handleContinue}
            disabled={!localStartDate || !localEndDate}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition flex items-center gap-2"
          >
            Continue
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default DateSelectionStep;