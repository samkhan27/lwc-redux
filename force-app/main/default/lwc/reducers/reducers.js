const reducer = (state = [], action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return state.concat([action.payload])
        case 'REMOVE_TODO': {
            const itemToRemoveIndex = state.findIndex(todo => todo === action.payload);
            return [...state.slice(0, itemToRemoveIndex), ...state.slice(itemToRemoveIndex + 1)]
        }
        default:
            return state
    }
};
export default reducer;