import axios from 'axios';

// Get API base URL from environment variable
// Production: https://ezapiplayground.onrender.com
// Development: http://localhost:51348
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://ezapiplayground.onrender.com' 
    : 'http://localhost:51348');

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add API key header
apiClient.interceptors.request.use(
  (config) => {
    // API key will be added per request via the methods below
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      return Promise.reject(error.response.data || error.response);
    } else if (error.request) {
      // Request was made but no response received
      return Promise.reject({ message: 'Network error. Please check your connection.' });
    } else {
      // Something else happened
      return Promise.reject({ message: error.message || 'An unexpected error occurred' });
    }
  }
);

/**
 * Generate API Key
 * @param {string} userName - Username
 * @param {string} password - Password
 * @returns {Promise} API response with tenantId, token, and apiKey
 */
export const generateApiKey = async (userName, password) => {
  const response = await apiClient.post(`/api/Client/apiKey?userName=${encodeURIComponent(userName)}&password=${encodeURIComponent(password)}`);
  return response.data;
};

/**
 * Get existing API Key
 * @param {string} userName - Username
 * @param {string} password - Password
 * @returns {Promise} API response with tenantId, token, and apiKey
 */
export const getApiKey = async (userName, password) => {
  const response = await apiClient.get(`/api/Client/apiKey?userName=${encodeURIComponent(userName)}&password=${encodeURIComponent(password)}`);
  return response.data;
};

/**
 * Generate QR Code
 * @param {string} apiKey - API Key for authentication
 * @param {string} qrValue - Value to encode in QR code
 * @returns {Promise} API response with QR code image (base64) and id
 */
export const generateQrCode = async (apiKey, qrValue) => {
  const response = await apiClient.post(
    '/api/qrcode/generate',
    { qrvalue: qrValue },
    {
      headers: {
        'X-API-Key': apiKey,
      },
    }
  );
  return response.data;
};

/**
 * Get File Summary
 * @param {string} apiKey - API Key for authentication
 * @param {File} file - File to upload
 * @param {string} token - Token for file processing
 * @returns {Promise} API response with file summary
 */
export const getFileSummary = async (apiKey, file, token) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('token', token);

  const response = await apiClient.post('/api/filesummary/getSummary', formData, {
    headers: {
      'X-API-Key': apiKey,
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Verify KYC
 * @param {string} apiKey - API Key for authentication
 * @param {File[]} documents - Array of document files
 * @param {string} expectedAddress - Expected address for verification
 * @param {string} modelChoice - Model choice (default: "Mistral")
 * @param {number} consistencyThreshold - Consistency threshold (default: 0.82)
 * @param {File|null} licenseImage - Optional license image
 * @param {File|null} selfieImage - Optional selfie image
 * @returns {Promise} API response with KYC verification results
 */
export const verifyKyc = async (
  apiKey,
  documents,
  expectedAddress,
  modelChoice = 'Mistral',
  consistencyThreshold = 0.82,
  licenseImage = null,
  selfieImage = null
) => {
  const formData = new FormData();
  
  // Add documents
  documents.forEach((doc) => {
    formData.append('documents', doc);
  });
  
  formData.append('expectedAddress', expectedAddress);
  formData.append('modelChoice', modelChoice);
  formData.append('consistencyThreshold', consistencyThreshold.toString());
  
  if (licenseImage) {
    formData.append('licenseImage', licenseImage);
  }
  
  if (selfieImage) {
    formData.append('selfieImage', selfieImage);
  }

  const response = await apiClient.post('/api/KycAgent/verify', formData, {
    headers: {
      'X-API-Key': apiKey,
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export default apiClient;

