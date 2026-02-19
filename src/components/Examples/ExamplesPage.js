import { useSearchParams, useNavigate } from 'react-router-dom';
import Navigation from '../common/Navigation';
import Sidebar from '../common/Sidebar';

const ExamplesPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const functionType = searchParams.get('function') || 'qrcode';

  const codeExamples = {
    qrcode: {
      title: 'QR Code Generation',
      endpoint: 'POST /api/qrcode/generate',
      examples: [
        {
          language: 'cURL',
          code: `curl -X POST "http://localhost:51348/api/qrcode/generate" \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: your-api-key-here" \\
  -d '{"qrvalue": "Hello World"}'`
        },
        {
          language: 'JavaScript',
          code: `const response = await fetch('http://localhost:51348/api/qrcode/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'your-api-key-here'
  },
  body: JSON.stringify({
    qrvalue: 'Hello World'
  })
});
const data = await response.json();
console.log(data);`
        },
        {
          language: 'Python',
          code: `import requests

url = "http://localhost:51348/api/qrcode/generate"
headers = {
    "Content-Type": "application/json",
    "X-API-Key": "your-api-key-here"
}
data = {"qrvalue": "Hello World"}

response = requests.post(url, headers=headers, json=data)
result = response.json()
print(result)`
        },
        {
          language: 'C#',
          code: `using System.Net.Http;
using System.Text;
using System.Text.Json;

var client = new HttpClient();
client.DefaultRequestHeaders.Add("X-API-Key", "your-api-key-here");

var requestData = new { qrvalue = "Hello World" };
var json = JsonSerializer.Serialize(requestData);
var content = new StringContent(json, Encoding.UTF8, "application/json");

var response = await client.PostAsync(
    "http://localhost:51348/api/qrcode/generate", 
    content
);
var result = await response.Content.ReadAsStringAsync();
Console.WriteLine(result);`
        }
      ]
    },
    filesummary: {
      title: 'File Summary',
      endpoint: 'POST /api/filesummary/getSummary',
      examples: [
        {
          language: 'cURL',
          code: `curl -X POST "http://localhost:51348/api/filesummary/getSummary" \\
  -H "X-API-Key: your-api-key-here" \\
  -F "file=@document.pdf" \\
  -F "token=your-token-here"`
        },
        {
          language: 'JavaScript',
          code: `const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('token', 'your-token-here');

const response = await fetch('http://localhost:51348/api/filesummary/getSummary', {
  method: 'POST',
  headers: {
    'X-API-Key': 'your-api-key-here'
  },
  body: formData
});
const data = await response.json();
console.log(data);`
        },
        {
          language: 'Python',
          code: `import requests

url = "http://localhost:51348/api/filesummary/getSummary"
headers = {"X-API-Key": "your-api-key-here"}

files = {
    "file": ("document.pdf", open("document.pdf", "rb"), "application/pdf"),
    "token": (None, "your-token-here")
}

response = requests.post(url, headers=headers, files=files)
result = response.json()
print(result)`
        },
        {
          language: 'C#',
          code: `using System.Net.Http;
using System.IO;

var client = new HttpClient();
client.DefaultRequestHeaders.Add("X-API-Key", "your-api-key-here");

var formData = new MultipartFormDataContent();
formData.Add(new ByteArrayContent(File.ReadAllBytes("document.pdf")), "file", "document.pdf");
formData.Add(new StringContent("your-token-here"), "token");

var response = await client.PostAsync(
    "http://localhost:51348/api/filesummary/getSummary", 
    formData
);
var result = await response.Content.ReadAsStringAsync();
Console.WriteLine(result);`
        }
      ]
    },
    kycagent: {
      title: 'KYC Verification',
      endpoint: 'POST /api/KycAgent/verify',
      examples: [
        {
          language: 'cURL',
          code: `curl -X POST "http://localhost:51348/api/KycAgent/verify" \\
  -H "X-API-Key: your-api-key-here" \\
  -F "documents=@document1.pdf" \\
  -F "documents=@document2.pdf" \\
  -F "expectedAddress=123 Main St, City, State" \\
  -F "modelChoice=Mistral" \\
  -F "consistencyThreshold=0.82" \\
  -F "licenseImage=@license.jpg" \\
  -F "selfieImage=@selfie.jpg"`
        },
        {
          language: 'JavaScript',
          code: `const formData = new FormData();
documents.forEach(doc => formData.append('documents', doc));
formData.append('expectedAddress', '123 Main St, City, State');
formData.append('modelChoice', 'Mistral');
formData.append('consistencyThreshold', '0.82');
if (licenseImage) formData.append('licenseImage', licenseImage);
if (selfieImage) formData.append('selfieImage', selfieImage);

const response = await fetch('http://localhost:51348/api/KycAgent/verify', {
  method: 'POST',
  headers: { 'X-API-Key': 'your-api-key-here' },
  body: formData
});
const result = await response.json();
console.log(result);`
        },
        {
          language: 'Python',
          code: `import requests

url = "http://localhost:51348/api/KycAgent/verify"
headers = {"X-API-Key": "your-api-key-here"}

files = [
    ("documents", ("doc1.pdf", open("doc1.pdf", "rb"), "application/pdf")),
    ("documents", ("doc2.pdf", open("doc2.pdf", "rb"), "application/pdf")),
    ("licenseImage", ("license.jpg", open("license.jpg", "rb"), "image/jpeg")),
    ("selfieImage", ("selfie.jpg", open("selfie.jpg", "rb"), "image/jpeg"))
]

data = {
    "expectedAddress": "123 Main St, City, State",
    "modelChoice": "Mistral",
    "consistencyThreshold": 0.82
}

response = requests.post(url, headers=headers, files=files, data=data)
result = response.json()
print(result)`
        },
        {
          language: 'C#',
          code: `using System.Net.Http;
using System.IO;

var client = new HttpClient();
client.DefaultRequestHeaders.Add("X-API-Key", "your-api-key-here");

var formData = new MultipartFormDataContent();
formData.Add(new ByteArrayContent(File.ReadAllBytes("doc1.pdf")), "documents", "doc1.pdf");
formData.Add(new ByteArrayContent(File.ReadAllBytes("doc2.pdf")), "documents", "doc2.pdf");
formData.Add(new StringContent("123 Main St, City, State"), "expectedAddress");
formData.Add(new StringContent("Mistral"), "modelChoice");
formData.Add(new StringContent("0.82"), "consistencyThreshold");
formData.Add(new ByteArrayContent(File.ReadAllBytes("license.jpg")), "licenseImage", "license.jpg");
formData.Add(new ByteArrayContent(File.ReadAllBytes("selfie.jpg")), "selfieImage", "selfie.jpg");

var response = await client.PostAsync(
    "http://localhost:51348/api/KycAgent/verify", 
    formData
);
var result = await response.Content.ReadAsStringAsync();
Console.WriteLine(result);`
        }
      ]
    }
  };

  const currentExamples = codeExamples[functionType] || codeExamples.qrcode;

  return (
    <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex flex-col gradient-animate" style={{ height: '100vh', margin: 0, padding: 0, backgroundSize: '400% 400%' }}>
      <Navigation />
      
      <div className="flex flex-1 overflow-hidden" style={{ minHeight: 0 }}>
        <Sidebar />

        <div className="flex-1 overflow-y-auto p-4 pb-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 animate-fadeInUp">
              <h2 className="text-4xl font-semibold text-gray-900 mb-2">Code Examples</h2>
              <p className="text-lg text-gray-600">{currentExamples.title}</p>
            </div>

            {/* Function Selector Tabs */}
            <div className="flex justify-center mb-6 space-x-2">
              <button
                onClick={() => navigate('/examples?function=qrcode')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  functionType === 'qrcode'
                    ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                QR Code
              </button>
              <button
                onClick={() => navigate('/examples?function=filesummary')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  functionType === 'filesummary'
                    ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                File Summary
              </button>
              <button
                onClick={() => navigate('/examples?function=kycagent')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  functionType === 'kycagent'
                    ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                KYC Agent
              </button>
            </div>

            <div className="mb-4 text-center">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Endpoint:</span>{' '}
                <code className="bg-gray-200 px-2 py-1 rounded text-xs">{currentExamples.endpoint}</code>
              </p>
            </div>

            <div className="space-y-6">
              {currentExamples.examples.map((example, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 card-hover animate-slideInLeft" style={{ animationDelay: `${index * 0.1}s` }}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{example.language}</h3>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto border-2 border-gray-800 font-mono">
                    <code>{example.code}</code>
                  </pre>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamplesPage;
