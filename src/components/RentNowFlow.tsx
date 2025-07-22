import React, { useState } from 'react';
import { X, Calendar, MapPin, User, CreditCard, Check } from 'lucide-react';
import { inventory } from '../data/inventory';

interface RentNowFlowProps {
  onClose: () => void;
}

function RentNowFlow({ onClose }: RentNowFlowProps) {
  const [step, setStep] = useState(1);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [bookingDetails, setBookingDetails] = useState({
    startDate: '',
    endDate: '',
    destination: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
  });
  const [loading, setLoading] = useState(false);

  const handleItemSelect = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const selectedItemsData = inventory.filter(item => 
    selectedItems.includes(item.id.toString())
  );

  const totalPrice = selectedItemsData.reduce((sum, item) => sum + item.price, 0);

  const handleBookingSubmit = async () => {
    setLoading(true);
    
    try {
      // This will be replaced with actual Stripe checkout session creation
      console.log('Creating Stripe checkout session...', {
        items: selectedItemsData,
        customer: bookingDetails,
        total: totalPrice
      });
      
      // Placeholder for Stripe integration
      // const response = await fetch('/api/create-checkout-session', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     items: selectedItemsData,
      //     customer: bookingDetails,
      //     total: totalPrice
      //   })
      // });
      // 
      // const { url } = await response.json();
      // window.location.href = url;
      
      // For now, show success step
      setStep(4);
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-slate-900">Select Items to Rent</h3>
            <div className="grid md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {inventory.slice(0, 8).map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleItemSelect(item.id.toString())}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition ${
                    selectedItems.includes(item.id.toString())
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-32 object-cover rounded-md mb-3"
                  />
                  <h4 className="font-medium text-slate-900">{item.title}</h4>
                  <p className="text-sm text-slate-600 mb-2">{item.category} • {item.size}</p>
                  <p className="text-lg font-semibold text-green-600">${item.price}/day</p>
                  {selectedItems.includes(item.id.toString()) && (
                    <div className="mt-2 flex items-center text-blue-600">
                      <Check className="w-4 h-4 mr-1" />
                      <span className="text-sm">Selected</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center pt-4 border-t">
              <div className="text-lg font-semibold">
                Selected: {selectedItems.length} items (${totalPrice}/day)
              </div>
              <button
                onClick={() => setStep(2)}
                disabled={selectedItems.length === 0}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
              >
                Continue
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-slate-900">Trip Details</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={bookingDetails.startDate}
                  onChange={(e) => setBookingDetails(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={bookingDetails.endDate}
                  onChange={(e) => setBookingDetails(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Destination
              </label>
              <input
                type="text"
                value={bookingDetails.destination}
                onChange={(e) => setBookingDetails(prev => ({ ...prev, destination: e.target.value }))}
                placeholder="Hotel name or address"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="flex justify-between pt-4 border-t">
              <button
                onClick={() => setStep(1)}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-300 transition"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!bookingDetails.startDate || !bookingDetails.endDate || !bookingDetails.destination}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
              >
                Continue
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-slate-900">Contact Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={bookingDetails.customerName}
                  onChange={(e) => setBookingDetails(prev => ({ ...prev, customerName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={bookingDetails.customerEmail}
                  onChange={(e) => setBookingDetails(prev => ({ ...prev, customerEmail: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={bookingDetails.customerPhone}
                  onChange={(e) => setBookingDetails(prev => ({ ...prev, customerPhone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-slate-50 rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 mb-3">Order Summary</h4>
              <div className="space-y-2">
                {selectedItemsData.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.title}</span>
                    <span>${item.price}/day</span>
                  </div>
                ))}
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total per day:</span>
                  <span>${totalPrice}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t">
              <button
                onClick={() => setStep(2)}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-300 transition"
              >
                Back
              </button>
              <button
                onClick={handleBookingSubmit}
                disabled={loading || !bookingDetails.customerName || !bookingDetails.customerEmail}
                className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    Proceed to Payment
                  </>
                )}
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-semibold text-slate-900">Booking Confirmed!</h3>
            <p className="text-slate-600">
              Your rental has been confirmed. You'll receive a confirmation email shortly with delivery details.
            </p>
            <button
              onClick={onClose}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Close
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-semibold text-slate-900">Rent Now</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNumber
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {stepNumber}
                </div>
                {stepNumber < 4 && (
                  <div
                    className={`w-16 h-1 mx-2 ${
                      step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-600">
            <span>Select Items</span>
            <span>Trip Details</span>
            <span>Contact & Payment</span>
            <span>Confirmation</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {renderStep()}
        </div>
      </div>
    </div>
  );
}

export default RentNowFlow;