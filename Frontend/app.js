"use strict";

feather.replace() 

var ns = 'http://standards.buildingsmart.org/IDS';
var xs = 'http://www.w3.org/2001/XMLSchema';

class IDSNew extends HTMLElement {
    connectedCallback() {
        this.addEventListener('click', this.click);
    }

    click(e) {
        let ifcTester = this.closest('ifc-tester');
        let template = ifcTester.getElementsByTagName('template')[0];
        console.log(template);
        ifcTester.appendChild(template.content.cloneNode(true));
        feather.replace();
    }
}


class IDSClose extends HTMLElement {
    connectedCallback() {
        this.addEventListener('click', this.click);
    }

    click(e) {
        let container = this.closest('ids-container');
        container.parentElement.removeChild(container);
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
    load(idsInfoData) {
        this.idsInfoData = idsInfoData;
        let idsInfoElements = this.getElementsByTagName('ids-info-element');
        for(let i =0;i<idsInfoElements.length;i++){
            let name = idsInfoElements[i].attributes['name'].value;
            idsInfoElements[i].load(idsInfoData[name]);
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

    load(idsInfoFieldData) {
        this.idsInfoFieldData=idsInfoFieldData;
        if (idsInfoFieldData) {
            this.textContent = idsInfoFieldData;
        }
        this.idsInfoFieldData ? this.classList.remove('null') : this.classList.add('null');
        this.validate() ? this.classList.remove('error') : this.classList.add('error');
    }

    input(e) {
        if ( ! this.idsInfoFieldData && this.textContent) {
            this.add();
        }
        this.idsInfoFieldData  ? this.idsInfoFieldData = this.textContent : null;
        this.idsInfoFieldData  ? this.classList.remove('null') : this.classList.add('null');
        this.validate() ? this.classList.remove('error') : this.classList.add('error');
    }

    blur(e) {
        if (this.idsElement && ( ! this.textContent)) {
            this.remove();
        }
        if ( ! this.textContent) {
            this.textContent = this.defaultValue;
        }
        // this.idsElement ? this.classList.remove('null') : this.classList.add('null');
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

        // this.idsInfoFieldData= container.idsData
    
        // console.log(container.idsData.info[this.attributes["name"].value]);
        // this.idsInfoFieldData  = container.idsInfo[this.attributes["name"].value];
        // console.log( this.idsInfoFieldData )
        // this.idsElement.textContent = this.textContent;
        // this.idsParentElement.appendChild(this.idsElement);

        this.idsElement = container.ids.createElementNS(ns, this.attributes["name"].value);
        this.idsElement.textContent = this.textContent;
        this.idsParentElement.appendChild(this.idsElement);
    }
    }

    remove() {
        this.idsParentElement.removeChild(this.idsElement);
        this.idsInfoFieldData  = null;
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
        // contains the filename of the file uploaded 
        container.filename = this.files[0].name;

        
        let file = this.files[0];
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
            let transformedData = result.data;

            console.log("Api Response=>",transformedData)
            // place the content 
            let container = self.closest('ids-container')
            container.idsData = transformedData
            self.loadSpecs(container)
            
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // loadSpecs(container) {
    //     // Load IDS info
    //     const infoElements = container.getElementsByTagName('ids-info')[0].getElementsByTagName('ids-info-element');
    //     const infoData = container.ids.info;

    //     const dummyInfoData = {
    //         author: 'john@doe.com',
    //         copyright: 'Company Inc.',
    //         date: (new Date()).toISOString().split('T')[0],
    //         description: 'An example suite of OpenBIM requirements for data quality audits',
    //         milestone: 'Construction',
    //         purpose: 'Purpose', // TODO: add these fields in Template Code
    //         title: 'My information requirements',
    //         version: '1.0.0'
    //     };
    //     for (let element of infoElements) {
    //         const name = element.getAttribute('name');
    //         if (infoData[name] !== undefined && infoData[name] !== null) {
    //             element.innerText = infoData[name];
    //         } else {
    //             element.innerText = dummyInfoData[name]; 
    //             element.classList.add('null');
    //         }
    //     }
    //     //Load Ids Specs
    //     let specsElements= container.getElementsByTagName('ids-specs');
    //     console.log("IdsSpecs",specsElements)
    // }

    loadSpecs(container) {
        container.getElementsByTagName('ids-info')[0].load(container.idsData.info);
    }
}



window.customElements.define('ids-new', IDSNew);
window.customElements.define('ids-close', IDSClose);
window.customElements.define('ids-container', IDSContainer);
window.customElements.define('ids-loader', IDSLoader);
window.customElements.define('ids-info', IDSInfo);
window.customElements.define('ids-info-element', IDSInfoElement);