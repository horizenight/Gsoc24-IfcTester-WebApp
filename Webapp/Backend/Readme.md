
# Project Setup Guideline

Follow these steps to set up and start the FastAPI backend:

### 1. Set Up the Environment
```bash
python -m venv .venv
```

### 2. Activate the Virtual Environment
On Windows:
```bash
.\.venv\Scripts\activate
```

On macOS/Linux:
```bash
source .venv/bin/activate
```

### 3. Install the Required Dependencies
```bash
pip install -r requirements.txt
```

### 4. Start the FastAPI Server
```bash
uvicorn App.main:app --reload
```
The server is live, so now you can use it with the frontend.
---

# Backend API Paths

### 1. `POST /api/ids/loadIds`
- **Description**: Uploads and validates an `.ids` file, returning its content in XML format.
- **Request**:
  - `ids_file`: File (only `.ids` files are allowed).
- **Response**:
  - `xml`: The content of the `.ids` file in XML format.
  - `is_valid`: A boolean indicating whether the `.ids` file is valid.

### 2. `POST /api/ids/auditIds`
- **Description**: Validates an `.ids` file against an `.ifc` file and generates a validation report.
- **Request**:
  - `ids_file`: File (only `.ids` files are allowed).
  - `ifc_file`: File (IFC file to validate against).
- **Response**:
  - `content`: A JSON validation report generated from the comparison of the IDS and IFC files.
