import React, { useState, useRef } from 'react';
import { X, Upload, Sparkles, AlertCircle, Camera } from 'lucide-react';

interface AITryOnModalProps {
  isOpen: boolean;
  onClose: () => void;
  clothingItem: {
    id: string;
    title: string;
    images: string[];
    category: string;
  };
}

function AITryOnModal({ isOpen, onClose, clothingItem }: AITryOnModalProps) {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setUserImage(e.target?.result as string);
        setError(null);
        setResultImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGeneratePreview = async () => {
    setLoading(true);
    setError(null);

    try {
      // Prepare the request data
      const requestData = {
        clothing_image: clothingItem.images[0],
        user_image: userImage,
        category: clothingItem.category.toLowerCase(),
        item_id: clothingItem.id
      };

      // Call the AI try-on API
      const response = await fetch('/api/ai-try-on', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error('Failed to generate try-on preview');
      }

      const data = await response.json();
      
      if (data.success) {
        setResultImage(data.result_image_url);
      } else {
        throw new Error(data.message || 'Failed to generate preview');
      }
    } catch (err: any) {
      // For demo purposes, show a mock result
      setError('AI try-on service is currently in development. This is a preview of the interface.');
      
      // Uncomment the line below to show a demo result
      // setResultImage(clothingItem.images[0]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setUserImage(null);
    setResultImage(null);
    setError(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-medium">AI Try-On</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Item Info */}
          <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <img
              src={clothingItem.images[0]}
              alt={clothingItem.title}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div>
              <h3 className="font-medium text-gray-900">{clothingItem.title}</h3>
              <p className="text-sm text-gray-600">Category: {clothingItem.category}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Side - Upload & Controls */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">1. Upload Your Photo (Optional)</h3>
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {userImage ? (
                    <div className="space-y-4">
                      <img 
                        src={userImage} 
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
                        <p className="text-sm text-gray-600">Or skip to use our default model</p>
                        <p className="text-xs text-gray-500 mt-2">PNG, JPG up to 10MB</p>
                      </div>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">2. Generate Preview</h3>
                <button
                  onClick={handleGeneratePreview}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Generating Preview...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate Preview
                    </>
                  )}
                </button>

                {(userImage || resultImage) && (
                  <button
                    onClick={handleReset}
                    className="w-full mt-3 bg-gray-100 text-gray-900 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition"
                  >
                    Start Over
                  </button>
                )}
              </div>
            </div>

            {/* Right Side - Result */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium">3. Preview Result</h3>
              
              <div className="border-2 border-gray-200 rounded-lg p-6 min-h-96 flex items-center justify-center">
                {resultImage ? (
                  <div className="text-center space-y-4">
                    <img 
                      src={resultImage} 
                      alt="AI try-on result" 
                      className="max-w-full max-h-80 mx-auto rounded-lg shadow-md object-cover"
                    />
                    <p className="text-sm text-gray-600">Your AI try-on preview</p>
                  </div>
                ) : error ? (
                  <div className="text-center space-y-4">
                    <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
                    <div>
                      <p className="text-lg font-medium text-gray-900">Demo Mode</p>
                      <p className="text-sm text-gray-600 max-w-sm mx-auto">{error}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                      <Sparkles className="w-8 h-8 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-900">Ready to preview</p>
                      <p className="text-sm text-gray-600 max-w-sm mx-auto">
                        {userImage 
                          ? 'Click "Generate Preview" to see how this item looks on you'
                          : 'Upload your photo or generate with our default model'
                        }
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {resultImage && (
                <div className="space-y-3">
                  <button 
                    onClick={onClose}
                    className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition"
                  >
                    Looks Great! Continue Shopping
                  </button>
                  <button 
                    onClick={handleReset}
                    className="w-full bg-gray-100 text-gray-900 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition"
                  >
                    Try Different Photo
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-8 bg-blue-50 rounded-xl p-6">
            <h4 className="text-lg font-medium mb-3 text-center">How AI Try-On Works</h4>
            <div className="grid md:grid-cols-3 gap-4 text-center text-sm">
              <div>
                <Upload className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="font-medium">Upload Photo</p>
                <p className="text-gray-600">Take or upload a clear photo</p>
              </div>
              <div>
                <Sparkles className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="font-medium">AI Processing</p>
                <p className="text-gray-600">Our AI fits the garment to your body</p>
              </div>
              <div>
                <Camera className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="font-medium">See Results</p>
                <p className="text-gray-600">View realistic try-on preview</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AITryOnModal;