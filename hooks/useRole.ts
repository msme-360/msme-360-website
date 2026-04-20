"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { getRoleById, hasPermission, RoleLevel } from "@/lib/constants/roles";

export function useRole(userId: string) {
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      // Use RPC to bypass RLS issues for reliable tier detection
      const { data, error } = await supabase
        .rpc('get_role_by_id', { user_id: userId });
      
      if (error) {
        console.error('Error fetching role via RPC:', error);
        // Fallback to direct fetch if RPC fails
        const { data: directData } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', userId)
          .single();
        return directData;
      }
      return data[0]; // RPC returns array
    },
    enabled: !!userId,
  });

  const role = profile?.role || 'user';
  const roleData = getRoleById(role);

  return {
    role,
    roleData,
    isLoading,
    isLevel: (level: RoleLevel) => hasPermission(role, level),
    // Specific helper for common checks
    isExecutive: hasPermission(role, 1),
    isManager: hasPermission(role, 2),
    isStaff: hasPermission(role, 3),
    isAdmin: role === 'super_admin' || role === 'ceo' || role === 'managing_partner',
  };
}
