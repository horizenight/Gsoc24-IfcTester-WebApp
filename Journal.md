## Weekly Journal Entry 
## Weekly Entry 1 - [27th May - 2nd June] 

### Plan
- Setup FastApi Backend 
- Setup Project Structure 
- Go through IDS documentation 
- Go through IFC tester library codebase.

### Accomplishment
- Completed all the planned tasks.

## Weekly Entry 2,3,4 - [3rd June - 23nd June] 
### Week2 , Week3 , Week4 
- Not any progress or accomplishment as due to family emergency. 


## Weekly Entry 5 - [24th June - 30th June]
### Plan
- Backend API to Interact with IFCTester Library
### Accomplishment
- - Implemented the `POST /api/ids/loadIds` endpoint to accept an **IDS Document**, validating its schema against the predefined **IDS Schema**.

## Weekly Entry 6 - [1st July - 7th July]
### Plan
- Implementing IDS Specs Library: Drag n Drop Functionality
### Difficulties
The HTML5 Api is specailly hard to work through in case of drag n drop
### Accomplishment
- Leveraged the existing **IDSLoader** to enable users to import an IDS Document and map its specifications to the **IDS Editor**.
- Developed a new component, `IDSSpecLibrary`, which uses **IDSLoader** to load the specifications into the library and map them to the appropriate sections of the editor.

## Weekly Entry 7,8 - [8th July - 21st July]
### Plan
- Implementing IDS Specs Library: Drag n Drop Functionality
### Accomplishment
- Overcame challenges with the HTML5 Drag n Drop API by carefully studying the documentation, enabling users to drag specifications from the library and drop them into the **IDS Editor**. This affected both the frontend editor and the actual IDS Document, ensuring the state remained consistent.

- Fixed existing bugs in the HTML5 Drag n Drop API implementation and handled updates to the `nav` component, ensuring the correct sequence of specifications was reflected during drag and drop operations.

## Weekly Entry 9 - [22nd July - 28th July]
### Plan
- Bug Fixes + Additional UI enhancement.
- Display loaded filenames 
- Display error boundaries encountered while laoding the specs file.

### Accomplishment
- Above task was achieved.

## Weekly Entry 10,11 - [29th July - 11th Aug]
### Plan
- Enhance IDSLoader 

### Difficulties
- Current IDSLoader doesnt parse `PartOfFacet` and Complex Restrictions correctly, tends to break if a IDS is loaded that has these complex restriction or `PartOfFacet`
- Handeling Complex Restrictions needed more work.

### Accomplishment
- IdsLoader now handled `PartOfFacet` correctly.

## Weekly Entry 11,12 - [12th Aug - 2th Aug]
### Plan
- Design and Implement Facet DropDown Editor
- CompeUp with designFacetDropdown vs Facetmenu editor
- Complete community feedback on the FacetDropdown vs Facetmenu editor
- Implement FacetDropdown Editor
### Difficulties
- The major difficllty was implementing the dropdown in resusbale component way , such that it gives a modular and easy way to add new facet.
- Had to revisit the IDS documentation to see how the structure of each facet look like and which tags should be used to identify each facet.
- had difficulty in relating the `load function` of each facet to their ids compoenet

### Drawback:
- Less commmunication due to having diffculty in completing above task 

### Accomplishment
- Achieved design goals , talked with community and mentor was able to come up with a plan for next days and created a IDSDropdown component that took care of complex restrictions excpets `Bounds` and `Length`


## Daily Journal Entry Starts here => 
## Journal Entry - [27 Aug 2024]

### Plan
- Complete the 'Bounds' complex restriction in the complex restrictions dropdown.

### Difficulties
1. The dropdown to control should be dynamic and render the appropriate template. The difficulty arises from detecting the existing `minExclusive`, `minInclusive`, etc., and then correctly showing the corresponding options in the dropdown.
2. When an option is changed, it should create the appropriate `idsElement` that will be used to verify the `idsDocument`.

### Accomplishment
- Loading is completed.
- Currently working on the Dropdown option to create the appropriate `idsElement`.



## Journal Entry - [28 Aug 2024]

### Plan
- Completed `Entity Facet`

### Difficulties
1. Too many combinations of templates to be considered  ( making it cluttered)

### Accomplishment
- Entity Facet is addded Succesfully

### Next Plan
- Complete `Attribute Facet`
- Complete `Classification facet`


## Journal Entry - [28 Aug 2024]

### Plan
- Completed `Attribute Facet`

### Difficulties
None made the code modular to take care of resusability

### Accomplishment
- Material Facet is addded Succesfully

### Next Plan
- Complete `Material facet`
- Complete `Classification facet`

## Journal Entry - [29 Aug 2024]

### Plan
- Completed `Material facet`
- Completed `Classification facet`

### Difficulties
None made the code modular to take care of resusability

### Accomplishment
- Material Facet is addded Succesfully

### Next Plan
- Complete `PartOf`
- Complete `Propoerty`

# Journal Entry -[30 Aug 2024]
# Journal Entry -[31 Aug 2024]
# Journal Entry -[1st Sept 2024]
### Plan
- Completed `PartOf`
### Difficulties
- The PartOf Facet includes Entity Facet inside therefore existing parsing method was not able to modify the inside of entity 
Thefore breaking the already implemented flow  

### Next Plan
- Continue `PartOf` Facet

# Journal Entry -[2nd Sept 2024]
### Plan
- Completed `PartOf`
### Difficulties
- The dropdown wasnt chaning the relation attirbute values 

### Next Plan
- Continue `PartOf` Facet


# Journal Entry -[3rd Sept 2024]
### Plan
- Completed `PartOf`

### Difficulties
The templates were very large for part of facet so needed a solution

### Accomplishment
- Part Of Facet is addded Succesfully

### Next Plan
- Complete `Propoerty`


# Journal Entry -[4th Sept 2024]
### Plan
- Completed `Property Facet`

### Difficulties
The challenge here was too implement a large amount of templates
also a challenge left to tackle is: dataType in property facet should be chosen on already given values but currently left as future scope for AutoComplete Feature.

### Accomplishment
- Facet Editor Completed

### Next Plan
- [x] Complete bunch of TODOs 
    - Priority1: edit in the <ids-param> value changes the correct and appropiate idsElement value/attribute
    - Priority2: create a new specs button
    - Priority3: complete `hasLength`Complex Restriction
    - Priority4: Addition and deletion of `optional types` for eg. Predfined type is optional so it should be avaialble to remove and add as per requirement
    - Priority5: Nav should be updated dynmically on drag and drop
    - Priority6: Plan other TODOs.



# Journal Entry -[5th Sept 2024]
### Plan
- [] Complete bunch of TODOs 
    - Priority1: edit in the <ids-param> value changes the correct and appropiate idsElement value/attribute
    - Priority2: create a new specs button
    - Priority3: complete `hasLength`Complex Restrictions
    - Priority4: Addition and deletion of `optional types` for eg. Predfined type is optional so it should be avaialble to remove and add as per requirement
    - Priority5: Nav should be updated dynmically on drag and drop
    - Priority6: Plan other TODOs.

### Accomplishment
- [x] Complete bunch of TODOs 
    - Priority1: edit in the <ids-param> value changes the correct and appropiate idsElement value/attribute
    - ~~Priority2: create a new specs button~~
    - ~~Priority3: complete `hasLength`Complex Restrictions~~
    - Priority4: Addition and deletion of `optional types` for eg. Predfined type is optional so it should be avaialble to remove and add as per requirement
    - ~~Priority5: Nav should be updated dynmically on drag and drop~~
    - Priority6: Plan other TODOs.


### Next Plan
- [] Complete bunch of TODOs:
     - Priority1: edit in the <ids-param> value changes the correct and appropiate idsElement value/attribute
      - Priority2: Addition and deletion of `optional types` for eg. Predfined type is optional so it should be avaialble to remove and add as per requirement
      - Priority3: Write Better CSS 
      - Priority4: Test with all example .ids and .ifc files 
      - Priority5: Complete if any github issue is left and not addressed
