import { LightningElement, track, api } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import reduxResourceURL from '@salesforce/resourceUrl/redux';
import lodashResourceURL from '@salesforce/resourceUrl/lodash';


export default class Provider extends LightningElement {
    @track resourceLoaded = false;

    @api storeName = 'redux';
    @api reducer;

    connectedCallback() {
        Promise.all([
            loadScript(this, reduxResourceURL),
            loadScript(this, lodashResourceURL),
        ])
            .then(() => {
                const { storeName } = this;
                const { createStore } = window.Redux;
                const store = createStore(this.reducer, ['Use Redux']);

                if (window.reduxStores === undefined) {
                    window.reduxStores = {};
                } 
                window.reduxStores[storeName] = store;
                this.resourceLoaded = true;
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error loading redux',
                        message: error,
                        variant: 'error',
                    }),
                );
            });
    }

}