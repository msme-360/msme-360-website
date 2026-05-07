"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/services/supabase/supabase";
import { useRouter } from "next/navigation";
import { logger } from "@/lib/logger";
import { signOut as serverSignOut } from "@/app/[locale]/(landing)/(auth)/actions";

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
        // SECURITY: Always use getUser() for verified identity
        const { data: { user: initialUser }, error: userError } = await supabase.auth.getUser();

        if (userError && !userError.message.includes("Auth session missing")) {
          throw userError;
        }

        setUser(initialUser);
      } catch (error) {
        logger.error("Auth initialization failed", "AuthProvider", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      logger.info(`Auth state changed: ${event}`, "AuthProvider");

      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsLoading(false);

      if (event === 'SIGNED_IN') {
        router.refresh();
      } else if (event === 'SIGNED_OUT') {
        router.push('/');
        router.refresh();
      }

    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const signOut = async () => {
    try {
      await serverSignOut();
      await supabase.auth.signOut();
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
