import { mockApi } from './mockApi';
import { realApi } from './realApi';

const useMock = import.meta.env.VITE_USE_MOCK === 'true';

export const api = useMock ? mockApi : realApi;
