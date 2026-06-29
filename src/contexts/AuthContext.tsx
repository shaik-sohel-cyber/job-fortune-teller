
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";

interface AppUser {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AppUser | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const toAppUser = (session: Session | null): AppUser | null => {
  if (!session?.user) return null;
  const meta = (session.user.user_metadata ?? {}) as Record<string, string>;
  return {
    id: session.user.id,
    email: session.user.email ?? "",
    name: meta.display_name || meta.name || (session.user.email?.split("@")[0] ?? "User"),
  };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Register listener FIRST, then hydrate the existing session.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setIsLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
      throw error;
    }
    toast({ title: "Welcome back!" });
    navigate("/");
  };

  const signup = async (name: string, email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: { display_name: name, name },
      },
    });
    if (error) {
      toast({ title: "Signup failed", description: error.message, variant: "destructive" });
      throw error;
    }
    toast({ title: "Account created", description: "Welcome to JobGenisis!" });
    navigate("/");
  };

  const logout = async () => {
    await supabase.auth.signOut();
    // Clear cached flow state from the old localStorage-based gating.
    [
      "resumeData", "verificationResults", "selectedPackage",
      "assessmentScore", "assessmentPassed", "aptitudePassed",
      "interviewComplete", "failedCompanies",
    ].forEach((k) => localStorage.removeItem(k));
    toast({ title: "Logged out" });
    navigate("/login");
  };

  const user = toAppUser(session);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!session,
        isLoading,
        user,
        session,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
