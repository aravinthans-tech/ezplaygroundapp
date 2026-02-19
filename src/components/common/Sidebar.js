import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div id="sidebar" className="w-64 bg-white shadow-lg border-r-2 border-gray-200 flex flex-col flex-shrink-0" style={{ display: 'flex', visibility: 'visible' }}>
      <div className="p-4 border-b-2 border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <h2 className="text-base font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent tracking-tight">
          API Functions
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {/* API KEY Section */}
        <div className="mb-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">API KEY</h3>
          <Link
            to="/"
            className={`w-full text-left px-3 py-2 rounded-lg mb-2 text-sm font-semibold transition duration-200 flex items-center ${
              isActive('/')
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md hover:scale-105 active:scale-95'
            }`}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
            </svg>
            Generate API Key
          </Link>
        </div>

        {/* FUNCTIONS Section */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">FUNCTIONS</h3>
          <Link
            to="/qrcode"
            className={`w-full text-left px-3 py-2 rounded-lg mb-2 text-sm font-semibold transition-all duration-300 flex items-center ${
              isActive('/qrcode')
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md hover:scale-105 active:scale-95'
            }`}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Generate QR Code
          </Link>
          <Link
            to="/filesummary"
            className={`w-full text-left px-3 py-2 rounded-lg mb-2 text-sm font-semibold transition-all duration-300 flex items-center ${
              isActive('/filesummary')
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md hover:scale-105 active:scale-95'
            }`}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            File Summary
          </Link>
          <Link
            to="/kycagent"
            className={`w-full text-left px-3 py-2 rounded-lg mb-2 text-sm font-semibold transition-all duration-300 flex items-center ${
              isActive('/kycagent')
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md hover:scale-105 active:scale-95'
            }`}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
            KYC Agent
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

