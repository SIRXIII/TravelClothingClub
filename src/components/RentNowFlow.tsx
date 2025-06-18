import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, MapPin, User, Filter, Star, Heart, Check } from 'lucide-react';
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

interface RentNowFlowProps {
  onClose: () => void;
  preselectedItem?: ClothingItem | null;
}

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '38', '40', '42', '44', '46', '48', '50'];
const categories = ['All', 'Suit', 'Dress', 'Shirt', 'Pants', 'Jacket', 'Blazer', 'Skirt', 'Blouse', 'Kids', 'Accessories', 'Other'];

function RentNowFlow({ onClose, preselectedItem }: RentNowFlowProps) {
  const [step, setStep] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [availableItems, setAvailableItems] = useState<ClothingItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<ClothingItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('price');
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(preselectedItem || null);
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

  // Filter and sort items
  useEffect(() => {
    let filtered = availableItems.filter(item => {
      // Size filter
      if (selectedSize && item.size !== selectedSize) return false;
      
      // Category filter
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

    setFilteredItems(filtered);
  }, [availableItems, selectedSize, selectedCategory, sortBy, startDate, endDate, bookings]);

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleSearchSubmit = () => {
    if (!startDate || !endDate || !destination || !selectedSize) {
      alert('Please fill in all fields');
      return;
    }
    setStep(2);
  };

  const toggleFavorite = (itemId: string) => {
    setFavorites(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleItemSelect = (item: ClothingItem) => {
    setSelectedItem(item);
    setStep(3);
  };

  const handleBookingConfirm = async () => {
    if (!selectedItem) return;

    try {
      const { error } = await supabase
        .from('bookings')
        .insert({
          item_id: selectedItem.id,
          start_date: startDate,
          end_date: endDate,
          destination,
          total_price: selectedItem.price_per_rental * getRentalDays(),
          status: 'pending'
        });

      if (error) throw error;

      alert('Booking request submitted! We\'ll contact you shortly to confirm details.');
      onClose();
    } catch (error) {
      console.error('Error creating booking:', error);
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Your Size
                </label>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="">Select your size</option>
                  {sizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
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

  // Step 2: Available Items List
  if (step === 2) {
    return (
      <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <div className="bg-white shadow-sm border-b sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setStep(1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back</span>
                  </button>
                  <div>
                    <h1 className="text-xl font-medium">Available Items</h1>
                    <p className="text-sm text-gray-600">
                      {startDate} - {endDate} • {destination} • Size {selectedSize}
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

          {/* Filters */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
                  {categories.map(cat => (
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
                <p className="text-gray-600 mb-6">
                  Try adjusting your dates, size, or category filters
                </p>
                <button
                  onClick={() => setStep(1)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Change Search Criteria
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-lg transition">
                    <div className="relative">
                      {item.images.length > 0 && (
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <button
                        onClick={() => toggleFavorite(item.id)}
                        className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition"
                      >
                        <Heart 
                          className={`w-4 h-4 ${
                            favorites.includes(item.id) 
                              ? 'text-red-500 fill-current' 
                              : 'text-gray-400'
                          }`} 
                        />
                      </button>
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
                        onClick={() => handleItemSelect(item)}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition"
                      >
                        Select This Item
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Booking Confirmation
  if (step === 3 && selectedItem) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-light">Confirm Booking</h2>
              <button
                onClick={() => setStep(2)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              {/* Item Details */}
              <div className="border rounded-lg p-4">
                {selectedItem.images.length > 0 && (
                  <img
                    src={selectedItem.images[0]}
                    alt={selectedItem.title}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                )}
                <h3 className="font-medium text-gray-900 mb-2">{selectedItem.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{selectedItem.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    {selectedItem.category} • {selectedItem.size}
                  </span>
                  <span className="font-medium">${selectedItem.price_per_rental}/day</span>
                </div>
              </div>

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
                    <span>Size:</span>
                    <span>{selectedSize}</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-medium">
                      <span>Total:</span>
                      <span>${(selectedItem.price_per_rental * getRentalDays()).toFixed(2)}</span>
                    </div>
                  </div>
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
                  <strong>Next Steps:</strong> After submitting, we'll contact you within 24 hours to confirm availability and arrange delivery details.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 bg-gray-100 text-gray-900 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition"
                >
                  Back to Items
                </button>
                <button
                  onClick={handleBookingConfirm}
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