from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .ids import ids
from datetime import datetime

app = FastAPI()
app.include_router(ids.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],  
)

# Create a route to check if the API is live and provide status information
@app.get("/")
async def root():
    return {
        "status": "API is live",
        "timestamp": datetime.utcnow(),
        "version": "1.0.0", 
        "idsSchemaVersion": "//TODO"
    }
