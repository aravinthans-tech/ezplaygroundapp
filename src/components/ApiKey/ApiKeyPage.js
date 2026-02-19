import { useState, useEffect, useRef } from 'react';
import { generateApiKey, getApiKey } from '../../services/api';
import Toast from '../common/Toast';
import Navigation from '../common/Navigation';
import Sidebar from '../common/Sidebar';

const ApiKeyPage = () => {
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [apiKeyData, setApiKeyData] = useState({ tenantId: '', token: '', apiKey: '' });
  const [apiKeyStatus, setApiKeyStatus] = useState({ text: '', className: '' });
  const [toast, setToast] = useState({ message: '', type: 'success', show: false });
  const [keyExists, setKeyExists] = useState(false);

  const tenantIdRef = useRef(null);
  const tokenRef = useRef(null);
  const apiKeyRef = useRef(null);

  const validateEmail = (email) => {
    if (!email) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one capital letter';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return 'Password must contain at least one special character';
    return '';
  };

  const showToastMessage = (message, type = 'success') => {
    setToast({ message, type, show: true });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  const handleGenerate = async () => {
    setShowError(false);
    setShowModal(false);

    const emailErr = validateEmail(userEmail);
    const passwordErr = validatePassword(userPassword);

    setEmailError(emailErr);
    setPasswordError(passwordErr);

    if (emailErr || passwordErr) return;

    setIsGenerating(true);
    try {
      // Check if key exists first
      try {
        await getApiKey(userEmail, userPassword);
        setKeyExists(true);
      } catch {
        setKeyExists(false);
      }

      const data = await generateApiKey(userEmail, userPassword);
      setApiKeyData({
        tenantId: data.tenantId || '',
        token: data.token || '',
        apiKey: data.apiKey || '',
      });

      if (keyExists) {
        setApiKeyStatus({
          text: 'Existing API Key Retrieved',
          className: 'px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800',
        });
        showToastMessage('Existing API key retrieved successfully!', 'success');
      } else {
        setApiKeyStatus({
          text: 'Newly Generated API Key',
          className: 'px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800',
        });
        showToastMessage('New API key generated successfully!', 'success');
      }

      setShowModal(true);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to generate API key');
      setShowError(true);
      showToastMessage('Failed to generate API key', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleView = async () => {
    setShowError(false);
    setShowModal(false);

    const emailErr = validateEmail(userEmail);
    const passwordErr = validatePassword(userPassword);

    setEmailError(emailErr);
    setPasswordError(passwordErr);

    if (emailErr || passwordErr) return;

    setIsViewing(true);
    try {
      const data = await getApiKey(userEmail, userPassword);
      setApiKeyData({
        tenantId: data.tenantId || '',
        token: data.token || '',
        apiKey: data.apiKey || '',
      });
      setApiKeyStatus({
        text: 'Existing API Key Retrieved',
        className: 'px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800',
      });
      setShowModal(true);
      showToastMessage('Existing API key retrieved successfully!', 'success');
    } catch (error) {
      setErrorMessage(error.message || 'Failed to retrieve API key');
      setShowError(true);
      showToastMessage('Failed to retrieve API key', 'error');
    } finally {
      setIsViewing(false);
    }
  };

  const handleCopyApiKey = () => {
    if (apiKeyRef.current) {
      apiKeyRef.current.select();
      document.execCommand('copy');
      showToastMessage('API key copied to clipboard!', 'success');
    }
  };

  const handleDownload = () => {
    const data = {
      tenantId: apiKeyData.tenantId,
      token: apiKeyData.token,
      apiKey: apiKeyData.apiKey,
    };

    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `api-key-details-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToastMessage('API key details downloaded successfully!', 'success');
  };

  useEffect(() => {
    const cards = document.querySelectorAll('.card-hover');
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.style.opacity = '1';
      }, index * 100);
    });
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
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 animate-fadeInUp">
              <h2 className="text-4xl font-semibold text-gray-900 mb-2">Generate API Key</h2>
              <p className="text-lg text-gray-600">Generate a secure API key for accessing the API</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* API Key Generation Card */}
              <div className="bg-white rounded-xl shadow-lg p-8 card-hover animate-slideInLeft delay-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">User Credentials</h3>
                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleGenerate(); }}>
                  <div>
                    <label htmlFor="userEmail" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="userEmail"
                      value={userEmail}
                      onChange={(e) => {
                        setUserEmail(e.target.value);
                        if (emailError) setEmailError('');
                      }}
                      onBlur={() => setEmailError(validateEmail(userEmail))}
                      className={`w-full px-3 py-2 text-sm border-2 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 input-focus ${
                        emailError ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="admin@ezofis.com"
                      required
                    />
                    {emailError && <p className="text-xs text-red-600 mt-1">{emailError}</p>}
                    <p className="text-xs text-gray-500 mt-1">Enter a valid email address (e.g., admin@ezofis.com)</p>
                  </div>

                  <div>
                    <label htmlFor="userPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      id="userPassword"
                      value={userPassword}
                      onChange={(e) => {
                        setUserPassword(e.target.value);
                        if (passwordError) setPasswordError('');
                      }}
                      onBlur={() => setPasswordError(validatePassword(userPassword))}
                      className={`w-full px-3 py-2 text-sm border-2 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 input-focus ${
                        passwordError ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter password"
                      required
                    />
                    {passwordError && <p className="text-xs text-red-600 mt-1">{passwordError}</p>}
                    <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters with 1 capital letter and 1 special character</p>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      disabled={isGenerating || isViewing}
                      className="flex-1 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white font-medium text-sm py-2 px-4 rounded-lg flex items-center justify-center shadow-md hover:shadow-lg button-hover disabled:opacity-50"
                    >
                      <span>{isGenerating ? 'Generating...' : 'Generate API Key'}</span>
                      {isGenerating && (
                        <svg className="animate-spin h-4 w-4 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleView}
                      disabled={isGenerating || isViewing}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium text-sm py-2 px-4 rounded-lg flex items-center justify-center shadow-md hover:shadow-lg button-hover disabled:opacity-50"
                    >
                      <span>{isViewing ? 'Loading...' : 'View API Key'}</span>
                      {isViewing && (
                        <svg className="animate-spin h-4 w-4 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      )}
                    </button>
                  </div>
                </form>

                {showError && (
                  <div className="mt-6">
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded animate-fadeInUp">
                      <h4 className="text-sm font-semibold text-red-800 mb-2">Error</h4>
                      <p className="text-sm text-red-700">{errorMessage}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Information Card */}
              <div className="bg-white rounded-xl shadow-lg p-8 card-hover animate-slideInRight delay-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">API Key Information</h3>
                <div className="space-y-4 text-sm">
                  <div className="border-l-4 border-purple-500 pl-3">
                    <div className="font-semibold text-gray-700 mb-1 text-xs">Generate API Key</div>
                    <code className="text-xs font-mono text-gray-800">POST /api/Client/apiKey</code>
                    <div className="text-xs text-gray-600 mt-1">Query: ?userName=email&password=pass</div>
                  </div>
                  <div className="border-l-4 border-cyan-500 pl-3">
                    <div className="font-semibold text-gray-700 mb-1 text-xs">View API Key</div>
                    <code className="text-xs font-mono text-gray-800">GET /api/Client/apiKey</code>
                    <div className="text-xs text-gray-600 mt-1">Query: ?userName=email&password=pass</div>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-3">
                    <div className="font-semibold text-gray-700 mb-1 text-xs">Authentication</div>
                    <div className="text-xs text-gray-600">No authentication required</div>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-3">
                    <div className="font-semibold text-gray-700 mb-1 text-xs">Response Format</div>
                    <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto mt-1">{`{
  "tenantId": "string",
  "token": "string",
  "apiKey": "string"
}`}</pre>
                  </div>
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-2">
                        <h4 className="text-xs font-semibold text-yellow-800">Security Notice</h4>
                        <div className="mt-1 text-xs text-yellow-700">
                          <p>API keys are generated based on your email and password. If an API key already exists, it will be returned. Save your API key securely.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* API Key Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-content bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>

            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-t-xl p-6 border-b-2 border-purple-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xl font-semibold text-gray-900">Your API Key Details</h4>
                {apiKeyStatus.text && (
                  <div className={apiKeyStatus.className}>{apiKeyStatus.text}</div>
                )}
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Tenant ID</label>
                <input
                  ref={tenantIdRef}
                  type="text"
                  value={apiKeyData.tenantId}
                  readOnly
                  className="w-full px-3 py-2 text-sm bg-white border-2 border-gray-300 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Token</label>
                <input
                  ref={tokenRef}
                  type="text"
                  value={apiKeyData.token}
                  readOnly
                  className="w-full px-3 py-2 text-sm bg-white border-2 border-gray-300 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">API Key</label>
                <div className="flex items-center space-x-2">
                  <input
                    ref={apiKeyRef}
                    type="text"
                    value={apiKeyData.apiKey}
                    readOnly
                    className="flex-1 px-3 py-2 text-sm bg-white border-2 border-gray-300 rounded-lg font-mono"
                  />
                  <button
                    onClick={handleCopyApiKey}
                    className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white font-medium text-sm py-2 px-4 rounded-lg button-hover"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-4 text-center">
                <span className="font-semibold text-red-600">Important:</span> Save this API key securely. You won't be able to see it again.
              </p>
            </div>

            <div className="bg-gray-50 rounded-b-xl px-6 py-4 flex justify-between items-center">
              <button
                onClick={handleDownload}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium text-sm py-2 px-6 rounded-lg button-hover flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
                <span>Download</span>
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium text-sm py-2 px-6 rounded-lg button-hover"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiKeyPage;

