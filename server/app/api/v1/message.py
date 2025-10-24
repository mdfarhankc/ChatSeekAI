from fastapi import APIRouter, Query
from fastapi.responses import StreamingResponse
from uuid import UUID
from app.core.database import SessionDep
from app.schemas.message import MessageListResponse, MessageResponse, StreamMessageRequest
from app.services.message_service import MessageService
from app.core.dependencies import CurrentUserDep

router = APIRouter(prefix="/messages", tags=["Messages"])


@router.get("/chat/{chat_id}", response_model=MessageListResponse)
def get_chat_messages(
    chat_id: UUID,
    session: SessionDep,
    current_user: CurrentUserDep,
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=100),
):
    """Get paginated messages for a chat."""
    message_service = MessageService(session)
    messages, total = message_service.get_chat_messages(
        chat_id,
        current_user,
        page,
        page_size
    )

    return MessageListResponse(
        items=[MessageResponse.model_validate(msg) for msg in messages],
        total=total
    )


@router.post("/stream")
async def stream_message(
    request: StreamMessageRequest,
    session: SessionDep,
    current_user: CurrentUserDep,
):
    """
    Send a message and stream the AI response.
    Returns Server-Sent Events (SSE) stream.
    """
    message_service = MessageService(session)

    async def event_generator():
        try:
            async for chunk in message_service.generate_ai_response(
                request.chat_id,
                request.message,
                current_user
            ):
                # Send as SSE format
                yield f"data: {chunk}\n\n"

            # Send completion signal
            yield "data: [DONE]\n\n"

        except Exception as e:
            yield f"data: [ERROR] {str(e)}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )
