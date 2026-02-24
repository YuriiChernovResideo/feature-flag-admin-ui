import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTestGroups } from '../hooks/useTestGroups';
import { useToast } from '../hooks/useToast';
import { TestGroup } from '../api/types';
import { UserList } from '../components/Users/UserList';
import { AddUserForm } from '../components/Users/AddUserForm';
import { BulkAddUsers } from '../components/Users/BulkAddUsers';
import { CsvUpload } from '../components/Users/CsvUpload';
import { LoadingSpinner } from '../components/Common/LoadingSpinner';
import { EmptyState } from '../components/Common/EmptyState';
import { ToastContainer } from '../components/Common/Toast';
import { SearchInput } from '../components/Common/SearchInput';
import { ConfirmDialog } from '../components/Common/ConfirmDialog';

export function GroupDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { groups, loading, fetchGroups, updateUsers } = useTestGroups();
  const { toasts, addToast, removeToast } = useToast();

  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [emailToRemove, setEmailToRemove] = useState<string | null>(null);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const group: TestGroup | undefined = useMemo(
    () => groups.find((g) => g.id === id),
    [groups, id]
  );

  const filteredEmails = useMemo(() => {
    if (!group) return [];
    if (!search) return group.userEmails;
    const q = search.toLowerCase();
    return group.userEmails.filter((e) => e.toLowerCase().includes(q));
  }, [group, search]);

  const handleAddUser = useCallback(
    async (email: string) => {
      if (!id) return;
      setActionLoading(true);
      try {
        await updateUsers(id, email, true);
        addToast(`Added ${email}`, 'success');
        await fetchGroups();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to add user';
        addToast(msg, 'error');
      } finally {
        setActionLoading(false);
      }
    },
    [id, updateUsers, fetchGroups, addToast]
  );

  const handleBulkAdd = useCallback(
    async (emails: string[]) => {
      if (!id) return;
      setActionLoading(true);
      try {
        await updateUsers(id, emails.join(','), true);
        addToast(`Added ${emails.length} users`, 'success');
        await fetchGroups();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to add users';
        addToast(msg, 'error');
      } finally {
        setActionLoading(false);
      }
    },
    [id, updateUsers, fetchGroups, addToast]
  );

  const handleRemoveUser = useCallback(async () => {
    if (!id || !group || !emailToRemove) return;
    setActionLoading(true);
    try {
      const remaining = group.userEmails.filter(
        (e) => e.toLowerCase() !== emailToRemove.toLowerCase()
      );
      await updateUsers(id, remaining.join(','), false);
      addToast(`Removed ${emailToRemove}`, 'success');
      setEmailToRemove(null);
      await fetchGroups();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to remove user';
      addToast(msg, 'error');
      setEmailToRemove(null);
    } finally {
      setActionLoading(false);
    }
  }, [id, group, emailToRemove, updateUsers, fetchGroups, addToast]);

  if (loading && groups.length === 0) {
    return <LoadingSpinner />;
  }

  if (!group) {
    return (
      <div>
        <button
          onClick={() => navigate('/')}
          className="mb-4 inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Groups
        </button>
        <EmptyState
          title="Group not found"
          description="This test group doesn't exist or may have been deleted."
          action={
            <button
              onClick={() => navigate('/')}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Go to Groups
            </button>
          }
        />
      </div>
    );
  }

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/')}
          className="mb-4 inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Groups
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{group.name}</h2>
            <p className="mt-1 text-sm text-gray-500">
              {group.userCount} {group.userCount === 1 ? 'user' : 'users'} in
              this group
            </p>
          </div>
          <button
            onClick={() => fetchGroups()}
            disabled={loading}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            title="Refresh"
          >
            <svg className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Add User Section */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold text-gray-900">Add Single User</h3>
        <AddUserForm
          onAdd={handleAddUser}
          loading={actionLoading}
          existingEmails={group.userEmails}
        />
      </div>

      {/* Bulk Add & CSV */}
      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <BulkAddUsers
          onAdd={handleBulkAdd}
          loading={actionLoading}
          existingEmails={group.userEmails}
        />
        <CsvUpload
          onUpload={handleBulkAdd}
          loading={actionLoading}
          existingEmails={group.userEmails}
        />
      </div>

      {/* Users List */}
      <div className="mb-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">
            Members ({group.userEmails.length})
          </h3>
          {group.userEmails.length > 0 && (
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Filter emails..."
              className="w-64"
            />
          )}
        </div>

        {group.userEmails.length === 0 ? (
          <EmptyState
            title="No users in this group"
            description="Add users using the form above"
          />
        ) : filteredEmails.length === 0 ? (
          <EmptyState
            title="No emails match your filter"
            description={`No emails found for "${search}"`}
          />
        ) : (
          <UserList
            emails={filteredEmails}
            onRemove={setEmailToRemove}
            loading={actionLoading}
          />
        )}
      </div>

      {/* Remove User Confirmation */}
      <ConfirmDialog
        isOpen={!!emailToRemove}
        title="Remove User"
        message={`Are you sure you want to remove "${emailToRemove}" from this group?`}
        confirmLabel="Remove"
        variant="danger"
        onConfirm={handleRemoveUser}
        onCancel={() => setEmailToRemove(null)}
      />
    </>
  );
}
