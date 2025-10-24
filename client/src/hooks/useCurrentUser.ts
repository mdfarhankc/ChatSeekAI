import { authService } from "@/services/authService";
import { useQuery } from "@tanstack/react-query";


export const useCurrentUser = () => {
    const isAuthenticated = authService.isAuthenticated();
    return useQuery({
        queryKey: ["currentUser"],
        queryFn: () => authService.getCurrentUser(),
        enabled: isAuthenticated,
        staleTime: 5 * 60 * 1000,
    });
};