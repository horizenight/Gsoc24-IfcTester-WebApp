from fastapi import FastAPI
from .ids import ids
from datetime import datetime

app = FastAPI()

# Include the router from the ids module
app.include_router(ids.router)

# Create a route to check if the API is live and provide status information
@app.get("/")
async def root():
    return {
        "status": "API is live",
        "timestamp": datetime.utcnow(),
        "version": "1.0.0", 
        "idsSchemaVersion":"//TODO"
    }
