import axios, { AxiosInstance } from 'axios';
import { TestGroupsApi, ApiResponse, TestGroup } from './types';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

// Handle backend error responses (400, 404, etc.) that contain structured errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.errors?.length > 0) {
      // Backend returned structured ApiResponse with errors — return as normal response
      return { data: error.response.data };
    }
    return Promise.reject(error);
  }
);

// Token will be set externally via setAuthToken
let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common['Authorization'];
  }
}

export function getAuthToken(): string | null {
  return authToken;
}

export const realApi: TestGroupsApi = {
  async getAll(): Promise<ApiResponse<TestGroup[]>> {
    const response = await axiosInstance.get('/api/v1/admin/testGroups');
    return response.data;
  },

  async create(name: string): Promise<ApiResponse<{ id: string }>> {
    const response = await axiosInstance.post('/api/v1/admin/testGroups', {
      name,
    });
    return response.data;
  },

  async updateUsers(
    groupId: string,
    emails: string,
    append: boolean
  ): Promise<ApiResponse<null>> {
    const response = await axiosInstance.put(
      `/api/v1/admin/testGroups/${groupId}/users`,
      { userEmails: emails, append }
    );
    return response.data;
  },

  async delete(groupId: string): Promise<ApiResponse<null>> {
    const response = await axiosInstance.delete(
      `/api/v1/admin/testGroups/${groupId}`
    );
    return response.data;
  },
};