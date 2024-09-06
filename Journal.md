[TODO : Update Privious Jourula]

## Journal Entry - [27 Aug 2024]

### Plan
- Complete the 'has value' complex restriction in the complex restrictions dropdown.

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



# Journal Entry -[4th Sept 2024]
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
