import { LightningElement, track, api } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';

import reduxResourceURL from '@salesforce/resourceUrl/redux';
import reduxThunkResourceURL from '@salesforce/resourceUrl/reduxThunk';
import lodashResourceURL from '@salesforce/resourceUrl/lodash';

import { logger } from 'c/logger'

export default class Provider extends LightningElement {
    @track resourceLoaded = false;

    @api storeName = 'redux';
    @api reducers;
    @api useCombineReducers = false;

    async connectedCallback() {
        await Promise.all([
            loadScript(this, reduxResourceURL),
            loadScript(this, reduxThunkResourceURL),
            loadScript(this, lodashResourceURL),
        ]);
        
        const { storeName, reducers, useCombineReducers } = this;
        const { createStore, applyMiddleware, combineReducers } = window.Redux;
        const ReduxThunk = window.ReduxThunk.default

        const rootReducer = useCombineReducers ? combineReducers(reducers) : reducers;

        const store = createStore(
            rootReducer,
            applyMiddleware(ReduxThunk, logger)
        );
        
        if (window.reduxStores === undefined) {
            window.reduxStores = {};
        } 
        window.reduxStores[storeName] = store;
        this.resourceLoaded = true;
    }

}