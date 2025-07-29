import { useQuery } from "@tanstack/react-query";

export interface UserProfile {
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  jobTitle?: string;
  // ...add more fields as needed
}

export function useAuth() {
  const { data: user, isLoading } = useQuery<UserProfile>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}
