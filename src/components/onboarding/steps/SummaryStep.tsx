import React from 'react';
import { CheckCircle, Calendar, Users, ArrowRight } from 'lucide-react';
import { useOnboardingStore } from '../../../store/onboardingStore';
import { useNavigate } from 'react-router-dom';

interface SummaryStepProps {
  onClose: () => void;
}

function SummaryStep({ onClose }: SummaryStepProps) {
  const { startDate, endDate, users, reset } = useOnboardingStore();
  const navigate = useNavigate();

  // Ensure dates are proper Date objects
  const startDateObj = startDate ? (startDate instanceof Date ? startDate : new Date(startDate)) : null;
  const endDateObj = endDate ? (endDate instanceof Date ? endDate : new Date(endDate)) : null;

  const handleStartBrowsing = () => {
    // Navigate to search results with the onboarding data
    navigate('/search-results', {
      state: {
        dates: {
          start: startDateObj?.toISOString().split('T')[0],
          end: endDateObj?.toISOString().split('T')[0]
        },
        users: users
      }
    });
    reset();
    onClose();
  };

  const getTripDuration = () => {
    if (!startDateObj || !endDateObj) return 0;
    return Math.ceil((endDateObj.getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-semibold text-slate-900 mb-2">
            You're All Set!
          </h3>
          <p className="text-slate-600">
            Review your information and start browsing clothing options
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Trip Details */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-6 h-6 text-blue-600" />
              <h4 className="text-lg font-semibold text-slate-900">Trip Details</h4>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-slate-600">Start Date</p>
                <p className="font-medium text-slate-900">
                  {startDateObj ? startDateObj.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  }) : 'Not selected'}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600">End Date</p>
                <p className="font-medium text-slate-900">
                  {endDateObj ? endDateObj.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  }) : 'Not selected'}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Duration</p>
                <p className="font-medium text-slate-900">{getTripDuration()} days</p>
              </div>
            </div>
          </div>

          {/* Users */}
          <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-purple-600" />
              <h4 className="text-lg font-semibold text-slate-900">
                Travelers ({users.length})
              </h4>
            </div>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {users.map((user, index) => (
                <div key={user.id} className="bg-white rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-slate-900">
                      {user.name} {index === 0 && '(Primary)'}
                    </h5>
                    <span className="text-sm text-slate-600">{user.gender}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs text-slate-600">
                    <div>
                      <span className="block font-medium">Height</span>
                      <span>{user.height}cm</span>
                    </div>
                    <div>
                      <span className="block font-medium">Weight</span>
                      <span>{user.weight}kg</span>
                    </div>
                    <div>
                      <span className="block font-medium">Chest</span>
                      <span>{user.chest}cm</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-6 mb-8">
          <h4 className="text-lg font-semibold text-slate-900 mb-4">What's Next?</h4>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h5 className="font-medium text-slate-900 mb-1">Browse Clothing</h5>
              <p className="text-sm text-slate-600">
                See items available for your dates and measurements
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <h5 className="font-medium text-slate-900 mb-1">Try On with AI</h5>
              <p className="text-sm text-slate-600">
                See how items look on you before renting
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">3</span>
              </div>
              <h5 className="font-medium text-slate-900 mb-1">Book & Travel</h5>
              <p className="text-sm text-slate-600">
                Rent your favorites and travel light
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handleStartBrowsing}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-4 rounded-2xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-3 mx-auto"
          >
            Start Browsing Clothing
            <ArrowRight className="w-6 h-6" />
          </button>
          <p className="text-slate-600 mt-4">
            Ready to discover your perfect travel wardrobe!
          </p>
        </div>
      </div>
    </div>
  );
}

export default SummaryStep;