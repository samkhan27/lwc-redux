import { LightningElement, track } from 'lwc';
import { connect } from 'c/connect';
import { VisibilityFilters } from 'c/actions'

const getVisibleTodos = (todos, filter) => {
    switch (filter) {
        case VisibilityFilters.SHOW_ALL:
            return todos
        case VisibilityFilters.SHOW_COMPLETED:
            return todos.filter(t => t.completed)
        case VisibilityFilters.SHOW_ACTIVE:
            return todos.filter(t => !t.completed)
        default:
            throw new Error('Unknown filter: ' + filter)
    }
}

const mapStateToProps = state => ({
    todos: getVisibleTodos(state.todos, state.visibilityFilter)
})


export default class TodoList extends LightningElement {
    @track todos;
    connectedCallback() {     
        connect(mapStateToProps)(this);
    }
}



