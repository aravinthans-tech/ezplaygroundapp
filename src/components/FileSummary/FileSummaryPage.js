import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFileSummary } from '../../services/api';
import Toast from '../common/Toast';
import Navigation from '../common/Navigation';
import Sidebar from '../common/Sidebar';

const FileSummaryPage = () => {
  const navigate = useNavigate();
  const [apiKey, setApiKey] = useState('');
  const [token, setToken] = useState('');
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [summaryContent, setSummaryContent] = useState('');
  const [toast, setToast] = useState({ message: '', type: 'success', show: false });

  const showToastMessage = (message, type = 'success') => {
    setToast({ message, type, show: true });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  const handleSubmit = async () => {
    if (!apiKey.trim() || !token.trim() || !file) {
      setErrorMessage('API Key, Token, and File are required');
      setShowError(true);
      return;
    }

    setIsProcessing(true);
    setShowResult(false);
    setShowError(false);

    try {
      const result = await getFileSummary(apiKey.trim(), file, token.trim());

      if (result.id === 0) {
        throw new Error(result.encryptOutput || result.EncryptOutput || 'Failed to get file summary');
      }

      if (!result.output) {
        throw new Error('No output received from API');
      }

      // Parse and display HTML
      setSummaryContent(result.output);
      setShowResult(true);
      showToastMessage('File summary generated successfully!', 'success');

      // Save to localStorage
      localStorage.setItem('filesummary_data', JSON.stringify({
        apiKey: apiKey,
        token: token,
        fileName: file.name,
        result: result
      }));
    } catch (error) {
      setErrorMessage(error.message || 'An error occurred');
      setShowError(true);
      showToastMessage('Failed to get file summary', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleViewCodeExamples = () => {
    navigate('/examples?function=filesummary');
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
              <h2 className="text-4xl font-semibold text-gray-900 mb-2">File Summary</h2>
              <p className="text-lg text-gray-600">Upload a file to get an AI-generated summary</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input Card */}
              <div className="bg-white rounded-xl shadow-lg p-8 card-hover animate-slideInLeft delay-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">File Details</h3>
                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                  <div>
                    <label htmlFor="apiKey" className="block text-sm font-semibold text-gray-700 mb-2">
                      API Key <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="apiKey"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 input-focus"
                      placeholder="Enter your API key"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="token" className="block text-sm font-semibold text-gray-700 mb-2">
                      Token <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="token"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 input-focus"
                      placeholder="Enter your token"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="fileInput" className="block text-sm font-semibold text-gray-700 mb-2">
                      File <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      id="fileInput"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={(e) => setFile(e.target.files[0])}
                      className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 input-focus"
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">Supported formats: PDF, DOC, DOCX, TXT</p>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white font-medium text-sm py-2 px-4 rounded-lg flex items-center justify-center shadow-md hover:shadow-lg button-hover disabled:opacity-50"
                  >
                    <span>{isProcessing ? 'Processing...' : 'Get File Summary'}</span>
                    {isProcessing && (
                      <svg className="animate-spin h-4 w-4 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                  </button>
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

              {/* Result Display Card */}
              <div className="bg-white rounded-xl shadow-lg p-8 card-hover animate-slideInRight delay-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">File Summary Result</h3>
                {showResult ? (
                  <div>
                    <div className="space-y-4" dangerouslySetInnerHTML={{ __html: summaryContent }} />
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
                ) : (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <p className="mt-4 text-sm text-gray-500">Enter details and click "Get File Summary" to view results</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileSummaryPage;

