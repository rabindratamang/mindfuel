# Production Dockerfile for FastAPI backend
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Create a non-root user
RUN useradd -m appuser

# Create chroma_db directory and set permissions
USER root
RUN mkdir -p /app/chroma_db && chown -R appuser:appuser /app/chroma_db && chmod 755 /app/chroma_db
USER appuser

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"] 