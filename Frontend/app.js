"use strict";

feather.replace()

var ns = 'http://standards.buildingsmart.org/IDS';
var xs = 'http://www.w3.org/2001/XMLSchema';

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
        }else{
            let alertElement = document.querySelector('ids-alert');
            alertElement.showAlert('Error: New Spec not allowed,' + 'already a ids spec present kindly close it.', 'error');
        }
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
        var container = this.closest('ids-container');
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
        let specs = this.closest('ids-specs');
        let spec = this.closest('ids-spec');
        specs.idsElement.removeChild(spec.idsElement);
        specs.idsElement.dispatchEvent(new Event('ids-spec-remove'));
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
            var nextNextSibling = this.idsElement.nextElementSibling.nextElementSibling;
            this.idsElement.parentElement.insertBefore(this.idsElement, nextNextSibling);
        }
        this.idsElement.parentElement.dispatchEvent(new Event('ids-spec-move'));
    }
}

class IDSSpecAdd extends HTMLElement {
    connectedCallback() {
        this.addEventListener('click', this.click);
    }

    click(e) {
        let specs = this.closest('ids-specs');
        let spec = this.closest('ids-spec');

        let container = this.closest('ids-container');
        let newSpec = container.ids.createElementNS(ns, "specification");
        let newApplicability = container.ids.createElementNS(ns, "applicability");
        let newRequirements = container.ids.createElementNS(ns, "requirements");
        

        specs.idsElement.insertBefore(newSpec, spec.idsElement.nextElementSibling);
        newSpec.appendChild(newApplicability);
        newSpec.appendChild(newRequirements);
        specs.idsElement.dispatchEvent(new Event('ids-spec-add'));
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
        this.contentEditable = true;
        this.defaultValue = this.textContent;
        this.addEventListener('input', this.input);
        this.addEventListener('blur', this.blur);
    }

    load(idsElement) {
        this.idsElement = idsElement;
        this.idsAttribute = this.idsElement.attributes['instructions']
        if (this.idsAttribute) {
            this.textContent = this.idsAttribute.value;
        }
        this.idsAttribute ? this.classList.remove('null') : this.classList.add('null');
    }

    input(e) {
        if (!this.idsAttribute && this.textContent) {
            this.add();
        }
        this.idsAttribute ? this.idsAttribute.value = this.textContent : null;
        this.idsAttribute ? this.classList.remove('null') : this.classList.add('null');
    }

    blur(e) {
        if (this.idsAttribute && !this.textContent) {
            this.remove();
        }
        if (!this.textContent) {
            this.textContent = this.defaultValue;
        }
        this.idsAttribute ? this.classList.remove('null') : this.classList.add('null');
    }

    add() {
        this.idsElement.setAttribute('instructions', this.textContent);
        this.idsAttribute = this.idsElement.attributes['instructions'];
    }

    remove() {
        this.idsElement.attributes.removeNamedItem('instructions');
        this.idsAttribute = null;
    }
}

class IDSFacetRemove extends HTMLElement {
    connectedCallback() {
        this.addEventListener('click', this.click);
    }

    click(e) {
        var idsElement = this.closest('div').getElementsByTagName('ids-facet')[0].idsElement;
        var parentElement = idsElement.parentElement;
        parentElement.removeChild(idsElement);
        parentElement.dispatchEvent(new Event('ids-facet-remove'));
    }
}


class IDSFacetAdd extends HTMLElement {
    constructor() {
        super();
        this.selectedFacet = null; // To store the selected facet type
        this.list = this.createList(); // Create the list on initialization
    }

    connectedCallback() {
        this.addEventListener('mouseover', this.showList.bind(this));
        this.addEventListener('mouseout', this.hideList.bind(this));
        this.addEventListener('click', this.click.bind(this));
        this.appendChild(this.list); // Append the list to the element
    }

    createList() {
        let list = document.createElement('div');
        list.classList.add('facet-list'); // Add a class for styling
        let facets = ['Entity Facet', 'Attribute Facet', 'Classification Facet','Property Facet','Material Facet','Part Of Facet']; // List of facet types

        facets.forEach(facet => {
            let item = document.createElement('div');
            item.textContent = facet;
            item.classList.add('facet-item'); 
            item.addEventListener('click', () => {
                this.selectedFacet = facet;
                this.hideList(); 
            });
            list.appendChild(item);
        });

        list.style.display = 'none'; 

        return list;
    }

    showList() {
        this.list.style.display = 'block'; // Show the list
    }

    hideList() {
        this.list.style.display = 'none'; // Hide the list
    }

    click(e) {
        if (this.selectedFacet) {
            let facet;
            if(this.selectedFacet == 'Entity Facet'){
                console.log('Entity Facet')
                facet = this.createEntityFacet();
            } else if (this.selectedFacet == 'Attribute Facet') {
                console.log('Attribute Facet')
            }else if(this.selectedFacet == 'Classification Facet'){
                console.log('Classification Facet')
            }else if(this.selectedFacet == 'Property Facet'){
                console.log('Property Facet')
            }else if(this.selectedFacet == 'Material Facet'){
                console.log('Material Facet')
            }else if(this.selectedFacet == 'Part Of Facet'){
                console.log('Part Of Facet')
            }

            // renders the whole specs.idsElement
            //TODO : render the component instead of specs
            // specs.render();
        }
    }

    createEntityFacet(){
            // logic for Entity Facet Goes here
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

        var paramElements = this.getElementsByTagName('ids-param');
        for (var i = 0; i < paramElements.length; i++) {
            paramElements[i].load(this.params[i]);
        }
    }

    showResults(requirement) {
        var idsResultElements = this.parentElement.getElementsByTagName('ids-result');
        for (var i = 0; i < idsResultElements.length; i++) {
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
        for (let i = 0; i < templates.length; i++) {
            let hasKeys = true;
            for (let key in parameters) {
                if (templates[i].indexOf('{' + key + '}') == -1) {
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

    loadEntity() {
        let templates;
        if (this.type == 'applicability') {
            templates = [
                'All {name} data',
                'All {name} data of type {type}',
                'All {name} data having a type of either {typeEnumeration}',
            ];
        } else if (this.type == 'requirement') {
            templates = [
                'Shall be {name} data',
                'Shall be {name} data of type {type}',
                'Shall be {name} data with a type of either {typeEnumeration}',
            ];
        }

        let parameters = {};
        this.parseEntityName(this.idsElement, parameters);
        this.innerHTML = this.renderTemplate(templates, parameters);
    }

    parseEntityName(idsElement, parameters) {
        var name = this.idsElement.getElementsByTagNameNS(ns, 'name')[0];
        var value = this.getIdsValue(name);
        if (value.type == 'simpleValue' || value.type == 'enumeration') {
            var content = this.capitalise(value.content.toLowerCase().replaceAll('ifc', ''))
            parameters.name = '<ids-param filter="entityName">' + content + '</ids-param>';
            this.params.push(value.param);
        }
        var predefinedTypes = this.idsElement.getElementsByTagNameNS(ns, 'predefinedType');
        if (predefinedTypes.length) {
            value = this.getIdsValue(predefinedTypes[0]);
            if (value.type == 'simpleValue') {
                parameters.type = '<ids-param>' + value.content + '</ids-param>';
                this.params.push(value.param);
            } else if (value.type == 'enumeration') {
                parameters.typeEnumeration = '<ids-param>' + value.content + '</ids-param>';
                this.params.push(value.param);
            }
        }

    }

    loadAttribute() {
        if (this.type == 'applicability') {
            var templates = [
                'Data where the {name} is provided',
                'Data where the {name} is {value}',
                'Data where the {name} follows the convention of {valuePattern}',
                'Data where the {name} is either {valueEnumeration}',
            ];
        } else if (this.type == 'requirement') {
            var templates = [
                'The {name} shall be provided',
                'The {name} shall be {value}',
                'The {name} shall follow the convention of {valuePattern}',
                'The {name} shall be either {valueEnumeration}'
            ];
        }

        var parameters = {};

        var name = this.idsElement.getElementsByTagNameNS(ns, 'name')[0];
        var value = this.getIdsValue(name);
        if (value.type == 'simpleValue') {
            parameters.name = '<ids-param filter="attributeName">' + this.sentence(value.content) + '</ids-param>';
            this.params.push(value.param);
        }
        var values = this.idsElement.getElementsByTagNameNS(ns, 'value');
        if (values.length) {
            value = this.getIdsValue(values[0]);
            if (value.type == 'simpleValue') {
                parameters.value = '<ids-param>' + value.content + '</ids-param>';
                this.params.push(value.param);
            } else if (value.type == 'pattern') {
                parameters.valuePattern = '<ids-param class="pattern">' + value.content + '</ids-param>';
                this.params.push(value.param);
            } else if (value.type == 'enumeration') {
                parameters.valueEnumeration = '<ids-param>' + value.content + '</ids-param>';
                this.params.push(value.param);
            }
        }

        this.innerHTML = this.renderTemplate(templates, parameters);
    }

    loadClassification() {
        if (this.type == 'applicability') {
            var templates = [
                'Data classified using {system}',
                'Data classified as {reference}',
                'Data classified following the convention of {referencePattern}',
                'Data having a {system} reference of {reference}',
                'Data having a {system} reference following the convention of {referencePattern}',
            ];
        } else if (this.type == 'requirement') {
            var templates = [
                'Shall be classified using {system}',
                'Shall be classified as {reference}',
                'Shall be classified following the convention of {referencePattern}',
                'Shall have a {system} reference of {reference}',
                'Shall have a {system} reference following the convention of {referencePattern}',
            ];
        }

        var parameters = {};

        var value;
        var systems = this.idsElement.getElementsByTagNameNS(ns, 'system');
        if (systems.length) {
            value = this.getIdsValue(systems[0]);
            if (value.type == 'simpleValue') {
                parameters.system = '<ids-param>' + value.content + '</ids-param>';
                this.params.push(value.param);
            }
        }
        var references = this.idsElement.getElementsByTagNameNS(ns, 'value');
        if (references.length) {
            value = this.getIdsValue(references[0]);
            if (value.type == 'simpleValue') {
                parameters.reference = '<ids-param>' + value.content + '</ids-param>';
                this.params.push(value.param);
            } else if (value.type == 'pattern') {
                parameters.referencePattern = '<ids-param class="pattern">' + value.content + '</ids-param>';
                this.params.push(value.param);
            }
        }

        this.innerHTML = this.renderTemplate(templates, parameters);
    }

    loadProperty() {
        let templates;
        if (this.type == 'applicability') {
            templates = [
                'Elements with {name} data in the dataset {pset}',
                'Elements with {name} data of {value} in the dataset {pset}',
                'Elements with {name} data following the convention of {valuePattern} in the dataset {pset}',
                'Elements with {name} data with either {valueEnumeration} in the dataset {pset}',
                '{name} data shall be {valueBounds} in the dataset {pset}'
            ];
        } else if (this.type == 'requirement') {
            templates = [
                '{name} data shall be provided in the dataset {pset}',
                '{name} data shall be {value} and in the dataset {pset}',
                '{name} data shall follow the convention of {valuePattern} and in the dataset {pset}',
                '{name} data shall be one of {valueEnumeration} and in the dataset {pset}',
                '{name} data shall be {valueBounds} in the dataset {pset}'
            ];
        }

        let parameters = {};
        let name = this.idsElement.getElementsByTagNameNS(ns, 'baseName')[0];
        let value = this.getIdsValue(name);
        if (value.type == 'simpleValue') {
            parameters.name = '<ids-param filter="propertyName">' + this.sentence(value.content) + '</ids-param>';
            this.params.push(value.param);
        }

        let values = this.idsElement.getElementsByTagNameNS(ns, 'value');
        if (values.length) {
            value = this.getIdsValue(values[0]);
            if (value.type == 'simpleValue') {
                parameters.value = '<ids-param>' + value.content + '</ids-param>';
                this.params.push(value.param);
            } else if (value.type == 'pattern') {
                parameters.valuePattern = '<ids-param class="pattern">' + value.content + '</ids-param>';
                this.params.push(value.param);
            } else if (value.type == 'enumeration') {
                parameters.valueEnumeration = '<ids-param>' + value.content + '</ids-param>';
                this.params.push(value.param);
            } else if(value.type == 'bounds'){
                parameters.valueBounds = '<ids-param>' + value.content + '</ids-param>';
            } else if(value.type == 'length'){
                parameters.valueLength = '<ids-param>' + value.content + '</ids-param>'; 
            }
        }

        let propertySet = this.idsElement.getElementsByTagNameNS(ns, 'propertySet')[0];
        value = this.getIdsValue(propertySet);
        if (value.type == 'simpleValue') {
            parameters.pset = '<ids-param>' + value.content + '</ids-param>';
            this.params.push(value.param);
        }

        this.innerHTML = this.renderTemplate(templates, parameters);
    }

    loadMaterial() {
        if (this.type == 'applicability') {
            var templates = [
                'All data with a {value} material',
                'All data with a material of either {valueEnumeration}',
                'All data with a material',
            ];
        } else if (this.type == 'requirement') {
            var templates = [
                'Shall shall have a material of {value}',
                'Shall have a material of either {valueEnumeration}',
                'Shall have a material',
            ];
        }

        var parameters = {};

        var value;
        var values = this.idsElement.getElementsByTagNameNS(ns, 'value');
        if (values.length) {
            value = this.getIdsValue(values[0]);
            if (value.type == 'simpleValue') {
                parameters.value = '<ids-param>' + value.content + '</ids-param>';
                this.params.push(value.param);
            } else if (value.type == 'pattern') {
                parameters.valuePattern = '<ids-param class="pattern">' + value.content + '</ids-param>';
                this.params.push(value.param);
            } else if (value.type == 'enumeration') {
                parameters.valueEnumeration = '<ids-param>' + value.content + '</ids-param>';
                this.params.push(value.param);
            }
        }


        this.innerHTML = this.renderTemplate(templates, parameters);
    }

    loadPartOf() {
        var templates = [
            'Must be part of a {relation} relationship',
            'Must be part of a {name} with a {relation} relationship',
            'Must be part of a {name} of type {type} with a {relation} relationship',
        ]

        var parameters = {};

        document.asdf = this.idsElement;
        parameters.relation = '<ids-param>' + this.sentence(this.idsElement.attributes['relation'].value.replace('Ifc', '').replace('Rel', '')) + '</ids-param>';
        this.parseEntityName(this.idsElement, parameters);

        this.innerHTML = this.renderTemplate(templates, parameters);
    }

    getIdsValue(element) {
        let simpleValues = element.getElementsByTagNameNS(ns, 'simpleValue');
        if (simpleValues.length) {
            return { type: 'simpleValue', param: simpleValues[0], content: simpleValues[0].textContent }
        }
        let restriction = element.getElementsByTagNameNS(xs, 'restriction')[0];
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
       let minExclusive = restriction.getElementsByTagNameNS(xs, 'minExclusive');
       let maxExclusive = restriction.getElementsByTagNameNS(xs, 'maxExclusive');
       let minInclusive = restriction.getElementsByTagNameNS(xs, 'maxInclusive');
       let maxInclusive = restriction.getElementsByTagNameNS(xs, 'maxInlcusive');

        if(minExclusive.length || maxExclusive.length){
            // exclusive bounds are set 
            let values = "";
            if(minExclusive.length && maxExclusive.length){
                values = "greater than " + minExclusive[0].attributes['value'].value + " and less than " + maxExclusive[0].attributes['value'].value;
            } else if(minExclusive.length){
                values = "greater than " + minExclusive[0].attributes['value'].value;
            } else if(maxExclusive.length){
                values = "less than " + maxExclusive[0].attributes['value'].value;
            }
            return {
                type: 'bounds', 
                params: { minExclusive: minExclusive[0], maxExclusive: maxExclusive[0] }, 
                content: values
            };
        }
        else if(minInclusive.length || maxInclusive.length){
            // inclusive bounds are set 
            let values = "";
            if(minInclusive.length && maxInclusive.length){
                values = "greater than or equal to " + minInclusive[0].attributes['value'].value + " and less than or equal to " + maxInclusive[0].attributes['value'].value;
            } else if(minInclusive.length){
                values = "greater than or equal to " + minInclusive[0].attributes['value'].value;
            } else if(maxInclusive.length){
                values = "less than or equal to " + maxInclusive[0].attributes['value'].value;
            }
            return {
                type: 'bounds', 
                params: { minInclusive: minInclusive[0], maxInclusive: maxInclusive[0] }, 
                content: values
            };
        }
        
    }

    capitalise(text) {
        return text.toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
    }

    sentence(text) {
        // E.g. ElevationOfSSLRelative --> Elevation Of S S L Relative
        var words = text.match(/([A-Z]?[^A-Z]*)/g).slice(0, -1);
        var mergedWords = [];
        var mergedWord = '';
        for (var i = 0; i < words.length; i++) {
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
        this.addEventListener('input', this.input);
        this.filter = this.attributes['filter'] ? this.attributes['filter'].value : null;
    }

    load(idsElement) {
        this.idsElement = idsElement;
    }

    input(e) {
        if (this.filter == 'entityName') {
            this.idsElement.textContent = 'IFC' + this.textContent.toUpperCase();
        } else if (this.filter == 'attributeName' || this.filter == 'propertyName') {
            this.idsElement.textContent = this.textContent.replace(/\s+/g, '');
        } else {
            this.idsElement.textContent = this.textContent;
        }
    }
}

class IDSSpecs extends HTMLElement {
    load(idsElement) {
        let self = this;
        this.idsElement = idsElement;
        this.idsElement.addEventListener('ids-spec-remove', function () { self.render(); });
        this.idsElement.addEventListener('ids-spec-add', function () { self.render(); });
        this.idsElement.addEventListener('ids-spec-move', function () { self.render(); });
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
            children[i].load(idsElement.getElementsByTagNameNS(ns, children[i].attributes['name'].value)[0]);
        }

        children = this.getElementsByTagName('ids-spec-move');
        for (let i = 0; i < children.length; i++) {
            children[i].load(idsElement);
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