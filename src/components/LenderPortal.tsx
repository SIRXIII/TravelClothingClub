import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase, addItem, getUserItems } from '../lib/supabase';
import AuthForm from './AuthForm';
import LenderDashboard from './LenderDashboard';
import LenderLandingPage from './LenderLandingPage';

function LenderPortal() {
  const { user, loading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  
  // Form state for adding items
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [size, setSize] = useState('');
  const [condition, setCondition] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [description, setDescription] = useState('');
  const [gender, setGender] = useState<'male'|'female'>('female');
  const [imageFile, setImageFile] = useState<File|null>(null);
  const [aiPreviewUrl, setAiPreviewUrl] = useState<string|null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Categories and options
  const categories = ['Suit', 'Dress', 'Shirt', 'Pants', 'Jacket', 'Blazer', 'Skirt', 'Blouse', 'Kids', 'Accessories', 'Other'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '38', '40', '42', '44', '46', '48', '50', '2T', '3T', '4T', '5T', '6', '7', '8', '10', '12', '14', '16'];
  const conditions = ['New with tags', 'Like new', 'Excellent', 'Good', 'Fair'];

  // Handle AI preview generation
  const handleGenerateAiPreview = async () => {
    if (!imageFile) return;
    
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('clothing_image', imageFile);
      formData.append('gender', gender);

      const response = await fetch('/api/fashn-tryon', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to generate AI preview');
      }

      const data = await response.json();
      setAiPreviewUrl(data.tryon_image_url);
    } catch (error) {
      console.error('Error generating AI preview:', error);
      alert('Failed to generate AI preview. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmitListing = async () => {
    if (!user || !imageFile || !title || !category || !size || !condition || !price) {
      alert('Please fill in all required fields and upload an image');
      return;
    }

    setLoading(true);
    try {
      // Upload image to Supabase Storage (simplified - you may want to implement proper storage)
      const imageUrl = URL.createObjectURL(imageFile); // Temporary - replace with actual upload
      
      await addItem({
        owner_id: user.id,
        title,
        category,
        size,
        condition,
        price,
        description,
        image_url: imageUrl,
        ai_preview_url: aiPreviewUrl || ''
      });

      setSuccess(true);
      // Reset form
      setTitle('');
      setCategory('');
      setSize('');
      setCondition('');
      setPrice(0);
      setDescription('');
      setImageFile(null);
      setAiPreviewUrl(null);
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error submitting listing:', error);
      alert('Failed to submit listing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Show landing page by default
  if (!showAuth && !user) {
    return <LenderLandingPage />;
  }

  // Show auth form if requested
  if (showAuth && !user) {
    return <AuthForm onSuccess={() => setShowAuth(false)} />;
  }

  // Show dashboard if authenticated
  if (user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LenderDashboard onSignOut={() => setShowAuth(false)} />
        
        {/* Add Item Form Card */}
        <div className="bg-white rounded-xl shadow p-6 max-w-xl mx-auto my-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Add New Item</h3>
          
          {/* Image Upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={e => setImageFile(e.target.files?.[0] || null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Gender Selector */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">AI Model Gender</label>
            <select 
              value={gender} 
              onChange={e => setGender(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="female">Female Model</option>
              <option value="male">Male Model</option>
            </select>
          </div>

          {/* AI Preview Generation */}
          <button 
            onClick={handleGenerateAiPreview} 
            disabled={!imageFile || loading}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition mb-4"
          >
            {loading ? 'Generating...' : 'Generate AI Preview'}
          </button>

          {/* AI Preview Display */}
          {aiPreviewUrl && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">AI Preview</label>
              <img src={aiPreviewUrl} alt="AI Preview" className="mt-4 rounded-lg shadow-md max-w-full h-48 object-cover mx-auto" />
            </div>
          )}

          {/* Detail Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
              <input 
                placeholder="e.g., Navy Blue Business Suit" 
                value={title} 
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <select 
                value={category} 
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Size *</label>
              <select 
                value={size} 
                onChange={e => setSize(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="">Select size</option>
                {sizes.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Condition *</label>
              <select 
                value={condition} 
                onChange={e => setCondition(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="">Select condition</option>
                {conditions.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price per Day *</label>
              <input 
                type="number" 
                placeholder="25.00" 
                value={price || ''} 
                onChange={e => setPrice(+e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea 
                placeholder="Describe the item, brand, condition, and special features..." 
                value={description} 
                onChange={e => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button 
            onClick={handleSubmitListing}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition mt-6"
          >
            {loading ? 'Submitting...' : 'Submit Listing'}
          </button>

          {/* Success Message */}
          {success && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-green-600 font-medium">Your item has been listed!</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <LenderLandingPage />;
}

export default LenderPortal;