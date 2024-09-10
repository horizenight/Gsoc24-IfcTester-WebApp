---
Author: Kshitij Roodkee
Title: "BRL-CAD: IfcOpenShell: IfcTester WebApp"
Subject: GSoC 2024 Project Breakdown
---

# Contact Information

- **Name**: Kshitij Roodkee
- **Email**: <small>kshitijroodkeee1@gmail.com</small>
- **IRC Username**: horizenight
- **GitHub**: [horizenight](https://github.com/horizenight)
- **Timezone**: GMT+5:30 IST (Indian Standard Time)
- **Have I ever contributed in open source before?**: Yes, I was selected for Linux Foundation Mentorship as part of Hyperledger in 2023.
- **Brief Background Info**: I have a strong proficiency in web development, with extensive experience working with JavaScript, Python, and various web frameworks. I have successfully completed numerous projects across these technologies, showcasing my versatility and capability to build effective and innovative web solutions.

# Project Overview

## Summary:

The project aims to seamlessly integrate three powerful tools — BlenderBIM Add-on, IfcOpenShell software, and Radiance — for the creation of detailed and scientifically accurate 3D renders of buildings. While BlenderBIM and IfcOpenShell enable users to construct intricate 3D models of structures, Radiance specializes in performing light simulations, ensuring renders are not only visually appealing but also photometrically correct.

## Key Components:

1. **IFCTester Library**:
   - The **IFCTester Library**, written in `Python`, serves as the core foundation for testing **IFC files** against a given **IDS Document**. It validates the IFC file, identifying where it meets or fails to satisfy specific IDS requirements.

2. **IFCTester WebApp : IDS Editor**:
   - The **IDS Editor** is a web interface included with the **IFCTester WebApp**. It provides a rich-text-like experience for editing an **IDS Document**, making it easy to modify facets and their optional parameters in a user-friendly manner.

# Project Breakdown

## 1. **Backend API to Interact with IFCTester Library**

### Objective:
Develop a backend that interacts with the **IFCTester Library** to validate **IDS Documents** and generate results for validating **IFC files** against a given IDS Document.

### Approach:
- Implemented the `POST /api/ids/loadIds` endpoint to accept an **IDS Document**, validating its schema against the predefined **IDS Schema**.
- Implemented the `POST /api/ids/auditIds` endpoint that accepts both an **IDS Document** and an **IFC file**, producing results that show which IDS specifications were passed or violated by the IFC file.

## 2. **Loading IDS Document in Frontend**

### Objective:
After validating the **IDS Document** schema on the backend, a frontend loader is required to load the validated IDS Document into the **IDS Editor**, allowing the user to interact with and modify the document.

### Approach:
- Created an **IDSLoader** to parse the IDS Document and map its specifications, information, facets, etc., to the respective components in the **IDS Editor**.
- Addressed complex restrictions like `Enumeration`, `Pattern`, `Length`, `Bounds`, ensuring they were accurately loaded and represented in the editor.
- Created templates for different facets to map each facet in the IDS Document to its respective element in the frontend **IDS Editor**.
- Maintained the state of the IDS Document in context, so changes in the **IDS Editor** were reflected in real-time within the document.
- Implemented the `Load` and `Save` buttons to load an IDS Document into the editor and save the modified document back to the system.

## 3. **Implementing IDS Specs Library: Drag n Drop Functionality**

### Objective:
Allow users to import specifications into the **IDS Editor** and easily drag and drop specifications from the library component into the main IDS Document being edited. This simplifies the process of adding specifications.

### Approach:
- Leveraged the existing **IDSLoader** to enable users to import an IDS Document and map its specifications to the **IDS Editor**.
- Developed a new component, `IDSSpecLibrary`, which uses **IDSLoader** to load the specifications into the library and map them to the appropriate sections of the editor.
- Overcame challenges with the HTML5 Drag n Drop API by carefully studying the documentation, enabling users to drag specifications from the library and drop them into the **IDS Editor**. This affected both the frontend editor and the actual IDS Document, ensuring the state remained consistent.
- Fixed existing bugs in the HTML5 Drag n Drop API implementation and handled updates to the `nav` component, ensuring the correct sequence of specifications was reflected during drag and drop operations.

## Accomplishment:
- All existing features of the **IFCTester** were addressed, and broken functionalities such as handling complex restrictions and the **HTML5 Drag n Drop** were fixed. This enabled users to seamlessly load IDS Documents and import specifications into the main IDS Document through simple drag-and-drop interactions.

- Opened new workflows, such as allowing users to maintain custom specifications files. These files can be loaded into the **IDS Specs Library** and easily dragged and dropped into the main IDS Document, saving time and effort by eliminating the need to create specifications from scratch.

## 4. **Enhancing IDSEditor in IFCTester WebApp: Facet Dropdown Editor**

### Objective:
The previous version of the **IDSEditor** allowed users to import and load an existing IDS Document but lacked the ability to easily edit or create new specifications. The goal was to provide a user-friendly interface that allows users to interact with and modify the IDS Document, including creating or removing specifications as needed.

### Approach:
- Implemented a dropdown menu in the **IDSEditor** interface to allow users to select from various facets (`Entity Facet, Attribute Facet, Property Facet, etc.`).
- Added an internal dropdown in each facet to manage and apply complex restrictions like `Enumeration, Pattern, Length, Bounds`.
- Implemented an **Add** button for users to easily add **Optional Parameters** to each facet.
- Mapped the state of the **IDSEditor** directly to the actual state of the **IDS Document**, ensuring real-time synchronization between the editor and the document.
- Created a seamless, user-friendly interface that abstracts the complexity of interacting with raw IDS XML files.

## 5. **IFCTester WebApp: Visualizing Results for IFC Validation Against IDS Document**

### Objective:
To validate an **IFC file** against a loaded, modified, or newly created **IDS Document** by making a backend call to the **IFCTester Library** and visualizing the results directly in the **IDSEditor** frontend.

### Approach:
- Made a backend call to `POST /api/ids/auditIds`, sending the current state of the IDS Document along with the IFC file for validation.
- Implemented visual feedback in the form of passed/failed icons for each specification to show whether the **IFC file** passed or violated specific IDS requirements.
- Provided a clear and intuitive view of validation results, helping users understand the compliance of their IFC files.

## Accomplishment:
- Users can now fully interact with their **IDS Document** in the **IDSTester: IDS Editor** without the need to directly modify XML code. They can load or create a new IDS Document, modify its structure, change the sequence of specifications, update IDS information, create new specifications, and define complex restrictions for each facet — all through the graphical interface.
- This not only saves time but also opens up opportunities for users with less technical knowledge of IDS to create and edit their documents without risking schema errors.
- Additionally, users can now test their **IFC files** against the given **IDS Document** and instantly see the results, identifying which specifications were passed or violated, providing deeper insights into IFC compliance.
                                                                                         |

  
