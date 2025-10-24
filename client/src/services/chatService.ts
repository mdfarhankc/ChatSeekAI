import { apiClient } from './api';
import type { Chat, ChatCreate, ChatUpdate, PaginatedResponse, Message } from '../types';

export const chatService = {
    async createChat(data: ChatCreate): Promise<Chat> {
        const response = await apiClient.post<Chat>('/chats', data);
        return response.data;
    },

    async getChats(page: number = 1, pageSize: number = 20): Promise<PaginatedResponse<Chat>> {
        const response = await apiClient.get<PaginatedResponse<Chat>>('/chats', {
            params: { page, page_size: pageSize },
        });
        return response.data;
    },

    async getChat(chatId: string): Promise<Chat> {
        const response = await apiClient.get<Chat>(`/chats/${chatId}`);
        return response.data;
    },

    async updateChat(chatId: string, data: ChatUpdate): Promise<Chat> {
        const response = await apiClient.put<Chat>(`/chats/${chatId}`, data);
        return response.data;
    },

    async deleteChat(chatId: string): Promise<void> {
        await apiClient.delete(`/chats/${chatId}`);
    },

    async getChatMessages(chatId: string, page: number = 1): Promise<{ items: Message[]; total: number }> {
        const response = await apiClient.get<{ items: Message[]; total: number }>(
            `/messages/chat/${chatId}`,
            { params: { page, page_size: 50 } }
        );
        return response.data;
    },
};