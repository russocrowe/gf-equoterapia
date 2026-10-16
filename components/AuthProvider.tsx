"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

export type UserProfile = {
  full_name: string;
  avatar_url: string | null;
} | null;

type AuthContextValue = {
  loading: boolean;
  user: User | null;
  profile: UserProfile;
  isAdmin: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const loadDetails = useCallback(
    async (current: User | null) => {
      if (!current) {
        setProfile(null);
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      const [profileResult, adminResult] = await Promise.all([
        supabase
          .from("profiles")
          .select("full_name, avatar_url")
          .eq("user_id", current.id)
          .maybeSingle(),
        supabase.rpc("is_admin"),
      ]);
      setProfile(profileResult.data ?? null);
      setIsAdmin(adminResult.data === true);
      setLoading(false);
    },
    [supabase],
  );

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      const current = data.session?.user ?? null;
      setUser(current);
      void loadDetails(current);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const current = session?.user ?? null;
      setUser(current);
      // Adiado: não se deve chamar o Supabase de dentro do callback.
      setTimeout(() => {
        if (active) void loadDetails(current);
      }, 0);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [supabase, loadDetails]);

  const refreshProfile = useCallback(async () => {
    await loadDetails(user);
  }, [loadDetails, user]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setIsAdmin(false);
    router.push("/");
    router.refresh();
  }, [supabase, router]);

  const value = useMemo(
    () => ({ loading, user, profile, isAdmin, refreshProfile, signOut }),
    [loading, user, profile, isAdmin, refreshProfile, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth precisa estar dentro de AuthProvider");
  return context;
}

export function displayName(user: User | null, profile: UserProfile): string {
  const full = profile?.full_name?.trim();
  if (full) return full;
  return user?.email?.split("@")[0] ?? "";
}
