import { DEFAULT_STORE_NAME } from 'c/constants';

export const connect = (mapStateToAttributes, mapDispatchToAttributes, storeName = DEFAULT_STORE_NAME) => (component) => {
    const { getState, subscribe, dispatch } = window.reduxStores[storeName];
    const { bindActionCreators } = window.Redux;
    
    if(!! mapStateToAttributes) {
        const handleStateChanges = () => {
            const state = getState();
            const attributeMap = mapStateToAttributes(state, component);
            Object.entries(attributeMap).forEach(([key, value]) => {
                component[key] = value;
            });
        }

        handleStateChanges();
        component.unsubscribe = subscribe(handleStateChanges);
    }
    if (!! mapDispatchToAttributes) {
        const attributeDispatchMap = typeof mapDispatchToAttributes === 'function' 
            ? mapDispatchToAttributes(dispatch, component) 
            : bindActionCreators(mapDispatchToAttributes, dispatch);

        Object.entries(attributeDispatchMap).forEach(([key, value]) => {
            component[key] = value;
        });
    }
}