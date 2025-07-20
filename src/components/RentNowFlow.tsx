import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Calendar, MapPin, User, Users, Filter, Star, Heart, Check, Plus, Minus, Upload, Camera, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import ProductCard from './ProductCard';

interface ClothingItem {
  id: string;
  lender_id: string;
  title: string;
  description: string;
  category: string;
  size: string;
  price_per_rental: number;
  images: string[];
  ai_model_image: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
  lender?: {
    full_name: string;
    verified: boolean;
  };
}

interface Booking {
  id: string;
  item_id: string;
  start_date: string;
  end_date: string;
  status: string;
}

interface Person {
  id: string;
  type: 'adult' | 'kid';
  gender: 'male' | 'female';
  size: string;
  selectedItems: ClothingItem[];
  photo?: string;
}

interface RentNowFlowProps {
  onClose: () => void;
  preselectedItem?: ClothingItem | null;
}

const adultSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '38', '40', '42', '44', '46', '48', '50'];
const kidSizes = ['2T', '3T', '4T', '5T', '6', '7', '8', '10', '12', '14', '16'];
const categories = ['All', 'Suit', 'Dress', 'Shirt', 'Pants', 'Jacket', 'Blazer', 'Skirt', 'Blouse', 'Kids', 'Accessories', 'Other'];

function RentNowFlow({ onClose, preselectedItem }: RentNowFlowProps) {
  const [step, setStep] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [destination, setDestination] = useState('');
  const [adultCount, setAdultCount] = useState(1);
  const [kidCount, setKidCount] = useState(0);
  const [people, setPeople] = useState<Person[]>([]);
  const [currentPersonIndex, setCurrentPersonIndex] = useState(0);
  const [availableItems, setAvailableItems] = useState<ClothingItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<ClothingItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('price');
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // Gender and photo selection state
  const [selectedGender, setSelectedGender] = useState<'male' | 'female' | 'kids' | ''>('');
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const [showTryOn, setShowTryOn] = useState(false);
  const [tryOnResult, setTryOnResult] = useState<string | null>(null);
  const [tryOnLoading, setTryOnLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calculate rental days
  const getRentalDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  };

  // Initialize people array when counts change
  useEffect(() => {
    const newPeople: Person[] = [];
    
    // Add adults
    for (let i = 0; i < adultCount; i++) {
      newPeople.push({
        id: `adult-${i}`,
        type: 'adult',
        gender: 'male',
        size: '',
        selectedItems: []
      });
    }
    
    // Add kids
    for (let i = 0; i < kidCount; i++) {
      newPeople.push({
        id: `kid-${i}`,
        type: 'kid',
        gender: 'male',
        size: '',
        selectedItems: []
      });
    }
    
    setPeople(newPeople);
    setCurrentPersonIndex(0);
  }, [adultCount, kidCount]);

  // Fetch all clothing items and bookings
  const fetchInventory = async () => {
    setLoading(true);
    try {
      // Fetch clothing items with lender info
      const { data: items, error: itemsError } = await supabase
        .from('clothing_items')
        .select(`
          *,
          lender:lenders(full_name, verified)
        `)
        .eq('active', true);

      if (itemsError) throw itemsError;

      // Fetch existing bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .in('status', ['confirmed', 'pending']);

      if (bookingsError) throw bookingsError;

      setAvailableItems(items || []);
      setBookings(bookingsData || []);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  // Check if item is available for selected dates
  const isItemAvailable = (itemId: string) => {
    if (!startDate || !endDate) return true;

    const requestStart = new Date(startDate);
    const requestEnd = new Date(endDate);

    return !bookings.some(booking => {
      if (booking.item_id !== itemId) return false;
      
      const bookingStart = new Date(booking.start_date);
      const bookingEnd = new Date(booking.end_date);

      // Check for date overlap
      return (requestStart <= bookingEnd && requestEnd >= bookingStart);
    });
  };

  // Filter items based on current person's criteria
  const getFilteredItemsForCurrentPerson = () => {
    if (!people[currentPersonIndex]) return [];
    
    const currentPerson = people[currentPersonIndex];
    
    const filtered = availableItems.filter(item => {
      // Size filter
      if (currentPerson.size && item.size !== currentPerson.size) return false;
      
      // Category filter for kids
      if (currentPerson.type === 'kid' && item.category !== 'Kids') return false;
      if (currentPerson.type === 'adult' && item.category === 'Kids') return false;
      
      // Additional category filter
      if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
      
      // Availability filter
      if (!isItemAvailable(item.id)) return false;

      return true;
    });

    // Sort items
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price_per_rental - b.price_per_rental;
        case 'price-desc':
          return b.price_per_rental - a.price_per_rental;
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  };

  useEffect(() => {
    setFilteredItems(getFilteredItemsForCurrentPerson());
  }, [availableItems, currentPersonIndex, people, selectedCategory, sortBy, startDate, endDate, bookings]);

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleSearchSubmit = () => {
    if (!startDate || !endDate || !destination) {
      alert('Please fill in all fields');
      return;
    }
    setStep(2); // Go to gender selection step
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedPhoto(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTryOn = async () => {
    if (!uploadedPhoto) {
      alert('Please upload a photo first');
      return;
    }

    setTryOnLoading(true);
    try {
      // Mock AI try-on API call
      const response = await fetch('/api/ai-try-on', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_image: uploadedPhoto,
          gender: selectedGender,
          category: selectedGender === 'kids' ? 'kids' : 'adult'
        })
      });

      if (!response.ok) {
        throw new Error('Try-on service not available');
      }

      const data = await response.json();
      setTryOnResult(data.result_image_url);
    } catch (error) {
      // For demo purposes, show a placeholder
      setTryOnResult('https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=400&h=600');
    } finally {
      setTryOnLoading(false);
    }
  };

  const handleGenderContinue = () => {
    if (!selectedGender) {
      alert('Please select a gender');
      return;
    }
    
    // Update people array based on gender selection
    if (selectedGender === 'kids') {
      setKidCount(1);
      setAdultCount(0);
    } else {
      setAdultCount(1);
      setKidCount(0);
      // Update the first person's gender
      setPeople(prev => prev.map((person, index) => 
        index === 0 ? { ...person, gender: selectedGender as 'male' | 'female' } : person
      ));
    }
    
    setStep(3); // Go to group size selection
  };

  const updatePersonInfo = (field: keyof Person, value: any) => {
    setPeople(prev => prev.map((person, index) => 
      index === currentPersonIndex 
        ? { ...person, [field]: value }
        : person
    ));
  };

  const addItemToPerson = (item: ClothingItem) => {
    setPeople(prev => prev.map((person, index) => 
      index === currentPersonIndex 
        ? { ...person, selectedItems: [...person.selectedItems, item] }
        : person
    ));
  };

  const removeItemFromPerson = (itemId: string) => {
    setPeople(prev => prev.map((person, index) => 
      index === currentPersonIndex 
        ? { ...person, selectedItems: person.selectedItems.filter(item => item.id !== itemId) }
        : person
    ));
  };

  const goToNextPerson = () => {
    if (currentPersonIndex < people.length - 1) {
      setCurrentPersonIndex(currentPersonIndex + 1);
      setSelectedCategory('All'); // Reset category filter for next person
    } else {
      setStep(5); // Go to final confirmation
    }
  };

  const goToPreviousPerson = () => {
    if (currentPersonIndex > 0) {
      setCurrentPersonIndex(currentPersonIndex - 1);
      setSelectedCategory('All');
    }
  };

  const getTotalPrice = () => {
    const days = getRentalDays();
    return people.reduce((total, person) => {
      return total + person.selectedItems.reduce((personTotal, item) => {
        return personTotal + (item.price_per_rental * days);
      }, 0);
    }, 0);
  };

  const handleFinalBooking = async () => {
    try {
      // Create bookings for all selected items
      const bookingPromises = people.flatMap(person => 
        person.selectedItems.map(item => 
          supabase.from('bookings').insert({
            item_id: item.id,
            start_date: startDate,
            end_date: endDate,
            destination,
            total_price: item.price_per_rental * getRentalDays(),
            status: 'pending'
          })
        )
      );

      await Promise.all(bookingPromises);
      
      alert('Booking request submitted! We\'ll contact you shortly to confirm details.');
      onClose();
    } catch (error) {
      console.error('Error creating bookings:', error);
      alert('Error submitting booking. Please try again.');
    }
  };

  const toggleFavorite = (itemId: string) => {
    setFavorites(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Step 1: Travel Details Form
  if (step === 1) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-light">Plan Your Rental</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Travel Dates
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Check-in</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Check-out</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate || new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Destination
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Hotel name, address, or area"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              {startDate && endDate && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>{getRentalDays()} day{getRentalDays() !== 1 ? 's' : ''}</strong> rental period
                  </p>
                </div>
              )}

              <button
                onClick={handleSearchSubmit}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Gender Selection with Photo Upload and Try-On
  if (step === 2) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-light">Select Gender & Try On</h2>
              <button
                onClick={() => setStep(1)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              <div className="text-center mb-6">
                <p className="text-gray-600">
                  {startDate} - {endDate}<br />
                  {destination}
                </p>
              </div>

              {/* Gender Selection */}
              <div>
                <h3 className="text-lg font-medium mb-4">Select Gender</h3>
                <div className="grid grid-cols-3 gap-4">
                  <button
                    onClick={() => setSelectedGender('male')}
                    className={`p-6 rounded-xl border-2 transition ${
                      selectedGender === 'male' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <User className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <div className="font-medium">Adult Male</div>
                  </button>
                  <button
                    onClick={() => setSelectedGender('female')}
                    className={`p-6 rounded-xl border-2 transition ${
                      selectedGender === 'female' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <User className="w-8 h-8 mx-auto mb-2 text-pink-600" />
                    <div className="font-medium">Adult Female</div>
                  </button>
                  <button
                    onClick={() => setSelectedGender('kids')}
                    className={`p-6 rounded-xl border-2 transition ${
                      selectedGender === 'kids' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Users className="w-8 h-8 mx-auto mb-2 text-green-600" />
                    <div className="font-medium">Kids</div>
                  </button>
                </div>
              </div>

              {/* Photo Upload Section */}
              {selectedGender && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Upload Your Photo (Optional)</h3>
                    <div 
                      className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {uploadedPhoto ? (
                        <div className="space-y-4">
                          <img 
                            src={uploadedPhoto} 
                            alt="Your photo" 
                            className="max-w-full max-h-48 mx-auto rounded-lg shadow-md object-cover"
                          />
                          <p className="text-sm text-gray-600">Click to change photo</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <Camera className="w-12 h-12 text-gray-400 mx-auto" />
                          <div>
                            <p className="text-lg font-medium text-gray-900">Upload your photo</p>
                            <p className="text-sm text-gray-600">See how clothes look on you with AI</p>
                            <p className="text-xs text-gray-500 mt-2">PNG, JPG up to 10MB</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />

                    {uploadedPhoto && (
                      <button
                        onClick={handleTryOn}
                        disabled={tryOnLoading}
                        className="w-full mt-4 bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                      >
                        {tryOnLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            Generating Preview...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5" />
                            Try On Sample Outfit
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Try-On Result */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">AI Try-On Preview</h3>
                    <div className="border-2 border-gray-200 rounded-lg p-6 min-h-64 flex items-center justify-center">
                      {tryOnResult ? (
                        <div className="text-center space-y-4">
                          <img 
                            src={tryOnResult} 
                            alt="AI try-on result" 
                            className="max-w-full max-h-60 mx-auto rounded-lg shadow-md object-cover"
                          />
                          <p className="text-sm text-gray-600">AI-generated preview</p>
                        </div>
                      ) : (
                        <div className="text-center space-y-4">
                          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                            <Sparkles className="w-8 h-8 text-gray-400" />
                          </div>
                          <div>
                            <p className="text-lg font-medium text-gray-900">Ready for try-on</p>
                            <p className="text-sm text-gray-600">Upload your photo to see AI-generated preview</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleGenderContinue}
                disabled={!selectedGender}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
              >
                Continue to Clothing Selection
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Group Size Selection
  if (step === 3) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-light">Who's Traveling?</h2>
              <button
                onClick={() => setStep(2)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              <div className="text-center mb-6">
                <p className="text-gray-600">
                  {startDate} - {endDate}<br />
                  {destination}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-600" />
                    <div>
                      <div className="font-medium">Adults</div>
                      <div className="text-sm text-gray-500">Ages 13+</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setAdultCount(Math.max(1, adultCount - 1))}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-medium">{adultCount}</span>
                    <button
                      onClick={() => setAdultCount(Math.min(8, adultCount + 1))}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-gray-600" />
                    <div>
                      <div className="font-medium">Children</div>
                      <div className="text-sm text-gray-500">Ages 2-12</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setKidCount(Math.max(0, kidCount - 1))}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-medium">{kidCount}</span>
                    <button
                      onClick={() => setKidCount(Math.min(8, kidCount + 1))}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Total: {adultCount + kidCount} person{adultCount + kidCount !== 1 ? 's' : ''}</strong><br />
                  Next, you'll select sizes and clothing for each person individually.
                </p>
              </div>

              <button
                onClick={() => setStep(4)}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Continue to Clothing Selection
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 4: Individual Person Selection
  if (step === 4 && people.length > 0) {
    const currentPerson = people[currentPersonIndex];
    const isLastPerson = currentPersonIndex === people.length - 1;
    
    return (
      <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <div className="bg-white shadow-sm border-b sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={currentPersonIndex === 0 ? () => setStep(3) : goToPreviousPerson}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back</span>
                  </button>
                  <div>
                    <h1 className="text-xl font-medium">
                      {currentPerson.type === 'adult' ? 'Adult' : 'Child'} {currentPersonIndex + 1} of {people.length}
                    </h1>
                    <p className="text-sm text-gray-600">
                      {startDate} - {endDate} • {destination}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
          </div>

          {/* Person Details Form */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-lg font-medium mb-4">
                {currentPerson.type === 'adult' ? 'Adult' : 'Child'} Details
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <select
                    value={currentPerson.gender}
                    onChange={(e) => updatePersonInfo('gender', e.target.value as 'male' | 'female')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                  <select
                    value={currentPerson.size}
                    onChange={(e) => updatePersonInfo('size', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="">Select size</option>
                    {(currentPerson.type === 'adult' ? adultSizes : kidSizes).map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Selected Items */}
              {currentPerson.selectedItems.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Selected Items ({currentPerson.selectedItems.length})</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {currentPerson.selectedItems.map((item) => (
                      <div key={item.id} className="relative bg-gray-50 rounded-lg p-3">
                        {item.images.length > 0 && (
                          <img
                            src={item.images[0]}
                            alt={item.title}
                            className="w-full h-20 object-cover rounded mb-2"
                          />
                        )}
                        <p className="text-xs font-medium truncate">{item.title}</p>
                        <p className="text-xs text-gray-600">${item.price_per_rental}/day</p>
                        <button
                          onClick={() => removeItemFromPerson(item.id)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {currentPerson.selectedItems.length > 0 && (
                    <span>
                      Subtotal: ${(currentPerson.selectedItems.reduce((sum, item) => sum + item.price_per_rental, 0) * getRentalDays()).toFixed(2)}
                    </span>
                  )}
                </div>
                <button
                  onClick={goToNextPerson}
                  disabled={!currentPerson.size || currentPerson.selectedItems.length === 0}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                >
                  {isLastPerson ? 'Review Booking' : 'Next Person'}
                </button>
              </div>
            </div>

            {/* Available Items */}
            {currentPerson.size && (
              <>
                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium">Filters:</span>
                    </div>
                    
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                    >
                      {categories.filter(cat => 
                        currentPerson.type === 'kid' ? cat === 'All' || cat === 'Kids' : cat !== 'Kids'
                      ).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>

                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="price">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="newest">Newest First</option>
                      <option value="title">Alphabetical</option>
                    </select>

                    <div className="ml-auto text-sm text-gray-600">
                      {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} available
                    </div>
                  </div>
                </div>

                {/* Items Grid */}
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : filteredItems.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No items available</h3>
                    <p className="text-gray-600">
                      Try adjusting the category filter or check back later
                    </p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map((item) => {
                      const isSelected = currentPerson.selectedItems.some(selected => selected.id === item.id);
                      
                      return (
                        <ProductCard
                          key={item.id}
                          item={item}
                          onRent={() => isSelected ? removeItemFromPerson(item.id) : addItemToPerson(item)}
                          onFavorite={toggleFavorite}
                          isFavorite={favorites.includes(item.id)}
                          rentalDays={getRentalDays()}
                        />
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Step 5: Final Booking Confirmation
  if (step === 5) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-light">Confirm Booking</h2>
              <button
                onClick={() => setStep(4)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              {/* Booking Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium mb-3">Booking Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Dates:</span>
                    <span>{startDate} to {endDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span>{getRentalDays()} day{getRentalDays() !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Destination:</span>
                    <span>{destination}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>People:</span>
                    <span>{people.length} person{people.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>

              {/* Items by Person */}
              <div className="space-y-4">
                <h4 className="font-medium">Selected Items</h4>
                {people.map((person, index) => (
                  <div key={person.id} className="border rounded-lg p-4">
                    <h5 className="font-medium mb-3">
                      {person.type === 'adult' ? 'Adult' : 'Child'} {index + 1} 
                      <span className="text-sm text-gray-600 ml-2">
                        ({person.gender}, Size {person.size})
                      </span>
                    </h5>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {person.selectedItems.map((item) => (
                        <div key={item.id} className="bg-gray-50 rounded p-3">
                          {item.images.length > 0 && (
                            <img
                              src={item.images[0]}
                              alt={item.title}
                              className="w-full h-16 object-cover rounded mb-2"
                            />
                          )}
                          <p className="text-xs font-medium truncate">{item.title}</p>
                          <p className="text-xs text-gray-600">
                            ${item.price_per_rental}/day × {getRentalDays()} = ${(item.price_per_rental * getRentalDays()).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">Total Amount:</span>
                  <span className="text-2xl font-bold text-blue-600">${getTotalPrice().toFixed(2)}</span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-4">
                <h4 className="font-medium">Contact Information</h4>
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Next Steps:</strong> After submitting, we'll contact you within 24 hours to confirm availability and arrange delivery details for all selected items.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(4)}
                  className="flex-1 bg-gray-100 text-gray-900 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition"
                >
                  Back to Items
                </button>
                <button
                  onClick={handleFinalBooking}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default RentNowFlow;