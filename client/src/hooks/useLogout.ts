import { authService } from "@/services/authService";
import { useNavigate } from "react-router";


export const useLogout = () => {
    const navigate = useNavigate();
    const logout = () => {
        authService.logout();
        navigate('/login');
    }

    return { logout };
}