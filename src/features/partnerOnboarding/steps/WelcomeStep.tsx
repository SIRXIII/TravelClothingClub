import React from "react";
import { Button } from "../../../components/ui/button";
import { usePartnerWizard } from "../hooks/usePartnerWizard";

export default function WelcomeStep() {
  const { setStep } = usePartnerWizard();

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <img 
            src="/TCC Cursive.png"
            alt="Travel Clothing Club"
            className="w-16 h-16 mx-auto mb-6"
          />
          <h1 className="text-4xl font-light text-gray-900 mb-4">
            Welcome to Travel Clothing Club
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Join our partner network and start earning from your clothing inventory
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-blue-50 rounded-xl p-6">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold">1</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Setup Profile</h3>
            <p className="text-gray-600 text-sm">Tell us about your business and inventory</p>
          </div>
          
          <div className="bg-green-50 rounded-xl p-6">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold">2</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">List Items</h3>
            <p className="text-gray-600 text-sm">Upload your clothing items with AI try-on</p>
          </div>
          
          <div className="bg-purple-50 rounded-xl p-6">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold">3</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Start Earning</h3>
            <p className="text-gray-600 text-sm">Get bookings and earn money from rentals</p>
          </div>
        </div>

        <Button 
          onClick={() => setStep(1)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
        >
          Get Started
        </Button>
      </div>
    </div>
  );
}