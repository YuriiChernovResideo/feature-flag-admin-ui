import { useState, useEffect, useMemo } from 'react';
import { useTestGroups } from '../hooks/useTestGroups';
import { useToast } from '../hooks/useToast';
import { TestGroup } from '../api/types';
import { GroupList } from '../components/Groups/GroupList';
import { CreateGroupModal } from '../components/Groups/CreateGroupModal';
import { DeleteGroupDialog } from '../components/Groups/DeleteGroupDialog';
import { LoadingSpinner } from '../components/Common/LoadingSpinner';
import { EmptyState } from '../components/Common/EmptyState';
import { ToastContainer } from '../components/Common/Toast';
import { SearchInput } from '../components/Common/SearchInput';

export function GroupListPage() {
  const { groups, loading, error, fetchGroups, createGroup, deleteGroup } =
    useTestGroups();
  const { toasts, addToast, removeToast } = useToast();

  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<TestGroup | null>(null);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  useEffect(() => {
    if (error) addToast(error, 'error');
  }, [error, addToast]);

  const filtered = useMemo(() => {
    if (!search) return groups;
    const q = search.toLowerCase();
    return groups.filter((g) => g.name.toLowerCase().includes(q));
  }, [groups, search]);

  const handleCreate = async (name: string) => {
    setCreating(true);
    try {
      await createGroup(name);
      addToast(`Group "${name}" created successfully`, 'success');
      setShowCreate(false);
      await fetchGroups();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create group';
      addToast(msg, 'error');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async () => {
    if (!groupToDelete) return;
    try {
      await deleteGroup(groupToDelete.id);
      addToast(`Group "${groupToDelete.name}" deleted`, 'success');
      setGroupToDelete(null);
      await fetchGroups();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete group';
      addToast(msg, 'error');
      setGroupToDelete(null);
    }
  };

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Test Groups</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage feature flag test groups and their members
          </p>
        </div>
        <div className="flex items-center gap-3">
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
          <button
            onClick={() => setShowCreate(true)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            + Create New Group
          </button>
        </div>
      </div>

      {groups.length > 0 && (
        <div className="mb-4">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search groups by name..."
            className="max-w-sm"
          />
        </div>
      )}

      {loading && groups.length === 0 ? (
        <LoadingSpinner />
      ) : groups.length === 0 ? (
        <EmptyState
          title="No test groups yet"
          description="Create your first test group to start managing feature flags."
          action={
            <button
              onClick={() => setShowCreate(true)}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Create First Group
            </button>
          }
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No groups match your search"
          description={`No groups found for "${search}"`}
        />
      ) : (
        <GroupList groups={filtered} onDelete={setGroupToDelete} />
      )}

      <CreateGroupModal
        isOpen={showCreate}
        loading={creating}
        onClose={() => setShowCreate(false)}
        onCreate={handleCreate}
      />

      <DeleteGroupDialog
        group={groupToDelete}
        onConfirm={handleDelete}
        onCancel={() => setGroupToDelete(null)}
      />
    </>
  );
}
