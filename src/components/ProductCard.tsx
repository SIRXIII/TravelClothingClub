import React, { useState } from 'react';
import { Heart, Star, MapPin, Sparkles } from 'lucide-react';
import AITryOnModal from './AITryOnModal';

interface ClothingItem {
  id: string;
  title: string;
  description: string;
  category: string;
  size: string;
  price_per_rental: number;
  images: string[];
  ai_model_image?: string | null;
  location?: string;
  lender?: {
    full_name: string;
    verified: boolean;
  };
}

interface ProductCardProps {
  item: ClothingItem;
  onRent?: () => void;
  onFavorite?: (itemId: string) => void;
  isFavorite?: boolean;
  rentalDays?: number;
}

function ProductCard({ item, onRent, onFavorite, isFavorite = false, rentalDays = 1 }: ProductCardProps) {
  const [showTryOn, setShowTryOn] = useState(false);

  const handleTryOnClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowTryOn(true);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavorite?.(item.id);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-lg transition group">
        <div className="relative">
          {item.images.length > 0 && (
            <img
              src={item.images[0]}
              alt={item.title}
              className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
            />
          )}
          
          {/* Overlay buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <button
              onClick={handleFavoriteClick}
              className={`p-2 rounded-full transition ${
                isFavorite
                  ? 'bg-red-500 text-white'
                  : 'bg-white/80 text-gray-600 hover:bg-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* AI Try-On Button Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <button
              onClick={handleTryOnClick}
              className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium shadow-lg hover:bg-gray-50 transition flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Try On With AI
            </button>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-medium text-gray-900 line-clamp-2 flex-1">{item.title}</h3>
            <div className="text-right ml-2">
              <div className="text-lg font-semibold text-green-600">
                ${item.price_per_rental}
              </div>
              <div className="text-xs text-gray-500">per day</div>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
          
          <div className="flex items-center justify-between text-sm mb-3">
            <span className="bg-gray-100 px-2 py-1 rounded text-gray-700">
              {item.category} • {item.size}
            </span>
            {item.location && (
              <div className="flex items-center gap-1 text-gray-600">
                <MapPin className="w-3 h-3" />
                <span className="text-xs">{item.location}</span>
              </div>
            )}
          </div>

          {item.lender && (
            <div className="flex items-center justify-between text-sm mb-3">
              <span className="text-gray-600">by {item.lender.full_name}</span>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span className="text-xs text-gray-600">4.8</span>
              </div>
            </div>
          )}

          {rentalDays > 1 && (
            <div className="text-sm text-gray-600 mb-3">
              <strong>Total: ${(item.price_per_rental * rentalDays).toFixed(2)}</strong>
              <span className="text-gray-500"> for {rentalDays} day{rentalDays !== 1 ? 's' : ''}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2">
            <button
              onClick={handleTryOnClick}
              className="w-full bg-blue-50 text-blue-700 py-2 px-4 rounded-lg font-medium hover:bg-blue-100 transition flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Try On With AI
            </button>
            
            <button 
              onClick={onRent}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Rent Now
            </button>
          </div>
        </div>
      </div>

      {/* AI Try-On Modal */}
      <AITryOnModal
        isOpen={showTryOn}
        onClose={() => setShowTryOn(false)}
        clothingItem={{
          id: item.id,
          title: item.title,
          images: item.images,
          category: item.category
        }}
      />
    </>
  );
}

export default ProductCard;