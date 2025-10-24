import httpx
import json
from typing import AsyncGenerator, Optional
from app.core.config import settings


class OllamaService:
    """Service for interacting with Ollama LLM API."""

    def __init__(self):
        self.base_url = settings.OLLAMA_BASE_URL
        self.default_model = settings.DEFAULT_MODEL

    async def generate_stream(
        self,
        prompt: str,
        model: Optional[str] = None,
        context: Optional[list[dict]] = None,
        system_prompt: Optional[str] = None
    ) -> AsyncGenerator[str, None]:
        """
        Generate streaming response from Ollama.
        Yields chunks of text as they're generated.
        """
        model = model or self.default_model

        # Build messages for chat format
        messages = []

        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})

        if context:
            messages.extend(context)

        messages.append({"role": "user", "content": prompt})

        payload = {
            "model": model,
            "messages": messages,
            "stream": True
        }

        async with httpx.AsyncClient(timeout=120.0) as client:
            try:
                async with client.stream(
                    "POST",
                    f"{self.base_url}/api/chat",
                    json=payload
                ) as response:
                    response.raise_for_status()

                    async for line in response.aiter_lines():
                        if line.strip():
                            try:
                                data = json.loads(line)

                                if "message" in data and "content" in data["message"]:
                                    content = data["message"]["content"]
                                    if content:
                                        yield content

                                # Check if generation is done
                                if data.get("done", False):
                                    break

                            except json.JSONDecodeError:
                                continue

            except httpx.HTTPError as e:
                yield f"\n\n[Error: Failed to connect to Ollama - {str(e)}]"
            except Exception as e:
                yield f"\n\n[Error: {str(e)}]"

    async def check_health(self) -> bool:
        """Check if Ollama service is available."""
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                response = await client.get(f"{self.base_url}/api/tags")
                return response.status_code == 200
        except:
            return False

    async def list_models(self) -> list[dict]:
        """List available models in Ollama."""
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(f"{self.base_url}/api/tags")
                response.raise_for_status()
                data = response.json()
                return data.get("models", [])
        except:
            return []

    async def pull_model(self, model: str) -> AsyncGenerator[dict, None]:
        """Pull a model from Ollama registry (streaming progress)."""
        payload = {"name": model, "stream": True}

        async with httpx.AsyncClient(timeout=600.0) as client:
            try:
                async with client.stream(
                    "POST",
                    f"{self.base_url}/api/pull",
                    json=payload
                ) as response:
                    response.raise_for_status()

                    async for line in response.aiter_lines():
                        if line.strip():
                            try:
                                data = json.loads(line)
                                yield data
                            except json.JSONDecodeError:
                                continue
            except Exception as e:
                yield {"error": str(e)}
