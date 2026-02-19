import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ApiKeyPage from './components/ApiKey/ApiKeyPage';
import QrCodePage from './components/QrCode/QrCodePage';
import FileSummaryPage from './components/FileSummary/FileSummaryPage';
import KycAgentPage from './components/KycAgent/KycAgentPage';
import ExamplesPage from './components/Examples/ExamplesPage';
import DocumentationPage from './components/Documentation/DocumentationPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ApiKeyPage />} />
        <Route path="/qrcode" element={<QrCodePage />} />
        <Route path="/filesummary" element={<FileSummaryPage />} />
        <Route path="/kycagent" element={<KycAgentPage />} />
        <Route path="/examples" element={<ExamplesPage />} />
        <Route path="/documentation" element={<DocumentationPage />} />
      </Routes>
    </Router>
  );
}

export default App;
