import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, MapPin, User, Users, Filter, Star, Heart, Check, Plus, Minus } from 'lucide-react';
import { supabase } from '../lib/supabase';

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
    
    let filtered = availableItems.filter(item => {
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
    setStep(2);
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
      setStep(4); // Go to final confirmation
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
                Find Available Items
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Group Size Selection
  if (step === 2) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-light">Who's Traveling?</h2>
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
                onClick={() => setStep(3)}
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

  // Step 3: Individual Person Selection
  if (step === 3 && people.length > 0) {
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
                    onClick={currentPersonIndex === 0 ? () => setStep(2) : goToPreviousPerson}
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
                        <div key={item.id} className={`bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-lg transition ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
                          <div className="relative">
                            {item.images.length > 0 && (
                              <img
                                src={item.images[0]}
                                alt={item.title}
                                className="w-full h-48 object-cover"
                              />
                            )}
                            {isSelected && (
                              <div className="absolute top-3 right-3 bg-blue-500 text-white rounded-full p-2">
                                <Check className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                          
                          <div className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-medium text-gray-900 line-clamp-2">{item.title}</h3>
                              <div className="text-right ml-2">
                                <div className="text-lg font-semibold text-green-600">
                                  ${item.price_per_rental}
                                </div>
                                <div className="text-xs text-gray-500">per day</div>
                              </div>
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                            
                            <div className="flex items-center justify-between text-sm mb-4">
                              <span className="bg-gray-100 px-2 py-1 rounded text-gray-700">
                                {item.category} • {item.size}
                              </span>
                              {item.lender?.verified && (
                                <div className="flex items-center gap-1 text-blue-600">
                                  <Check className="w-3 h-3" />
                                  <span className="text-xs">Verified</span>
                                </div>
                              )}
                            </div>

                            <div className="text-sm text-gray-600 mb-4">
                              <strong>Total: ${(item.price_per_rental * getRentalDays()).toFixed(2)}</strong>
                              <span className="text-gray-500"> for {getRentalDays()} day{getRentalDays() !== 1 ? 's' : ''}</span>
                            </div>

                            <button
                              onClick={() => isSelected ? removeItemFromPerson(item.id) : addItemToPerson(item)}
                              className={`w-full py-2 px-4 rounded-lg font-medium transition ${
                                isSelected 
                                  ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                                  : 'bg-blue-600 text-white hover:bg-blue-700'
                              }`}
                            >
                              {isSelected ? 'Remove Item' : 'Add Item'}
                            </button>
                          </div>
                        </div>
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

  // Step 4: Final Booking Confirmation
  if (step === 4) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-light">Confirm Booking</h2>
              <button
                onClick={() => setStep(3)}
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
                  onClick={() => setStep(3)}
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