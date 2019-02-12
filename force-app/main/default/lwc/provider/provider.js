import { LightningElement, track, api } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import reduxResourceURL from '@salesforce/resourceUrl/redux';

export default class Provider extends LightningElement {
    

    @track resourceLoaded = false;

    @api storeName = 'redux';
    @api reducer = (state = [], action) => {
        switch (action.type) {
            case 'ADD_TODO':
                return state.concat([action.payload])
            default:
                return state
        }
    };

    connectedCallback() {
        Promise.all([
            loadScript(this, reduxResourceURL),
        ])
            .then(() => {
                const { reducer, storeName } = this;
                const { createStore, combineReducers } = window.Redux;
                const store = createStore(reducer, ['Use Redux']);

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
                        message: ':(',
                        variant: 'error',
                    }),
                );
            });
    }

}