import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { RegisterValues } from "@/schemas";
import { authService } from "@/services/authService";
import type { User } from "@/types";
import { AxiosError } from "axios";
import { useNavigate } from "react-router";


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