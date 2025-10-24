import axios, { type AxiosInstance } from 'axios';
import type { AuthTokens } from '../types';

const API_URL = import.meta.env.VITE_API_URL as string;

class ApiClient {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: `${API_URL}/api/v1`,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Request interceptor to add auth token
        this.client.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('access_token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor to handle token refresh
        this.client.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    try {
                        const refreshToken = localStorage.getItem('refresh_token');
                        if (refreshToken) {
                            const response = await axios.post<AuthTokens>(
                                `${API_URL}/api/v1/auth/refresh`,
                                { refresh_token: refreshToken }
                            );

                            const { access_token, refresh_token } = response.data;
                            localStorage.setItem('access_token', access_token);
                            localStorage.setItem('refresh_token', refresh_token);

                            originalRequest.headers.Authorization = `Bearer ${access_token}`;
                            return this.client(originalRequest);
                        }
                    } catch (refreshError) {
                        localStorage.removeItem('access_token');
                        localStorage.removeItem('refresh_token');
                        window.location.href = '/login';
                        return Promise.reject(refreshError);
                    }
                }
                return Promise.reject(error);
            }
        );
    }

    getInstance(): AxiosInstance {
        return this.client;
    }
}

export const apiClient = new ApiClient().getInstance();
export const API_BASE_URL = API_URL;