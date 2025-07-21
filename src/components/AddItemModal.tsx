import React, { useState, useRef } from 'react';

interface AddItemModalProps {
  onClose: () => void;
}

function AddItemModal({ onClose }: AddItemModalProps) {
  const [itemName, setItemName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [size, setSize] = useState('');
  const [condition, setCondition] = useState('');
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
      // Call our API endpoint
      const response = await fetch('/api/fashn-tryon', {
        method: 'POST',
        body: formData
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || 'AI generation failed');
      }
      const data = await response.json();
      if (data.tryon_image_url) {
        setAiPreview(data.tryon_image_url);
      } else {
        throw new Error('No AI preview generated');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setAiError(`AI preview failed: ${errorMessage}`);
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
    setLoading(true);
    setError(null);
    try {
      // Mock successful submission
      console.log('Item added:', {
        itemName,
        brand,
        category,
        size,
        condition,
        price,
        description,
        image
      });
      onClose();
      // Reset form
      setItemName('');
      setBrand('');
      setCategory('');
      setSize('');
      setCondition('');
      setPrice('');
      setDescription('');
      setImage(null);
      setImagePreview(null);
      setAiPreview(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          {/* Add your form fields here */}
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Add Item
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddItemModal;