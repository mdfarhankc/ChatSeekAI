import { chatService } from "@/services/chatService"
import type { ChatCreate } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"


export const useChats = () => {
    const { data: chats, ...query } = useQuery({
        queryKey: ["chats"],
        queryFn: () => chatService.getChats(),
        staleTime: 30 * 1000, // 30 seconds
    });
    return { chats, ...query };
}

export const useChat = (chatId: string | null) => {
    return useQuery({
        queryKey: ['chat', chatId],
        queryFn: () => chatService.getChat(chatId!),
        enabled: !!chatId,
    });
};

export const useCreateChat = () => {
    const queryClient = useQueryClient();
    const { mutate: createChat, isPending: isLoading, ...mutate } = useMutation({
        mutationFn: (data: ChatCreate) => chatService.createChat(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chats'] });
        },
    });

    return { createChat, isLoading, ...mutate };
}

export const useDeleteChat = () => {
    const queryClient = useQueryClient();
    const { mutate: deleteChat, isPending: isLoading, ...mutate } = useMutation({
        mutationFn: (chatId: string) => chatService.deleteChat(chatId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chats'] });
        },
    });

    return { deleteChat, isLoading, ...mutate };
}