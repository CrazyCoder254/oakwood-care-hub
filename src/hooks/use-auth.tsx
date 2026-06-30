import { useEffect, useState, createContext, useContext, ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";

export type AppRole = "patient" | "doctor" | "admin";

interface AuthState {
  user: User | null;
  session: Session | null;
  role: AppRole | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  user: null, session: null, role: null, loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const { supabase } = await import("@/integrations/supabase/client");
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
          setSession(s);
          if (s?.user) {
            // defer DB call
            setTimeout(async () => {
              try {
                const { data } = await supabase
                  .from("user_roles")
                  .select("role")
                  .eq("user_id", s.user.id)
                  .order("role");
                const roles = (data ?? []).map(r => r.role as AppRole);
                const best = roles.includes("admin") ? "admin" : roles.includes("doctor") ? "doctor" : roles[0] ?? "patient";
                setRole(best);
              } catch (error) {
                console.error('[AuthProvider] Error fetching user role:', error);
              }
            }, 0);
          } else {
            setRole(null);
          }
        });

        const { data: { session: s } } = await supabase.auth.getSession();
        setSession(s);
        setLoading(false);
        if (s?.user) {
          try {
            const { data } = await supabase.from("user_roles").select("role").eq("user_id", s.user.id);
            const roles = (data ?? []).map(r => r.role as AppRole);
            const best = roles.includes("admin") ? "admin" : roles.includes("doctor") ? "doctor" : roles[0] ?? "patient";
            setRole(best);
          } catch (error) {
            console.error('[AuthProvider] Error fetching user role:', error);
          }
        }

        return () => subscription.unsubscribe();
      } catch (error) {
        console.error('[AuthProvider] Failed to initialize Supabase:', error);
        setLoading(false);
      }
    })();
  }, []);

  const signOut = async () => {
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      await supabase.auth.signOut();
    } catch (error) {
      console.error('[AuthProvider] Sign out error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user: session?.user ?? null, session, role, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
