import { useState, useCallback } from 'react';
import { api } from '../api/client';
import { TestGroup } from '../api/types';

export function useTestGroups() {
  const [groups, setGroups] = useState<TestGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getAll();
      if (response.errors.length > 0) {
        setError(response.errors[0].message);
      } else {
        setGroups(response.data);
      }
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { status?: number } };
        if (axiosErr.response?.status === 401) {
          setError('Token expired or invalid. Please update your token.');
        } else {
          setError('Failed to fetch test groups');
        }
      } else {
        setError('Failed to fetch test groups');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const createGroup = useCallback(async (name: string) => {
    const response = await api.create(name);
    if (response.errors.length > 0) {
      throw new Error(response.errors[0].message);
    }
    return response.data;
  }, []);

  const updateUsers = useCallback(
    async (groupId: string, emails: string, append: boolean) => {
      const response = await api.updateUsers(groupId, emails, append);
      if (response.errors.length > 0) {
        throw new Error(response.errors[0].message);
      }
    },
    []
  );

  const deleteGroup = useCallback(async (groupId: string) => {
    const response = await api.delete(groupId);
    if (response.errors.length > 0) {
      throw new Error(response.errors[0].message);
    }
  }, []);

  const getGroupById = useCallback(
    (id: string): TestGroup | undefined => {
      return groups.find((g) => g.id === id);
    },
    [groups]
  );

  return {
    groups,
    loading,
    error,
    fetchGroups,
    createGroup,
    updateUsers,
    deleteGroup,
    getGroupById,
  };
}
