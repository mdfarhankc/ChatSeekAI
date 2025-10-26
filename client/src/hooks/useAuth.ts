import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import type { LoginValues, RegisterValues } from "@/schemas";
import { authService } from "@/services/authService";
import type { AuthTokens, ErrorResponse, User } from "@/types";

export const useRegister = () => {
    const navigate = useNavigate();
    const mutation = useMutation<User, unknown, RegisterValues>({
        mutationFn: (values: RegisterValues) => authService.register(values),
        onError: (error) => {
            if (error instanceof AxiosError) {
                toast(error.response?.data?.detail);
            }
        },
        onSuccess: () => {
            toast("Account created successfully!");
            navigate('/login');
        }
    });
    return {
        register: mutation.mutate,
        isLoading: mutation.isPending,
        ...mutation,
    };
}

export const useLogin = () => {
    const navigate = useNavigate();
    const mutation = useMutation<AuthTokens, ErrorResponse, LoginValues>({
        mutationFn: (values: LoginValues) => authService.login(values),
        onError: (error) => {
            if (error instanceof AxiosError) {
                toast(error.response?.data?.detail);
            }
        },
        onSuccess: (data) => {
            console.log("Data: ", data)
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('refresh_token', data.refresh_token);
            toast("Login successful!");
            navigate('/');
        }
    });

    return {
        login: mutation.mutate,
        isLoading: mutation.isPending,
        ...mutation,
    };
};


export const useLogout = () => {
    const navigate = useNavigate();
    const logout = () => {
        authService.logout();
        navigate('/login');
    }
    return { logout };
}

export const useCurrentUser = () => {
    const isAuthenticated = authService.isAuthenticated();
    return useQuery({
        queryKey: ["currentUser"],
        queryFn: () => authService.getCurrentUser(),
        enabled: isAuthenticated,
        staleTime: 5 * 60 * 1000,
    });
};