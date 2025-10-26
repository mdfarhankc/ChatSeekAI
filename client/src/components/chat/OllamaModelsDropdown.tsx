import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useOllamaModels, useSelectedModel } from "@/hooks/useOllama";
import { Check } from "lucide-react";

export default function OllamaModelsDropdown() {
  const { models, isLoading } = useOllamaModels();
  const { selectedModel, setSelectedModel } = useSelectedModel();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"}>
          {selectedModel?.model.toUpperCase() || "Models"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Available Models</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {isLoading ? (
          // Loading skeletons
          <div className="space-y-2 p-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-6 w-full rounded-md" />
            ))}
          </div>
        ) : models?.length ? (
          models.map((model) => (
            <DropdownMenuItem
              key={model.name}
              onClick={() => setSelectedModel(model)}
              className="flex items-center justify-between"
            >
              <span>{model.name}</span>
              {selectedModel === model && (
                <Check className="h-4 w-4 text-green-600" />
              )}
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem disabled>No models found</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
