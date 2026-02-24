import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { setAuthToken } from '../api/realApi';

interface AuthContextType {
  token: string | null;
  isTokenSet: boolean;
  updateToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  isTokenSet: false,
  updateToken: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);

  const updateToken = useCallback((newToken: string | null) => {
    setToken(newToken);
    setAuthToken(newToken);
  }, []);

  return (
    <AuthContext.Provider
      value={{ token, isTokenSet: !!token, updateToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
