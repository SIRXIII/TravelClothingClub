import React, { useState } from 'react';
import { X, Filter, Grid, List, Star, MapPin, Phone, Mail, Globe, ChevronLeft, ChevronRight, Building2 } from 'lucide-react';

interface Partner {
  id: string;
  name: string;
  description: string;
  location: string;
  rating: number;
  reviewCount: number;
  contact: {
    phone?: string;
    email?: string;
    website?: string;
  };
  specialties: string[];
  image: string;
}

interface ClothingItem {
  id: string;
  name: string;
  category: string;
  season: 'winter' | 'summer' | 'year-round';
  price: number;
  sizes: string[];
  colors: string[];
  images: string[];
  partnerId: string;
  description: string;
}

interface PartnersShowcaseProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockPartners: Partner[] = [
  {
    id: '1',
    name: 'Bella Vista Boutique',
    description: 'Curated fashion for the modern traveler. Specializing in versatile, high-quality pieces that transition seamlessly from day to night.',
    location: 'New York, NY',
    rating: 4.8,
    reviewCount: 127,
    contact: {
      phone: '+1 (555) 123-4567',
      email: 'hello@bellavistaboutique.com',
      website: 'www.bellavistaboutique.com'
    },
    specialties: ['Designer Wear', 'Business Attire', 'Evening Wear'],
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: '2',
    name: 'Urban Thread Co.',
    description: 'Contemporary streetwear and casual fashion. Perfect for the urban explorer seeking comfort without compromising style.',
    location: 'Los Angeles, CA',
    rating: 4.6,
    reviewCount: 89,
    contact: {
      phone: '+1 (555) 987-6543',
      email: 'info@urbanthreadco.com',
      website: 'www.urbanthreadco.com'
    },
    specialties: ['Streetwear', 'Casual Wear', 'Accessories'],
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&q=80&w=400'
  }
];

const mockClothingItems: ClothingItem[] = [
  // Winter Collection
  {
    id: '1',
    name: 'Wool Blend Overcoat',
    category: 'Outerwear',
    season: 'winter',
    price: 45,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Charcoal', 'Navy', 'Camel'],
    images: [
      'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&q=80&w=400'
    ],
    partnerId: '1',
    description: 'Elegant wool blend overcoat perfect for business travel and formal occasions.'
  },
  {
    id: '2',
    name: 'Cashmere Turtleneck',
    category: 'Sweaters',
    season: 'winter',
    price: 35,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Cream', 'Black', 'Grey', 'Burgundy'],
    images: [
      'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1583743814966-8936f37f4678?auto=format&fit=crop&q=80&w=400'
    ],
    partnerId: '1',
    description: 'Luxurious cashmere turtleneck for ultimate comfort and sophistication.'
  },
  {
    id: '3',
    name: 'Leather Ankle Boots',
    category: 'Footwear',
    season: 'winter',
    price: 40,
    sizes: ['6', '7', '8', '9', '10', '11'],
    colors: ['Black', 'Brown', 'Cognac'],
    images: [
      'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=400'
    ],
    partnerId: '2',
    description: 'Versatile leather ankle boots that complement any winter outfit.'
  },
  {
    id: '4',
    name: 'Silk Scarf',
    category: 'Accessories',
    season: 'winter',
    price: 25,
    sizes: ['One Size'],
    colors: ['Navy Print', 'Burgundy Print', 'Grey Print'],
    images: [
      'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&q=80&w=400'
    ],
    partnerId: '1',
    description: 'Elegant silk scarf to add a touch of luxury to any winter ensemble.'
  },
  // Summer Collection
  {
    id: '5',
    name: 'Floral Midi Dress',
    category: 'Dresses',
    season: 'summer',
    price: 38,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Blue Floral', 'Pink Floral', 'White Floral'],
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=400'
    ],
    partnerId: '1',
    description: 'Breezy floral midi dress perfect for summer events and vacation wear.'
  },
  {
    id: '6',
    name: 'Linen Shorts',
    category: 'Bottoms',
    season: 'summer',
    price: 28,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Khaki', 'Navy', 'Coral'],
    images: [
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=400'
    ],
    partnerId: '2',
    description: 'Comfortable linen shorts for casual summer days and beach vacations.'
  },
  {
    id: '7',
    name: 'Strappy Sandals',
    category: 'Footwear',
    season: 'summer',
    price: 32,
    sizes: ['6', '7', '8', '9', '10'],
    colors: ['Tan', 'Black', 'White', 'Gold'],
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=400'
    ],
    partnerId: '1',
    description: 'Stylish strappy sandals that elevate any summer outfit.'
  },
  {
    id: '8',
    name: 'Cotton Blouse',
    category: 'Tops',
    season: 'summer',
    price: 30,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['White', 'Light Blue', 'Peach', 'Mint'],
    images: [
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=400'
    ],
    partnerId: '2',
    description: 'Lightweight cotton blouse perfect for warm weather and professional settings.'
  },
  // Year-round Essentials
  {
    id: '9',
    name: 'Classic Denim Jeans',
    category: 'Bottoms',
    season: 'year-round',
    price: 35,
    sizes: ['26', '28', '30', '32', '34', '36'],
    colors: ['Dark Wash', 'Medium Wash', 'Light Wash', 'Black'],
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=400'
    ],
    partnerId: '2',
    description: 'Timeless denim jeans that work for any season and occasion.'
  },
  {
    id: '10',
    name: 'Leather Handbag',
    category: 'Accessories',
    season: 'year-round',
    price: 42,
    sizes: ['One Size'],
    colors: ['Black', 'Brown', 'Tan', 'Navy'],
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=400'
    ],
    partnerId: '1',
    description: 'Versatile leather handbag suitable for both casual and formal occasions.'
  }
];

function PartnersShowcase({ isOpen, onClose }: PartnersShowcaseProps) {
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSeason, setSelectedSeason] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!isOpen) return null;

  const filteredItems = mockClothingItems.filter(item => {
    const categoryMatch = selectedCategory === 'all' || item.category.toLowerCase() === selectedCategory.toLowerCase();
    const seasonMatch = selectedSeason === 'all' || item.season === selectedSeason;
    const partnerMatch = !selectedPartner || item.partnerId === selectedPartner.id;
    return categoryMatch && seasonMatch && partnerMatch;
  });

  const categories = ['all', ...Array.from(new Set(mockClothingItems.map(item => item.category)))];
  const seasons = ['all', 'winter', 'summer', 'year-round'];

  const nextImage = () => {
    if (selectedItem) {
      setCurrentImageIndex((prev) => 
        prev === selectedItem.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedItem) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedItem.images.length - 1 : prev - 1
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-slate-50 to-blue-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Partners Showcase</h2>
              <p className="text-slate-600">Discover our curated network of fashion partners</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Left Sidebar - Partners */}
          <div className="w-80 border-r bg-slate-50 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Our Partners</h3>
              <div className="space-y-4">
                <button
                  onClick={() => setSelectedPartner(null)}
                  className={`w-full text-left p-4 rounded-lg transition ${
                    !selectedPartner ? 'bg-blue-100 border-2 border-blue-300' : 'bg-white hover:bg-slate-100'
                  }`}
                >
                  <div className="font-medium text-slate-900">All Partners</div>
                  <div className="text-sm text-slate-600">View all available items</div>
                </button>
                
                {mockPartners.map((partner) => (
                  <button
                    key={partner.id}
                    onClick={() => setSelectedPartner(partner)}
                    className={`w-full text-left p-4 rounded-lg transition ${
                      selectedPartner?.id === partner.id ? 'bg-blue-100 border-2 border-blue-300' : 'bg-white hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={partner.image}
                        alt={partner.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-slate-900 truncate">{partner.name}</div>
                        <div className="flex items-center gap-1 mb-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-sm text-slate-600">{partner.rating} ({partner.reviewCount})</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <MapPin className="w-3 h-3" />
                          <span>{partner.location}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Partner Details */}
              {selectedPartner && (
                <div className="mt-6 p-4 bg-white rounded-lg">
                  <h4 className="font-semibold text-slate-900 mb-2">{selectedPartner.name}</h4>
                  <p className="text-sm text-slate-600 mb-3">{selectedPartner.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    {selectedPartner.contact.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-600">{selectedPartner.contact.phone}</span>
                      </div>
                    )}
                    {selectedPartner.contact.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-600">{selectedPartner.contact.email}</span>
                      </div>
                    )}
                    {selectedPartner.contact.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-600">{selectedPartner.contact.website}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-3">
                    <div className="text-xs font-medium text-slate-700 mb-1">Specialties:</div>
                    <div className="flex flex-wrap gap-1">
                      {selectedPartner.specialties.map((specialty, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content - Clothing Items */}
          <div className="flex-1 overflow-y-auto">
            {/* Filters */}
            <div className="p-6 border-b bg-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">
                  Clothing Collection ({filteredItems.length} items)
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700">Filters:</span>
                </div>
                
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-1 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedSeason}
                  onChange={(e) => setSelectedSeason(e.target.value)}
                  className="px-3 py-1 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  {seasons.map((season) => (
                    <option key={season} value={season}>
                      {season === 'all' ? 'All Seasons' : season.charAt(0).toUpperCase() + season.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Items Grid/List */}
            <div className="p-6">
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedItem(item);
                        setCurrentImageIndex(0);
                      }}
                      className="bg-white rounded-xl shadow-sm border hover:shadow-lg transition cursor-pointer group"
                    >
                      <div className="relative overflow-hidden rounded-t-xl">
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
                        />
                        <div className="absolute top-3 right-3">
                          <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-slate-700">
                            {item.season}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="font-medium text-slate-900 mb-1">{item.name}</h4>
                        <p className="text-sm text-slate-600 mb-2">{item.category}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold text-green-600">${item.price}/day</span>
                          <div className="flex gap-1">
                            {item.colors.slice(0, 3).map((color, index) => (
                              <div
                                key={index}
                                className="w-4 h-4 rounded-full border border-slate-200"
                                style={{ backgroundColor: color.toLowerCase() === 'white' ? '#f8fafc' : color.toLowerCase() }}
                                title={color}
                              />
                            ))}
                            {item.colors.length > 3 && (
                              <span className="text-xs text-slate-500">+{item.colors.length - 3}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedItem(item);
                        setCurrentImageIndex(0);
                      }}
                      className="bg-white rounded-xl shadow-sm border hover:shadow-lg transition cursor-pointer p-4"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-900 mb-1">{item.name}</h4>
                          <p className="text-sm text-slate-600 mb-2">{item.description}</p>
                          <div className="flex items-center gap-4 text-sm text-slate-500">
                            <span>{item.category}</span>
                            <span>•</span>
                            <span>{item.season}</span>
                            <span>•</span>
                            <span>{item.sizes.length} sizes</span>
                            <span>•</span>
                            <span>{item.colors.length} colors</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-green-600">${item.price}/day</div>
                          <div className="text-sm text-slate-500">Available now</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Item Detail Modal */}
        {selectedItem && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-2xl font-semibold text-slate-900">{selectedItem.name}</h3>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-slate-400 hover:text-slate-600 transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-8 p-6">
                {/* Image Gallery */}
                <div>
                  <div className="relative mb-4">
                    <img
                      src={selectedItem.images[currentImageIndex]}
                      alt={selectedItem.name}
                      className="w-full h-96 object-cover rounded-lg"
                    />
                    {selectedItem.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>
                  
                  {selectedItem.images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto">
                      {selectedItem.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                            currentImageIndex === index ? 'border-blue-500' : 'border-slate-200'
                          }`}
                        >
                          <img
                            src={image}
                            alt={`${selectedItem.name} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Item Details */}
                <div>
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                        {selectedItem.category}
                      </span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                        {selectedItem.season}
                      </span>
                    </div>
                    <div className="text-3xl font-bold text-green-600 mb-2">${selectedItem.price}/day</div>
                    <p className="text-slate-600">{selectedItem.description}</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-slate-900 mb-2">Available Sizes</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedItem.sizes.map((size) => (
                          <span
                            key={size}
                            className="border border-slate-300 px-3 py-1 rounded-lg text-sm hover:border-blue-500 hover:bg-blue-50 transition cursor-pointer"
                          >
                            {size}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-slate-900 mb-2">Available Colors</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedItem.colors.map((color) => (
                          <div
                            key={color}
                            className="flex items-center gap-2 border border-slate-300 px-3 py-1 rounded-lg text-sm hover:border-blue-500 hover:bg-blue-50 transition cursor-pointer"
                          >
                            <div
                              className="w-4 h-4 rounded-full border border-slate-200"
                              style={{ backgroundColor: color.toLowerCase() === 'white' ? '#f8fafc' : color.toLowerCase() }}
                            />
                            <span>{color}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 space-y-3">
                    <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition">
                      Rent This Item
                    </button>
                    <button className="w-full border border-slate-300 text-slate-700 py-3 px-6 rounded-lg font-semibold hover:bg-slate-50 transition">
                      Add to Favorites
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PartnersShowcase;