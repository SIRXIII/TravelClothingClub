import React from 'react';

interface MeasurementInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  unit: string;
  min: number;
  max: number;
  step?: number;
  required?: boolean;
}

function MeasurementInput({ 
  label, 
  value, 
  onChange, 
  unit, 
  min, 
  max, 
  step = 1,
  required = false 
}: MeasurementInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="space-y-3">
        {/* Slider */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
        />
        
        {/* Number Input */}
        <div className="relative">
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full px-4 py-2 pr-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 text-sm">
            {unit}
          </span>
        </div>
        
        {/* Range Display */}
        <div className="flex justify-between text-xs text-slate-500">
          <span>{min}{unit}</span>
          <span>{max}{unit}</span>
        </div>
      </div>
    </div>
  );
}

export default MeasurementInput;