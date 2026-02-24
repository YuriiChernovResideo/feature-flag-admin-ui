import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const useMock = import.meta.env.VITE_USE_MOCK === 'true';

export function Header() {
  const { isTokenSet, updateToken } = useAuth();
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [tokenInput, setTokenInput] = useState('');

  const handleSaveToken = () => {
    const trimmed = tokenInput.trim();
    if (trimmed) {
      updateToken(trimmed);
      setTokenInput('');
      setShowTokenModal(false);
    }
  };

  const handleClearToken = () => {
    updateToken(null);
    setTokenInput('');
    setShowTokenModal(false);
  };

  return (
    <>
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
              </svg>
            </div>
            <h1 className="text-lg font-bold text-gray-900">Feature Flag Admin</h1>
            {useMock && (
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                Mock Mode
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div
                className={`h-2 w-2 rounded-full ${
                  useMock
                    ? 'bg-amber-400'
                    : isTokenSet
                    ? 'bg-green-500'
                    : 'bg-red-400'
                }`}
              />
              <span className="text-xs text-gray-500">
                {useMock
                  ? 'Mock API'
                  : isTokenSet
                  ? 'Token Set'
                  : 'No Token'}
              </span>
            </div>
            {!useMock && (
              <button
                onClick={() => setShowTokenModal(true)}
                className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                {isTokenSet ? 'Update Token' : 'Set Token'}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Token Modal */}
      {showTokenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setShowTokenModal(false)}
          />
          <div className="relative z-10 w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
            <h2 className="mb-1 text-lg font-semibold text-gray-900">
              Bearer Token
            </h2>
            <p className="mb-4 text-sm text-gray-500">
              Paste your OAuth Bearer token. It will be stored in memory only (not
              persisted).
            </p>
            <textarea
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="eyJhbGciOiJSUzI1NiIs..."
              rows={4}
              className="mb-4 w-full rounded-lg border border-gray-300 p-3 font-mono text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
            <div className="flex justify-between">
              <button
                onClick={handleClearToken}
                className="rounded-lg px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Clear Token
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowTokenModal(false)}
                  className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveToken}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Save Token
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
