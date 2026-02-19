import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyKyc } from '../../services/api';
import Toast from '../common/Toast';
import Navigation from '../common/Navigation';
import Sidebar from '../common/Sidebar';

const KycAgentPage = () => {
  const navigate = useNavigate();
  const [apiKey, setApiKey] = useState('');
  const [expectedAddress, setExpectedAddress] = useState('');
  const [consistencyThreshold, setConsistencyThreshold] = useState(0.82);
  const [documents, setDocuments] = useState([]);
  const [licenseImage, setLicenseImage] = useState(null);
  const [selfieImage, setSelfieImage] = useState(null);
  const [licensePreview, setLicensePreview] = useState('');
  const [selfiePreview, setSelfiePreview] = useState('');
  const [documentPreviews, setDocumentPreviews] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'success', show: false });
  const [showApiKeyCheckmark, setShowApiKeyCheckmark] = useState(false);
  const [showDocumentLoader, setShowDocumentLoader] = useState(false);
  const [showDocumentCheckmark, setShowDocumentCheckmark] = useState(false);
  const [showLicenseScanning, setShowLicenseScanning] = useState(false);
  const [showSelfieScanning, setShowSelfieScanning] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const licenseInputRef = useRef(null);
  const selfieInputRef = useRef(null);
  const documentsInputRef = useRef(null);
  const cameraVideoRef = useRef(null);
  const cameraCanvasRef = useRef(null);

  const showToastMessage = (message, type = 'success') => {
    setToast({ message, type, show: true });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  // Load PDF.js library
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleDocumentsChange = (e) => {
    const files = Array.from(e.target.files);
    setDocuments(files);
    updateDocumentPreviews(files);
  };

  const updateDocumentPreviews = async (files) => {
    const previews = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          previews.push({ type: 'image', src: e.target.result, name: file.name, index: i });
          if (previews.length === files.length) {
            setDocumentPreviews([...previews]);
          }
        };
        reader.readAsDataURL(file);
      } else if (file.type === 'application/pdf' && window.pdfjsLib) {
        try {
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          const page = await pdf.getPage(1);
          const viewport = page.getViewport({ scale: 1.0 });
          const scale = 96 / viewport.height;
          const scaledViewport = page.getViewport({ scale });
          const canvas = document.createElement('canvas');
          canvas.width = scaledViewport.width;
          canvas.height = scaledViewport.height;
          const context = canvas.getContext('2d');
          await page.render({ canvasContext: context, viewport: scaledViewport }).promise;
          previews.push({ type: 'pdf', src: canvas.toDataURL(), name: file.name, index: i });
        } catch (error) {
          previews.push({ type: 'file', name: file.name, index: i });
        }
        if (previews.length === files.length) {
          setDocumentPreviews([...previews]);
        }
      } else {
        previews.push({ type: 'file', name: file.name, index: i });
        if (previews.length === files.length) {
          setDocumentPreviews([...previews]);
        }
      }
    }
  };

  const removeDocumentPreview = (index) => {
    const newDocuments = documents.filter((_, i) => i !== index);
    setDocuments(newDocuments);
    const dataTransfer = new DataTransfer();
    newDocuments.forEach(file => dataTransfer.items.add(file));
    if (documentsInputRef.current) {
      documentsInputRef.current.files = dataTransfer.files;
    }
    updateDocumentPreviews(newDocuments);
  };

  const handleLicenseChange = (e) => {
    const file = e.target.files[0];
    setLicenseImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setLicensePreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setLicensePreview('');
    }
  };

  const handleSelfieChange = (e) => {
    const file = e.target.files[0];
    setSelfieImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setSelfiePreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setSelfiePreview('');
    }
  };

  const clearLicensePreview = () => {
    setLicenseImage(null);
    setLicensePreview('');
    if (licenseInputRef.current) licenseInputRef.current.value = '';
  };

  const clearSelfiePreview = () => {
    setSelfieImage(null);
    setSelfiePreview('');
    if (selfieInputRef.current) selfieInputRef.current.value = '';
  };

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      setCameraStream(stream);
      setShowCameraModal(true);
      if (cameraVideoRef.current) {
        cameraVideoRef.current.srcObject = stream;
      }
    } catch (error) {
      showToastMessage('Unable to access camera. Please allow camera access.', 'error');
    }
  };

  const closeCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setShowCameraModal(false);
  };

  const capturePhoto = () => {
    if (!cameraVideoRef.current || !cameraCanvasRef.current) return;
    
    const video = cameraVideoRef.current;
    const canvas = cameraCanvasRef.current;
    const context = canvas.getContext('2d');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' });
        setSelfieImage(file);
        setSelfiePreview(canvas.toDataURL());
        if (selfieInputRef.current) {
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          selfieInputRef.current.files = dataTransfer.files;
        }
      }
      closeCamera();
    }, 'image/jpeg', 0.95);
  };

  const handleSubmit = async () => {
    if (!apiKey.trim() || !expectedAddress.trim() || documents.length < 2) {
      setErrorMessage('API Key, Expected Address, and at least 2 documents are required');
      setShowError(true);
      return;
    }

    setIsProcessing(true);
    setShowResult(false);
    setShowError(false);
    setShowApiKeyCheckmark(true);
    setShowDocumentLoader(true);
    setShowLicenseScanning(!!licenseImage);
    setShowSelfieScanning(!!selfieImage);

    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      const result = await verifyKyc(
        apiKey.trim(),
        documents,
        expectedAddress.trim(),
        'Mistral',
        consistencyThreshold,
        licenseImage,
        selfieImage
      );

      setShowDocumentLoader(false);
      setShowDocumentCheckmark(result.documentsConsistent !== undefined);
      setShowLicenseScanning(false);
      setShowSelfieScanning(false);

      setVerificationResult(result);
      setShowResult(true);
      showToastMessage('KYC verification completed!', 'success');
    } catch (error) {
      setErrorMessage(error.message || 'An error occurred');
      setShowError(true);
      setShowDocumentLoader(false);
      setShowLicenseScanning(false);
      setShowSelfieScanning(false);
      showToastMessage('Failed to verify KYC', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleViewCodeExamples = () => {
    navigate('/examples?function=kycagent');
  };

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    const iconMap = { pdf: '📄', doc: '📝', docx: '📝', txt: '📄' };
    return iconMap[ext] || '📄';
  };

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
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 animate-fadeInUp">
              <h2 className="text-4xl font-semibold text-gray-900 mb-2">KYC Agent</h2>
              <p className="text-lg text-gray-600">Process KYC documents and get agent information</p>
            </div>

            {/* KYC Verification Section */}
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6 card-hover animate-fadeInUp">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                🔍 Real-time KYC Verification
              </h3>
              <p className="text-xs text-gray-600 mb-4 text-center">Upload multiple documents, verify address with Google Maps, and match faces between license and selfie.</p>
              
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                {/* API Key Input */}
                <div>
                  <label htmlFor="apiKey" className="block text-xs font-semibold text-gray-700 mb-1">
                    API Key <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="apiKey"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="w-full px-2 py-1.5 pr-8 text-xs border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 input-focus"
                      placeholder="Enter your API key"
                      required
                    />
                    {showApiKeyCheckmark && (
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                    )}
                  </div>
                </div>

                {/* Step 1: Upload Documents */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-xs font-bold mr-1.5">1</span>
                    Upload Documents (2 or more) <span className="text-red-500">*</span>
                    {showDocumentLoader && (
                      <span className="ml-2 inline-flex items-center">
                        <svg className="animate-spin h-4 w-4 text-cyan-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="ml-1 text-xs text-cyan-600 font-medium">Matching Documents...</span>
                      </span>
                    )}
                    {showDocumentCheckmark && (
                      <span className="ml-2 inline-flex items-center">
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span className="ml-1 text-xs text-green-600 font-medium">Documents Matched</span>
                      </span>
                    )}
                  </label>
                  <input
                    ref={documentsInputRef}
                    type="file"
                    id="documentsInput"
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                    multiple
                    onChange={handleDocumentsChange}
                    className="w-full px-2 py-1.5 text-xs border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 input-focus file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
                    required
                  />
                  <p className="mt-0.5 text-xs text-gray-500">Upload at least 2 documents</p>
                  {/* Document Previews */}
                  {documentPreviews.length > 0 && (
                    <div className="mt-3">
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {documentPreviews.map((preview, index) => (
                          <div key={index} className="relative bg-gray-50 border-2 border-gray-200 rounded-lg p-2 hover:border-cyan-400 transition-all">
                            {preview.type === 'image' && (
                              <div className="w-full h-24 bg-gray-100 rounded overflow-hidden mb-1 flex items-center justify-center">
                                <img src={preview.src} alt={preview.name} className="w-full h-full object-contain" />
                              </div>
                            )}
                            {preview.type === 'pdf' && (
                              <div className="w-full h-24 bg-gray-100 rounded overflow-hidden mb-1 flex items-center justify-center">
                                <img src={preview.src} alt={preview.name} className="w-full h-full object-contain" />
                              </div>
                            )}
                            {preview.type === 'file' && (
                              <div className="w-full h-24 bg-gray-100 rounded flex flex-col items-center justify-center mb-1">
                                <div className="text-4xl mb-1">{getFileIcon(preview.name)}</div>
                              </div>
                            )}
                            <div className="text-xs text-gray-700 truncate text-center px-1" title={preview.name}>
                              {preview.name}
                            </div>
                            <button
                              type="button"
                              onClick={() => removeDocumentPreview(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors z-10"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Step 2: Expected Address */}
                <div>
                  <label htmlFor="expectedAddress" className="block text-xs font-semibold text-gray-700 mb-1">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-xs font-bold mr-1.5">2</span>
                    Enter Expected Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="expectedAddress"
                    value={expectedAddress}
                    onChange={(e) => setExpectedAddress(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 input-focus"
                    placeholder="e.g., 123 Main St, Toronto, ON, M5V 2N2"
                    required
                  />
                </div>

                {/* Step 3: Consistency Threshold */}
                <div>
                  <label htmlFor="consistencyThreshold" className="block text-xs font-semibold text-gray-700 mb-1">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-xs font-bold mr-1.5">3</span>
                    Consistency Threshold: <span id="thresholdValue">{consistencyThreshold.toFixed(2)}</span>
                  </label>
                  <input
                    type="range"
                    id="consistencyThreshold"
                    min="0.5"
                    max="1.0"
                    step="0.01"
                    value={consistencyThreshold}
                    onChange={(e) => setConsistencyThreshold(parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <p className="mt-0.5 text-xs text-gray-500">Adjust threshold for address matching</p>
                </div>

                {/* Step 4: License Image */}
                <div>
                  <label htmlFor="licenseImage" className="block text-xs font-semibold text-gray-700 mb-1">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-xs font-bold mr-1.5">4</span>
                    Upload License/ID Image
                  </label>
                  <input
                    ref={licenseInputRef}
                    type="file"
                    id="licenseImage"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleLicenseChange}
                    className="w-full px-2 py-1.5 text-xs border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 input-focus file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
                  />
                  {licensePreview && (
                    <div className="mt-2 relative">
                      <div className="relative border-2 border-cyan-300 rounded-lg overflow-hidden bg-gray-100">
                        <img src={licensePreview} alt="License Preview" className="w-full h-auto max-h-48 object-contain" />
                        {showLicenseScanning && (
                          <>
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-300 to-transparent opacity-40 animate-scan"></div>
                            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-gray-400 to-transparent animate-scan-line"></div>
                          </>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={clearLicensePreview}
                        className="mt-1 text-xs text-red-600 hover:text-red-700 font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* Step 5: Selfie Image */}
                <div>
                  <label htmlFor="selfieImage" className="block text-xs font-semibold text-gray-700 mb-1">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-xs font-bold mr-1.5">5</span>
                    Upload Selfie Image
                  </label>
                  <div className="flex gap-2 mb-2">
                    <button
                      type="button"
                      onClick={openCamera}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium text-xs py-1 px-2 rounded-lg shadow-sm hover:shadow-md button-hover flex items-center justify-center"
                    >
                      <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      <span className="text-xs">Take Photo</span>
                    </button>
                    <input
                      ref={selfieInputRef}
                      type="file"
                      id="selfieImage"
                      accept=".jpg,.jpeg,.png"
                      onChange={handleSelfieChange}
                      className="flex-1 px-2 py-1.5 text-xs border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 input-focus file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
                    />
                  </div>
                  {selfiePreview && (
                    <div className="mt-2 relative">
                      <div className="relative border-2 border-cyan-300 rounded-lg overflow-hidden bg-gray-100">
                        <img src={selfiePreview} alt="Selfie Preview" className="w-full h-auto max-h-48 object-contain rounded-lg" />
                        {showSelfieScanning && (
                          <>
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-300 to-transparent opacity-40 animate-scan"></div>
                            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-gray-400 to-transparent animate-scan-line"></div>
                          </>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={clearSelfiePreview}
                        className="mt-1 text-xs text-red-600 hover:text-red-700 font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg button-hover text-sm disabled:opacity-50"
                >
                  <span>{isProcessing ? 'Verifying...' : '🔍 Verify Now'}</span>
                  {isProcessing && (
                    <svg className="animate-spin h-4 w-4 ml-2 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                </button>
              </form>

              {/* Verification Results */}
              {showResult && verificationResult && (
                <div className="mt-6">
                  {verificationResult.statusHtml && (
                    <div className="mb-4" dangerouslySetInnerHTML={{ __html: verificationResult.statusHtml }} />
                  )}
                  {verificationResult.verificationTableHtml && (
                    <div className="mb-4" dangerouslySetInnerHTML={{ __html: verificationResult.verificationTableHtml }} />
                  )}
                  {verificationResult.faceMatch && (
                    <div className="mb-4">
                      <div className="bg-white rounded-xl shadow-lg p-4 border-2 border-cyan-200 animate-fadeInUp">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Face Match Result</h4>
                        <div className={`mb-2 text-xs font-medium ${verificationResult.faceMatch.isMatch ? 'text-green-600' : 'text-red-600'}`}>
                          {verificationResult.faceMatch.message || 'Face matching completed'}
                        </div>
                        <div className="text-xs text-gray-600">Match Score: <span className="font-bold">{verificationResult.faceMatch.matchScore || 0}/5</span></div>
                      </div>
                    </div>
                  )}
                  {verificationResult.extractedFields && (
                    <details className="mt-4">
                      <summary className="cursor-pointer text-xs font-semibold text-gray-700 mb-2">View Extracted Document Details</summary>
                      <pre className="mt-2 p-3 bg-gray-100 rounded-lg text-xs overflow-auto max-h-60">
                        {JSON.stringify(verificationResult.extractedFields, null, 2)}
                      </pre>
                    </details>
                  )}
                  <div className="mt-6 text-center">
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
              )}

              {/* Error Display */}
              {showError && (
                <div className="mt-4">
                  <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded animate-fadeInUp">
                    <h4 className="text-xs font-semibold text-red-800 mb-1">Error</h4>
                    <p className="text-xs text-red-700">{errorMessage}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Camera Capture Modal */}
      {showCameraModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4" onClick={closeCamera}>
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-fadeInUp" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Take Selfie Photo</h3>
              <button
                type="button"
                onClick={closeCamera}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="mb-4">
              <video
                ref={cameraVideoRef}
                autoPlay
                playsInline
                className="w-full bg-gray-900 rounded-lg"
                style={{ maxHeight: '400px', objectFit: 'cover' }}
              ></video>
              <canvas ref={cameraCanvasRef} className="hidden"></canvas>
            </div>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={capturePhoto}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white font-semibold text-sm py-2 px-4 rounded-lg shadow-md hover:shadow-lg button-hover"
              >
                📷 Capture Photo
              </button>
              <button
                type="button"
                onClick={closeCamera}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold text-sm py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KycAgentPage;
