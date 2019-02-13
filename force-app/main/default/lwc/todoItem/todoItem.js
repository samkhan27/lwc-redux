import { LightningElement, api } from 'lwc';
import { connect } from 'c/connect';

export default class TodoItem extends LightningElement {
    @api todo;

    connectedCallback() {
        const mapDispatchToProps = dispatch => ({
            removeTodoAction: (text) => dispatch({ type: 'REMOVE_TODO', payload: text })
        })
        connect(undefined, mapDispatchToProps)(this);
    }

    removeTodo = () => {
        this.removeTodoAction(this.todo);
    }
}



