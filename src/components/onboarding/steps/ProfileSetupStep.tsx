import React, { useState } from 'react';
import { User, ArrowRight } from 'lucide-react';
import { useOnboardingStore, UserMeasurements } from '../../../store/onboardingStore';
import MeasurementInput from '../MeasurementInput';
import BodyVisualization from '../BodyVisualization';

interface ProfileSetupStepProps {
  onClose: () => void;
}

function ProfileSetupStep({ onClose }: ProfileSetupStepProps) {
  const { addUser, nextStep } = useOnboardingStore();
  const [profile, setProfile] = useState<Partial<UserMeasurements>>({
    id: crypto.randomUUID(),
    name: 'Primary User',
    gender: 'Female',
    height: 170,
    weight: 70,
    chest: 90,
    waist: 75,
    hips: 95,
    inseam: 75,
    sleeveLength: 60,
    shoeSize: 8,
  });

  const handleContinue = () => {
    if (profile.gender && profile.height && profile.weight) {
      addUser(profile as UserMeasurements);
      nextStep();
    }
  };

  const updateMeasurement = (field: keyof UserMeasurements, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const isValid = profile.gender && profile.height && profile.weight && 
                 profile.chest && profile.waist && profile.hips;

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-2xl font-semibold text-slate-900 mb-2">
            Tell us about yourself
          </h3>
          <p className="text-slate-600">
            Your measurements help us find the perfect fit for your travel wardrobe
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Side - Form */}
          <div className="space-y-6">
            {/* Gender Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Gender *
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['Female', 'Male', 'Other'].map((gender) => (
                  <button
                    key={gender}
                    onClick={() => updateMeasurement('gender', gender as any)}
                    className={`p-3 rounded-lg border-2 transition ${
                      profile.gender === gender
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {gender}
                  </button>
                ))}
              </div>
            </div>

            {/* Basic Measurements */}
            <div className="grid grid-cols-2 gap-4">
              <MeasurementInput
                label="Height *"
                value={profile.height || 0}
                onChange={(value) => updateMeasurement('height', value)}
                unit="cm"
                min={120}
                max={220}
                required
              />
              <MeasurementInput
                label="Weight *"
                value={profile.weight || 0}
                onChange={(value) => updateMeasurement('weight', value)}
                unit="kg"
                min={30}
                max={200}
                required
              />
            </div>

            {/* Body Measurements */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-slate-900">Body Measurements</h4>
              <div className="grid grid-cols-2 gap-4">
                <MeasurementInput
                  label="Chest/Bust *"
                  value={profile.chest || 0}
                  onChange={(value) => updateMeasurement('chest', value)}
                  unit="cm"
                  min={60}
                  max={150}
                  required
                />
                <MeasurementInput
                  label="Waist *"
                  value={profile.waist || 0}
                  onChange={(value) => updateMeasurement('waist', value)}
                  unit="cm"
                  min={50}
                  max={130}
                  required
                />
                <MeasurementInput
                  label="Hips *"
                  value={profile.hips || 0}
                  onChange={(value) => updateMeasurement('hips', value)}
                  unit="cm"
                  min={60}
                  max={150}
                  required
                />
                <MeasurementInput
                  label="Inseam"
                  value={profile.inseam || 0}
                  onChange={(value) => updateMeasurement('inseam', value)}
                  unit="cm"
                  min={50}
                  max={100}
                />
              </div>
            </div>

            {/* Additional Measurements */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-slate-900">Additional Measurements</h4>
              <div className="grid grid-cols-2 gap-4">
                <MeasurementInput
                  label="Sleeve Length"
                  value={profile.sleeveLength || 0}
                  onChange={(value) => updateMeasurement('sleeveLength', value)}
                  unit="cm"
                  min={40}
                  max={80}
                />
                <MeasurementInput
                  label="Shoe Size"
                  value={profile.shoeSize || 0}
                  onChange={(value) => updateMeasurement('shoeSize', value)}
                  unit="US"
                  min={4}
                  max={15}
                  step={0.5}
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm">
                <strong>Tip:</strong> Accurate measurements ensure the best fit. 
                Use a measuring tape and have someone help you for the most precise results.
              </p>
            </div>
          </div>

          {/* Right Side - 3D Visualization */}
          <div className="lg:sticky lg:top-8">
            <div className="bg-slate-50 rounded-2xl p-6 h-96">
              <h4 className="text-lg font-medium text-slate-900 mb-4 text-center">
                Body Visualization
              </h4>
              <BodyVisualization 
                measurements={profile as UserMeasurements}
                gender={profile.gender || 'Female'}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <button
            onClick={handleContinue}
            disabled={!isValid}
            className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition flex items-center gap-2"
          >
            Continue
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileSetupStep;