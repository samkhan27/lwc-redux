import { LightningElement, track, api } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';

import reduxResourceURL from '@salesforce/resourceUrl/redux';
import reduxThunkResourceURL from '@salesforce/resourceUrl/reduxThunk';
import lodashResourceURL from '@salesforce/resourceUrl/lodash';

import { createLoggerMiddleware, poll } from 'c/utils'
import { DEFAULT_STORE_NAME } from 'c/constants'

export default class Provider extends LightningElement {
    @track resourceLoaded = false;

    @api storeName = DEFAULT_STORE_NAME;
    @api secondary = false;
    @api reducers;
    @api initialState = {};
    @api useCombineReducers = false;
    @api useThunk = false;
    @api useLogger = false;

    async connectedCallback() {
        const {
            storeName,
            reducers,
            initialState,
            useCombineReducers,
            useThunk,
            useLogger,
            secondary,
        } = this;
        
        if (secondary) {
            try {
                await poll(() => (window.reduxStores && window.reduxStores[this.storeName]));
                this.resourceLoaded = true;
                return;
            } catch (ex) {
                console.log(ex);
                return;
            }
        }

        await Promise.all([
            loadScript(this, reduxResourceURL),
            loadScript(this, reduxThunkResourceURL),
            loadScript(this, lodashResourceURL),
        ]);

        const { 
            createStore, 
            applyMiddleware, 
            combineReducers 
        } = window.Redux;

        const ReduxThunk = window.ReduxThunk.default;
        const logger = createLoggerMiddleware(storeName);
        const rootReducer = useCombineReducers ? combineReducers(reducers) : reducers;
        
        let enhancer;
        if (useThunk && useLogger) {
            enhancer = applyMiddleware(ReduxThunk, logger)
        } else if (useThunk) {
            enhancer = applyMiddleware(ReduxThunk);
        } else if (useLogger) {
            enhancer = applyMiddleware(logger);
        }
        
        window.reduxStores = window.reduxStores || {};
        const store = createStore(rootReducer, initialState, enhancer);

        if (window.reduxStores[storeName] === undefined) {
            window.reduxStores[storeName] = store;
        } else {
            console.error(`You may be trying to use the same redux store from multiple apps/providers. To do so you need to make one of the providers primary (by passing in the 'reducers' attribute) and the rest of the providers secondary (by passing in the 'secondary' attribute). Alternately, you can use multple stores for multiple apps under different namesapces by passing in the 'storeName' attribute to provider and connect()`);
        }
        
        this.resourceLoaded = true;
    }

}