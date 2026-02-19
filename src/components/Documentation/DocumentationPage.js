import { Link } from 'react-router-dom';

const DocumentationPage = () => {
  return (
    <div style={{ fontFamily: "'Calibri', 'Arial', sans-serif", lineHeight: 1.6, maxWidth: '900px', margin: '0 auto', padding: '20px', color: '#333' }}>
      {/* Navigation Bar */}
      <nav style={{ backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '12px 24px', margin: '-20px -20px 20px -20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/logo.png" alt="Logo" style={{ height: '32px', width: 'auto', objectFit: 'contain', maxWidth: '120px' }} onError={(e) => e.target.style.display = 'none'} />
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <Link to="/qrcode" style={{ color: '#333', textDecoration: 'none', padding: '6px 12px', borderRadius: '4px', transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'} onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>Home</Link>
          <Link to="/" style={{ color: '#333', textDecoration: 'none', padding: '6px 12px', borderRadius: '4px', transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'} onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>API Key</Link>
          <Link to="/kycagent" style={{ color: '#333', textDecoration: 'none', padding: '6px 12px', borderRadius: '4px', transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'} onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>KYC Agent</Link>
          <Link to="/examples" style={{ color: '#333', textDecoration: 'none', padding: '6px 12px', borderRadius: '4px', transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'} onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>Examples</Link>
        </div>
      </nav>
      
      <h1 style={{ color: '#2c3e50', borderBottom: '3px solid #3498db', paddingBottom: '10px' }}>KYC Agent API Documentation</h1>
      
      <h2 style={{ color: '#34495e', borderBottom: '2px solid #ecf0f1', paddingBottom: '5px', marginTop: '30px' }}>Overview</h2>
      <p>The KYC Agent API provides comprehensive Know Your Customer (KYC) verification services. It processes documents, extracts KYC information, verifies addresses with Google Maps, checks document consistency, and performs face matching between license and selfie images.</p>
      
      <h2 style={{ color: '#34495e', borderBottom: '2px solid #ecf0f1', paddingBottom: '5px', marginTop: '30px' }}>Base URL</h2>
      <pre style={{ backgroundColor: '#f4f4f4', border: '1px solid #ddd', borderRadius: '5px', padding: '15px', overflowX: 'auto', fontFamily: "'Courier New', monospace", fontSize: '0.85em' }}>http://localhost:51348/api/KycAgent</pre>
      <p>or</p>
      <pre style={{ backgroundColor: '#f4f4f4', border: '1px solid #ddd', borderRadius: '5px', padding: '15px', overflowX: 'auto', fontFamily: "'Courier New', monospace", fontSize: '0.85em' }}>https://localhost:51347/api/KycAgent</pre>
      
      <h2 style={{ color: '#34495e', borderBottom: '2px solid #ecf0f1', paddingBottom: '5px', marginTop: '30px' }}>Authentication</h2>
      <p>All endpoints require API key authentication via the <code style={{ backgroundColor: '#f4f4f4', padding: '2px 6px', borderRadius: '3px', fontFamily: "'Courier New', monospace", fontSize: '0.9em' }}>X-API-Key</code> header:</p>
      <pre style={{ backgroundColor: '#f4f4f4', border: '1px solid #ddd', borderRadius: '5px', padding: '15px', overflowX: 'auto', fontFamily: "'Courier New', monospace", fontSize: '0.85em' }}>X-API-Key: your-api-key-here</pre>
      
      <hr style={{ margin: '20px 0' }} />
      
      <h2 style={{ color: '#34495e', borderBottom: '2px solid #ecf0f1', paddingBottom: '5px', marginTop: '30px' }}>Endpoints</h2>
      
      <h3 style={{ color: '#555', marginTop: '25px' }}>1. Process Documents</h3>
      <div style={{ backgroundColor: '#e8f4f8', padding: '10px', borderLeft: '4px solid #3498db', margin: '10px 0' }}>
        <strong>POST</strong> <code style={{ backgroundColor: '#f4f4f4', padding: '2px 6px', borderRadius: '3px', fontFamily: "'Courier New', monospace", fontSize: '0.9em' }}>/api/KycAgent/process</code>
      </div>
      <p>Extracts KYC data from one or more documents using OCR and optional face matching.</p>
      
      <h4>Request</h4>
      <p><strong>Content-Type:</strong> <code style={{ backgroundColor: '#f4f4f4', padding: '2px 6px', borderRadius: '3px', fontFamily: "'Courier New', monospace", fontSize: '0.9em' }}>multipart/form-data</code></p>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', margin: '15px 0' }}>
        <thead>
          <tr style={{ backgroundColor: '#3498db', color: 'white' }}>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Parameter</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Type</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Required</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}><code style={{ backgroundColor: '#f4f4f4', padding: '2px 6px', borderRadius: '3px', fontFamily: "'Courier New', monospace", fontSize: '0.9em' }}>documents</code></td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>File[]</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Yes</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>One or more document files (PDF, DOC, DOCX, TXT, JPG, JPEG, PNG)</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}><code style={{ backgroundColor: '#f4f4f4', padding: '2px 6px', borderRadius: '3px', fontFamily: "'Courier New', monospace", fontSize: '0.9em' }}>licenseImage</code></td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>File</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>No</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>License/ID image for face matching (JPG, JPEG, PNG)</td>
          </tr>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}><code style={{ backgroundColor: '#f4f4f4', padding: '2px 6px', borderRadius: '3px', fontFamily: "'Courier New', monospace", fontSize: '0.9em' }}>selfieImage</code></td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>File</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>No</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Selfie image for face matching (JPG, JPEG, PNG)</td>
          </tr>
        </tbody>
      </table>
      
      <h4>Response</h4>
      <p><strong>Success (200 OK):</strong></p>
      <pre style={{ backgroundColor: '#f4f4f4', border: '1px solid #ddd', borderRadius: '5px', padding: '15px', overflowX: 'auto', fontFamily: "'Courier New', monospace", fontSize: '0.85em' }}>{`{
  "id": 1,
  "output": "<html>KYC Agent Report with extracted data...</html>",
  "encryptOutput": null
}`}</pre>
      
      <p><strong>Error (400 Bad Request):</strong></p>
      <pre style={{ backgroundColor: '#f4f4f4', border: '1px solid #ddd', borderRadius: '5px', padding: '15px', overflowX: 'auto', fontFamily: "'Courier New', monospace", fontSize: '0.85em' }}>{`{
  "id": 0,
  "output": null,
  "encryptOutput": "At least one document is required"
}`}</pre>
      
      <h4>Features</h4>
      <ul style={{ margin: '10px 0', paddingLeft: '30px' }}>
        <li style={{ margin: '5px 0' }}>Extracts text from documents using OCR (Unstract API)</li>
        <li style={{ margin: '5px 0' }}>Extracts KYC fields (name, address, document type, etc.) using LLM</li>
        <li style={{ margin: '5px 0' }}>Performs face matching if both license and selfie images are provided</li>
        <li style={{ margin: '5px 0' }}>Returns HTML report with all extracted information</li>
      </ul>
      
      <hr style={{ margin: '20px 0' }} />
      
      <h3 style={{ color: '#555', marginTop: '25px' }}>2. Verify Documents</h3>
      <div style={{ backgroundColor: '#e8f4f8', padding: '10px', borderLeft: '4px solid #3498db', margin: '10px 0' }}>
        <strong>POST</strong> <code style={{ backgroundColor: '#f4f4f4', padding: '2px 6px', borderRadius: '3px', fontFamily: "'Courier New', monospace", fontSize: '0.9em' }}>/api/KycAgent/verify</code>
      </div>
      <p>Comprehensive document verification with address matching, consistency checks, and face verification.</p>
      
      <h4>Request</h4>
      <p><strong>Content-Type:</strong> <code style={{ backgroundColor: '#f4f4f4', padding: '2px 6px', borderRadius: '3px', fontFamily: "'Courier New', monospace", fontSize: '0.9em' }}>multipart/form-data</code></p>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', margin: '15px 0' }}>
        <thead>
          <tr style={{ backgroundColor: '#3498db', color: 'white' }}>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Parameter</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Type</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Required</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Default</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}><code style={{ backgroundColor: '#f4f4f4', padding: '2px 6px', borderRadius: '3px', fontFamily: "'Courier New', monospace", fontSize: '0.9em' }}>documents</code></td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>File[]</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Yes</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>-</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>At least 2 document files (PDF, DOC, DOCX, TXT, JPG, JPEG, PNG)</td>
          </tr>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}><code style={{ backgroundColor: '#f4f4f4', padding: '2px 6px', borderRadius: '3px', fontFamily: "'Courier New', monospace", fontSize: '0.9em' }}>expectedAddress</code></td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>string</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Yes</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>-</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>The expected address to match against extracted addresses</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}><code style={{ backgroundColor: '#f4f4f4', padding: '2px 6px', borderRadius: '3px', fontFamily: "'Courier New', monospace", fontSize: '0.9em' }}>modelChoice</code></td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>string</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>No</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>"Mistral"</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>LLM model: "Mistral" or "OpenAI"</td>
          </tr>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}><code style={{ backgroundColor: '#f4f4f4', padding: '2px 6px', borderRadius: '3px', fontFamily: "'Courier New', monospace", fontSize: '0.9em' }}>consistencyThreshold</code></td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>double</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>No</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>0.82</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Address consistency threshold (0.0 to 1.0)</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}><code style={{ backgroundColor: '#f4f4f4', padding: '2px 6px', borderRadius: '3px', fontFamily: "'Courier New', monospace", fontSize: '0.9em' }}>licenseImage</code></td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>File</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>No</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>null</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>License/ID image for face matching (JPG, JPEG, PNG)</td>
          </tr>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}><code style={{ backgroundColor: '#f4f4f4', padding: '2px 6px', borderRadius: '3px', fontFamily: "'Courier New', monospace", fontSize: '0.9em' }}>selfieImage</code></td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>File</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>No</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>null</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Selfie image for face matching (JPG, JPEG, PNG)</td>
          </tr>
        </tbody>
      </table>
      
      <h4>Response Structure</h4>
      <pre style={{ backgroundColor: '#f4f4f4', border: '1px solid #ddd', borderRadius: '5px', padding: '15px', overflowX: 'auto', fontFamily: "'Courier New', monospace", fontSize: '0.85em' }}>{`{
  "finalResult": true,
  "addressConsistencyScore": 0.95,
  "nameConsistencyScore": 0.98,
  "documentConsistencyScore": 0.95,
  "averageAuthenticityScore": 0.92,
  "documentsConsistent": true,
  "documents": [...],
  "faceMatch": {...},
  "statusHtml": "<div>...</div>",
  "verificationTableHtml": "<div>...</div>",
  "extractedFields": {...}
}`}</pre>
      
      <h4>Response Fields</h4>
      <table style={{ width: '100%', borderCollapse: 'collapse', margin: '15px 0' }}>
        <thead>
          <tr style={{ backgroundColor: '#3498db', color: 'white' }}>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Field</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Type</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}><code style={{ backgroundColor: '#f4f4f4', padding: '2px 6px', borderRadius: '3px', fontFamily: "'Courier New', monospace", fontSize: '0.9em' }}>finalResult</code></td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>boolean</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Overall verification result (true = passed, false = failed)</td>
          </tr>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}><code style={{ backgroundColor: '#f4f4f4', padding: '2px 6px', borderRadius: '3px', fontFamily: "'Courier New', monospace", fontSize: '0.9em' }}>addressConsistencyScore</code></td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>double</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Address similarity score between documents (0.0 to 1.0)</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}><code style={{ backgroundColor: '#f4f4f4', padding: '2px 6px', borderRadius: '3px', fontFamily: "'Courier New', monospace", fontSize: '0.9em' }}>nameConsistencyScore</code></td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>double</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Name similarity score between documents (0.0 to 1.0)</td>
          </tr>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}><code style={{ backgroundColor: '#f4f4f4', padding: '2px 6px', borderRadius: '3px', fontFamily: "'Courier New', monospace", fontSize: '0.9em' }}>faceMatch</code></td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>object</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Face matching result (if license and selfie provided)</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}><code style={{ backgroundColor: '#f4f4f4', padding: '2px 6px', borderRadius: '3px', fontFamily: "'Courier New', monospace", fontSize: '0.9em' }}>statusHtml</code></td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>string</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>HTML formatted verification status</td>
          </tr>
        </tbody>
      </table>
      
      <hr style={{ margin: '20px 0' }} />
      
      <h2 style={{ color: '#34495e', borderBottom: '2px solid #ecf0f1', paddingBottom: '5px', marginTop: '30px' }}>Verification Process</h2>
      
      <h3 style={{ color: '#555', marginTop: '25px' }}>Step 1: Document Processing</h3>
      <ol style={{ margin: '10px 0', paddingLeft: '30px' }}>
        <li style={{ margin: '5px 0' }}>OCR text extraction from all documents (parallel processing)</li>
        <li style={{ margin: '5px 0' }}>KYC field extraction using LLM (name, address, DOB, etc.)</li>
        <li style={{ margin: '5px 0' }}>Address extraction from each document</li>
      </ol>
      
      <h3 style={{ color: '#555', marginTop: '25px' }}>Step 2: Address Consistency Check</h3>
      <ol style={{ margin: '10px 0', paddingLeft: '30px' }}>
        <li style={{ margin: '5px 0' }}>Compare addresses from all documents</li>
        <li style={{ margin: '5px 0' }}>Normalize addresses (expand abbreviations: TN → Tamil Nadu)</li>
        <li style={{ margin: '5px 0' }}>Calculate similarity score using Jaccard similarity</li>
        <li style={{ margin: '5px 0' }}><strong>If addresses match:</strong> Proceed to Google Maps verification</li>
        <li style={{ margin: '5px 0' }}><strong>If addresses don't match:</strong> Skip Google Maps, mark as not verified</li>
      </ol>
      
      <h3 style={{ color: '#555', marginTop: '25px' }}>Step 3: Google Maps Verification (if addresses match)</h3>
      <ol style={{ margin: '10px 0', paddingLeft: '30px' }}>
        <li style={{ margin: '5px 0' }}>Verify each document's address with Google Maps Geocoding API</li>
        <li style={{ margin: '5px 0' }}>Get formatted address from Google Maps</li>
        <li style={{ margin: '5px 0' }}>Calculate authenticity score (similarity between extracted and Google formatted address)</li>
      </ol>
      
      <h3 style={{ color: '#555', marginTop: '25px' }}>Step 4: Face Matching (if provided)</h3>
      <ol style={{ margin: '10px 0', paddingLeft: '30px' }}>
        <li style={{ margin: '5px 0' }}>Detect and crop faces from license and selfie images</li>
        <li style={{ margin: '5px 0' }}>Preprocess images (CLAHE, grayscale, resize)</li>
        <li style={{ margin: '5px 0' }}>Compare faces using ORB feature matching</li>
        <li style={{ margin: '5px 0' }}>Calculate match score (0-5)</li>
        <li style={{ margin: '5px 0' }}>Pass if score >= 4 (configurable threshold)</li>
      </ol>
      
      <hr style={{ margin: '20px 0' }} />
      
      <h2 style={{ color: '#34495e', borderBottom: '2px solid #ecf0f1', paddingBottom: '5px', marginTop: '30px' }}>Code Examples</h2>
      
      <h3 style={{ color: '#555', marginTop: '25px' }}>cURL - Verify Documents</h3>
      <pre style={{ backgroundColor: '#f4f4f4', border: '1px solid #ddd', borderRadius: '5px', padding: '15px', overflowX: 'auto', fontFamily: "'Courier New', monospace", fontSize: '0.85em' }}>{`curl -X POST "http://localhost:51348/api/KycAgent/verify" \\
  -H "X-API-Key: your-api-key-here" \\
  -F "documents=@document1.pdf" \\
  -F "documents=@document2.pdf" \\
  -F "expectedAddress=10 F2 Narayanasamy Kovil Street, Pettai, Tirunelveli, Tamil Nadu 627004" \\
  -F "modelChoice=Mistral" \\
  -F "consistencyThreshold=0.82" \\
  -F "licenseImage=@license.jpg" \\
  -F "selfieImage=@selfie.jpg"`}</pre>
      
      <h3 style={{ color: '#555', marginTop: '25px' }}>Python - Verify Documents</h3>
      <pre style={{ backgroundColor: '#f4f4f4', border: '1px solid #ddd', borderRadius: '5px', padding: '15px', overflowX: 'auto', fontFamily: "'Courier New', monospace", fontSize: '0.85em' }}>{`import requests

url = "http://localhost:51348/api/KycAgent/verify"
headers = {"X-API-Key": "your-api-key-here"}

files = [
    ("documents", ("doc1.pdf", open("doc1.pdf", "rb"), "application/pdf")),
    ("documents", ("doc2.pdf", open("doc2.pdf", "rb"), "application/pdf")),
    ("licenseImage", ("license.jpg", open("license.jpg", "rb"), "image/jpeg")),
    ("selfieImage", ("selfie.jpg", open("selfie.jpg", "rb"), "image/jpeg"))
]

data = {
    "expectedAddress": "10 F2 Narayanasamy Kovil Street, Pettai, Tirunelveli, Tamil Nadu 627004",
    "modelChoice": "Mistral",
    "consistencyThreshold": 0.82
}

response = requests.post(url, headers=headers, files=files, data=data)
result = response.json()

print(f"Verification: {'✅ Passed' if result['finalResult'] else '❌ Failed'}")
print(f"Address Consistency: {result['addressConsistencyScore']:.2%}")

if result.get('faceMatch'):
    print(f"Face Match: {'✅ Passed' if result['faceMatch']['match'] else '❌ Failed'}")
    print(f"Face Score: {result['faceMatch']['matchScore']}/5")`}</pre>
      
      <hr style={{ margin: '20px 0' }} />
      
      <h2 style={{ color: '#34495e', borderBottom: '2px solid #ecf0f1', paddingBottom: '5px', marginTop: '30px' }}>Features</h2>
      
      <h3 style={{ color: '#555', marginTop: '25px' }}>Address Verification Logic</h3>
      <ol style={{ margin: '10px 0', paddingLeft: '30px' }}>
        <li style={{ margin: '5px 0' }}><strong>Address Consistency Check First:</strong> Documents are checked for address consistency before Google Maps verification</li>
        <li style={{ margin: '5px 0' }}><strong>Conditional Google Maps Verification:</strong> Google Maps API is only called if addresses from documents match</li>
        <li style={{ margin: '5px 0' }}><strong>Address Normalization:</strong> State/province abbreviations are automatically expanded (TN → Tamil Nadu, ON → Ontario)</li>
        <li style={{ margin: '5px 0' }}><strong>Similarity Calculation:</strong> Uses Jaccard similarity with normalized addresses</li>
      </ol>
      
      <h3 style={{ color: '#555', marginTop: '25px' }}>Face Matching</h3>
      <ul style={{ margin: '10px 0', paddingLeft: '30px' }}>
        <li style={{ margin: '5px 0' }}><strong>Technology:</strong> Azure Face API (cloud-based face recognition service)</li>
        <li style={{ margin: '5px 0' }}><strong>Preprocessing:</strong> CLAHE (Contrast Limited Adaptive Histogram Equalization)</li>
        <li style={{ margin: '5px 0' }}><strong>Threshold:</strong> Minimum score of 4/5 required to pass (configurable)</li>
        <li style={{ margin: '5px 0' }}><strong>Rotation Handling:</strong> Automatically handles rotated images (0°, 90°, 180°, 270°)</li>
      </ul>
      
      <hr style={{ margin: '20px 0' }} />
      
      <h2 style={{ color: '#34495e', borderBottom: '2px solid #ecf0f1', paddingBottom: '5px', marginTop: '30px' }}>Error Handling</h2>
      
      <h3 style={{ color: '#555', marginTop: '25px' }}>Common Error Responses</h3>
      <p><strong>400 Bad Request:</strong></p>
      <ul style={{ margin: '10px 0', paddingLeft: '30px' }}>
        <li style={{ margin: '5px 0' }}>"At least one document is required" (process endpoint)</li>
        <li style={{ margin: '5px 0' }}>"Please upload at least two documents" (verify endpoint)</li>
        <li style={{ margin: '5px 0' }}>"Expected address is required" (verify endpoint)</li>
      </ul>
      
      <p><strong>401 Unauthorized:</strong></p>
      <ul style={{ margin: '10px 0', paddingLeft: '30px' }}>
        <li style={{ margin: '5px 0' }}>"API Key was not provided"</li>
        <li style={{ margin: '5px 0' }}>"Invalid API Key"</li>
      </ul>
      
      <hr style={{ margin: '20px 0' }} />
      
      <h2 style={{ color: '#34495e', borderBottom: '2px solid #ecf0f1', paddingBottom: '5px', marginTop: '30px' }}>Best Practices</h2>
      <ol style={{ margin: '10px 0', paddingLeft: '30px' }}>
        <li style={{ margin: '5px 0' }}><strong>Document Quality:</strong> Ensure documents are clear and readable for better OCR accuracy</li>
        <li style={{ margin: '5px 0' }}><strong>Address Format:</strong> Provide expected address in consistent format</li>
        <li style={{ margin: '5px 0' }}><strong>Face Images:</strong> Use clear, front-facing photos for better face matching</li>
        <li style={{ margin: '5px 0' }}><strong>API Key Security:</strong> Never expose API keys in client-side code</li>
        <li style={{ margin: '5px 0' }}><strong>Error Handling:</strong> Always check response status and handle errors appropriately</li>
      </ol>
    </div>
  );
};

export default DocumentationPage;
