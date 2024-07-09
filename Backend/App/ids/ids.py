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
    tmp_file_path = None
    output_file_path = None

    try:
        # Create a temporary file for the IDS file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".ids") as tmp_file:
            tmp_file.write(await ids_file.read())
            tmp_file.flush()
            tmp_file_path = tmp_file.name

        # Open the IDS file 
        ids_data = ifctester.ids.open(tmp_file_path, validate=True)

        # Create a temporary file for the XML output
        with tempfile.NamedTemporaryFile(delete=False, suffix=".xml") as output_file:
            output_file_path = output_file.name
            # write the xml 
            is_valid = ids_data.to_xml(output_file_path)

        # Read the XML content from the temporary file
        with open(output_file_path, 'r') as xml_file:
            output_xml_content = xml_file.read()

    except Exception as e:
        # If an exception occurs, return empty XML and is_valid as False
        output_xml_content = ""
        is_valid = False

    finally:
        # Clean up temporary files if they exist
        if tmp_file_path and os.path.exists(tmp_file_path):
            os.remove(tmp_file_path)
        if output_file_path and os.path.exists(output_file_path):
            os.remove(output_file_path)

    # If the loaded file is not valid it will return as empty xml content and is_valid will be false
    return {
        "xml": output_xml_content,
        "is_valid": is_valid
    }
