import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="bg-white shadow-md h-12 flex items-center justify-between px-6 flex-shrink-0 relative">
      <div className="flex items-center space-x-3 flex-shrink-0">
        <img 
          src="/logo.png" 
          alt="Logo" 
          className="h-8 w-auto object-contain" 
          style={{ maxWidth: '120px' }}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextElementSibling.style.display = 'flex';
          }}
        />
        <div className="hidden items-center space-x-0.5 whitespace-nowrap" id="logoFallback">
          <span className="text-lg font-bold bg-gradient-to-r from-cyan-500 to-teal-500 bg-clip-text text-transparent">ez</span>
          <span className="text-lg font-bold text-cyan-500">o</span>
          <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">fis</span>
        </div>
      </div>
      <h1 className="text-lg font-semibold text-gray-900 tracking-tight absolute left-[calc(50%+128px)] transform -translate-x-1/2 pointer-events-none">
        API Playground
      </h1>
      <div className="flex space-x-4 flex-1 justify-end">
        <Link 
          to="/examples" 
          className={`px-3 py-1 rounded text-sm font-medium ${
            location.pathname === '/examples' 
              ? 'text-white bg-gradient-to-r from-purple-600 to-blue-600' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          Code Examples
        </Link>
        <Link 
          to="/" 
          className={`px-3 py-1 rounded text-sm font-medium ${
            location.pathname === '/' 
              ? 'text-white bg-gradient-to-r from-purple-600 to-blue-600' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          API Key
        </Link>
        <Link 
          to="/documentation" 
          className={`px-3 py-1 rounded text-sm font-medium ${
            location.pathname === '/documentation' 
              ? 'text-white bg-gradient-to-r from-purple-600 to-blue-600' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          Documentation
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;

