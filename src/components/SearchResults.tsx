import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ArrowLeft, Filter, Heart, Star, MapPin, Calendar } from 'lucide-react';
import { inventory } from '../data/inventory';

function SearchResults() {
  const location = useLocation();
  const searchParams = location.state || {};
  const { dates, destination, size } = searchParams;
  
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('price-asc');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [filteredItems, setFilteredItems] = useState(inventory);

  useEffect(() => {
    // Filter logic
    let filtered = inventory.filter(item => {
      const matchesLocation = destination ? 
        item.location.toLowerCase().includes(destination.toLowerCase()) : true;
      const matchesSize = size ? 
        item.size.toLowerCase() === size.toLowerCase() : true;
      const matchesDates = (!dates?.start || !dates?.end) ||
        (item.availableFrom <= dates.start && item.availableTo >= dates.end);
      const matchesCategory = category ? item.category === category : true;
      
      return matchesLocation && matchesSize && matchesDates && matchesCategory;
    });

    // Sorting logic
    filtered = [...filtered].sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'title') return a.title.localeCompare(b.title);
      return 0;
    });

    setFilteredItems(filtered);
  }, [dates, destination, size, category, sort]);

  const toggleFavorite = (itemId: number) => {
    setFavorites(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const getRentalDays = () => {
    if (!dates?.start || !dates?.end) return 1;
    const start = new Date(dates.start);
    const end = new Date(dates.end);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
            <div className="flex items-center gap-3">
              <img 
                src="/ChatGPT Image Jun 4, 2025, 09_30_18 PM copy.png"
                alt="Travel Clothing Club"
                className="w-8 h-8 object-contain"
              />
              <h1 className="text-xl font-medium">Search Results</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Search Summary */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            {dates?.start && dates?.end && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{dates.start} to {dates.end} ({getRentalDays()} day{getRentalDays() !== 1 ? 's' : ''})</span>
              </div>
            )}
            {destination && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{destination}</span>
              </div>
            )}
            {size && (
              <div className="bg-gray-100 px-2 py-1 rounded">
                Size: {size}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <span className="font-medium">Filters:</span>
            </div>
            
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="">All Categories</option>
              <option value="Suit">Suits</option>
              <option value="Dress">Dresses</option>
              <option value="Shirt">Shirts</option>
              <option value="Blazer">Blazers</option>
              <option value="Kids">Kids</option>
            </select>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="title">Alphabetical</option>
            </select>

            <div className="ml-auto text-sm text-gray-600">
              {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>

        {/* Results */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or filters to find more items.
            </p>
            <Link 
              to="/"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Start New Search
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-lg transition">
                <div className="relative">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={() => toggleFavorite(item.id)}
                    className={`absolute top-3 right-3 p-2 rounded-full transition ${
                      favorites.includes(item.id)
                        ? 'bg-red-500 text-white'
                        : 'bg-white/80 text-gray-600 hover:bg-white'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${favorites.includes(item.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-gray-900 line-clamp-2">{item.title}</h3>
                    <div className="text-right ml-2">
                      <div className="text-lg font-semibold text-green-600">
                        ${item.price}
                      </div>
                      <div className="text-xs text-gray-500">per day</div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                  
                  <div className="flex items-center justify-between text-sm mb-4">
                    <span className="bg-gray-100 px-2 py-1 rounded text-gray-700">
                      {item.category} • {item.size}
                    </span>
                    <div className="flex items-center gap-1 text-gray-600">
                      <MapPin className="w-3 h-3" />
                      <span className="text-xs">{item.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm mb-4">
                    <span className="text-gray-600">by {item.lender}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-600">4.8</span>
                    </div>
                  </div>

                  {dates?.start && dates?.end && (
                    <div className="text-sm text-gray-600 mb-4">
                      <strong>Total: ${(item.price * getRentalDays()).toFixed(2)}</strong>
                      <span className="text-gray-500"> for {getRentalDays()} day{getRentalDays() !== 1 ? 's' : ''}</span>
                    </div>
                  )}

                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition">
                    Rent Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default SearchResults;