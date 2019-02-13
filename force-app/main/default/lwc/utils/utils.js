function createLoggerMiddleware(extraArgument) {
    return ({ getState }) => next => action => {
        console.log(`%c dispatching ${action.type}`, 'color:blue', action); 
        console.log('%c next state', 'color:green', getState());
        return next(action);
    };
}

export const logger = createLoggerMiddleware();

export const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};