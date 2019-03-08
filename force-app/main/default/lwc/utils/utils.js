import { DEFAULT_STORE_NAME } from 'c/constants'

export function createLoggerMiddleware(storeName = DEFAULT_STORE_NAME) {
    return ({ getState }) => next => action => {
        console.group(`${action.type}%c(${storeName})`, 'font-style: italic');
        console.info('dispatching', action);
        const result = next(action);
        console.log('%c next state', 'color:green', getState());
        console.groupEnd();
        return result;
    };
}

export const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

export const poll = (fn, timeout = 2000, interval = 100) => {
    const endTime = Number(new Date()) + timeout;
    const checkCondition = (resolve, reject) => {
        const result = fn();
        if (result) {
            resolve(result);
            clearTimeout(checkCondition);
        } else if (Number(new Date()) < endTime) {
            setTimeout(checkCondition, interval, resolve, reject);
        } else {
            reject(new Error('timed out for ' + fn + ': ' + arguments));
        }
    };
    return new Promise(checkCondition);
}