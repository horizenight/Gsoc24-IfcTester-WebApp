# IfcTester WebApp

## Project Overview

The IfcTester WebApp aims to enhance the functionality and user experience of the existing IfcTester application. This project focuses on creating a web application to inspect, edit, and validate information inside IDS (Information Delivery Specifications) files against IFC (Industry Foundation Classes) files. The key features include a user-friendly interface, drag-and-drop functionality, and comprehensive validation capabilities.

## Project Features

### Backend

- **Load IDS File**: Parses `.ids` files into JSON format for frontend consumption.
- **Save IDS File**: Saves the edited IDS file back into `.ids` format.
- **Audit IFC File**: Validates the IFC file against the specifications in the IDS file.

### Frontend

- **Drag and Drop Functionality**: Allows users to easily reorder facets and specifications.
- **Facet Menu Editor**: Provides a user-friendly interface to edit different facets.
- **IDS Import Library**: Enables users to import IDS specifications and add them via drag-and-drop.
- **Error Boundaries**: Displays personalized error messages for improved user experience.
- **Validation Results**: Highlights validated results with color-coded borders.

## Tech Stack

### Frontend

- HTML
- CSS
- JavaScript (Web Components)

### Backend

- FastAPI
- ifcTester Python library

## Setting Up the Project

### Backend Setup Instructions

To start the FastAPI backend, follow these steps:

1. **Navigate to the Backend Directory**:
   `cd Backend`

2. **Create a Virtual Environment**:
   `python -m venv env`

3. **Activate the Virtual Environment**:

   On Windows:
   `.\env\Scripts\activate`

   On macOS/Linux:
   `source env/bin/activate`

4. **Install the Required Dependencies**:
   `pip install -r requirements.txt`

5. **Start the FastAPI Server**:
   `uvicorn App.main:app --reload`
   The server will be live, and you can now interact with the backend through the API or integrate it with the frontend.

For more detailed backend setup and API usage, refer to the [Backend Readme](./Backend/Readme.md).

---

### Frontend Setup Instructions

The frontend is built using plain HTML, CSS, and JavaScript. No build tools are required, but it depends on external libraries (e.g., for styling).

1. **Open the Frontend**: 
   Simply open `index.html` in a modern web browser (Chrome, Firefox, etc.) to start using the IfcTester WebApp.

For more details, check out the [Frontend Readme](./Frontend/Readme.md).

---

## Project Discussions:

|  Links                         |
|---------------------------------------|
| [Project Github Issue](https://github.com/opencax/GSoC/issues/44) |
| [Project Discussion ](https://github.com/IfcOpenShell/IfcOpenShell/issues/2480) |
| [Gsoc Proposal - Kshitij Roodkee](https://summerofcode.withgoogle.com/myprojects/details/HrPevjGn) |
