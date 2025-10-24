import type { LoginValues } from "@/schemas";
import { authService } from "@/services/authService";
import type { AuthTokens, ErrorResponse } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useNavigate } from "react-router";
import { toast } from "sonner";

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