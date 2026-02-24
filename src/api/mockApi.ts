import { TestGroupsApi, TestGroup, ApiResponse } from './types';
import { mockTestGroups } from './mockData';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const randomDelay = () => delay(300 + Math.random() * 200);

// In-memory state — persists during session, resets on refresh
let groups: TestGroup[] = JSON.parse(JSON.stringify(mockTestGroups));

export const mockApi: TestGroupsApi = {
  async getAll(): Promise<ApiResponse<TestGroup[]>> {
    await randomDelay();
    return {
      data: JSON.parse(JSON.stringify(groups)),
      errors: [],
    };
  },

  async create(name: string): Promise<ApiResponse<{ id: string }>> {
    await randomDelay();

    const existing = groups.find(
      (g) => g.name.toLowerCase() === name.toLowerCase()
    );
    if (existing) {
      return {
        data: null as unknown as { id: string },
        errors: [
          {
            message: `Test group "${name}" already exists`,
            code: 'DUPLICATE',
            reasonCode: 'TEST_GROUP_ALREADY_EXISTS',
          },
        ],
      };
    }

    const id = crypto.randomUUID();
    const newGroup: TestGroup = {
      id,
      name,
      userCount: 0,
      userEmails: [],
    };
    groups.push(newGroup);

    return {
      data: { id },
      errors: [],
    };
  },

  async updateUsers(
    groupId: string,
    emails: string,
    append: boolean
  ): Promise<ApiResponse<null>> {
    await randomDelay();

    const group = groups.find((g) => g.id === groupId);
    if (!group) {
      return {
        data: null,
        errors: [
          {
            message: 'Test group not found',
            code: 'NOT_FOUND',
            reasonCode: 'TEST_GROUP_NOT_FOUND',
          },
        ],
      };
    }

    const newEmails = emails
      .split(',')
      .map((e) => e.trim())
      .filter((e) => e.length > 0);

    if (append) {
      const combined = new Set([...group.userEmails, ...newEmails]);
      group.userEmails = Array.from(combined);
    } else {
      group.userEmails = newEmails;
    }
    group.userCount = group.userEmails.length;

    return { data: null, errors: [] };
  },

  async delete(groupId: string): Promise<ApiResponse<null>> {
    await randomDelay();

    const index = groups.findIndex((g) => g.id === groupId);
    if (index === -1) {
      return {
        data: null,
        errors: [
          {
            message: 'Test group not found',
            code: 'NOT_FOUND',
            reasonCode: 'TEST_GROUP_NOT_FOUND',
          },
        ],
      };
    }

    groups.splice(index, 1);
    return { data: null, errors: [] };
  },
};
