import React, { useState, useRef } from 'react';
import { X, Upload, Sparkles, DollarSign } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { addItem } from '../lib/supabase';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const categories = [
  'Suit',
  'Dress',
  'Shirt',
  'Pants',
  'Jacket',
  'Blazer',
  'Skirt',
  'Blouse',
  'Kids',
  'Accessories',
  'Other'
];

const conditions = [
  'New with tags',
  'Like new',
  'Excellent',
  'Good',
  'Fair'
];

const sizes = [
  'XS', 'S', 'M', 'L', 'XL', 'XXL',
  '28', '30', '32', '34', '36', '38', '40', '42', '44', '46', '48', '50',
  '2T', '3T', '4T', '5T', '6', '7', '8', '10', '12', '14', '16'
];

function AddItemModal({ isOpen, onClose, onSuccess }: AddItemModalProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [size, setSize] = useState('');
  const [condition, setCondition] = useState(conditions[0]);
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [aiPreview, setAiPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [modelGender, setModelGender] = useState<'Male' | 'Female'>('Female');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setError(null);
      setAiError(null);
    }
  };

  const generateAIPreview = async () => {
    if (!image) {
      setAiError('Please upload an image first');
      return;
    }

    setAiLoading(true);
    setAiError(null);

    try {
      const formData = new FormData();
      formData.append('clothing_image', image);
      formData.append('gender', modelGender);

      // Call Fashn.ai API
      const response = await fetch('https://app.fashn.ai/api/tryon', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_FASHN_AI_API_KEY}`,
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'AI generation failed');
      }

      const data = await response.json();
      
      if (data.tryon_image_url) {
        setAiPreview(data.tryon_image_url);
      } else {
        throw new Error('No AI preview generated');
      }
    } catch (err: any) {
      setAiError(`AI preview failed: ${err.message}`);
      console.error('Fashn.ai API error:', err);
    } finally {
      setAiLoading(false);
    }
  };

  const uploadImageToSupabase = async (file: File): Promise<string> => {
    // For demo purposes, we'll use a placeholder URL
    // In production, you'd upload to Supabase Storage
    return URL.createObjectURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !image) return;

    setLoading(true);
    setError(null);

    try {
      // Upload image to Supabase Storage
      const imageUrl = await uploadImageToSupabase(image);

      // Add item to database
      await addItem({
        owner_id: user.id,
        title,
        category,
        size,
        condition,
        price: parseFloat(price),
        description,
        image_url: imageUrl,
        ai_preview_url: aiPreview || ''
      });

      onSuccess();
      onClose();
      
      // Reset form
      setTitle('');
      setCategory(categories[0]);
      setSize('');
      setCondition(conditions[0]);
      setPrice('');
      setDescription('');
      setImage(null);
      setImagePreview(null);
      setAiPreview(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-medium">Add New Item</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column - Form Fields */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Item Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="e.g., Navy Blue Business Suit"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      required
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Size *
                    </label>
                    <select
                      required
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                      <option value="">Select size</option>
                      {sizes.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Condition *
                    </label>
                    <select
                      required
                      value={condition}
                      onChange={(e) => setCondition(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                      {conditions.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Daily Price *
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="25.00"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                    placeholder="Describe the item, brand, condition, and special features..."
                  />
                </div>
              </div>

              {/* Right Column - Image Upload & AI Preview */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Item Image *
                  </label>
                  
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Item preview"
                        className="w-full h-48 object-cover rounded-lg shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImage(null);
                          setImagePreview(null);
                          setAiPreview(null);
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition cursor-pointer"
                    >
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Click to upload image</p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                {/* AI Preview Section */}
                {imagePreview && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Model Gender
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="modelGender"
                            value="Female"
                            checked={modelGender === 'Female'}
                            onChange={(e) => setModelGender(e.target.value as 'Female')}
                            className="mr-2 text-blue-600"
                          />
                          Female
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="modelGender"
                            value="Male"
                            checked={modelGender === 'Male'}
                            onChange={(e) => setModelGender(e.target.value as 'Male')}
                            className="mr-2 text-blue-600"
                          />
                          Male
                        </label>
                      </div>
                    </div>

                    <div>
                      <button
                        type="button"
                        onClick={generateAIPreview}
                        disabled={aiLoading}
                        className="w-full bg-purple-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                      >
                        {aiLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Generating AI Preview...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            Generate AI Try-On Preview
                          </>
                        )}
                      </button>

                      {aiError && (
                        <div className="mt-2 text-sm text-red-600">
                          {aiError}
                        </div>
                      )}
                    </div>

                    {/* AI Preview Display */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        AI Try-On Preview
                      </label>
                      
                      {aiPreview ? (
                        <div className="relative">
                          <img
                            src={aiPreview}
                            alt="AI try-on preview"
                            className="w-full h-48 object-cover rounded-lg shadow-md"
                          />
                          <button
                            type="button"
                            onClick={() => setAiPreview(null)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                          <Sparkles className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">
                            Generate AI preview to show how this item looks on a model
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !image}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Adding Item...
                  </>
                ) : (
                  'Add Item'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddItemModal;