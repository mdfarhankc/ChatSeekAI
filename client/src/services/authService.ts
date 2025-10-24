import { apiClient } from './api';
import type { AuthTokens, User } from '../types';
import type { LoginValues, RegisterValues } from '@/schemas';

export const authService = {
    async login(credentials: LoginValues): Promise<AuthTokens> {
        const response = await apiClient.post<AuthTokens>('/auth/login', credentials);
        return response.data;
    },

    async register(data: RegisterValues): Promise<User> {
        const response = await apiClient.post<User>('/auth/register', data);
        return response.data;
    },

    async getCurrentUser(): Promise<User> {
        const response = await apiClient.get<User>('/users/me');
        return response.data;
    },

    async refreshToken(refreshToken: string): Promise<AuthTokens> {
        const response = await apiClient.post<AuthTokens>('/auth/refresh', {
            refresh_token: refreshToken,
        });
        return response.data;
    },

    logout() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    },

    isAuthenticated(): boolean {
        return !!localStorage.getItem('access_token');
    },
};