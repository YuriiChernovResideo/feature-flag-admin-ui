import { useNavigate } from 'react-router-dom';
import { TestGroup } from '../../api/types';

interface GroupListProps {
  groups: TestGroup[];
  onDelete: (group: TestGroup) => void;
}

export function GroupList({ groups, onDelete }: GroupListProps) {
  const navigate = useNavigate();

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
              Group Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
              Users
            </th>
            <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {groups.map((group) => (
            <tr key={group.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">
                <button
                  onClick={() => navigate(`/groups/${group.id}`)}
                  className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {group.name}
                </button>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    group.userCount > 0
                      ? 'bg-blue-50 text-blue-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {group.userCount} {group.userCount === 1 ? 'user' : 'users'}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => navigate(`/groups/${group.id}`)}
                    className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100"
                  >
                    View
                  </button>
                  <button
                    onClick={() => onDelete(group)}
                    className="rounded-md px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
