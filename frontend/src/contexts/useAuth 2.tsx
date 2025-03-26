import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  username: string;
  role: string;
  clubId: string;
}

interface AuthContextType {
  user: User | null;
  register: (
    username: string,
    password: string,
    confirmPassword: string,
    clubId: string
  ) => Promise<void>;
  registerAdmin: (
    username: string,
    password: string,
    confirmPassword: string,
    passkey1: string,
    passkey2: string
  ) => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoggedIn: boolean;
  isLoading: boolean;
  clubName: string;
}

type Props = {
  children: React.ReactNode;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const UserProvider = ({ children }: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [clubName, setClubName] = useState("");
  // Check if user is authenticated by making a request to /me endpoint
  const checkAuth = useCallback(async () => {
    try {
      const response = await api.get("/auth/me");
      if (response.data) {
        console.log("Auth Check Response:", response.data);
        setUser(response.data);
        setIsLoggedIn(true);
        if (response.data.role !== "admin") {
          const clubResponse = await api.get(`/clubs/${response.data.clubId}`);
          setClubName(clubResponse.data.name);
        }
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    checkAuth().finally(() => setIsLoading(false));
  }, [checkAuth]);

  const register = useCallback(
    async (
      username: string,
      password: string,
      confirmPassword: string,
      clubId: string
    ) => {
      setIsLoading(true);
      try {
        const response = await api.post("/auth/register", {
          username,
          password,
          confirmPassword,
          clubId,
        });
        console.log("Register Response:", response);
        await logout();
        navigate("/login");
      } catch (error) {
        console.error("Error registering:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [navigate]
  );

  const registerAdmin = useCallback(
    async (
      username: string,
      password: string,
      confirmPassword: string,
      passkey1: string,
      passkey2: string
    ) => {
      setIsLoading(true);
      try {
        const response = await api.post("/auth/create-admin", {
          username,
          password,
          confirmPassword,
          passkey1,
          passkey2,
        });
        console.log("Register Admin Response:", response);
        navigate("/login");
      } catch (error) {
        console.error("Error registering admin:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [navigate]
  );

  const login = useCallback(
    async (username: string, password: string) => {
      setIsLoading(true);
      try {
        const response = await api.post("/auth/login", {
          username,
          password,
        });
        if (response.data) {
          setUser(response.data);
          setIsLoggedIn(true);

          // Fetch club name if user is not admin
          if (response.data.role !== "admin") {
            try {
              const clubResponse = await api.get(
                `/clubs/${response.data.clubId}`
              );
              setClubName(clubResponse.data.name);
            } catch (clubError) {
              console.error("Error fetching club name:", clubError);
            }
          }

          // Wait for state updates to complete
          await new Promise((resolve) => setTimeout(resolve, 0));
          navigate("/");
        }
      } catch (error) {
        throw new Error("Failed to login");
      } finally {
        setIsLoading(false);
      }
    },
    [navigate]
  );

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await api.post("/auth/logout");
      setUser(null);
      setIsLoggedIn(false);
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  return (
    <AuthContext.Provider
      value={{
        user,
        register,
        registerAdmin,
        login,
        logout,
        isLoggedIn,
        isLoading,
        clubName,
      }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
