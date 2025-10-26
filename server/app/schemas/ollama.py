from pydantic import BaseModel


class ModelResponse(BaseModel):
    name: str
    model: str
    size: int