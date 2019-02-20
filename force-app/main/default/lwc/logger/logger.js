import { DEFAULT_STORE_NAME } from 'c/constants'

export function createLoggerMiddleware(storeName = DEFAULT_STORE_NAME) {
    return ({ getState }) => next => action => {
        console.log(`=======${storeName}=======`);
        console.log(`%c dispatching ${action.type}`, 'color:blue', action); 
        const result = next(action);
        console.log('%c next state', 'color:green', getState());
        return result;
    };
}