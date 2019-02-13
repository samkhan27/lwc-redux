import { LightningElement, track, api } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import reduxResourceURL from '@salesforce/resourceUrl/redux';
import reduxThunkResourceURL from '@salesforce/resourceUrl/reduxThunk';
import lodashResourceURL from '@salesforce/resourceUrl/lodash';

import { logger } from 'c/utils'

export default class Provider extends LightningElement {
    @track resourceLoaded = false;

    @api storeName = 'redux';
    @api reducer;

    connectedCallback() {
        Promise.all([
            loadScript(this, reduxResourceURL),
            loadScript(this, reduxThunkResourceURL),
            loadScript(this, lodashResourceURL),
        ])
            .then(() => {
                const { storeName } = this;
                const { createStore, applyMiddleware } = window.Redux;
                const ReduxThunk = window.ReduxThunk.default

                const store = createStore(
                    this.reducer,
                    applyMiddleware(ReduxThunk, logger)
                );
                
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