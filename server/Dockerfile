FROM python:3.12-slim

RUN pip install uv

WORKDIR /app

COPY . .

RUN uv sync

EXPOSE 8000

CMD [ "uv", "run", "fastapi", "run", "app/main.py", "--port", "8000" ]