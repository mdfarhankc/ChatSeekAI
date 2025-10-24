export interface User {
    id: string;
    email: string;
    username: string;
    full_name?: string;
    is_active: boolean;
    is_superuser: boolean;
    created_at: string;
    updated_at: string;
}

export interface Chat {
    id: string;
    user_id: string;
    title: string;
    model: string;
    system_prompt?: string;
    created_at: string;
    updated_at: string;
    message_count: number;
}

export interface Message {
    id: string;
    chat_id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    tokens: number;
    created_at: string;
}

export interface AuthTokens {
    access_token: string;
    refresh_token: string;
    token_type: string;
}


export interface ChatCreate {
    title: string;
    model?: string;
    system_prompt?: string;
}

export interface ChatUpdate {
    title?: string;
    model?: string;
    system_prompt?: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
}

export interface ErrorResponse {
    detail: string;
}