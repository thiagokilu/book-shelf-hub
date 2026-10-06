
import { createContext, useContext, useEffect, useState } from "react";
import { getUserProfile } from "../lib/http/user/getuserprofile";
import { useAuth } from "./authContext";

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  bio?: string | null;
  profileImageUrl?: string | null;
  emailVerified?: boolean;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    async function fetchUser() {
      try {
        const response = await getUserProfile();
        if (response.ok) {
          setUser(response.data);
        }
      } catch (error) {
        // Error fetching user profile
      } finally {
        setIsLoading(false);
      }
    }

    fetchUser();
  }, [isAuthenticated]);

  return (
    <UserContext.Provider value={{ user, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}