import { useRef, useState } from 'react';

interface CsvUploadProps {
  onUpload: (emails: string[]) => void;
  loading: boolean;
  existingEmails: string[];
}

function parseCSV(text: string): string[] {
  const emailRegex = /[^\s@,;]+@[^\s@,;]+\.[^\s@,;]+/g;
  const matches = text.match(emailRegex) || [];
  return [...new Set(matches.map((e) => e.toLowerCase()))];
}

export function CsvUpload({ onUpload, loading, existingEmails }: CsvUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string[] | null>(null);
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const parsed = parseCSV(text);
      const existingLower = existingEmails.map((e) => e.toLowerCase());
      const unique = parsed.filter((e) => !existingLower.includes(e));
      setPreview(unique);
    };
    reader.readAsText(file);

    // Reset input so same file can be selected again
    e.target.value = '';
  };

  const handleConfirm = () => {
    if (preview && preview.length > 0) {
      onUpload(preview);
      setPreview(null);
      setFileName('');
    }
  };

  const handleCancel = () => {
    setPreview(null);
    setFileName('');
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-gray-900">Upload CSV</h3>

      {!preview ? (
        <div>
          <input
            ref={fileRef}
            type="file"
            accept=".csv,.txt"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Choose CSV File
          </button>
          <p className="mt-2 text-xs text-gray-500">
            Upload a CSV or text file containing email addresses
          </p>
        </div>
      ) : (
        <>
          <p className="mb-2 text-xs text-gray-500">File: {fileName}</p>
          {preview.length === 0 ? (
            <div className="mb-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-700">
              No new valid emails found in file.
            </div>
          ) : (
            <>
              <div className="mb-3 rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
                Found {preview.length} new {preview.length === 1 ? 'email' : 'emails'}:
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
              Cancel
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
