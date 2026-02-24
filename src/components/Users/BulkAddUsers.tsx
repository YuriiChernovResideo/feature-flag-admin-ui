import { useState } from 'react';

interface BulkAddUsersProps {
  onAdd: (emails: string[]) => void;
  loading: boolean;
  existingEmails: string[];
}

function parseEmails(input: string): string[] {
  return input
    .split(/[,;\n\r]+/)
    .map((e) => e.trim().toLowerCase())
    .filter((e) => e.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
}

export function BulkAddUsers({ onAdd, loading, existingEmails }: BulkAddUsersProps) {
  const [input, setInput] = useState('');
  const [preview, setPreview] = useState<string[] | null>(null);

  const handlePreview = () => {
    const parsed = parseEmails(input);
    const existingLower = existingEmails.map((e) => e.toLowerCase());
    const unique = [...new Set(parsed)].filter(
      (e) => !existingLower.includes(e)
    );
    setPreview(unique);
  };

  const handleConfirm = () => {
    if (preview && preview.length > 0) {
      onAdd(preview);
      setInput('');
      setPreview(null);
    }
  };

  const handleCancel = () => {
    setPreview(null);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-gray-900">Bulk Add Users</h3>

      {!preview ? (
        <>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste emails separated by commas, semicolons, or new lines&#10;&#10;e.g., user1@example.com, user2@example.com"
            rows={4}
            className="mb-3 w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
          <button
            onClick={handlePreview}
            disabled={!input.trim()}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            Preview
          </button>
        </>
      ) : (
        <>
          {preview.length === 0 ? (
            <div className="mb-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-700">
              No new valid emails found. All emails are either invalid or already in the group.
            </div>
          ) : (
            <>
              <div className="mb-3 rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
                {preview.length} new {preview.length === 1 ? 'email' : 'emails'} will be added:
              </div>
              <div className="mb-3 max-h-40 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-3">
                {preview.map((email) => (
                  <div key={email} className="py-0.5 text-sm text-gray-700">
                    {email}
                  </div>
                ))}
              </div>
            </>
          )}
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              Back
            </button>
            {preview.length > 0 && (
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Adding...' : `Add ${preview.length} Users`}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
