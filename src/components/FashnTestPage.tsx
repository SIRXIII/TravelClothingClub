import React, { useState } from 'react';

function FashnTestPage() {
  const [testResults, setTestResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedTest, setSelectedTest] = useState('');

  const runTest = async (testType: string) => {
    setLoading(true);
    setTestResults(null);
    
    try {
      let response;
      
      switch (testType) {
        case 'credentials':
          response = await fetch('/api/test-fashn');
          break;
          
        case 'simple-tryon':
          const formData = new FormData();
          // Create a simple test image (1x1 pixel)
          const canvas = document.createElement('canvas');
          canvas.width = 1;
          canvas.height = 1;
          const ctx = canvas.getContext('2d');
          ctx!.fillStyle = 'red';
          ctx!.fillRect(0, 0, 1, 1);
          
          canvas.toBlob((blob) => {
            if (blob) {
              formData.append('clothing_image', blob, 'test.jpg');
              formData.append('gender', 'Female');
            }
          }, 'image/jpeg');
          
          // Wait for blob creation
          await new Promise(resolve => setTimeout(resolve, 100));
          
          response = await fetch('/api/fashn-tryon-debug', {
            method: 'POST',
            body: formData
          });
          break;
          
        default:
          throw new Error('Unknown test type');
      }
      
      const data = await response.json();
      setTestResults({
        status: response.status,
        ok: response.ok,
        data: data
      });
      
    } catch (error) {
      setTestResults({
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Fashn.ai API Test Suite</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Test Controls */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Run Tests</h2>
            
            <div className="space-y-4">
              <button
                onClick={() => runTest('credentials')}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading && selectedTest === 'credentials' ? 'Testing...' : 'Test API Credentials'}
              </button>
              
              <button
                onClick={() => runTest('simple-tryon')}
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:bg-gray-400"
              >
                {loading && selectedTest === 'simple-tryon' ? 'Testing...' : 'Test Simple Try-On'}
              </button>
            </div>
          </div>
          
          {/* Results */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Test Results</h2>
            
            {testResults ? (
              <div className="space-y-2">
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
                  {JSON.stringify(testResults, null, 2)}
                </pre>
              </div>
            ) : (
              <p className="text-gray-500">Run a test to see results</p>
            )}
          </div>
        </div>
        
        {/* Instructions */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">Troubleshooting Steps</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li><strong>Test API Credentials:</strong> Verifies your FASHN_API_KEY is set and valid</li>
            <li><strong>Test Simple Try-On:</strong> Tests the full pipeline with a minimal image</li>
            <li><strong>Check Netlify Logs:</strong> Go to Netlify dashboard → Functions → View logs for detailed output</li>
            <li><strong>Check Browser Console:</strong> Look for any JavaScript errors or network issues</li>
            <li><strong>Verify Environment:</strong> Ensure FASHN_API_KEY is set in Netlify environment variables</li>
          </ol>
        </div>
        
        {/* Common Issues */}
        <div className="mt-6 bg-yellow-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">Common Issues & Solutions</h3>
          <div className="space-y-3 text-sm">
            <div>
              <strong>❌ "FASHN_API_KEY not configured"</strong>
              <p>→ Add your API key to Netlify environment variables</p>
            </div>
            <div>
              <strong>❌ "Invalid API key or API key has expired"</strong>
              <p>→ Check your Fashn.ai account and regenerate the key if needed</p>
            </div>
            <div>
              <strong>❌ "No credits available"</strong>
              <p>→ Add credits to your Fashn.ai account</p>
            </div>
            <div>
              <strong>❌ "Failed to start prediction"</strong>
              <p>→ Check image format and size, ensure base64 encoding is correct</p>
            </div>
            <div>
              <strong>❌ "Prediction timed out"</strong>
              <p>→ Try with smaller images or check Fashn.ai service status</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FashnTestPage;