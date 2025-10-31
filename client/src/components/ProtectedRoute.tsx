import { Navigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import type { ReactNode } from "react";
import useSWR from "swr";

interface ProtectedRouteProps {
  children: ReactNode;
  requireProfile?: boolean;
}

export const ProtectedRoute = ({
  children,
  requireProfile = false,
}: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();
  const {
    data: profile,
    error: profileError,
    isLoading,
  } = useSWR<{
    accountId: string;
  }>(requireProfile && isAuthenticated ? "/api/users/my-profile" : null, {
    shouldRetryOnError: false,
  });

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If profile is required, check if it exists
  if (requireProfile) {
    // Wait for profile check to complete
    if (isLoading) {
      return <div>Loading...</div>;
    }

    // If profile check failed (401 means profile not found), redirect to create-profile
    if (profileError || !profile) {
      return <Navigate to="/create-profile" replace />;
    }
  }

  return <>{children}</>;
};
