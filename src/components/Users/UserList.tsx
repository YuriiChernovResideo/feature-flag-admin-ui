interface UserListProps {
  emails: string[];
  onRemove: (email: string) => void;
  loading: boolean;
}

export function UserList({ emails, onRemove, loading }: UserListProps) {
  if (emails.length === 0) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
              Email Address
            </th>
            <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {emails.map((email) => (
            <tr key={email} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-3">
                <span className="text-sm text-gray-900">{email}</span>
              </td>
              <td className="px-6 py-3 text-right">
                <button
                  onClick={() => onRemove(email)}
                  disabled={loading}
                  className="rounded-md px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
