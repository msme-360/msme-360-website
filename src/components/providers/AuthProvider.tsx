"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/services/supabase/supabase";
import { useRouter } from "next/navigation";
import { logger } from "@/lib/logger";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  signOut: async () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        if (error) throw error;

        setSession(initialSession);
        setUser(initialSession?.user ?? null);
      } catch (error) {
        logger.error("Auth initialization failed", "AuthProvider", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      logger.info(`Auth state changed: ${event}`, "AuthProvider");

      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsLoading(false);

      if (event === 'SIGNED_IN') {
        router.refresh();
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setSession(null);
        router.push('/login');
        router.refresh();
      } else if (event === 'TOKEN_REFRESHED') {
        logger.debug("Token refreshed successfully", "AuthProvider");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/login');
    } catch (error) {
      logger.error("Sign out failed", "AuthProvider", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

