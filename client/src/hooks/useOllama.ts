import { ollamaService } from "@/services/ollamaService";
import type { OllamaModel } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react";


export const useOllamaModels = () => {
    const queryClient = useQueryClient();
    const { data: models, ...query } = useQuery<Array<OllamaModel>>({
        queryKey: ["models"],
        queryFn: () => ollamaService.getModels(),
        staleTime: 60 * 1000,
    });

    useEffect(() => {
        if (query.isSuccess && models?.length) {
            const selected = queryClient.getQueryData(["selectedModel"]);

            if (!selected) {
                queryClient.setQueryData(["selectedModel"], models[0]);
            }
        }
    }, [query.isSuccess, models, queryClient]);

    return { models, ...query };
}


export const useSelectedModel = () => {
    const queryClient = useQueryClient();
    const { data: selectedModel } = useQuery<OllamaModel | null>({
        queryKey: ["selectedModel"],
        initialData: null,
    });

    const setSelectedModel = (model: OllamaModel) => {
        queryClient.setQueryData(["selectedModel"], model);
    };

    return { selectedModel, setSelectedModel };
}