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

## Project Discussions:
|  Links                         |
|---------------------------------------|
| [Project Github Issue](https://github.com/opencax/GSoC/issues/44) |
| [Project Discussion ](https://github.com/IfcOpenShell/IfcOpenShell/issues/2480) |
| [Gsoc Proposal - Kshitij Roodkee](https://summerofcode.withgoogle.com/myprojects/details/HrPevjGn) |
