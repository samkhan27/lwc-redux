export const connect = (mapStateToAttributes, mapDispatchToAttributes, storeName = 'redux') => (component) => {
    const { getState, subscribe, dispatch} = window.reduxStores[storeName];
    
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
        const attributeDispatchMap = mapDispatchToAttributes(dispatch);

        Object.entries(attributeDispatchMap).forEach(([key, value]) => {
            component[key] = value;
        });
    }
}