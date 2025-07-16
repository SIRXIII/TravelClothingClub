import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Upload, Sparkles, AlertCircle } from 'lucide-react';

function VirtualTryOn() {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [selectedGarment, setSelectedGarment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const garmentOptions = [
    {
      value: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80',
      label: 'Blue Business Suit',
      category: 'tops'
    },
    {
      value: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80',
      label: 'Gray Travel Jacket',
      category: 'tops'
    },
    {
      value: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80',
      label: 'Elegant Evening Dress',
      category: 'dresses'
    },
    {
      value: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80',
      label: 'Professional Business Attire',
      category: 'tops'
    }
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUserImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setError(null);
      setResult(null);
    }
  };

  const handleTryOn = async () => {
    if (!userImage) {
      setError('Please upload your photo first');
      return;
    }
    
    if (!selectedGarment) {
      setError('Please select a garment to try on');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // This is where the FASHN API call would go
      // For now, we'll simulate the API call
      const selectedGarmentData = garmentOptions.find(g => g.value === selectedGarment);
      
      // Use the same proxy endpoint as other components
      const garmentBlob = await fetch(selectedGarment).then(r => r.blob());
      const formData = new FormData();
      formData.append('clothing_image', garmentBlob, 'garment.jpg');
      formData.append('gender', 'Female');

      const response = await fetch('/api/fashn-tryon', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('API call failed');
      }

      const data = await response.json();
      setResult(data.output_url);
    } catch (err) {
      // For demo purposes, we'll show a placeholder result
      setError('API not yet configured. This is a demo interface ready for integration.');
      // Uncomment the line below to show a demo result
      // setResult(selectedGarment);
    } finally {
      setIsLoading(false);
    }
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
                src="/TCC Cursive.png"
                alt="Travel Clothing Club"
                className="w-8 h-8 object-contain"
              />
              <h1 className="text-xl font-medium">Travel Clothing Club</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-blue-600" />
            <h2 className="text-4xl font-light text-gray-900">Virtual Try-On</h2>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See how our clothing looks on you before you travel. Upload your photo and select a garment to get started.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Upload Section */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium mb-4">1. Upload Your Photo</h3>
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {userImage ? (
                    <div className="space-y-4">
                      <img 
                        src={userImage} 
                        alt="Uploaded" 
                        className="max-w-full max-h-64 mx-auto rounded-lg shadow-md"
                      />
                      <p className="text-sm text-gray-600">Click to change photo</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                      <div>
                        <p className="text-lg font-medium text-gray-900">Upload your full body photo</p>
                        <p className="text-sm text-gray-600">PNG, JPG up to 10MB</p>
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
                <h3 className="text-xl font-medium mb-4">2. Select a Garment</h3>
                <div className="space-y-3">
                  {garmentOptions.map((garment) => (
                    <label key={garment.value} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="garment"
                        value={garment.value}
                        checked={selectedGarment === garment.value}
                        onChange={(e) => setSelectedGarment(e.target.value)}
                        className="text-blue-600"
                      />
                      <img 
                        src={garment.value} 
                        alt={garment.label}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <span className="font-medium">{garment.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={handleTryOn}
                disabled={isLoading || !userImage || !selectedGarment}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Try On
                  </>
                )}
              </button>
            </div>

            {/* Result Section */}
            <div className="space-y-6">
              <h3 className="text-xl font-medium">3. See the Result</h3>
              
              <div className="border-2 border-gray-200 rounded-lg p-8 min-h-96 flex items-center justify-center">
                {result ? (
                  <div className="text-center">
                    <img 
                      src={result} 
                      alt="Try-on result" 
                      className="max-w-full max-h-80 mx-auto rounded-lg shadow-md"
                    />
                    <p className="mt-4 text-sm text-gray-600">Your virtual try-on result</p>
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
                      <p className="text-lg font-medium text-gray-900">Ready to try on</p>
                      <p className="text-sm text-gray-600">Upload your photo and select a garment to see the magic</p>
                    </div>
                  </div>
                )}
              </div>

              {result && (
                <div className="space-y-4">
                  <button className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition">
                    Rent This Item
                  </button>
                  <button 
                    onClick={() => {
                      setResult(null);
                      setError(null);
                    }}
                    className="w-full bg-gray-100 text-gray-900 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition"
                  >
                    Try Another Item
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-blue-50 rounded-xl p-8">
          <h3 className="text-xl font-medium mb-4 text-center">How Virtual Try-On Works</h3>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Upload className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-medium mb-2">Upload Photo</h4>
              <p className="text-sm text-gray-600">Take or upload a full-body photo with good lighting</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-medium mb-2">AI Processing</h4>
              <p className="text-sm text-gray-600">Our AI analyzes your body shape and fits the garment</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <ArrowLeft className="w-6 h-6 text-blue-600 rotate-180" />
              </div>
              <h4 className="font-medium mb-2">See Results</h4>
              <p className="text-sm text-gray-600">View how the clothing looks on you before renting</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default VirtualTryOn;