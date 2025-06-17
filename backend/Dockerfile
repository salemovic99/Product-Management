# Stage 1: Build the backend image
FROM python:3.10-slim-buster AS builder

# Set working directory
WORKDIR /app

# Copy only requirements.txt to leverage Docker cache
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Stage 2: Create a smaller production image
FROM python:3.10-slim-buster AS runner

# Set working directory
WORKDIR /app

# Create a non-root user for security
RUN useradd --no-create-home appuser
# Create data directory and set correct permissions
RUN mkdir -p /app/data && chown -R appuser:appuser /app
RUN mkdir -p /app/qrcodes && chown -R appuser:appuser /app/qrcodes


USER appuser

# Copy installed dependencies from the builder stage
COPY --from=builder /usr/local/lib/python3.10/site-packages /usr/local/lib/python3.10/site-packages

# Copy the application code
COPY --from=builder /app .

# Expose the port FastAPI will run on
EXPOSE 8000

# Command to run the FastAPI application
# CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
