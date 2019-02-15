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
    @api initalState;
    @api useCombineReducers = false;
    @api useThunk = false;
    @api useLogger = false;

    async connectedCallback() {
        await Promise.all([
            loadScript(this, reduxResourceURL),
            loadScript(this, reduxThunkResourceURL),
            loadScript(this, lodashResourceURL),
        ]);
        
        const { 
            storeName, 
            reducers, 
            initalState, 
            useCombineReducers, 
            useThunk, 
            useLogger 
        } = this;

        const { 
            createStore, 
            applyMiddleware, 
            combineReducers 
        } = window.Redux;

        const ReduxThunk = window.ReduxThunk.default

        const rootReducer = useCombineReducers ? combineReducers(reducers) : reducers;

        let enhancer;
        if (useThunk && useLogger) {
            enhancer = applyMiddleware(ReduxThunk, logger)
        } else if (useThunk) {
            enhancer = applyMiddleware(ReduxThunk);
        } else if (useLogger) {
            enhancer = applyMiddleware(logger);
        }
        
        const store = createStore(rootReducer, initalState, enhancer);
        
        if (window.reduxStores === undefined) {
            window.reduxStores = {};
        } 
        window.reduxStores[storeName] = store;
        this.resourceLoaded = true;
    }

}