
import * as React from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  fullName: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  signup: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
};

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = React.useState<Session | null>(null);
  const [user, setUser] = React.useState<User | null>(null);
  const [fullName, setFullName] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  // Fetch profile from `profiles` table using the user id
  const fetchProfile = async (uid: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", uid)
      .maybeSingle();
    setFullName(data?.full_name ?? null);
  };

  React.useEffect(() => {
    // Set listener FIRST then check for session
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else setFullName(null);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else setFullName(null);
      setLoading(false);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
    // eslint-disable-next-line
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error && supabase.auth.getUser()) {
      // Full name will refresh by onAuthStateChange
    }
    return { error: error ? error.message : null };
  };

  const signup = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/`,
      }
    });
    return { error: error ? error.message : null };
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, user, fullName, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
