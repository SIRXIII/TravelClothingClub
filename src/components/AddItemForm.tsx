import React, { useState, useRef } from 'react';
import { ArrowLeft, Upload, Sparkles, X, DollarSign } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

interface ClothingItem {
  id: string;
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
}

interface AddItemFormProps {
  item?: ClothingItem | null;
  onSuccess: () => void;
  onCancel: () => void;
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

function AddItemForm({ item, onSuccess, onCancel }: AddItemFormProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState(item?.title || '');
  const [description, setDescription] = useState(item?.description || '');
  const [category, setCategory] = useState(item?.category || categories[0]);
  const [size, setSize] = useState(item?.size || '');
  const [price, setPrice] = useState(item?.price_per_rental?.toString() || '');
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(item?.images || []);
  const [aiImage, setAiImage] = useState<string | null>(item?.ai_model_image || null);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [modelGender, setModelGender] = useState<'Male' | 'Female'>('Female');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length + images.length + existingImages.length > 3) {
      setError('Maximum 3 images allowed');
      return;
    }
    setImages([...images, ...files]);
    setError(null);
    setAiError(null);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `clothing-images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleAIGenerate = async () => {
    if (images.length === 0 && existingImages.length === 0) {
      setAiError('Please upload at least one image first');
      return;
    }

    setAiLoading(true);
    setAiError(null);

    try {
      // Get the first available image
      let clothingImage: File | string | null = null;

      if (images.length > 0) {
        clothingImage = images[0];
      } else if (existingImages.length > 0) {
        clothingImage = existingImages[0];
      }

      const formData = new FormData();
      if (clothingImage instanceof File) {
        formData.append('clothing_image', clothingImage);
      } else if (typeof clothingImage === 'string') {
        // If it's a URL, fetch it and convert to a blob
        const response = await fetch(clothingImage);
        const blob = await response.blob();
        formData.append('clothing_image', blob, 'clothing_image.jpg');
      }

      formData.append('gender', modelGender);

     // Call our proxy API to interact with Fashn.ai
      const response = await fetch('/api/fashn-tryon', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = await response.text();
        }
        throw new Error(typeof errorData === 'string' ? errorData : errorData.message || 'API request failed');
      }

      let data;
      try {
        data = await response.json();
      } catch {
        const responseText = await response.text();
        throw new Error(`Server returned non-JSON response: ${responseText}`);
      }

      if (data.output) {
        setAiImage(data.output);
      } else if (data.tryon_image_url) {
        setAiImage(data.tryon_image_url);
      } else {
        throw new Error(`No image URL returned from API: ${JSON.stringify(data)}`);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setAiError(`AI preview failed: ${errorMessage}`);
      console.error('Fashn.ai API error:', err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      // Upload new images
      const uploadedImageUrls = await Promise.all(
        images.map(file => uploadImage(file))
      );

      // Combine existing and new image URLs
      const allImageUrls = [...existingImages, ...uploadedImageUrls];

      const itemData = {
        lender_id: user.id,
        title,
        description,
        category,
        size,
        price_per_rental: parseFloat(price),
        images: allImageUrls,
        ai_model_image: aiImage,
      };

      if (item) {
        // Update existing item
        const { error } = await supabase
          .from('clothing_items')
          .update(itemData)
          .eq('id', item.id);

        if (error) throw error;
      } else {
        // Create new item
        const { error } = await supabase
          .from('clothing_items')
          .insert(itemData);

        if (error) throw error;
      }

      onSuccess();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onCancel}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
            <div className="flex items-center gap-3">
              <img
                src="/TCC Cursive.png"
                alt="Travel Clothing Club"
                className="w-8 h-8 object-contain"
              />
              <h1 className="text-xl font-medium">
                {item ? 'Edit Item' : 'Add New Item'}
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Item Title *
                  </label>
                  <input
                    id="title"
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="e.g., Navy Blue Business Suit"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    required
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                    placeholder="Describe the item, its condition, brand, and any special features..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      id="category"
                      required
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-2">
                      Size *
                    </label>
                    <input
                      id="size"
                      type="text"
                      required
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="M, L, 32, 6, etc."
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                    Rental Price per Day *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="price"
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

              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Images (Max 3) *
                  </label>

                  {/* Existing Images */}
                  {existingImages.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Current Images:</p>
                      <div className="grid grid-cols-3 gap-2">
                        {existingImages.map((url, index) => (
                          <div key={index} className="relative">
                            <img
                              src={url}
                              alt={`Existing ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeExistingImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* New Images */}
                  {images.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">New Images:</p>
                      <div className="grid grid-cols-3 gap-2">
                        {images.map((file, index) => (
                          <div key={index} className="relative">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Upload ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Upload Button */}
                  {images.length + existingImages.length < 3 && (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition cursor-pointer"
                    >
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        Click to upload images
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG up to 10MB each
                      </p>
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                {/* Model Gender Selector */}
                {(images.length > 0 || existingImages.length > 0) && (
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
                )}

                {/* Generate AI Model Preview Button */}
                {(images.length > 0 || existingImages.length > 0) && (
                  <div>
                    <button
                      type="button"
                      onClick={handleAIGenerate}
                      disabled={aiLoading}
                      className="w-full bg-purple-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                    >
                      {aiLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Generate AI Model Preview
                        </>
                      )}
                    </button>

                    {/* AI Error Message */}
                    {aiError && (
                      <div className="mt-2 text-sm text-red-600">
                        {aiError}
                      </div>
                    )}
                  </div>
                )}

                {/* AI Model Preview Display */}
                {aiImage && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      AI Model Preview
                    </label>
                    <div className="relative">
                      <img
                        src={aiImage}
                        alt="AI Model Preview"
                        className="w-full h-64 object-cover rounded-lg shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => setAiImage(null)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Placeholder when no AI image */}
                {!aiImage && (images.length > 0 || existingImages.length > 0) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      AI Model Preview
                    </label>
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                      <Sparkles className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        Generate an AI model wearing this item
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Select gender and click Generate
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    {item ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  item ? 'Update Item' : 'Add Item'
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default AddItemForm;