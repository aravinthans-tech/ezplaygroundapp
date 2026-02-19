import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateQrCode } from '../../services/api';
import Toast from '../common/Toast';
import Navigation from '../common/Navigation';
import Sidebar from '../common/Sidebar';

const QrCodePage = () => {
  const navigate = useNavigate();
  const [apiKey, setApiKey] = useState('dev-api-key-12345');
  const [qrValue, setQrValue] = useState('Hello World');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [qrImageSrc, setQrImageSrc] = useState('');
  const [jsonResponse, setJsonResponse] = useState('');
  const [responseStatus, setResponseStatus] = useState('');
  const [responseTime, setResponseTime] = useState('');
  const [toast, setToast] = useState({ message: '', type: 'success', show: false });
  const jsonResponseRef = useRef(null);

  const showToastMessage = (message, type = 'success') => {
    setToast({ message, type, show: true });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  const handleGenerate = async (e) => {
    e.preventDefault();

    if (!apiKey.trim() || !qrValue.trim()) {
      showToastMessage('Please fill in all fields', 'error');
      return;
    }

    setIsGenerating(true);
    setShowResult(false);
    setShowError(false);
    setJsonResponse('');

    const startTime = performance.now();

    try {
      const data = await generateQrCode(apiKey.trim(), qrValue.trim());
      const endTime = performance.now();
      const responseTimeMs = (endTime - startTime).toFixed(2);

      setJsonResponse(JSON.stringify(data, null, 2));
      setResponseTime(`${responseTimeMs} ms`);

      if (data.id === 1 && data.output) {
        setQrImageSrc(`data:image/png;base64,${data.output}`);
        setResponseStatus('Success');
        setShowResult(true);
        setShowError(false);
        showToastMessage('QR code generated successfully!', 'success');

        // Save to localStorage
        localStorage.setItem('qrcode_data', JSON.stringify({
          apiKey: apiKey,
          qrValue: qrValue,
          result: data
        }));
      } else {
        setErrorMessage(data.EncryptOutput || 'Failed to generate QR code');
        setShowError(true);
        setShowResult(false);
        showToastMessage('Failed to generate QR code', 'error');
      }
    } catch (error) {
      const endTime = performance.now();
      const responseTimeMs = (endTime - startTime).toFixed(2);
      setResponseTime(`${responseTimeMs} ms`);
      setErrorMessage(error.message || 'An error occurred');
      setShowError(true);
      setShowResult(false);
      setJsonResponse(JSON.stringify({ error: error.message }, null, 2));
      showToastMessage('Network error occurred', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (qrImageSrc) {
      const link = document.createElement('a');
      link.href = qrImageSrc;
      link.download = 'qrcode.png';
      link.click();
      showToastMessage('QR code downloaded!', 'success');
    }
  };

  const handleClear = () => {
    setShowResult(false);
    setShowError(false);
    setJsonResponse('');
    setQrValue('');
    localStorage.removeItem('qrcode_data');
  };

  const handleCopyJson = () => {
    if (jsonResponseRef.current) {
      jsonResponseRef.current.select();
      document.execCommand('copy');
      showToastMessage('JSON copied to clipboard!', 'success');
    }
  };

  const handleViewCodeExamples = () => {
    navigate('/examples?function=qrcode');
  };

  useEffect(() => {
    // Load from localStorage on mount
    const savedData = localStorage.getItem('qrcode_data');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        setApiKey(data.apiKey || '');
        setQrValue(data.qrValue || '');
        if (data.result && data.result.id === 1 && data.result.output) {
          setQrImageSrc(`data:image/png;base64,${data.result.output}`);
          setJsonResponse(JSON.stringify(data.result, null, 2));
          setShowResult(true);
        }
      } catch (e) {
        console.error('Error loading saved data:', e);
      }
    }
  }, []);

  return (
    <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex flex-col gradient-animate" style={{ height: '100vh', margin: 0, padding: 0, backgroundSize: '400% 400%' }}>
      <Navigation />
      
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      <div className="flex flex-1 overflow-hidden" style={{ minHeight: 0 }}>
        <Sidebar />

        <div className="flex-1 overflow-y-auto p-4 pb-8">
          {/* API Information Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-4 card-hover animate-fadeInUp">
            <h2 className="text-xl font-bold text-gray-900 mb-4">API Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div className="border-l-4 border-purple-500 pl-4">
                <div className="font-semibold text-gray-700 mb-1">Endpoint</div>
                <code className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-mono text-xs">POST /api/qrcode/generate</code>
              </div>
              <div className="border-l-4 border-cyan-500 pl-4">
                <div className="font-semibold text-gray-700 mb-1">Authentication</div>
                <div className="text-gray-600 text-xs">X-API-Key header required</div>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <div className="font-semibold text-gray-700 mb-1">Request Body</div>
                <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto mt-1">{`{"qrvalue": "string"}`}</pre>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <div className="font-semibold text-gray-700 mb-1">Response</div>
                <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto mt-1">{`{"output": "base64", "id": 1}`}</pre>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Left Column: Generate Form */}
            <div className="flex flex-col space-y-4">
              <div className="bg-white rounded-lg shadow-md p-6 flex-shrink-0 card-hover animate-slideInLeft delay-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Generate QR Code
                </h2>
                <form onSubmit={handleGenerate} className="space-y-4">
                  <div>
                    <label htmlFor="apiKey" className="block text-sm font-semibold text-gray-700 mb-2">
                      API Key <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="apiKey"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 input-focus"
                      placeholder="Enter your API key"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="qrValue" className="block text-sm font-semibold text-gray-700 mb-2">
                      QR Code Value <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="qrValue"
                      value={qrValue}
                      onChange={(e) => setQrValue(e.target.value)}
                      rows="4"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 resize-none input-focus"
                      placeholder="Enter text to encode in QR code"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center shadow-md hover:shadow-lg button-hover disabled:opacity-50"
                  >
                    <span>{isGenerating ? 'Generating...' : 'Generate QR Code'}</span>
                    {isGenerating && (
                      <svg className="animate-spin h-5 w-5 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                  </button>
                </form>
              </div>

              {/* QR Code Display */}
              {showResult && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Generated QR Code</h3>
                  <div className="flex flex-col items-center space-y-4">
                    <div className="bg-white p-4 rounded-lg border-2 border-gray-200 shadow-inner">
                      <img src={qrImageSrc} alt="QR Code" className="max-w-full h-auto" />
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={handleDownload}
                        className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white font-semibold py-2 px-4 rounded-lg button-hover"
                      >
                        Download QR Code
                      </button>
                      <button
                        onClick={handleClear}
                        className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="w-full bg-gray-50 rounded-lg p-4 space-y-2">
                      <div className="text-sm">
                        <span className="font-semibold text-gray-700">Status:</span>
                        <span className="ml-2 text-green-600 font-medium">{responseStatus}</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-semibold text-gray-700">Response Time:</span>
                        <span className="ml-2 text-gray-900 font-medium">{responseTime}</span>
                      </div>
                    </div>
                    <div className="mt-4 w-full">
                      <button
                        onClick={handleViewCodeExamples}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl button-hover animate-blink"
                      >
                        <div className="flex items-center justify-center">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                          </svg>
                          View Code Examples
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Display */}
              {showError && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                    <h3 className="text-sm font-semibold text-red-800 mb-2">Error</h3>
                    <p className="text-sm text-red-700">{errorMessage}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: JSON Result */}
            <div className="flex flex-col">
              <div className="bg-white rounded-lg shadow-md p-6 card-hover animate-slideInRight delay-200">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    JSON Response
                  </h2>
                  <button
                    onClick={handleCopyJson}
                    className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 text-sm"
                  >
                    Copy JSON
                  </button>
                </div>
                <textarea
                  ref={jsonResponseRef}
                  readOnly
                  value={jsonResponse}
                  className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto border-2 border-gray-800 w-full h-96 font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QrCodePage;

