from fastapi import APIRouter, HTTPException
from typing import List
from pydantic import BaseModel

router = APIRouter()

class IdItem(BaseModel):
    id: int

ids_db = []

@router.post("/saveIds")
async def save_ids(ids: List[IdItem]):
    ids_db.extend(ids)
    return {"message": "IDs saved successfully"}

@router.get("/loadIds")
async def load_ids():
    if not ids_db:
        raise HTTPException(status_code=404, detail="No IDs found")
    return ids_db
