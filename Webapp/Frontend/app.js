"use strict";

feather.replace()

let ns = 'http://standards.buildingsmart.org/IDS';
let xs = 'http://www.w3.org/2001/XMLSchema';

class IDSNew extends HTMLElement {
    connectedCallback() {
        this.addEventListener('click', this.click.bind(this));
    }

    click(e) {
        let ifcTester = this.closest('ifc-tester');
        // Check if there's already a .ids div present
        if (!ifcTester.querySelector('.ids')) {
            let template = ifcTester.getElementsByTagName('template')[0];
            if (template) {
                ifcTester.appendChild(template.content.cloneNode(true));
                feather.replace();
            }
            let container = ifcTester.getElementsByTagName('ids-container')[0]
            // Initialize the ids document directly
            let idsFilename = container.querySelector('ids-filename')
            idsFilename.innerHTML = "Template"
            if (!container.ids) {
                container.ids = this.createDefaultIdsDocument();
                console.log(container)
                console.log(container.ids)
                this.loadSpecs(container);
            }
        } else {
            let alertElement = document.querySelector('ids-alert');
            alertElement.showAlert('Error: New Spec not allowed,' + 'already a ids spec present kindly close it.', 'error');
        }
    }

    createDefaultIdsDocument() {
        let parser = new DOMParser();
        let date = new Date().toISOString().split('T')[0];
        let xmlString = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <ids:ids xmlns:ids="http://standards.buildingsmart.org/IDS" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://standards.buildingsmart.org/IDS http://standards.buildingsmart.org/IDS/1.0/ids.xsd">
            <ids:info>
                <ids:title>My information requirements</ids:title>
                <ids:author>john@doe.com</ids:author>
                <ids:copyright>Company Inc.</ids:copyright>
                <ids:version>1.0.0</ids:version>
                <ids:description>An example suite of OpenBIM requirements for data quality audits</ids:description>
                <ids:date>${date}</ids:date>
                <ids:milestone>Construction</ids:milestone>
            </ids:info>
        </ids:ids>`;
        return parser.parseFromString(xmlString, "text/xml");

    }

    loadSpecs(container) {
        container.getElementsByTagName('ids-info')[0].load(container.ids.getElementsByTagNameNS(ns, 'info')[0]);
    }
}

class IDSClose extends HTMLElement {
    connectedCallback() {
        this.addEventListener('click', this.click);
    }

    click(e) {
        const idsContainer = this.closest('.ids');
        if (idsContainer) {
            idsContainer.remove();
        }
    }
}

class IDSContainer extends HTMLElement {
    connectedCallback() {
        this.filename = 'specifications.ids';
        this.ids = null;
        this.containerId = crypto.randomUUID();
        this.isEditing = true;
    }
}

class IDSInfo extends HTMLElement {
    load(idsElement) {
        this.idsElement = idsElement;
        let idsInfoElements = this.getElementsByTagName('ids-info-element');
        for (let i = 0; i < idsInfoElements.length; i++) {
            let name = idsInfoElements[i].attributes['name'].value;
            idsInfoElements[i].load(idsElement, idsElement.getElementsByTagNameNS(ns, name)[0]);
        }
    }
}

class IDSInfoElement extends HTMLElement {
    connectedCallback() {
        this.contentEditable = true;
        this.addEventListener('input', this.input);
        this.addEventListener('blur', this.blur);
        this.defaultValue = this.textContent;
        if (this.defaultValue == 'date()') {
            this.defaultValue = new Date().toISOString().split('T')[0];
            this.textContent = this.defaultValue;
        }
        this.title = this.attributes['name'].value.replace(/^\w/, (c) => c.toUpperCase());
    }

    load(idsParentElement, idsElement) {
        this.idsElement = idsElement;
        this.idsParentElement = idsParentElement;
        if (idsElement) {
            this.textContent = idsElement.textContent;
        }
        this.idsElement ? this.classList.remove('null') : this.classList.add('null');
        this.validate() ? this.classList.remove('error') : this.classList.add('error');
    }

    input(e) {
        if (!this.idsElement && this.textContent) {
            this.add();
        }
        this.idsElement ? this.idsElement.textContent = this.textContent : null;
        this.idsElement ? this.classList.remove('null') : this.classList.add('null');
        this.validate() ? this.classList.remove('error') : this.classList.add('error');
    }

    blur(e) {
        if (this.idsElement && (!this.textContent)) {
            this.remove();
        }
        if (!this.textContent) {
            this.textContent = this.defaultValue;
        }
        this.idsElement ? this.classList.remove('null') : this.classList.add('null');
        this.validate() ? this.classList.remove('error') : this.classList.add('error');
    }

    validate() {
        if (this.attributes['name'].value == 'author') {
            return this.textContent.match(new RegExp('[^@]+@[^\.]+\..+')) != null;
        } else if (this.attributes['name'].value == 'date') {
            return this.textContent.match(new RegExp('[0-9]{4}-[0-9]{2}-[0-9]{2}')) != null;
        }
        return true;
    }

    add() {
        let container = this.closest('ids-container');
        this.idsElement = container.ids.createElementNS(ns, this.attributes["name"].value);
        this.idsElement.textContent = this.textContent;
        this.idsParentElement.appendChild(this.idsElement);
    }

    remove() {
        this.idsParentElement.removeChild(this.idsElement);
        this.idsElement = null;
    }
}

class IDSSpecRemove extends HTMLElement {
    connectedCallback() {
        this.addEventListener('click', this.click);
    }

    click(e) {
        const container = this.closest('ids-container')
        console.log(container)
        let specs = this.closest('ids-specs');
        let spec = this.closest('ids-spec');
        specs.idsElement.removeChild(spec.idsElement);
        if (specs.idsElement.children.length == 0) {
            console.log('Container.ids:', container.ids);

            let specifications = container.ids.getElementsByTagNameNS(ns, 'specifications')[0];
            console.log('Specifications:', specifications);

            let containerIDS = container.ids.getElementsByTagNameNS(ns, 'ids')[0];
            if (containerIDS && specifications) {
                containerIDS.removeChild(specifications);
                console.log('containerIDS', containerIDS)
                let xmlSerializer = new XMLSerializer();
                let containerIDSString = xmlSerializer.serializeToString(containerIDS);

                // Prepend the XML declaration
                let xmlString = containerIDSString;
                console.log(xmlString);

                // Parse the XML string back into an XML document
                let parser = new DOMParser();
                container.ids = parser.parseFromString(xmlString, "application/xml");

            } else {
                console.error('Container IDS or Specifications not found.');
            }

            let template = container.getElementsByTagName('template')[0];
            let idsSpec = container.getElementsByTagName('ids-specs')[0];
            if (idsSpec && template) {
                // Construct the new HTML for idsSpec
                let newHtml = `
                <ids-specs>
                    <div class="divider">
                        <span class="controls">
                            <ids-spec-add>
                                <i data-feather="plus"></i>
                            </ids-spec-add>
                        </span>
                    </div>
                    <template/>
                    </ids-specs>
                `;

                // Set the outerHTML of idsSpec
                idsSpec.outerHTML = newHtml;

                ;
            } else {
                console.error('IDs Spec or Template not found.');
            }

            // Assuming this.loadSpecs is a method of your class
            this.loadSpecs(container);
        }


        specs.idsElement.dispatchEvent(new Event('ids-spec-remove'));
    }
    loadSpecs(container) {
        container.getElementsByTagName('ids-info')[0].load(container.ids.getElementsByTagNameNS(ns, 'info')[0]);
    }
}

class IDSSpecMove extends HTMLElement {
    connectedCallback() {
        this.direction = this.attributes['direction'].value;
        this.addEventListener('click', this.click);
    }

    load(idsElement) {
        let self = this;
        this.idsElement = idsElement;
        this.render();
    }

    render() {
        let index = Array.prototype.indexOf.call(this.idsElement.parentElement.children, this.idsElement);
        if (index == 0 && this.direction == 'up') {
            this.classList.add('hidden');
        } else if (index == this.idsElement.parentElement.children.length - 1 && this.direction == 'down') {
            this.classList.add('hidden');
        } else {
            this.classList.remove('hidden');
        }
    }

    click(e) {
        if (this.direction == "up") {
            this.idsElement.parentElement.insertBefore(this.idsElement, this.idsElement.previousElementSibling);
        } else if (this.direction == "down") {
            let nextNextSibling = this.idsElement.nextElementSibling.nextElementSibling;
            this.idsElement.parentElement.insertBefore(this.idsElement, nextNextSibling);
        }
        //manual render 
        let specs = this.closest('ids-specs')
        specs.render()
        this.idsElement.parentElement.dispatchEvent(new Event('ids-spec-move', { bubbles: true }));
    }
}

class IDSSpecAdd extends HTMLElement {
    connectedCallback() {
        this.addEventListener('click', this.click.bind(this));
    }

    click(e) {
        let specs = this.closest('ids-specs');
        let spec = this.closest('ids-spec');
        let container = this.closest('ids-container');

        let newSpec = container.ids.createElementNS(ns, "specification");
        let newApplicability = container.ids.createElementNS(ns, "applicability");
        let newRequirements = container.ids.createElementNS(ns, "requirements");
        newSpec.appendChild(newApplicability);
        newSpec.appendChild(newRequirements);

        if (specs.children.length == 2 && !spec) {
            //here we should modify the container 
            let idsElement = container.ids.querySelector('ids');
            let specifications = container.ids.createElementNS(ns, "specifications");
            specifications.appendChild(newSpec)
            idsElement.appendChild(specifications);
            this.loadSpecs(container)
        } else {
            specs.idsElement.insertBefore(newSpec, spec.idsElement.nextElementSibling);
            specs.idsElement.dispatchEvent(new Event('ids-spec-add', { bubbles: true }));
        }
    }

    loadSpecs(container) {
        console.log('logSpecs', container.ids)
        container.getElementsByTagName('ids-info')[0].load(container.ids.getElementsByTagNameNS(ns, 'info')[0]);
        let specsElements = container.getElementsByTagName('ids-specs');
        for (let i = 0; i < specsElements.length; i++) {
            let specs = specsElements[i];
            specs.load(container.ids.getElementsByTagNameNS(ns, 'specifications')[0]);
        }
    }
}

class IDSSpecHandle extends HTMLElement {
    connectedCallback() {
        this.addEventListener('dragstart', this.dragstart);
        this.addEventListener('dragend', this.dragend);
    }

    dragstart(e) {
        let snippet = this.getElementsByClassName('snippet')[0];
        snippet.style.left = e.clientX + 'px';
        snippet.style.top = e.clientY + 'px';
        let dropzones = document.getElementsByTagName('ids-spec');
        for (let i = 0; i < dropzones.length; i++) {
            dropzones[i].classList.add('dropzone');
        }
        snippet.classList.remove('hidden');
        this.closest('ids-spec').style.opacity = '0.3';
        this.closest('ids-spec').classList.add('dragging');
    }

    dragend(e) {
        let snippet = this.getElementsByClassName('snippet')[0];
        snippet.classList.add('hidden');
        this.closest('ids-spec').style.opacity = '1';
        this.closest('ids-spec').classList.remove('dragging');
        let dropzones = document.getElementsByTagName('ids-spec');
        for (let i = 0; i < dropzones.length; i++) {
            dropzones[i].classList.remove('dropzone');
            dropzones[i].classList.remove('dragover');
        }
    }
}

class IDSSpecCounter extends HTMLElement {
    connectedCallback() {
        let spec = this.closest('ids-spec');
        let index = Array.prototype.indexOf.call(spec.parentElement.children, spec);
        this.textContent = index;
    }
}

class IDSSpecAnchor extends HTMLElement {
    connectedCallback() {
        let spec = this.closest('ids-spec');
        let index = Array.prototype.indexOf.call(spec.parentElement.children, spec);
        let container = this.closest('ids-container');
        let a = this.getElementsByTagName('a')[0];
        a.setAttribute('href', '#' + container.containerId + '-' + index);
    }
}

class IDSSpecTarget extends HTMLElement {
    connectedCallback() {
        let spec = this.closest('ids-spec');
        let index = Array.prototype.indexOf.call(spec.parentElement.children, spec);
        let container = this.closest('ids-container');
        let a = document.createElement("a");
        a.setAttribute('id', container.containerId + '-' + index);
        this.appendChild(a);
    }
}

class IDSSpecAttribute extends HTMLElement {
    connectedCallback() {
        this.name = this.attributes['name'].value;
        if (!this.attributes['readonly']) {
            this.contentEditable = true;
            this.addEventListener('input', this.input);
            this.addEventListener('blur', this.blur);
        }
        this.defaultValue = this.textContent;
    }

    load(idsElement) {
        let self = this;
        this.idsElement = idsElement;
        this.idsElement.addEventListener('ids-spec-attribute-' + this.name, function () { self.render(); });
        this.render();
    }

    render() {
        this.idsAttribute = this.idsElement.attributes[this.name];
        if (this.idsAttribute) {
            if (this.textContent != this.idsAttribute.value) {
                this.textContent = this.idsAttribute.value;
            }
        }
        this.idsAttribute ? this.classList.remove('null') : this.classList.add('null');
        if (!this.textContent) {
            this.textContent = this.defaultValue;
        }
    }

    input(e) {
        if (!this.idsAttribute && this.textContent) {
            this.add();
        }
        if (this.idsAttribute && !this.textContent) {
            this.remove();
        }
        if (this.idsAttribute) {
            this.idsAttribute.value = this.textContent;
        }
        this.idsElement.dispatchEvent(new Event('ids-spec-attribute-' + this.name));
    }

    blur(e) {
        if (this.idsAttribute && !this.textContent) {
            this.remove();
            this.idsElement.dispatchEvent(new Event('ids-spec-attribute-' + this.name));
        }
    }

    add() {
        this.idsElement.setAttribute(this.attributes['name'].value, this.textContent);
        this.idsAttribute = this.idsElement.attributes[this.attributes['name'].value];
    }

    remove() {
        this.idsElement.attributes.removeNamedItem(this.attributes['name'].value);
        this.idsAttribute = null;
    }
}

class IDSFacets extends HTMLElement {
    load(idsElement) {
        let self = this;
        this.idsElement = idsElement;
        this.idsElement.addEventListener('ids-facet-remove', function () { self.render(); });
        this.render();
    }

    render() {
        let template = this.getElementsByTagName('template')[0];

        let children = [];
        for (let i = 0; i < this.children.length; i++) {
            if (this.children[i] != template) {
                children.push(this.children[i]);
            }
        }

        for (let i = 0; i < children.length; i++) {
            this.removeChild(children[i]);
        }

        let facets = this.idsElement.children;
        for (let i = 0; i < facets.length; i++) {
            this.appendChild(template.content.cloneNode(true));
            let facet = this.children[this.children.length - 1];
            let facetElements = facet.getElementsByTagName('ids-facet');
            for (let j = 0; j < facetElements.length; j++) {
                facetElements[j].load(facets[i]);
            }
            //TODO : take care of documentation variable in the tag
            let facetInstructionsElements = facet.getElementsByTagName('ids-facet-instructions');
            for (let j = 0; j < facetInstructionsElements.length; j++) {
                facetInstructionsElements[j].load(facets[i]);
            }
        }
        feather.replace();
    }

    showResults(requirements) {
        let facetElements = this.getElementsByTagName('ids-facet');
        for (let i = 0; i < facetElements.length; i++) {
            facetElements[i].showResults(requirements[i]);
        }
    }
}

class IDSFacetInstructions extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `<span class="label">Instructions : </span><span class="editable" contentEditable="true"></span>`;

        this.labelSpan = this.querySelector('.label');
        this.editableSpan = this.querySelector('.editable');

        this.defaultValue = this.editableSpan.textContent || ''; // Store the default value

        this.addEventListener('input', this.input.bind(this));
        this.addEventListener('blur', this.blur.bind(this));
    }

    load(idsElement) {
        this.idsElement = idsElement;
        this.idsAttribute = this.idsElement.attributes['instructions'];
        if (this.idsAttribute) {
            this.editableSpan.textContent = this.idsAttribute.value;
        }
        this.idsAttribute ? this.classList.remove('null') : this.classList.add('null');
    }

    input() {
        const editableText = this.editableSpan.textContent;

        // Add new attribute if it doesn't exist
        if (!this.idsAttribute && editableText) {
            this.add();
        }

        // Update the existing attribute
        if (this.idsAttribute) {
            this.idsAttribute.value = editableText;
        }

        this.idsAttribute ? this.classList.remove('null') : this.classList.add('null');
    }

    blur() {
        const editableText = this.editableSpan.textContent;

        // Remove the attribute if the text is empty
        if (this.idsAttribute && !editableText) {
            this.remove();
        }

        // Reset to default value if empty
        if (!editableText) {
            this.editableSpan.textContent = this.defaultValue;
        }

        this.idsAttribute ? this.classList.remove('null') : this.classList.add('null');
    }

    add() {
        const editableText = this.editableSpan.textContent;
        this.idsElement.setAttribute('instructions', editableText);
        this.idsAttribute = this.idsElement.attributes['instructions'];
    }

    remove() {
        this.idsElement.removeAttribute('instructions');
        this.idsAttribute = null;
    }
}

class IDSFacetRemove extends HTMLElement {
    connectedCallback() {
        this.addEventListener('click', this.click);
    }

    click(e) {
        let idsElement = this.closest('div').getElementsByTagName('ids-facet')[0].idsElement;
        let parentElement = idsElement.parentElement;
        parentElement.removeChild(idsElement);
        parentElement.dispatchEvent(new Event('ids-facet-remove'));
    }
}


class IDSFacetAdd extends HTMLElement {
    constructor() {
        super();
        this.selectedFacet = null;
        this.list = this.createList();
    }

    connectedCallback() {
        this.addEventListener('mouseover', this.showList.bind(this));
        this.addEventListener('mouseout', this.hideList.bind(this));
        this.addEventListener('click', this.click.bind(this));
        this.appendChild(this.list);
    }

    createList() {
        const facets = ['Entity Facet', 'Attribute Facet', 'Classification Facet', 'Property Facet', 'Material Facet', 'Part Of Facet'];
        return this.createDropdownList(facets, 'facet-item', facet => {
            this.selectedFacet = facet;
            this.hideList();
        });
    }

    createDropdownList(items, itemClass, onClickCallback) {
        const list = document.createElement('div');
        list.classList.add('facet-list');
        list.style.display = 'none';

        items.forEach(item => {
            const listItem = document.createElement('div');
            listItem.textContent = item;
            listItem.classList.add(itemClass);
            listItem.addEventListener('click', () => onClickCallback(item));
            list.appendChild(listItem);
        });

        return list;
    }

    showList() {
        this.list.style.display = 'block';
    }

    hideList() {
        this.list.style.display = 'none';
    }

    click(e) {
        if (this.selectedFacet) {
            this.handleFacetCreation(this.selectedFacet);
        }
    }

    handleFacetCreation(facetType) {
        const facetMap = {
            'Entity Facet': this.createEntityFacet,
            'Attribute Facet': this.createAttributeFacet,
            'Classification Facet': this.createClassificationFacet,
            'Property Facet': this.createPropertyFacet,
            'Material Facet': this.createMaterialFacet,
            'Part Of Facet': this.createPartOfFacet
        };

        const createFacetFunction = facetMap[facetType];
        if (createFacetFunction) {
            createFacetFunction.call(this);
        }
    }

    createFacetElement(container, tagName, childElements) {
        const element = container.ids.createElementNS(ns, tagName);
        childElements.forEach(child => element.appendChild(child));
        return element;
    }

    createSimpleValueElement(container, textContent) {
        const simpleValue = container.ids.createElementNS(ns, 'simpleValue');
        simpleValue.textContent = textContent;
        return simpleValue;
    }


    createEntityFacet() {
        this.createAndRenderFacet('entity', [
            { tag: 'name', content: 'Enter Name' },
            // { tag: 'predefinedType', content: 'Enter Type' }
        ]);
    }

    createAttributeFacet() {
        this.createAndRenderFacet('attribute', [
            { tag: 'name', content: 'Enter Name' },
            { tag: 'value', content: 'Enter Value' }
        ]);
    }

    createClassificationFacet() {
        this.createAndRenderFacet('classification', [
            { tag: 'system', content: 'Enter system' },
            { tag: 'value', content: 'Enter Value' }
        ]);
    }

    createAndRenderFacet(facetTagName, elements) {
        const container = this.closest('ids-container');
        const facets = this.closest('h3').nextElementSibling;
        const specs = this.closest('ids-specs');

        const facetElements = elements.map(({ tag, content }) => {
            const child = this.createFacetElement(container, tag, [this.createSimpleValueElement(container, content)]);
            return child;
        });
        const facet = this.createFacetElement(container, facetTagName, facetElements);
        facets.idsElement.append(facet);
        specs.render();

        return facet
    }

    // Stub methods for other facets

    createPropertyFacet() {
        const facets = this.closest('h3').nextElementSibling;
        const specs = this.closest('ids-specs');
        const propertyFacet = this.createAndRenderFacet('property', [
            { tag: 'propertySet', content: 'Enter pSet' },
            { tag: 'baseName', content: 'Enter BaseName' },
            { tag: 'value', content: 'Enter Value' },
        ])
        propertyFacet.setAttribute('dataType', "IFCLABEL");
        propertyFacet.setAttribute('instructions', "Enter Instructions");

        facets.idsElement.append(propertyFacet);
        specs.render();
    }

    createMaterialFacet() {
        //TODO: currently dont take care of documentation
        this.createAndRenderFacet('material', [
            { tag: 'value', content: 'Enter Value' }
        ]);
    }

    createPartOfFacet() {
        const container = this.closest('ids-container');
        const facets = this.closest('h3').nextElementSibling;
        const specs = this.closest('ids-specs');
        const entityFacet = this.createAndRenderFacet('entity', [
            { tag: 'name', content: 'Enter Name' },
            { tag: 'predefinedType', content: 'Enter Type' }
        ]);

        const partOfFacet = container.ids.createElementNS(ns, 'partOf');
        partOfFacet.setAttribute('relation', 'IFCRELASSIGNSTOGROUP');
        partOfFacet.appendChild(entityFacet);
        facets.idsElement.append(partOfFacet);
        specs.render();
    }
}

class IDSFacetDropdown extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.addEventListeners();
    }

    render() {
        const target = this.getAttribute('target')
        const defaultOption = this.getAttribute('defaultOption') || 'type';
        let options = [
            { value: 'type', text: 'equals' },
            { value: 'typeEnumeration', text: 'is one of' },
            { value: 'matchesPattern', text: 'matches pattern' },
            { value: 'bounds', text: 'has value' },
            { value: 'length', text: 'has length' },
        ];
        if (target == "predefinedType" || target == "value") {
            options.push({ value: 'none', text: "none" })
        }

        if (target == 'relation') {
            options = [
                //TODO : Dropdown Values Friendly
                { value: 'IFCRELAGGREGATES', text: 'IFCRELAGGREGATES' },
                { value: 'IFCRELASSIGNSTOGROUP', text: 'IFCRELASSIGNSTOGROUP' },
                { value: 'IFCRELCONTAINEDINSPATIALSTRUCTURE', text: 'IFCRELCONTAINEDINSPATIALSTRUCTURE' },
                { value: 'IFCRELNESTS', text: 'IFCRELNESTS' },
                { value: 'IFCRELVOIDSELEMENT', text: 'IFCRELVOIDSELEMENT ' },
                { value: 'IFCRELFILLSELEMENT', text: 'IFCRELFILLSELEMENT ' },
                { value: 'none', text: 'directly or indirectly part of' },
            ];
        }
        this.shadowRoot.innerHTML = `
            <style>
                select {
                    font-size: 1em;
                    padding: 0.2em;
                }
            </style>
            <select id="dropdown">
                ${options.map(option => `
                    <option value="${option.value}" ${option.value === defaultOption ? 'selected' : ''}>
                        ${option.text}
                    </option>
                `).join('')}
            </select>
        `;
    }

    addEventListeners() {
        this.shadowRoot.querySelector('#dropdown').addEventListener('change', this.handleDropdownChange.bind(this));
    }

    handleDropdownChange(e) {
        const target = this.getAttribute('target');
        if (!target) return;

        const handlers = {
            'name': this.handleNameChange,
            'predefinedType': this.handlePredefinedTypeChange,
            'value': this.handleValueChange,
            'system': this.handelSystemChange,
            'relation': this.handleRelationChange,
            'baseName': this.handleBaseNameChange,
            'pset': this.handlePsetNameChange,
        };

        const handler = handlers[target];
        if (handler) {
            handler.call(this, e.target.value);
        }

        this.dispatchEvent(new CustomEvent('selection-changed', {
            detail: { value: e.target.value },
            bubbles: true,
            composed: true,
        }));
    }
    handleRelationChange(value) {
        const container = this.closest('ids-container');
        const specs = this.closest('ids-specs');
        const facet = this.closest('ids-facet');
        let partOfFacet = facet.idsElement;


        if (partOfFacet) {
            if (value === 'IFCRELAGGREGATES') {
                partOfFacet.setAttribute('relation', 'IFCRELAGGREGATES');
            } else if (value === 'IFCRELASSIGNSTOGROUP') {
                partOfFacet.setAttribute('relation', 'IFCRELASSIGNSTOGROUP');
            }
            else if (value === 'IFCRELCONTAINEDINSPATIALSTRUCTURE') {
                partOfFacet.setAttribute('relation', 'IFCRELCONTAINEDINSPATIALSTRUCTURE');
            }
            else if (value === 'IFCRELNESTS') {
                partOfFacet.setAttribute('relation', 'IFCRELNESTS');
            }
            else if (value === 'IFCRELVOIDSELEMENT') {
                partOfFacet.setAttribute('relation', 'IFCRELVOIDSELEMENT');
            }
            else if (value === 'IFCRELFILLSELEMENT') {
                partOfFacet.setAttribute('relation', 'IFCRELFILLSELEMENT');
            } else if (value == 'none') {
                partOfFacet.removeAttribute('relation');
            }
        }
        console.log(partOfFacet)
        facet.isdElement = partOfFacet;
        specs.render();
    }
    handlePsetNameChange(value) {
        this.updateFacetElement('propertySet', value, [
            { value: 'type', elements: () => [this.createSimpleValueElement('Enter Name')] },
            { value: 'typeEnumeration', elements: () => this.createEnumerationElements(['Enter Value', 'Enter Value 2']) },
            { value: 'matchesPattern', elements: () => this.createPatternElement('Enter XML Regular Expression') },
            { value: 'bounds', elements: () => this.createBoundsElement() },
            { value: 'length', elements: () => this.createLengthElement('Enter length Value') }
        ]);
    }
    handleBaseNameChange(value) {
        this.updateFacetElement('baseName', value, [
            { value: 'type', elements: () => [this.createSimpleValueElement('Enter Name')] },
            { value: 'typeEnumeration', elements: () => this.createEnumerationElements(['Enter Value', 'Enter Value 2']) },
            { value: 'matchesPattern', elements: () => this.createPatternElement('Enter XML Regular Expression') },
            { value: 'bounds', elements: () => this.createBoundsElement() },
            { value: 'length', elements: () => this.createLengthElement('Enter length Value') }
        ]);
    }
    handleNameChange(value) {
        this.updateFacetElement('name', value, [
            { value: 'type', elements: () => [this.createSimpleValueElement('Enter Name')] },
            { value: 'typeEnumeration', elements: () => this.createEnumerationElements(['Enter Value', 'Enter Value 2']) },
            { value: 'matchesPattern', elements: () => this.createPatternElement('Enter XML Regular Expression') },
            { value: 'bounds', elements: () => this.createBoundsElement() },
            { value: 'length', elements: () => this.createLengthElement('Enter length Value') }
        ]);
    }

    handlePredefinedTypeChange(value) {
        if (value == "none") {
            this.removeOptionalType('predefinedType')
        } else {
            this.updateFacetElement('predefinedType', value, [
                { value: 'type', elements: () => [this.createSimpleValueElement('Enter Type')] },
                { value: 'typeEnumeration', elements: () => this.createEnumerationElements(['Enter Value', 'Enter Value 2']) },
                { value: 'matchesPattern', elements: () => this.createPatternElement('Enter XML Regular Expression') },
                { value: 'bounds', elements: () => this.createBoundsElement() },
                { value: 'length', elements: () => this.createLengthElement('Enter length Value') },
            ]);
        }

    }

    removeOptionalType(type) {
        const specs = this.closest('ids-specs');
        const facet = this.closest('ids-facet');
        let idsElement = facet.idsElement;
        console.log('remove', idsElement.tagName)
        let typeToRemove = idsElement.getElementsByTagName(type)[0]
        if (idsElement.tagName == 'partOf') {
            // it is partOf Facet
            let entity = idsElement.getElementsByTagName('entity')[0]
            console.log('entity', entity)
            entity.removeChild(typeToRemove)
        } else {
            idsElement.removeChild(typeToRemove)
        }

        facet.idsElement = idsElement;
        specs.render();
    }


    handleValueChange(value) {
        if (value == "none") {
            this.removeOptionalType('value')
        } else {

            this.updateFacetElement('value', value, [
                { value: 'type', elements: () => [this.createSimpleValueElement('Enter Type')] },
                { value: 'typeEnumeration', elements: () => this.createEnumerationElements(['Enter Value', 'Enter Value 2']) },
                { value: 'matchesPattern', elements: () => this.createPatternElement('Enter XML Regular Expression') },
                { value: 'bounds', elements: () => this.createBoundsElement() },
                { value: 'length', elements: () => this.createLengthElement('Enter length Value') },
            ])
        }
    }

    handelSystemChange(value) {
        if (value == "none") {
            this.removeOptionalType('value')
        } else {
            this.updateFacetElement('system', value, [
                { value: 'type', elements: () => [this.createSimpleValueElement('Enter System')] },
                { value: 'typeEnumeration', elements: () => this.createEnumerationElements(['Enter System1', 'Enter System2']) },
                { value: 'matchesPattern', elements: () => this.createPatternElement('Enter XML Regular Expression') },
                { value: 'bounds', elements: () => this.createBoundsElement() },
                { value: 'length', elements: () => this.createLengthElement('Enter Length Value') }
            ])
        }
    }


    updateFacetElement(tagName, value, options) {
        const container = this.closest('ids-container');
        const specs = this.closest('ids-specs');
        const facet = this.closest('ids-facet');
        let idsElement = facet.idsElement;

        let element = null;
        let entityElement = null;

        // Attempt to find the 'entity' tag within idsElement
        entityElement = idsElement.getElementsByTagNameNS(ns, 'entity')[0];

        // If 'entity' tag exists, operate within it
        if (entityElement) {
            try {
                element = entityElement.getElementsByTagNameNS(ns, tagName)[0];
                if (element) {
                    entityElement.removeChild(element); // Remove from entity
                }
            } catch (e) {
                console.error('Failed to remove element from entityElement:', e);
            }
        } else {
            // If 'entity' tag doesn't exist, operate directly on idsElement
            try {
                element = idsElement.getElementsByTagNameNS(ns, tagName)[0];
                if (element) {
                    idsElement.removeChild(element); // Remove directly from idsElement
                }
            } catch (e) {
                console.error('Failed to remove element from idsElement:', e);
            }
        }

        // Proceed to create and append the new element
        const option = options.find(opt => opt.value === value);
        if (option) {
            element = this.createFacetElement(container, tagName, option.elements());

            // Append to the appropriate parent element
            try {
                if (entityElement) {
                    entityElement.appendChild(element); // Append to entity if it exists
                } else {
                    idsElement.appendChild(element); // Otherwise, append directly to idsElement
                }
            } catch (e) {
                console.error('Failed to append element:', e);
            }

            facet.idsElement = idsElement;
            specs.render();
        }

        console.log('Updated idsElement after append', idsElement);
    }

    createFacetElement(container, tagName, childElements) {
        const element = container.ids.createElementNS(ns, tagName);
        childElements.forEach(child => element.appendChild(child));
        return element;
    }

    createSimpleValueElement(textContent) {
        const simpleValue = document.createElementNS(ns, 'simpleValue');
        simpleValue.textContent = textContent;
        return simpleValue;
    }

    createEnumerationElements(values) {
        const restriction = document.createElementNS(xs, 'restriction');
        values.forEach(value => {
            const enumeration = document.createElementNS(xs, 'enumeration');
            enumeration.setAttribute('value', value);
            restriction.appendChild(enumeration);
        });
        return [restriction];
    }

    createPatternElement(value) {
        const restriction = document.createElementNS(xs, 'restriction');
        const pattern = document.createElementNS(xs, 'pattern');
        pattern.setAttribute('value', value);
        restriction.appendChild(pattern);
        return [restriction];
    }

    createLengthElement(value) {
        const restriction = document.createElementNS(xs, 'restriction');
        const length = document.createElementNS(xs, 'length')
        length.setAttribute('value', value);
        restriction.appendChild(length)
        return [restriction];
    }

    createBoundsElement() {
        const restriction = document.createElementNS(xs, 'restriction');
        restriction.setAttribute('base', 'xs:double');

        const minInclusive = document.createElementNS(xs, 'minInclusive');
        minInclusive.setAttribute('value', '0');
        const maxExclusive = document.createElementNS(xs, 'maxExclusive');
        maxExclusive.setAttribute('value', '0');

        restriction.appendChild(minInclusive);
        restriction.appendChild(maxExclusive);

        return [restriction];
    }

    removePredefinedType() {
        console.log('this', this)
    }
}

class IDSFacetBoundsDropdown extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    connectedCallback() {
        this.render();
        this.addEventListeners();
    }

    render() {
        const type = this.getAttribute('type');
        // Get the options based on the type attribute
        const target = this.getAttribute('target');
        const minOptions = [
            { value: 'minInclusive', text: 'greater than or equal to' },
            { value: 'minExclusive', text: 'greater than' },
        ];

        const maxOptions = [
            { value: 'maxInclusive', text: 'less than or equal to' },
            { value: 'maxExclusive', text: 'less than' },
        ];

        let options;
        let selectedOption;

        // Determine the appropriate options and default selection
        if (type === 'min') {
            options = minOptions;
            selectedOption = this.getAttribute('minInclusive') ? 'minInclusive' : 'minExclusive';
        } else if (type === 'max') {
            options = maxOptions;
            selectedOption = this.getAttribute('maxInclusive') ? 'maxInclusive' : 'maxExclusive';
        }


        // Render the dropdown
        this.shadowRoot.innerHTML = `
            <style>
                select {
                    font-size: 1em;
                    padding: 0.2em;
                }
            </style>
            <select id="dropdown">
                ${options.map(option => `
                    <option value="${option.value}" ${option.value === selectedOption ? 'selected' : ''}>
                        ${option.text}
                    </option>
                `).join('')}
            </select>
        `;

    }


    addEventListeners() {
        this.shadowRoot.querySelector('#dropdown').addEventListener('change', (e) => {
            let self = this
            console.log('self', self)
            let target = self.getAttribute('target')
            console.log(target)
            let container = this.closest('ids-container');
            let specs = this.closest('ids-specs')
            let facet = this.closest('ids-facet')
            let idsElement = facet.idsElement;
            console.log('idsElement', idsElement)
            let type = idsElement.getElementsByTagNameNS(ns, target)[0];

            let restriction = type.getElementsByTagNameNS(xs, 'restriction')[0];
            console.log('type', type)
            console.log(restriction)
            if (e.target.value == 'minInclusive') {
                let minInclusive = restriction.getElementsByTagNameNS(xs, 'minInclusive')[0];
                let minExclusive = restriction.getElementsByTagNameNS(xs, 'minExclusive')[0];


                if (minInclusive) {
                    restriction.removeChild(minInclusive);
                }
                if (minExclusive) {
                    restriction.removeChild(minExclusive);

                }

                minInclusive = container.ids.createElementNS(xs, 'minInclusive')
                minInclusive.setAttribute('value', 'Enter Value');

                console.log('restriction2', restriction)
                restriction.appendChild(minInclusive)

                facet.idsElement = idsElement;
                specs.render();
            }
            else if (e.target.value == 'minExclusive') {
                let minInclusive = restriction.getElementsByTagNameNS(xs, 'minInclusive')[0];
                let minExclusive = restriction.getElementsByTagNameNS(xs, 'minExclusive')[0];

                if (minInclusive) {
                    restriction.removeChild(minInclusive);
                }
                if (minExclusive) {
                    restriction.removeChild(minExclusive);
                }

                minExclusive = container.ids.createElementNS(xs, 'minExclusive')
                minExclusive.setAttribute('value', 'Enter Value');
                restriction.appendChild(minExclusive)

                facet.idsElement = idsElement;
                specs.render();
            }
            if (e.target.value == 'maxInclusive') {
                let maxInclusive = restriction.getElementsByTagNameNS(xs, 'maxInclusive')[0];
                let maxExclusive = restriction.getElementsByTagNameNS(xs, 'maxExclusive')[0];


                if (maxInclusive) {
                    restriction.removeChild(maxInclusive);
                }
                if (maxExclusive) {
                    restriction.removeChild(maxExclusive);
                }

                maxInclusive = container.ids.createElementNS(xs, 'maxInclusive')
                maxInclusive.setAttribute('value', 'Enter Value');
                restriction.appendChild(maxInclusive)

                facet.idsElement = idsElement;
                specs.render();
            }
            else if (e.target.value == 'maxExclusive') {
                let maxInclusive = restriction.getElementsByTagNameNS(xs, 'maxInclusive')[0];
                let maxExclusive = restriction.getElementsByTagNameNS(xs, 'maxExclusive')[0];


                if (maxInclusive) {
                    restriction.removeChild(maxInclusive);
                }
                if (maxExclusive) {
                    restriction.removeChild(maxExclusive);
                }
                maxExclusive = container.ids.createElementNS(xs, 'maxExclusive')
                maxExclusive.setAttribute('value', 'Enter Value');
                restriction.appendChild(maxExclusive)

                facet.idsElement = idsElement;
                specs.render();
            }

            this.dispatchEvent(new CustomEvent('selection-changed', {
                detail: { value: e.target.value },
                bubbles: true,
                composed: true,
            }));
        });
    }

}

class IDSFacet extends HTMLElement {

    load(idsElement) {
        let self = this;
        this.idsElement = idsElement;
        this.type = this.attributes['type'].value;
        this.params = [];
        if (this.idsElement.localName == 'entity') {
            this.loadEntity();
        } else if (this.idsElement.localName == 'attribute') {
            this.loadAttribute()
        } else if (this.idsElement.localName == 'classification') {
            this.loadClassification();
        } else if (this.idsElement.localName == 'property') {
            this.loadProperty();
        } else if (this.idsElement.localName == 'material') {
            this.loadMaterial();
        } else if (this.idsElement.localName == 'partOf') {
            this.loadPartOf();
        }

        let paramElements = this.getElementsByTagName('ids-param');
        for (let i = 0; i < paramElements.length; i++) {
            paramElements[i].load(this.params[i]);
        }
    }

    showResults(requirement) {
        let idsResultElements = this.parentElement.getElementsByTagName('ids-result');
        for (let i = 0; i < idsResultElements.length; i++) {
            if (!idsResultElements[i].classList.contains('hidden')) {
                idsResultElements[i].classList.add('hidden');
            }
            if (requirement.status == true && idsResultElements[i].attributes['name'].value == 'pass') {
                idsResultElements[i].classList.remove('hidden');
            } else if (requirement.status == false && idsResultElements[i].attributes['name'].value == 'fail') {
                idsResultElements[i].classList.remove('hidden');
                idsResultElements[i].getElementsByTagName('span')[0].textContent = requirement.failed_entities.length;
            }
        }
    }

    renderTemplate(templates, parameters) {
        console.log(parameters)
        for (let i = 0; i < templates.length; i++) {
            let hasKeys = true;
            for (let key in parameters) {
                if (templates[i].indexOf('{' + key + '}') === -1) {
                    hasKeys = false;
                    break;
                } else {
                    templates[i] = templates[i].replace('{' + key + '}', parameters[key]);
                }
            }

            if (hasKeys) {
                return templates[i];
            }
        }
    }

    parseRelation(idsElement, parameters) {
        let value = this.idsElement.attributes['relation']

        if (value) {
            if (value.value == 'IFCRELAGGREGATES') {
                parameters.relationIFCRELAGGREGATES = '<ids-param filter="relation">' + this.sentence(this.idsElement.attributes['relation'].value.replace('Ifc', '').replace('Rel', '')) + '</ids-param>';
            }
            else if (value.value === 'IFCRELASSIGNSTOGROUP') {
                parameters.relationIFCRELASSIGNSTOGROUP = '<ids-param filter="relation">' + this.sentence(this.idsElement.attributes['relation'].value.replace('Ifc', '').replace('Rel', '')) + '</ids-param>';
            }
            else if (value.value === 'IFCRELCONTAINEDINSPATIALSTRUCTURE') {
                parameters.relationIFCRELCONTAINEDINSPATIALSTRUCTURE = '<ids-param filter="relation" >' + this.sentence(this.idsElement.attributes['relation'].value.replace('Ifc', '').replace('Rel', '')) + '</ids-param>';
            }
            else if (value.value === 'IFCRELNESTS') {
                parameters.relationIFCRELNESTS = '<ids-param filter="relation">' + this.sentence(this.idsElement.attributes['relation'].value.replace('Ifc', '').replace('Rel', '')) + '</ids-param>';
            }
            else if (value.value === 'IFCRELVOIDSELEMENT') {
                parameters.relationIFCRELVOIDSELEMENT = '<ids-param filter="relation">' + this.sentence(this.idsElement.attributes['relation'].value.replace('Ifc', '').replace('Rel', '')) + '</ids-param>';
            }
            else if (value.value === 'IFCRELFILLSELEMENT') {
                parameters.relationIFCRELFILLSELEMENT = '<ids-param filter="relation">' + this.sentence(this.idsElement.attributes['relation'].value.replace('Ifc', '').replace('Rel', '')) + '</ids-param>';
            }
        }
        else {
            parameters.relationNone = '<ids-param filter="relation">' + 'none' + '</ids-param>';
        }
    }
    parseBaseName(idsElement, parameters) {
        let baseName = this.idsElement.getElementsByTagNameNS(ns, 'baseName')[0]

        let value = this.getIdsValue(baseName);
        if (value.type === 'simpleValue') {
            let content = this.capitalise(value.content.toLowerCase().replace(/ifc/g, ''));
            parameters.name = `<ids-param filter="entityName">${content}</ids-param>`;
            this.params.push(value.param);
        } else if (value.type === 'enumeration') {
            let content = this.capitalise(value.content.toLowerCase().replace(/ifc/g, ''));
            parameters.nameTypeEnumeration = `<ids-param filter="entityName">${content}</ids-param>`;
            this.params.push(value.param);
        }
        else if (value.type === 'pattern') {
            parameters.namePattern = `<ids-param class="pattern" filter="pattern">${value.content}</ids-param>`;
            this.params.push(value.param);
        }
        else if (value.type === 'bounds') {
            parameters.nameBounds = this.processBoundsValue(value, parameters, "baseName");
            this.params.push(value.param);
        }
        else if (value.type === 'length') {
            parameters.nameLength = `<ids-param filter="length">${value.content}</ids-param>`;
            this.params.push(value.param);
        }
    }

    parseEntityName(idsElement, parameters) {

        let name = this.idsElement.getElementsByTagNameNS(ns, 'name')[0];
        let nameValue = this.getIdsValue(name);

        this.processEntityNameValue(nameValue, parameters);

        // Get all 'predefinedType' elements and filter those not inside 'name'
        let predefinedTypes = this.getPredefinedTypesOutsideName();

        if (predefinedTypes.length > 0) {
            let predefinedValue = this.getIdsValue(predefinedTypes[0]);
            this.processPredefinedValue(predefinedValue, parameters);
        }
    }

    processEntityNameValue(value, parameters) {
        if (value.type === 'simpleValue') {
            let content = this.capitalise(value.content.toLowerCase().replace(/ifc/g, ''));
            parameters.name = `<ids-param filter="entityName">${content}</ids-param>`;
            this.params.push(value.param);
        } else if (value.type === 'enumeration') {
            let content = this.capitalise(value.content.toLowerCase().replace(/ifc/g, ''));
            parameters.nameTypeEnumeration = `<ids-param filter="entityName">${content}</ids-param>`;
            this.params.push(value.param);
        }
        else if (value.type === 'pattern') {
            parameters.namePattern = `<ids-param class="pattern" filter="pattern">${value.content}</ids-param>`;
            this.params.push(value.param);
        }
        else if (value.type === 'bounds') {
            parameters.nameBounds = this.processBoundsValue(value, parameters, "name");
            this.params.push(value.param);
        }
        else if (value.type === 'length') {
            parameters.nameLength = `<ids-param filter="length">${value.content}</ids-param>`;
            this.params.push(value.param);
        }
    }

    processAttributeNameValue(value, parameters) {
        if (value.type === 'simpleValue') {
            let content = this.capitalise(value.content.toLowerCase().replace(/ifc/g, ''));
            parameters.name = `<ids-param filter="attributeName">${content}</ids-param>`;
            this.params.push(value.param);
        } else if (value.type === 'enumeration') {
            let content = this.capitalise(value.content.toLowerCase().replace(/ifc/g, ''));
            parameters.nameTypeEnumeration = `<ids-param ilter="attributeName">${content}</ids-param>`;
            this.params.push(value.param);
        }
        else if (value.type === 'pattern') {
            parameters.namePattern = `<ids-param class="pattern" filter="pattern">${value.content}</ids-param>`;
            this.params.push(value.param);
        }
        else if (value.type === 'bounds') {
            parameters.nameBounds = this.processBoundsValue(value, parameters, "name");
            this.params.push(value.param);
        }
        else if (value.type === 'length') {
            parameters.nameLength = `<ids-param filter="length">${value.content}</ids-param>`;
            this.params.push(value.param);
        }

    }

    getPredefinedTypesOutsideName() {
        let allPredefinedTypes = this.idsElement.getElementsByTagNameNS(ns, 'predefinedType');
        return Array.from(allPredefinedTypes).filter(element => {
            return !this.isChildOfName(element);
        });
    }

    isChildOfName(element) {
        let parent = element.parentNode;
        return parent.tagName === 'name';
    }

    processPredefinedValue(value, parameters) {
        if (value.type === 'simpleValue') {
            parameters.type = `<ids-param>${value.content}</ids-param>`;
        } else if (value.type === 'enumeration') {
            parameters.typeEnumeration = `<ids-param>${value.content}</ids-param>`;
        } else if (value.type === 'pattern') {
            parameters.pattern = `<ids-param class="pattern" filter="pattern">${value.content}</ids-param>`;
        } else if (value.type === 'bounds') {
            parameters.bounds = this.processBoundsValue(value, parameters, "predefinedType");
        } else if (value.type === 'length') {
            parameters.length = `<ids-param filter="length">${value.content}</ids-param>`;
        }
        this.params.push(value.param);
    }

    processAttributeValue(values, parameters) {
        if (values.length) {
            let value = this.getIdsValue(values[0]);
            if (value.type == 'simpleValue') {
                parameters.type = '<ids-param>' + value.content + '</ids-param>';
                this.params.push(value.param);
            } else if (value.type == 'pattern') {
                parameters.pattern = `<ids-param class="pattern" filter="pattern">${value.content}</ids-param>`;
                this.params.push(value.param);
            } else if (value.type == 'enumeration') {
                parameters.typeEnumeration = `<ids-param>${value.content}</ids-param>`;
                this.params.push(value.param);
            }
            else if (value.type === 'bounds') {
                parameters.bounds = this.processBoundsValue(value, parameters, "value");
            } else if (value.type === 'length') {
                parameters.length = '<ids-param filter="length">' + value.content + '</ids-param>';
                this.params.push(value.param);
            }
        }
    }

    parsePropertySet(value, parameters) {
        if (value.type == 'simpleValue') {
            parameters.psetName = '<ids-param>' + value.content + '</ids-param>';
        }
        else if (value.type == 'pattern') {
            parameters.psetPattern = '<ids-param class="pattern" filter="pattern">' + value.content + '</ids-param>';
        } else if (value.type == 'enumeration') {
            parameters.psetEnumeration = '<ids-param>' + value.content + '</ids-param>';
        } else if (value.type == 'bounds') {
            parameters.psetBounds = this.processBoundsValue(value, parameters, "propertySet");
        } else if (value.type == 'length') {
            parameters.psetLength = '<ids-param filter="length">' + value.content + '</ids-param>';
        }
        this.params.push(value.param);
    }

    parseValue(value, parameters) {
        if (value.type == 'simpleValue') {
            parameters.value = '<ids-param>' + value.content + '</ids-param>';
            this.params.push(value.param);
        } else if (value.type == 'pattern') {
            parameters.valuePattern = '<ids-param class="pattern" filter="pattern">' + value.content + '</ids-param>';
            this.params.push(value.param);
        } else if (value.type == 'enumeration') {
            parameters.valueEnumeration = '<ids-param>' + value.content + '</ids-param>';
            this.params.push(value.param);
        } else if (value.type == 'bounds') {
            parameters.valueBounds = this.processBoundsValue(value, parameters, "value");
            this.params.push(value.param);

        } else if (value.type == 'length') {
            parameters.valueLength = '<ids-para filter="length">' + value.content + '</ids-param>';
            this.params.push(value.param);

        }
    }

    processClassificationSystemNameValue(value, parameters) {
        if (value.type === 'simpleValue') {
            let content = this.capitalise(value.content.toLowerCase().replace(/ifc/g, ''));
            parameters.system = `<ids-param filter="attributeName">${content}</ids-param>`;
        } else if (value.type === 'enumeration') {
            let content = this.capitalise(value.content.toLowerCase().replace(/ifc/g, ''));
            parameters.systemEnumeration = `<ids-param ilter="attributeName">${content}</ids-param>`;
        }
        else if (value.type === 'pattern') {
            parameters.systemPattern = `<ids-param class="pattern" filter="pattern">${value.content}</ids-param>`;
        }
        else if (value.type === 'bounds') {
            parameters.systemBounds = this.processBoundsValue(value, parameters, "system");
        }
        else if (value.type === 'length') {
            parameters.systemLength = `<ids-param filter="length">${value.content}</ids-param>`;
        }
        this.params.push(value.param);
    }

    processClassificationSystemValue(values, parameters) {
        if (values.length) {
            let value = this.getIdsValue(values[0]);
            if (value.type == 'simpleValue') {
                parameters.value = '<ids-param>' + value.content + '</ids-param>';
            } else if (value.type == 'pattern') {
                parameters.valuePattern = `<ids-param class="pattern" filter="pattern">${value.content}</ids-param>`;
            } else if (value.type == 'enumeration') {
                parameters.valueEnumeration = `<ids-param>${value.content}</ids-param>`;
            }
            else if (value.type === 'bounds') {
                parameters.valueBounds = this.processBoundsValue(value, parameters, "value");
            } else if (value.type === 'length') {
                parameters.valueLength = `<ids-param filter="length" >${value.content}</ids-param>`;
            }
            this.params.push(value.param);
        }
    }

    processMaterialValue(values, parameters) {
        if (values.length) {
            let value = this.getIdsValue(values[0]);
            if (value.type == 'simpleValue') {
                parameters.type = '<ids-param>' + value.content + '</ids-param>';
            } else if (value.type == 'pattern') {
                parameters.pattern = `<ids-param class="pattern" filter="pattern">${value.content}</ids-param>`;
            } else if (value.type == 'enumeration') {
                parameters.typeEnumeration = `<ids-param>${value.content}</ids-param>`;
            }
            else if (value.type === 'bounds') {
                parameters.bounds = this.processBoundsValue(value, parameters, "value");
            } else if (value.type === 'length') {
                parameters.length = `<ids-param filter="length">${value.content}</ids-param>`;
            }
            this.params.push(value.param);
        }
    }
    processBoundsValue(value, parameters, target) {
        let minBoundsDropdowns = '';
        let minBoundsValues = '';
        let maxBoundsDropdowns = '';
        let maxBoundsValues = '';
        if (value.param.minInclusive || value.param.minExclusive) {
            minBoundsDropdowns += this.createBoundsDropdown('min', value.param, target);
            minBoundsValues += `<ids-param filter="bounds">${this.getBoundsValue(value.param, 'min')}</ids-param>`;
        }

        if (value.param.maxExclusive || value.param.maxInclusive) {
            maxBoundsDropdowns += this.createBoundsDropdown('max', value.param, target);
            maxBoundsValues += `<ids-param filter="bounds">${this.getBoundsValue(value.param, 'max')}</ids-param>`;
        }
        // Combine dropdowns and values
        let bounds;
        if (minBoundsDropdowns && maxBoundsDropdowns) {
            bounds = `${minBoundsDropdowns} ${minBoundsValues} and ${maxBoundsDropdowns} ${maxBoundsValues} `;
        } else if (minBoundsDropdowns) {
            bounds = `${minBoundsDropdowns} ${minBoundsValues}`;
        } else if (maxBoundsDropdowns) {
            bounds = `${maxBoundsDropdowns} ${maxBoundsValues} `;
        }

        return bounds;
    }

    createBoundsDropdown(type, param, target) {

        let dropdown = document.createElement('ids-facet-bounds-dropdown');
        dropdown.setAttribute('type', type);
        dropdown.setAttribute('target', target);

        if (type === 'min') {
            if (param.minInclusive) {
                dropdown.setAttribute('minInclusive', param.minInclusive);
            } else if (param.minExclusive) {
                dropdown.setAttribute('minExclusive', param.minExclusive);
            }
        } else if (type === 'max') {
            if (param.maxInclusive) {
                dropdown.setAttribute('maxInclusive', param.maxInclusive);
            } else if (param.maxExclusive) {
                dropdown.setAttribute('maxExclusive', param.maxExclusive);
            }
        }
        console.log('dropdown', dropdown.outerHTML)
        return dropdown.outerHTML;
    }

    getBoundsValue(param, type) {
        return type === 'min'
            ? param.minInclusive || param.minExclusive
            : param.maxInclusive || param.maxExclusive;
    }

    loadEntity() {
        let templates;
        const names = [
            ['type', 'name'],
            ['typeEnumeration', 'nameTypeEnumeration'],
            ['matchesPattern', 'namePattern'],
            ['bounds', 'nameBounds'],
            ['length', 'nameLength']
        ];

        const predefinedTypes = [
            ['type', 'type'],
            ['typeEnumeration', 'typeEnumeration'],
            ['matchesPattern', 'pattern'],
            ['bounds', 'bounds'],
            ['length', 'length']
        ];
        if (this.type == 'applicability') {
            templates = []
            names.forEach(([name, name_param]) => {
                templates.push(
                    `Entities where IFC Class <ids-facet-dropdown target="name" defaultoption="${name}"></ids-facet-dropdown>{${name_param}} data.` + `
                    <span class="facet-control">
                    <ids-add-optional-type optional-types='["predefinedType"]'><i data-feather="plus"></i><ids-add-optional-type>
                    </span>
                    `
                );
            });

            names.forEach(([name, name_param]) => {
                predefinedTypes.forEach(([predefinedType, predefinedType_param]) => {
                    templates.push(
                        `Entities where IFC Class <ids-facet-dropdown target="name" defaultoption="${name}"></ids-facet-dropdown>{${name_param}} and predefined type <ids-facet-dropdown target="predefinedType" defaultoption="${predefinedType}"></ids-facet-dropdown>{${predefinedType_param}}`
                    );
                });
            });
        } else if (this.type == 'requirement') {
            templates = []
            names.forEach(([name, name_param]) => {
                templates.push(
                    `Entities where IFC Class must be<ids-facet-dropdown target="name" defaultoption="${name}"></ids-facet-dropdown>{${name_param}}` + `
                    <span class="facet-control">
                    <ids-add-optional-type optional-types='["predefinedType"]'><i data-feather="plus"></i><ids-add-optional-type>
                    </span>
                    `
                );
            });

            names.forEach(([name, name_param]) => {
                predefinedTypes.forEach(([predefinedType, predefinedType_param]) => {
                    templates.push(
                        `Entities where IFC Class must be<ids-facet-dropdown target="name" defaultoption="${name}"></ids-facet-dropdown>{${name_param}} and predefined type <ids-facet-dropdown target="predefinedType" defaultoption="${predefinedType}"></ids-facet-dropdown>{${predefinedType_param}} data`
                    );
                });
            });
        }

        let parameters = {};
        this.parseEntityName(this.idsElement, parameters);
        this.innerHTML = this.renderTemplate(templates, parameters);
    }

    loadAttribute() {
        let templates;
        const names = [
            ['type', 'name'],
            ['typeEnumeration', 'nameTypeEnumeration'],
            ['matchesPattern', 'namePattern'],
            ['bounds', 'nameBounds'],
            ['length', 'nameLength']
        ];

        const valuesInfo = [
            ['type', 'type'],
            ['typeEnumeration', 'typeEnumeration'],
            ['matchesPattern', 'pattern'],
            ['bounds', 'bounds'],
            ['length', 'length']
        ];

        if (this.type == 'applicability') {
            templates = []
            names.forEach(([name, name_param]) => {
                templates.push(
                    `Entities having Attribute Name that <ids-facet-dropdown target="name" defaultoption="${name}"></ids-facet-dropdown>{${name_param}}` + `
                    <span class="facet-control">
                    <ids-add-optional-type optional-types='["value"]'><i data-feather="plus"></i><ids-add-optional-type>
                    </span>
                    `
                );
            });

            names.forEach(([name, name_param]) => {
                valuesInfo.forEach(([value, value_param]) => {
                    templates.push(
                        `Entities having Attribute Name that <ids-facet-dropdown target="name" defaultoption="${name}"></ids-facet-dropdown>{${name_param}} and value that <ids-facet-dropdown target="value" defaultoption="${value}"></ids-facet-dropdown>{${value_param}}`
                    );
                });
            });
        }
        else if (this.type == 'requirement') {
            templates = []
            names.forEach(([name, name_param]) => {
                templates.push(
                    `Entities having Attribute Name that <ids-facet-dropdown target="name" defaultoption="${name}"></ids-facet-dropdown>{${name_param}}` + `
                    <span class="facet-control">
                    <ids-add-optional-type optional-types='["value"]'><i data-feather="plus"></i><ids-add-optional-type>
                    </span>
                    `
                );
            });

            names.forEach(([name, name_param]) => {
                valuesInfo.forEach(([value, value_param]) => {
                    templates.push(
                        `Entities having Attribute Name that <ids-facet-dropdown target="name" defaultoption="${name}"></ids-facet-dropdown>{${name_param}} and predefined type <ids-facet-dropdown target="value" defaultoption="${value}"></ids-facet-dropdown>{${value_param}}`
                    );
                });
            });
        }

        let parameters = {};

        let name = this.idsElement.getElementsByTagNameNS(ns, 'name')[0];
        let nameValue = this.getIdsValue(name);
        this.processAttributeNameValue(nameValue, parameters);

        let values = this.idsElement.getElementsByTagNameNS(ns, 'value');
        this.processAttributeValue(values, parameters);

        this.innerHTML = this.renderTemplate(templates, parameters);
    }

    loadClassification() {
        let templates;
        const systemInfo = [
            ['type', 'system'],
            ['typeEnumeration', 'systemEnumeration'],
            ['matchesPattern', 'systemPattern'],
            ['bounds', 'systemBounds'],
            ['length', 'systemLength']
        ];

        const valueInfo = [
            ['type', 'value'],
            ['typeEnumeration', 'valueEnumeration'],
            ['matchesPattern', 'valuePattern'],
            ['bounds', 'valueBounds'],
            ['length', 'valueLength']
        ];

        if (this.type == 'applicability') {
            templates = []
            templates.push('Any classified element')
            systemInfo.forEach(([system, system_param]) => {
                templates.push(
                    `Any entity classified using system that <ids-facet-dropdown target="system" defaultoption="${system}"></ids-facet-dropdown>{${system_param}}` + `
                    <span class="facet-control">
                    <ids-add-optional-type optional-types='["value"]'><i data-feather="plus"></i><ids-add-optional-type>
                    </span>
                    `
                );
            });

            systemInfo.forEach(([system, system_param]) => {
                valueInfo.forEach(([value, value_param]) => {
                    templates.push(
                        `Any entity classified using system that <ids-facet-dropdown target="system" defaultoption="${system}"></ids-facet-dropdown>{${system_param}} and a classification reference starting with that <ids-facet-dropdown target="value" defaultoption="${value}"></ids-facet-dropdown>{${value_param}}`
                    );
                });
            });
        } else if (this.type == 'requirement') {
            templates = []
            templates.push('The entity must be classified')
            systemInfo.forEach(([system, system_param]) => {
                templates.push(
                    `The entity classified using system that <ids-facet-dropdown target="system" defaultoption="${system}"></ids-facet-dropdown>{${system_param}}`
                );
            });

            systemInfo.forEach(([system, system_param]) => {
                valueInfo.forEach(([value, value_param]) => {
                    templates.push(
                        `The entity classified using system that <ids-facet-dropdown target="system" defaultoption="${system}"></ids-facet-dropdown>{${system_param}} and a classification reference starting with that <ids-facet-dropdown target="value" defaultoption="${value}"></ids-facet-dropdown>{${value_param}}`
                    );
                });
            });
        }

        let parameters = {};


        let systems = this.idsElement.getElementsByTagNameNS(ns, 'system');
        if (systems.length) {
            let systemValue = this.getIdsValue(systems[0]);
            this.processClassificationSystemNameValue(systemValue, parameters)
        }
        let values = this.idsElement.getElementsByTagNameNS(ns, 'value');
        this.processClassificationSystemValue(values, parameters);
        this.innerHTML = this.renderTemplate(templates, parameters);
    }

    loadProperty() {
        let templates;
        const psets = [
            ['type', 'psetName'],
            ['typeEnumeration', 'psetEnumeration'],
            ['matchesPattern', 'psetPattern'],
            ['bounds', 'psetBounds'],
            ['hasLength', 'psetLength']
        ];
        const names = [
            ['type', 'name'],
            ['typeEnumeration', 'nameTypeEnumeration'],
            ['matchesPattern', 'namePattern'],
            ['bounds', 'nameBounds'],
            ['hasLength', 'nameLength']
        ];

        const propertyValues = [
            ['type', 'value'],
            ['typeEnumeration', 'valueEnumeration'],
            ['matchesPattern', 'valuePattern'],
            ['bounds', 'valueBounds'],
            ['hasLength', 'valueLength']
        ];

        if (this.type == 'applicability') {
            templates = [];
            psets.forEach(([pset, pset_param]) => {
                names.forEach(([name, name_param]) => {
                    propertyValues.forEach(([value, value_param]) => {
                        // both absent
                        templates.push(
                            `Entities having property set that <ids-facet-dropdown target="pset" defaultoption="${pset}"></ids-facet-dropdown> {${pset_param}} and property Name that <ids-facet-dropdown target="baseName" defaultoption="${name}"></ids-facet-dropdown>{${name_param}}` + `
                            <span class="facet-control">
                            <ids-add-optional-type optional-types='["dataType","value"]'><i data-feather="plus"></i><ids-add-optional-type>
                            </span>
                            `,
                        );
                        // dataType Present Value not
                        templates.push(
                            `Entities having property set that <ids-facet-dropdown target="pset" defaultoption="${pset}"></ids-facet-dropdown> {${pset_param}} and property Name that <ids-facet-dropdown target="baseName" defaultoption="${name}"></ids-facet-dropdown>{${name_param}} and with the IFC data type {dataType}` + `
                            <span class="facet-control">
                            <ids-add-optional-type optional-types='["value"]'><i data-feather="plus"></i><ids-add-optional-type>
                            </span>
                            `,
                        );
                        //dataType not present value present
                        templates.push(
                            `Entities having property set that <ids-facet-dropdown target="pset" defaultoption="${pset}"></ids-facet-dropdown> {${pset_param}} and property Name that <ids-facet-dropdown target="baseName" defaultoption="${name}"></ids-facet-dropdown>{${name_param}} and property value that <ids-facet-dropdown target="value" defaultoption="${value}"></ids-facet-dropdown>{${value_param}}` + `
                            <span class="facet-control">
                            <ids-add-optional-type optional-types='["dataType"]'><i data-feather="plus"></i><ids-add-optional-type>
                            </span>
                            `,
                        );

                        templates.push(
                            `Entities having property set that <ids-facet-dropdown target="pset" defaultoption="${pset}"></ids-facet-dropdown> {${pset_param}} and property Name that <ids-facet-dropdown target="baseName" defaultoption="${name}"></ids-facet-dropdown>{${name_param}} and with the IFC data type {dataType} and property value that <ids-facet-dropdown target="value" defaultoption="${value}"></ids-facet-dropdown>{${value_param}}`
                        );
                    });
                });
            });

        } else if (this.type == 'requirement') {
            templates = [];
            psets.forEach(([pset, pset_param]) => {
                names.forEach(([name, name_param]) => {
                    propertyValues.forEach(([value, value_param]) => {
                        // both absent
                        templates.push(
                            `Entities having property set that <ids-facet-dropdown target="pset" defaultoption="${pset}"></ids-facet-dropdown> {${pset_param}} and property Name that <ids-facet-dropdown target="baseName" defaultoption="${name}"></ids-facet-dropdown>{${name_param}}`
                        );
                        // dataType Present Value not
                        templates.push(
                            `Entities having property set that <ids-facet-dropdown target="pset" defaultoption="${pset}"></ids-facet-dropdown> {${pset_param}} and property Name that <ids-facet-dropdown target="baseName" defaultoption="${name}"></ids-facet-dropdown>{${name_param}} and with the IFC data type {dataType}`
                        );
                        //dataType not present value present
                        templates.push(
                            `Entities having property set that <ids-facet-dropdown target="pset" defaultoption="${pset}"></ids-facet-dropdown> {${pset_param}} and property Name that <ids-facet-dropdown target="baseName" defaultoption="${name}"></ids-facet-dropdown>{${name_param}} and property value that <ids-facet-dropdown target="value" defaultoption="${value}"></ids-facet-dropdown>{${value_param}}`
                        );

                        templates.push(
                            `Entities having property set that <ids-facet-dropdown target="pset" defaultoption="${pset}"></ids-facet-dropdown> {${pset_param}} and property Name that <ids-facet-dropdown target="baseName" defaultoption="${name}"></ids-facet-dropdown>{${name_param}} and with the IFC data type {dataType} and property value that <ids-facet-dropdown target="value" defaultoption="${value}"></ids-facet-dropdown>{${value_param}}`
                        );
                    });
                });
            });
        }

        let parameters = {};

        this.parseBaseName(this.idsElement, parameters)

        let values = this.idsElement.getElementsByTagNameNS(ns, 'value');
        if (values.length) {
            let value = this.getIdsValue(values[0]);
            this.parseValue(value, parameters);
        }


        let propertySet = this.idsElement.getElementsByTagNameNS(ns, 'propertySet')[0];
        let value = this.getIdsValue(propertySet);
        this.parsePropertySet(value, parameters)

        let dataTypevalue = this.idsElement.attributes['dataType']
        if (dataTypevalue) {
            parameters.dataType = '<ids-param filter="dataType">' + dataTypevalue.value + '</ids-param>';
        }

        this.innerHTML = this.renderTemplate(templates, parameters);
    }

    loadMaterial() {
        let templates;
        if (this.type == 'applicability') {
            templates = [
                'All data with a material' + `
                <span class="facet-control">
                <ids-add-optional-type optional-types='["value"]'><i data-feather="plus"></i><ids-add-optional-type>
                </span>
                `,

                'Entities having Material that <ids-facet-dropdown target="value" defaultoption="type"></ids-facet-dropdown> {type} data',

                'Entities having Material that <ids-facet-dropdown target="value" defaultoption="typeEnumeration"></ids-facet-dropdown> either {typeEnumeration}',

                'Entities having Material that <ids-facet-dropdown target="value" defaultoption="matchesPattern"></ids-facet-dropdown> {pattern}',

                'Entities having Material that <ids-facet-dropdown target="value" defaultoption="bounds"></ids-facet-dropdown>  {bounds}',

                'Entities having Material that <ids-facet-dropdown target="value" defaultoption="length"></ids-facet-dropdown>  {length}',

            ];
        } else if (this.type == 'requirement') {
            templates = [
                'Shall have a material' + `
                <span class="facet-control">
                <ids-add-optional-type optional-types='["value"]'><i data-feather="plus"></i><ids-add-optional-type>
                </span>
                `,

                'Entities having Material that <ids-facet-dropdown target="value"></ids-facet-dropdown> {type} data',

                'Entities having Material that <ids-facet-dropdown target="value" defaultoption="typeEnumeration"></ids-facet-dropdown> either {typeEnumeration}',

                'Entities having Material that <ids-facet-dropdown target="value" defaultoption="matchesPattern"></ids-facet-dropdown> {pattern}',

                'Entities having Material that <ids-facet-dropdown target="value" defaultoption="bounds"></ids-facet-dropdown>  {bounds}',

                'Entities having Material that <ids-facet-dropdown target="value" defaultoption="length"></ids-facet-dropdown>  {length}',

            ];
        }

        let parameters = {};

        let values = this.idsElement.getElementsByTagNameNS(ns, 'value');
        this.processMaterialValue(values, parameters);

        this.innerHTML = this.renderTemplate(templates, parameters);
    }

    loadPartOf() {
        let templates;
        //TODO : Modernise all templates
        const relations = [
            ['IFCRELAGGREGATES', 'relationIFCRELAGGREGATES'],
            ['IFCRELASSIGNSTOGROUP', 'relationIFCRELASSIGNSTOGROUP'],
            ['IFCRELCONTAINEDINSPATIALSTRUCTURE', 'relationIFCRELCONTAINEDINSPATIALSTRUCTURE'],
            ['IFCRELNESTS', 'relationIFCRELNESTS'],
            ['IFCRELVOIDSELEMENT', 'relationIFCRELVOIDSELEMENT'],
            ['IFCRELFILLSELEMENT', 'relationIFCRELFILLSELEMENT'],
            ['none', 'relationNone']
        ];

        const names = [
            ['type', 'name'],
            ['typeEnumeration', 'nameTypeEnumeration'],
            ['matchesPattern', 'namePattern'],
            ['bounds', 'nameBounds'],
            ['hasLength', 'nameLength']
        ];

        const predefinedTypes = [
            ['type', 'type'],
            ['typeEnumeration', 'typeEnumeration'],
            ['matchesPattern', 'pattern'],
            ['bounds', 'bounds'],
            ['hasLength', 'length']
        ];
        if (this.type == 'applicability') {
            templates = []
            relations.forEach(([relation, relation_param]) => {
                names.forEach(([name, name_param]) => {
                    templates.push(
                        `Any entity that is <ids-facet-dropdown target="relation" defaultoption="${relation}" relation="{${relation_param}}"></ids-facet-dropdown> a <ids-facet-dropdown target="name" defaultoption="${name}"></ids-facet-dropdown>{${name_param}}` + `
                        <span class="facet-control">
                        <ids-add-optional-type optional-types='["predefinedType"]'><i data-feather="plus"></i><ids-add-optional-type>
                        </span>
                        `
                    );
                });
            });

            relations.forEach(([relation, relation_param]) => {
                names.forEach(([name, name_param]) => {
                    predefinedTypes.forEach(([predefinedType, predefinedType_param]) => {
                        templates.push(
                            `Any entity that is <ids-facet-dropdown target="relation" defaultoption="${relation}" relation="{${relation_param}}"></ids-facet-dropdown>a <ids-facet-dropdown target="name" defaultoption="${name}"></ids-facet-dropdown>{${name_param}} and predefined type <ids-facet-dropdown target="predefinedType" defaultoption="${predefinedType}"></ids-facet-dropdown>{${predefinedType_param}}`
                        );
                    });
                });
            });

        } else if (this.type == 'requirement') {
            templates = [];
            relations.forEach(([relation, relation_param]) => {
                names.forEach(([name, name_param]) => {
                    templates.push(
                        `The entity that is <ids-facet-dropdown target="relation" defaultoption="${relation}" relation="{${relation_param}}"></ids-facet-dropdown> a <ids-facet-dropdown target="name" defaultoption="${name}"></ids-facet-dropdown>{${name_param}}` + `
                        <span class="facet-control">
                        <ids-add-optional-type optional-types='["predefinedType"]'><i data-feather="plus"></i><ids-add-optional-type>
                        </span>
                        `
                    );
                });
            });

            relations.forEach(([relation, relation_param]) => {
                names.forEach(([name, name_param]) => {
                    predefinedTypes.forEach(([predefinedType, predefinedType_param]) => {
                        templates.push(
                            `The entity that is <ids-facet-dropdown target="relation" defaultoption="${relation}" relation="{${relation_param}}"></ids-facet-dropdown> a <ids-facet-dropdown target="name" defaultoption="${name}"></ids-facet-dropdown>{${name_param}} and predefined type <ids-facet-dropdown target="predefinedType" defaultoption="${predefinedType}"></ids-facet-dropdown>{${predefinedType_param}}`
                        );
                    });
                });
            });

        }

        let parameters = {};
        this.parseRelation(this.idsElement, parameters)
        this.parseEntityName(this.idsElement, parameters);

        this.innerHTML = this.renderTemplate(templates, parameters);
    }

    getIdsValue(element) {
        let simpleValues = element.getElementsByTagNameNS(ns, 'simpleValue');
        if (simpleValues.length) {
            return { type: 'simpleValue', param: simpleValues[0], content: simpleValues[0].textContent }
        }
        let restriction = element.getElementsByTagNameNS(xs, 'restriction')[0];
        let length = restriction.getElementsByTagNameNS(xs, 'length');
        if (length.length) {
            return { type: 'length', param: length[0], content: length[0].attributes['value'].value }
        }
        let patterns = restriction.getElementsByTagNameNS(xs, 'pattern');
        if (patterns.length) {
            return { type: 'pattern', param: patterns[0], content: patterns[0].attributes['value'].value }
        }
        let enumerations = restriction.getElementsByTagNameNS(xs, 'enumeration');
        if (enumerations.length) {
            let values = [];
            for (let i = 0; i < enumerations.length; i++) {
                values.push(enumerations[i].attributes['value'].value);
            }
            return { type: 'enumeration', param: restriction, content: values.join(' or ') }
        }

        // TODO: getIdsValue : doesnt take the length restriction into account 

        let minInclusive = restriction.getElementsByTagNameNS(xs, 'minInclusive');
        let maxInclusive = restriction.getElementsByTagNameNS(xs, 'maxInclusive');
        let minExclusive = restriction.getElementsByTagNameNS(xs, 'minExclusive');
        let maxExclusive = restriction.getElementsByTagNameNS(xs, 'maxExclusive');

        let params = {
            minInclusive: undefined,
            maxInclusive: undefined,
            minExclusive: undefined,
            maxExclusive: undefined,
        };


        // Handle all combinations of bounds
        if (minInclusive.length > 0) {
            params.minInclusive = minInclusive[0].attributes['value'].value;
        }

        if (maxInclusive.length > 0) {
            params.maxInclusive = maxInclusive[0].attributes['value'].value;
        }

        if (minExclusive.length > 0) {
            params.minExclusive = minExclusive[0].attributes['value'].value;
        }

        if (maxExclusive.length > 0) {
            params.maxExclusive = maxExclusive[0].attributes['value'].value;
        }

        if (params.minInclusive || params.maxInclusive || params.minExclusive || params.maxExclusive) {
            return {
                type: 'bounds',
                param: params,
            };
        }

    }

    capitalise(text) {
        return text.toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
    }

    sentence(text) {
        // E.g. ElevationOfSSLRelative --> Elevation Of S S L Relative
        let words = text.match(/([A-Z]?[^A-Z]*)/g).slice(0, -1);
        let mergedWords = [];
        let mergedWord = '';
        for (let i = 0; i < words.length; i++) {
            if (words[i].length == 1) {
                mergedWord += words[i];
                if (i == words.length - 1) {
                    mergedWords.push(mergedWord);
                }
            } else {
                if (mergedWord.length) {
                    mergedWords.push(mergedWord);
                    mergedWord = '';
                }
                mergedWords.push(words[i]);
            }
        }
        // E.g. Elevation Of S S L Relative --> Elevation Of SSL Relative
        return mergedWords.join(' ');
    }
}

class IDSParam extends HTMLElement {
    connectedCallback() {
        this.contentEditable = true;
        this.addEventListener('input', this.input.bind(this));
        this.filter = this.attributes['filter'] ? this.attributes['filter'].value : null;
    }

    load(idsElement) {
        this.idsElement = idsElement;
    }

    input(e) {
        // Log the current input value before any transformations

        if (this.filter == 'entityName') {
            this.idsElement.textContent = 'IFC' + this.textContent.toUpperCase();
        } else if (this.filter == 'attributeName' || this.filter == 'propertyName') {
            this.idsElement.textContent = this.textContent.replace(/\s+/g, '');
        } else if (this.filter == 'length') {
            this.idsElement.setAttribute('value', this.textContent);
        }
        else if (this.filter == 'pattern') {
            this.idsElement.setAttribute('value', this.textContent);
            console.log(this.idsElement)
        }
        else if (this.filter == 'bounds') {
            console.log('bounds', this.idsElement)
        }
        else if (this.filter == "dataType") {
            console.log('dateType', this.idsElement.parentElement.parentElement)
            if (this.textContent == "none" || this.textContent == "None") {
                console.log('dateType none', this.idsElement.parentElement.parentElement)
                this.idsElement.parentElement.parentElement.removeAttribute('dataType')
                const specs = this.closest('ids-specs')
                specs.render()

            } else {
                this.idsElement.parentElement.parentElement.setAttribute('dataType', this.textContent)
            }
        }
        else {
            console.log(this.idsElement)
            this.idsElement.textContent = this.textContent;
        }

        // Log the final value after the transformation is applied
    }
}


class IDSSpecs extends HTMLElement {
    load(idsElement) {
        let self = this;
        this.idsElement = idsElement;
        this.idsElement.addEventListener('ids-spec-remove', function () { self.render(); });
        this.idsElement.addEventListener('ids-spec-add', function () {
            self.render();
        });
        this.idsElement.addEventListener('ids-spec-move', function () {
            self.render();
        });
        this.render();
    }

    render() {
        let template = this.getElementsByTagName('template')[0];
        let children = [];
        if (children.length == 1) {
            console.log("only template here")
        }
        for (let i = 0; i < this.children.length; i++) {
            if (this.children[i] != template) {
                children.push(this.children[i]);
            }
        }

        for (let i = 0; i < children.length; i++) {
            this.removeChild(children[i]);
        }

        let idsSpecs = this.idsElement.getElementsByTagNameNS(ns, 'specification');
        for (let i = 0; i < idsSpecs.length; i++) {
            this.appendChild(template.content.cloneNode(true));
            let spec = this.children[this.children.length - 1];
            spec.load(idsSpecs[i]);
        }
        feather.replace();
    }

    showResults(specifications) {
        let specElements = this.getElementsByTagName('ids-spec');
        for (let i = 0; i < specElements.length; i++) {
            specElements[i].showResults(specifications[i]);
        }
    }
}

class IDSSpec extends HTMLElement {
    connectedCallback() {
        this.addEventListener('dragenter', this.dragenter);
        this.addEventListener('dragover', this.dragover);
        this.addEventListener('drop', this.drop);
        this.setAttribute("draggable", "true");
    }

    dragenter(e) {
        if (e.target.classList.contains('dropzone')) {
            let dropzones = document.getElementsByTagName('ids-spec');
            for (let i = 0; i < dropzones.length; i++) {
                dropzones[i].classList.remove('dragover');
            }
            e.target.classList.add('dragover');
        }
    }

    dragover(e) {
        // The HTML draggable API is terrible.
        e.preventDefault();
    }

    drop(e) {
        let targetElement = this;
        let draggedElement = document.getElementsByClassName('dragging')[0];
        let targetSpecsElement = this.closest('ids-specs')
        let draggedSpecsElement = draggedElement.closest('ids-specs')
        if (targetSpecsElement === draggedSpecsElement) {
            if (draggedElement && targetElement && draggedElement !== targetElement && targetSpecsElement && targetSpecsElement.idsElement) {
                let specifications = targetSpecsElement.idsElement.getElementsByTagNameNS(ns, 'specification');
                let draggedIndex = Array.from(specifications).indexOf(draggedElement.idsElement);
                let targetIndex = Array.from(specifications).indexOf(targetElement.idsElement);

                if (draggedIndex > -1 && targetIndex > -1) {
                    // Swap the elements in the idsElement
                    let temp = specifications[draggedIndex];
                    targetSpecsElement.idsElement.insertBefore(temp, specifications[targetIndex]);
                    targetSpecsElement.idsElement.insertBefore(specifications[targetIndex], specifications[draggedIndex]);
                    targetSpecsElement.render();
                }
            }
        }
        else {
            targetSpecsElement.idsElement.insertBefore(draggedElement.idsElement, targetElement.idsElement);
            targetSpecsElement.render();
            draggedSpecsElement.render();
        }

        this.idsElement.parentElement.dispatchEvent(new Event('ids-spec-move', { bubbles: true }));
    }

    load(idsElement) {
        let self = this;
        this.idsElement = idsElement;
        let children = this.getElementsByTagName('ids-spec-attribute');
        for (let i = 0; i < children.length; i++) {
            children[i].load(idsElement);
        }

        children = this.getElementsByTagName('ids-facets');
        for (let i = 0; i < children.length; i++) {
            let nameAttr = children[i].attributes['name'].value;
            let facetElement = idsElement.getElementsByTagNameNS(ns, nameAttr)[0];
            children[i].load(facetElement);
        }


        children = this.getElementsByTagName('ids-spec-move');
        if (children.length > 0) {
            for (let i = 0; i < children.length; i++) {
                children[i].load(idsElement);
            }
        }
    }

    showResults(specification) {
        let facetsElements = this.getElementsByTagName('ids-facets');
        for (let i = 0; i < facetsElements.length; i++) {
            if (facetsElements[i].attributes['name'].value == "requirements") {
                facetsElements[i].showResults(specification.requirements);
            }
        }
    }
}

class IDSAlert extends HTMLElement {
    connectedCallback() {
        this.classList.add('hidden');
    }

    showAlert(message, type) {
        this.innerText = message;
        this.className = ''; // Reset classes
        this.classList.add(type); // Add either 'success' or 'error'
        setTimeout(() => {
            this.classList.add('hidden');
        }, 8000); // Hide after 8 seconds
    }
}


class IDSLibLoader extends HTMLElement {
    connectedCallback() {
        let self = this;
        this.addEventListener('click', this.launchFileBrowser);
    }

    launchFileBrowser(accept, callback) {
        let inputElement = document.createElement("input");
        inputElement.idsLibraryLoader = this;
        inputElement.type = "file";
        inputElement.accept = '.ids,.xml';
        inputElement.multiple = false;
        inputElement.addEventListener("change", this.loadFile)
        inputElement.dispatchEvent(new MouseEvent("click"));
    }

    async loadFile(e) {
        let self = this.idsLibraryLoader
        let container = self.closest('ids-container');
        let alertElement = container.querySelector('ids-alert');
        let filename = this.files[0].name;
        container.filename = this.files[0].name;
        let file = this.files[0]
        console.log(file)
        let formData = new FormData();
        formData.append('ids_file', file);
        try {
            let response = await fetch('http://127.0.0.1:8000/api/ids/loadIds', {
                method: 'POST',
                body: formData
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            let result = await response.json();
            if (result.is_valid) {
                let parser = new DOMParser();
                let xml = parser.parseFromString(result.xml, "text/xml")
                let container = self.closest('ids-container')
                container.ids = xml;
                container.idsElement = xml;
                window.xxx = xml; // TODO
                alertElement.showAlert('Upload successful', 'success');
                self.loadSpecs(container);

            }
            else {
                // XML Schmeais not Valid 
                throw new Error(`Ids is not Valid! XML Status: ${result.is_valid}`);
            }
        } catch (error) {
            alertElement.showAlert('Error: cannot upload ' + filename, 'error');
            console.error('Error:', error);
        }
    }

    loadSpecs(container) {
        let specsElements = container.getElementsByTagName('ids-specs');
        for (let i = 0; i < specsElements.length; i++) {
            let specs = specsElements[i];
            specs.load(container.ids.getElementsByTagNameNS(ns, 'specifications')[0]);
        }
    }
}

class IDSLoader extends HTMLElement {
    connectedCallback() {
        let self = this;
        this.addEventListener('click', this.launchFileBrowser);
    }

    launchFileBrowser(accept, callback) {
        let inputElement = document.createElement("input");
        inputElement.idsLoader = this;
        inputElement.type = "file";
        inputElement.accept = '.ids,.xml';
        inputElement.multiple = false;
        inputElement.addEventListener("change", this.loadFile)
        inputElement.dispatchEvent(new MouseEvent("click"));
    }

    async loadFile(e) {
        let self = this.idsLoader;
        let container = self.closest('ids-container')
        let alertElement = container.querySelector('ids-alert');
        let filename = this.files[0].name;
        container.filename = this.files[0].name;

        let idsFilename = container.querySelector('ids-filename')
        idsFilename.innerHTML = filename

        let file = this.files[0]
        let formData = new FormData();
        formData.append('ids_file', file);

        try {
            let response = await fetch('http://127.0.0.1:8000/api/ids/loadIds', {
                method: 'POST',
                body: formData
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            let result = await response.json();
            if (result.is_valid) {
                let parser = new DOMParser();
                let xml = parser.parseFromString(result.xml, "text/xml")
                let container = self.closest('ids-container')
                container.ids = xml;
                container.idsElement = xml;
                window.xxx = xml; // TODO
                self.loadSpecs(container);
                alertElement.showAlert('Upload successful', 'success');

            }
            else {
                // XML Schmeais not Valid 
                throw new Error(`Ids is not Valid! XML Status: ${result.is_valid}`);
            }
        } catch (error) {

            alertElement.showAlert('Error: cannot upload ' + filename, 'error');
            console.error('Error:', error);
        }

    }

    loadSpecs(container) {
        container.getElementsByTagName('ids-info')[0].load(container.ids.getElementsByTagNameNS(ns, 'info')[0]);
        let specsElements = container.getElementsByTagName('ids-specs');
        for (let i = 0; i < specsElements.length; i++) {
            let specs = specsElements[i];
            specs.load(container.ids.getElementsByTagNameNS(ns, 'specifications')[0]);
        }
    }
}

class IDSSave extends HTMLElement {
    connectedCallback() {
        this.addEventListener('click', this.click);
    }

    click() {
        let container = this.closest('ids-container')
        let xmlString = new XMLSerializer().serializeToString(container.ids);
        this.download(container.filename, xmlString);
    }

    download(filename, text) {
        let element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
}


class IDSAudit extends HTMLElement {
    connectedCallback() {
        this.addEventListener('click', this.launchFileBrowser.bind(this));
    }

    launchFileBrowser() {
        let inputElement = document.createElement("input");
        inputElement.idsAudit = this;
        inputElement.type = "file";
        inputElement.accept = '.ifc';
        inputElement.multiple = false;
        inputElement.addEventListener("change", this.loadFile.bind(this));
        inputElement.dispatchEvent(new MouseEvent("click"));
    }

    loadFile(event) {
        let self = this;
        let inputElement = event.target;
        let container = this.closest('ids-container');

        let request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState == 4) {
                self.processResponse(request);
            }
        };
        request.open("POST", "http://127.0.0.1:8000/api/ids/auditIds");

        let data = new FormData();
        data.append('ifc_file', inputElement.files[0]);
        data.append('ids_file', new Blob([new XMLSerializer().serializeToString(container.ids)], { type: 'application/xml' }));
        request.send(data);
    }

    processResponse(request) {
        if (request.readyState != 4) {
            return;
        }
        let container = this.closest('ids-container');
        container.isEditing = false;

        let results = JSON.parse(request.responseText);
        results = JSON.parse(results.content)
        let specsElements = container.getElementsByTagName('ids-specs');
        for (let i = 0; i < specsElements.length; i++) {
            let specs = specsElements[i];
            specs.showResults(results.specifications);
        }
    }
}

class IDSAddOptionalType extends HTMLElement {
    constructor() {
        super();
        this.optionalTypes = [];
        this.dropdownList = null;
    }

    static get observedAttributes() {
        return ['optional-types'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'optional-types' && newValue) {
            this.optionalTypes = JSON.parse(newValue);
            if (this.dropdownList) {
                this.updateDropdownList();
            }
        }
    }

    connectedCallback() {
        this.dropdownList = this.createDropdownList(this.optionalTypes);
        this.appendChild(this.dropdownList);
        this.addEventListener('mouseover', this.showDropdown.bind(this));
        this.addEventListener('mouseout', this.hideDropdown.bind(this));
        this.addEventListener('click', this.handleClick.bind(this));
    }

    createDropdownList(items) {
        const list = document.createElement('div');
        list.classList.add('optional-type-list');
        list.style.display = 'none';

        items.forEach(item => {
            const listItem = document.createElement('div');
            listItem.textContent = item;
            listItem.classList.add('optional-type-item');
            listItem.addEventListener('click', () => this.handleItemClick(item));
            list.appendChild(listItem);
        });

        return list;
    }

    updateDropdownList() {
        this.dropdownList.innerHTML = '';
        this.optionalTypes.forEach(item => {
            const listItem = document.createElement('div');
            listItem.textContent = item;
            listItem.classList.add('optional-type-item');
            listItem.addEventListener('click', () => this.handleItemClick(item));
            this.dropdownList.appendChild(listItem);
        });
    }

    showDropdown() {
        this.dropdownList.style.display = 'block';
    }

    hideDropdown() {
        this.dropdownList.style.display = 'none';
    }

    handleClick() {
        this.dropdownList.style.display = this.dropdownList.style.display === 'block' ? 'none' : 'block';
    }

    handleItemClick(value) {
        // Handle the item click event
        console.log('value', value)
        const container = this.closest('ids-container');
        const specs = this.closest('ids-specs');
        const facet = this.closest('ids-facet');
        let idsElement = facet.idsElement;
        let type = container.ids.createElementNS(ns, value);
        let simpleValue = container.ids.createElementNS(ns, 'simpleValue');
        simpleValue.textContent = "enter type";
        type.appendChild(simpleValue);
        if (value == "dataType") {
            idsElement.setAttribute('dataType', "Enter DataType")
        } else if (idsElement.tagName == 'partOf') {
            let entity = idsElement.getElementsByTagName('entity')[0]
            entity.appendChild(type)
        }
        else {
            idsElement.appendChild(type);
            facet.idsElement = idsElement;
        }

        specs.render();

        this.hideDropdown();
    }
}

window.customElements.define('ids-new', IDSNew);
window.customElements.define('ids-container', IDSContainer);
window.customElements.define('ids-alert', IDSAlert);
window.customElements.define('ids-loader', IDSLoader);
window.customElements.define('ids-lib-loader', IDSLibLoader);
window.customElements.define('ids-save', IDSSave);
window.customElements.define('ids-close', IDSClose);
window.customElements.define('ids-audit', IDSAudit);
window.customElements.define('ids-info', IDSInfo);
window.customElements.define('ids-info-element', IDSInfoElement);
window.customElements.define('ids-specs', IDSSpecs);
window.customElements.define('ids-spec', IDSSpec);
window.customElements.define('ids-spec-handle', IDSSpecHandle);
window.customElements.define('ids-spec-remove', IDSSpecRemove);
window.customElements.define('ids-spec-move', IDSSpecMove);
window.customElements.define('ids-spec-add', IDSSpecAdd);
window.customElements.define('ids-spec-attribute', IDSSpecAttribute);
window.customElements.define('ids-spec-counter', IDSSpecCounter);
window.customElements.define('ids-spec-anchor', IDSSpecAnchor);
window.customElements.define('ids-spec-target', IDSSpecTarget);
window.customElements.define('ids-facets', IDSFacets);
window.customElements.define('ids-facet', IDSFacet);
window.customElements.define('ids-facet-add', IDSFacetAdd);
window.customElements.define('ids-facet-remove', IDSFacetRemove);
window.customElements.define('ids-facet-instructions', IDSFacetInstructions);
window.customElements.define('ids-param', IDSParam);
window.customElements.define('ids-facet-dropdown', IDSFacetDropdown);
window.customElements.define('ids-facet-bounds-dropdown', IDSFacetBoundsDropdown);
window.customElements.define('ids-add-optional-type', IDSAddOptionalType);
