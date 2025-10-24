import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { chatService } from '@/services/chatService';
import { API_BASE_URL } from '@/services/api';
import type { Chat, Message, PaginatedResponse } from '@/types';

export const useChatMessages = (chatId: string | null, page: number = 1) => {
    const { data: messages, ...query } = useQuery({
        queryKey: ['messages', chatId, page],
        queryFn: () => chatService.getChatMessages(chatId!, page),
        enabled: !!chatId,
        staleTime: 10 * 1000, // 10 seconds
    });
    return { messages, ...query };
};

export const useStreamMessage = () => {
    const queryClient = useQueryClient();
    const [isStreaming, setIsStreaming] = useState(false);
    const [streamingMessage, setStreamingMessage] = useState('');

    const streamMessage = async (chatId: string, message: string) => {
        setIsStreaming(true);
        setStreamingMessage('');

        // Create optimistic user message
        const userMessage: Message = {
            id: crypto.randomUUID(),
            chat_id: chatId,
            role: 'user',
            content: message,
            tokens: 0,
            created_at: new Date().toISOString(),
        };

        // Optimistically update messages
        queryClient.setQueryData(['messages', chatId, 1], (old: PaginatedResponse<Chat>) => {
            if (!old) return { items: [userMessage], total: 1 };
            return {
                ...old,
                items: [...old.items, userMessage],
                total: old.total + 1,
            };
        });

        return new Promise<void>((resolve, reject) => {
            try {
                const token = localStorage.getItem('access_token');
                const url = new URL(`${API_BASE_URL}/api/v1/messages/stream`);

                fetch(url.toString(), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        chat_id: chatId,
                        message: message,
                    }),
                }).then(async (response) => {
                    if (!response.ok) {
                        throw new Error('Failed to stream message');
                    }

                    const reader = response.body?.getReader();
                    const decoder = new TextDecoder();

                    if (!reader) {
                        throw new Error('No reader available');
                    }

                    while (true) {
                        const { done, value } = await reader.read();

                        if (done) break;

                        const chunk = decoder.decode(value);
                        const lines = chunk.split('\n');

                        for (const line of lines) {
                            if (line.startsWith('data: ')) {
                                const data = line.slice(6);

                                if (data === '[DONE]') {
                                    setIsStreaming(false);
                                    setStreamingMessage('');
                                    // Invalidate to fetch fresh messages from server
                                    queryClient.invalidateQueries({ queryKey: ['messages', chatId] });
                                    queryClient.invalidateQueries({ queryKey: ['chats'] });
                                    resolve();
                                    return;
                                } else if (data.startsWith('[ERROR]')) {
                                    setIsStreaming(false);
                                    setStreamingMessage('');
                                    reject(new Error(data));
                                    return;
                                } else if (data) {
                                    setStreamingMessage((prev) => prev + data);
                                }
                            }
                        }
                    }
                }).catch((error) => {
                    setIsStreaming(false);
                    setStreamingMessage('');
                    reject(error);
                });
            } catch (error) {
                setIsStreaming(false);
                setStreamingMessage('');
                reject(error);
            }
        });
    };

    return {
        streamMessage,
        isStreaming,
        streamingMessage,
    };
};