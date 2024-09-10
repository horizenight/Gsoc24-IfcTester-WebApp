# Google Summer of Code 2024 Final Report: IFCTester WebAPP 

## Project Overview

This summer, I had the opportunity to contribute to the IFCOpenShell as part of Google Summer of Code 2024. The project focused on developing a web interface for editing idsDocument and auditing ifc files using ifctester library , enhancing the capabilities IfcTester Webapp, making it an intuitive tool for creating and validating BIM project exchange requirements.


<img width="1216" alt="image" src="https://github.com/user-attachments/assets/8c56510f-a0b7-43d9-963a-6f12c9ebc9a0">


### Project Goals

The main objectives of this project were:

1. **Backend API Integration**  
   Implement a Backend API that interacts with the **IfcTester library** to validate an **IFC file** against an **IDS (Information Delivery Specification)** document.
2. **Rich Text-Editor for IDS Documents**  
   Develop a user-friendly interface that provides a rich text-editor-like experience for editing **IDS Documents**. This will make it easier for users to create and modify IDS files.
3. **Dropdown Facet Editor**  
   Design and implement a **Dropdown Facet Editor** that extends the functionality of the current **idsEditor** in the **IFCTester WebApp**. The editor will allow users to add different types of facets and specify optional parameters for each facet.
4. **Visualization of Validation Results**  
   Enable visualization of the validated **IFC files** against the edited or modified **IDS Document**. This will allow users to see which IDS requirements have been violated by a given **IFC file**.
5. **IDS Specs Library: Import Functionality for IDS Specifications**  
   Implement the ability for the **IFCTester WebApp** to import **IDS Documents**. This will allow users to directly incorporate predefined specifications into their main document, streamlining the process of constructing an IDS document.
6. **Improve Overall User Experience**  
   Enhance the user experience by incorporating features such as:
   - **Error boundaries** to indicate whether an **IDS document** is valid or invalid.
   - Providing a straightforward way to edit existing IDS documents, making it easier for users to modify and manage their documents efficiently.
   - **Bug Fixes/Additions**: Making the Drag n Drop Functionality work, loading IDS document correctly, Addition of IDS specifications from scratch.


## Accomplishments

Over the course of the program, I was able to achieve the following:

1. **IDS Editor: Facet Dropdown Editor Feature**:
   - Developed a **Facet Dropdown Editor** that enables users to edit the IDS Document with a rich text-editor-like experience.
   - The Facet Dropdown Editor covers all existing facets, including `Entity Facet, Attribute Facet, Classification Facet, Property Facet, PartOf Facet, and Material Facet`, along with the ability to modify the **Optional Parameters** for each facet.
   - The implementation of the Dropdown Editor introduced a new and improved way to manage templates, displaying specific text in the IDS Editor when a facet with certain optional parameters is built.
   - Its modular and reusable implementation makes it easier to extend functionality for new types of facets in the future.

2. **IFCTester Integration and Visualization**:
   - Successfully implemented a Web Interface for the **IFCTester Library**.
   - Created an intuitive visualization system for validating **IFC files** against a given **IDS Document**, displaying whether the specifications were passed or violated.

3. **Drag n Drop Functionality**:
   - Implemented **Drag n Drop** functionality for loading IDS data, overcoming the challenges posed by HTML5's limitations.
   - Enabled users to load IDS data either from an external file or via drag-and-drop functionality.

4. **IDS Spec Library**:
   - Developed functionality to load IDS data from external files, making it easier to exchange specifications between the main IDS document and imported specs.
   - Created a user interface for the **Specs Library** feature, allowing users to easily add specifications to the IDS document.

5. **Enhanced WebApp Features & Codebase**:
   - Expanded the `app.js` codebase from around `1000` lines to `2656` lines by adding new features and improving functionality.
   - Enhanced the overall user experience with an improved UI and added features.
   - Implemented the ability to import existing IDS documents and edit them seamlessly.
   - Added error boundaries to handle invalid IDS document imports, improving robustness.

### IFCTester: IDS Editor Facet Dropdown Editor

One of the key achievements was the development of a user-friendly interface for editing facets in the IDS Document. Here's a screenshot of the final UI:


![IDSFacet Menu Dropdown Editor](https://github.com/user-attachments/assets/2ffcf89d-f0fb-4832-9c50-ede30b7abbb8)


### IFCTester: IDS Editor Specs Library

The drag-and-drop functionality between the imported specs and the main IDS document provides an easy way to add specifications, saving time and effort.

![IDS Specs Library (2)](https://github.com/user-attachments/assets/2fbfb3b1-b92b-4b85-8abc-d6304ae47aa1)


## Current State

The **IFCTester WebApp** is now a fully functional and deployable project that integrates the **IFCTester library** into a web interface. Users can:

- Create new **IDS Documents** in the IDS Editor using the facet menu editor, iterating over various facet types and their optional parameters.
- Load an existing IDS Document, with the system validating whether the imported document is valid or not upon successful creation or import.
- Test an **IFC file** against the IDS Document and visualize the results on the web interface, showing which specifications were passed or violated.

### Key Features:

- A new **Web Interface** for editing and creating facets and information within an IDS Document.
- **Import functionality** for loading existing IDS Documents.
- **IDS Spec Library** allowing users to exchange specifications between two IDS Documents.
- **Visualization** of validation results, showing where the IFC file failed or passed specific IDS requirements.
- Enhanced **Drag n Drop Functionality** for easier file management of specifications and their order.

### IFCTester Integration and Visualization Result

The visualization of validation results for the IFC file against the IDS document helps users identify where the IFC file failed to meet specifications, enabling corrective actions.

<img width="1561" alt="image" src="https://github.com/user-attachments/assets/6ed63dcd-a5d4-4e66-a001-be7eedf9ce43">


## Future Work

While the project has achieved its main goals, there are several areas for potential improvement and expansion:

1. **Testing and Deployment**  
   Enhance the existing user experience of the web app by incorporating feedback from the community, ensuring smoother usability and addressing any potential issues that arise post-deployment.

2. **AutoComplete Feature**  
   Add support for more **AutoComplete** and **AutoSuggestion** on fields such as data types, helping users avoid errors while editing the **IDS Document** and streamlining the document creation process.

3. **Performance Optimization**: Improve the performance of the app by rendering each modified facet rather than re-renering the whole specifications.

4. **Better Visualization of IFC File against IDS Document**  
   Improve the current visualization by generating more detailed insights. This could include creating **PDF** and **HTML reports** that provide deeper analysis, beyond just indicating which IDS specifications were violated by the IFC file.


5. **Documentation and Tutorials**  
   Develop a comprehensive help feature, including documentation and interactive tutorials. This will assist users in navigating the IDS editor, explaining facets and optional parameters, and offering educational guidance during document editing.



## Challenges and Learnings

Throughout this project, I encountered several challenges and learned valuable lessons:

1. **Understanding IDS Documentation**:  
   Working on an IDS Document Editor required a deep familiarity with all the facet types and optional parameters. Thus, a thorough understanding of the IDS documentation was essential. The official documentation was particularly helpful in learning these aspects.

2. **Going Through IfCTester Documentation**:  
   Using the IFCTester Library to test IFC files against the IDS document required an in-depth understanding of the existing methods in the IFCTester Library. I needed to learn how to use these methods to parse and validate IDS documents against the IDS schema, ensuring IFC files were correctly validated against the IDS document.

3. **Dropdown Editor Implementation**:  
   Implementing a dropdown editor using the Web Components API was challenging. I aimed to create a framework-like code that utilized existing methods and reusable components to handle modifications efficiently. The task of managing changes in the IDS document while keeping the web page's DOM in sync was a complex but rewarding experience. It enhanced my confidence in working with lifecycle methods of the Web Components API.

4. **UI/UX Design**:  
   Designing an intuitive user interface within the constraints of a text-editor-like environment was a challenging but rewarding task. It significantly improved my UI/UX design skills.

5. **Open Source Collaboration**:  
   Collaborating with the BlenderBIM community provided invaluable insights into open-source development practices and how to work effectively in a collaborative environment.

6. **JavaScript Mastery**:  
   GSoC allowed me to deepen my understanding of core JavaScript concepts like callbacks and state management. By working with vanilla JavaScript and the Web Components API, I gained experience in writing reusable components and implementing lifecycle methods, further strengthening my JS skills.
The Main Challenge remianed implementation of all the features in vanialla js for example drag n drop , dropdowns etc. They took extra efforts so that every sideeffects are handled correctly.



## Conclusion

Participating in Google Summer of Code 2024 has been an incredible learning experience. I'm grateful for the opportunity to contribute to the IFCOPENSHELL and the broader open-source community. I look forward to seeing how this work will be used and expanded upon in the future.

## Acknowledgements

I would like to express my sincere gratitude to my mentor, **Vukas Pajic**, for his invaluable guidance and support throughout this project. His uplifting motivation and belief in my abilities were instrumental in helping me stay focused and confident in achieving the project goals.

I would also like to thank the **OSArch community** for being such a flourishing and supportive community, which greatly motivated me and contributed to the success of this project.
