import { LightningElement, track } from 'lwc';
import { addTodo } from 'c/actions';
import { connect } from 'c/connect';

const mapDispatchToProps = {
    addTodo
}

export default class AddTodo extends LightningElement {
    @track newTodo;

    connectedCallback() {
        connect(undefined, mapDispatchToProps)(this);
    }

    addTodoHandler = () => {
        this.addTodo(this.newTodo);
        this.newTodo = '';
    }

    changeHandler(event) {
        this.newTodo = event.target.value;
    }
}



