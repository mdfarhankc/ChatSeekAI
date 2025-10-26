import type { OllamaModel } from "@/types";
import { apiClient } from "./api";

export const ollamaService = {
    async getModels(): Promise<Array<OllamaModel>> {
        const response = await apiClient.get<Array<OllamaModel>>('/ollama/models');
        return response.data;
    },
}