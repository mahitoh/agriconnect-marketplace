import React, { useState, useEffect } from 'react';

const ConnectionTest = () => {
  const [backendStatus, setBackendStatus] = useState('checking');
  const [apiUrl, setApiUrl] = useState('');

  useEffect(() => {
    const testConnection = async () => {
      const url = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      setApiUrl(url);

      try {
        console.log('Testing connection to:', url);
        const response = await fetch(`${url}/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (response.ok) {
          setBackendStatus('connected');
          console.log('✅ Backend is connected!');
        } else {
          setBackendStatus('error');
          console.log('❌ Backend returned error:', response.status);
        }
      } catch (error) {
        setBackendStatus('offline');
        console.log('❌ Cannot reach backend:', error.message);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Backend Connection Test</h1>

        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-2">API URL:</p>
          <p className="font-mono bg-gray-100 p-3 rounded text-sm break-all">{apiUrl}</p>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-2">Status:</p>
          <div className={`p-4 rounded-lg font-bold text-center ${
            backendStatus === 'connected' ? 'bg-green-100 text-green-700' :
            backendStatus === 'offline' ? 'bg-red-100 text-red-700' :
            backendStatus === 'error' ? 'bg-yellow-100 text-yellow-700' :
            'bg-blue-100 text-blue-700'
          }`}>
            {backendStatus === 'connected' && '✅ Connected!'}
            {backendStatus === 'offline' && '❌ Backend Offline'}
            {backendStatus === 'error' && '⚠️ Backend Error'}
            {backendStatus === 'checking' && '⏳ Checking...'}
          </div>
        </div>

        {backendStatus !== 'connected' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
            <p className="font-bold mb-2">To fix this:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Open a terminal in the backend folder</li>
              <li>Run: <code className="bg-white px-2 py-1 rounded">npm run dev</code></li>
              <li>Wait for "✅ All routes loaded successfully"</li>
              <li>Refresh this page</li>
            </ol>
          </div>
        )}

        {backendStatus === 'connected' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-700">
            <p className="font-bold">✅ Backend is running!</p>
            <p className="mt-2">You can now proceed with login/registration.</p>
          </div>
        )}

        <div className="mt-8 pt-8 border-t">
          <p className="text-xs text-gray-500">
            <strong>Environment:</strong> {process.env.NODE_ENV || 'development'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            <strong>Frontend Port:</strong> 3000
          </p>
          <p className="text-xs text-gray-500 mt-1">
            <strong>Expected Backend Port:</strong> 5000
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConnectionTest;
