import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DbMember } from "@/types/database";

interface AuthContextType {
  member: DbMember | null;
  isLoading: boolean;
  login: (uid: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  setPassword: (uid: string, password: string) => Promise<{ success: boolean; error?: string }>;
  updateMember: (updates: Partial<DbMember>) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const SESSION_KEY = "member_session";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [member, setMember] = useState<DbMember | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const storedSession = localStorage.getItem(SESSION_KEY);
    if (storedSession) {
      try {
        const parsed = JSON.parse(storedSession);
        setMember(parsed);
      } catch {
        localStorage.removeItem(SESSION_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (uid: string, password: string) => {
    try {
      const { data, error } = await supabase.rpc("member_login", {
        p_uid: uid,
        p_password: password,
      });

      if (error) throw error;

      const result = data as unknown as { success: boolean; error?: string; member?: DbMember };
      
      if (result.success && result.member) {
        setMember(result.member);
        localStorage.setItem(SESSION_KEY, JSON.stringify(result.member));
        return { success: true };
      }
      
      return { success: false, error: result.error || "Login failed" };
    } catch (error: any) {
      return { success: false, error: error.message || "Login failed" };
    }
  };

  const logout = () => {
    setMember(null);
    localStorage.removeItem(SESSION_KEY);
  };

  const setPassword = async (uid: string, password: string) => {
    try {
      const { data, error } = await supabase.rpc("member_set_password", {
        p_uid: uid,
        p_password: password,
      });

      if (error) throw error;

      const result = data as { success: boolean; error?: string };
      return result;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const updateMember = async (updates: Partial<DbMember>) => {
    if (!member) return { success: false, error: "Not logged in" };

    try {
      const { error } = await supabase
        .from("members")
        .update(updates)
        .eq("uid", member.uid);

      if (error) throw error;

      // Update local state
      const updatedMember = { ...member, ...updates };
      setMember(updatedMember);
      localStorage.setItem(SESSION_KEY, JSON.stringify(updatedMember));

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  return (
    <AuthContext.Provider value={{ member, isLoading, login, logout, setPassword, updateMember }}>
      {children}
    </AuthContext.Provider>
  );
};
