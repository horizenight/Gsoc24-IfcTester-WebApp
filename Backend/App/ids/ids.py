import os
import tempfile
import uuid
from fastapi import APIRouter, HTTPException, UploadFile, File
import ifctester
import ifctester.reporter
import ifcopenshell

router = APIRouter(prefix="/api/ids")


def transform(data):
    info = data.get('info', {})
    specifications = data.get('specifications', {})

    transformed_data = {
        "info": {
            "title": info.get('title'),
            "identifier": str(uuid.uuid4()),
            "copyright": info.get('copyright'),
            "version": info.get('version'),
            "description": info.get('description'),
            "author": info.get('author'),
            "date": info.get('date'),
            "purpose": info.get('purpose'),
            "milestone": info.get('milestone'),
        },
        "specifications": specifications.get('specification', [])
    }
    return transformed_data
    
@router.post("/loadIds")
async def audit(ids_file: UploadFile = File(...)):
    if not ids_file.filename.endswith(".ids"):
        raise HTTPException(status_code=400, detail="Invalid file extension. Only .ids files are allowed.")

    with tempfile.NamedTemporaryFile(delete=False, suffix=".ids") as tmp_file:
        try:
            tmp_file.write(await ids_file.read())
            tmp_file.flush()
            ids_data = ifctester.open(tmp_file.name)
            return {"data": transform(ids_data.asdict())}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")
        finally:
            os.remove(tmp_file.name)
