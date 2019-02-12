import { LightningElement, track } from 'lwc';
import { connect } from 'c/connect';

export default class TodoList extends LightningElement {
    @track todos;
    @track newTodo;

    connectedCallback() {
        const mapStateToAttributes = state => ({
            todos: state
        });

        const mapDispatchToProps = dispatch => ({
            addTodoAction: (text) => dispatch({ type:'ADD_TODO', payload:text})
        })
        connect(mapStateToAttributes, mapDispatchToProps)(this);
    }

    addTodo = () => {
        this.addTodoAction(this.newTodo);
    }

    changeHandler(event) {
        this.newTodo = event.target.value;
    }
}



