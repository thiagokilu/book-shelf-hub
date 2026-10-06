import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import { useTranslation } from "react-i18next";
import { ScreenContainer } from "../components/ScreenContainer";
import { clearTokens, getAccessToken } from "../lib/auth/storage";

type AuthContextData = {
  isAuthenticated: boolean;
  signIn: () => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextData | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const token = await getAccessToken();
        setIsAuthenticated(!!token);
      } catch (error) {
        // Error checking auth
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, []);

  const signIn = useCallback(() => {
    setIsAuthenticated(true);
  }, []);

  const signOut = useCallback(async () => {
    await clearTokens();
    setIsAuthenticated(false);
  }, []);

  if (isLoading) {
    return <ScreenContainer />;
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  const { t } = useTranslation();

  if (!context) {
    throw new Error(t("errors.authContext"));
  }

  return context;
}
