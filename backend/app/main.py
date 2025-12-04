from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import chat

# Create FastAPI app
app = FastAPI(
    title="Gujarat Kisan AI API",
    description="Backend for Gujarat farmer assistance app",
    version="1.0.0"
)

# Configure CORS - Allow mobile app to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your mobile app domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(chat.router, prefix="/api", tags=["chat"])

# Health check endpoint
@app.get("/")
def root():
    return {
        "message": "Gujarat Kisan AI API is running",
        "status": "healthy",
        "version": "1.0.0"
    }

# Test endpoint
@app.get("/api/test")
def test():
    return {"message": "API is working!"}