export const connect = (mapStateToAttributes, mapDispatchToAttributes, storeName = 'redux') => (component) => {
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
        component.unsubscribeFromState = subscribe(handleStateChanges);
        if (component.disconnectedCallback) {
            const disconnectedCallbackClone = component.disconnectedCallback.bind(component);
            component.disconnectedCallback = () => {
                disconnectedCallbackClone();
                component.unsubscribeFromState();
            }
        } else {
            component.disconnectedCallback = () => {
                component.unsubscribeFromState();
            }
        }
        
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