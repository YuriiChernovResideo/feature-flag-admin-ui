export interface TestGroup {
  id: string;
  name: string;
  userCount: number;
  userEmails: string[];
}

export interface ApiResponse<T> {
  data: T;
  errors: ApiError[];
}

export interface ApiError {
  message: string;
  code: string;
  reasonCode: string;
}

export interface CreateTestGroupRequest {
  name: string;
}

export interface UpdateTestGroupUsersRequest {
  userEmails: string;
  append: boolean;
}

export interface TestGroupsApi {
  getAll(): Promise<ApiResponse<TestGroup[]>>;
  create(name: string): Promise<ApiResponse<{ id: string }>>;
  updateUsers(groupId: string, emails: string, append: boolean): Promise<ApiResponse<null>>;
  delete(groupId: string): Promise<ApiResponse<null>>;
}
