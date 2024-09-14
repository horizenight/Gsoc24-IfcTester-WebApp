import os
from datetime import datetime, timezone

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles

from .ids import ids

app = FastAPI()
app.include_router(ids.router)

# allows all origins 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],  
)

app.mount("/static", StaticFiles(directory=os.path.join(os.path.dirname(__file__), "../../Frontend")), name="static")


#API Routes: 

# Create a route to serve static files
@app.get("/", response_class=HTMLResponse)
async def serve_html():
    with open(os.path.join(os.path.dirname(__file__), "../../Frontend/index.html")) as f:
        return HTMLResponse(content=f.read(), status_code=200)


# Create a route to check if the API is live and provide status information
@app.get("/api")
async def root():
    return {
        "status": "API is live",
        "timestamp": datetime.now(timezone.utc),
        "version": "1.0.0", 
        "idsSchemaVersion": "//TODO"
    }
