import { LightningElement, api, track} from 'lwc';
import { connect } from 'c/connect';
import { toggleTodo } from 'c/actions'


const mapDispatchToProps = dispatch => ({
    toggleTodo: id => dispatch(toggleTodo(id))
})

export default class TodoItem extends LightningElement {
    @api item
    
    get styleClass() {
        return this.item.completed ? 'strikeThrough' : ''
    }

    connectedCallback() {
        connect(null, mapDispatchToProps)(this);
    }

    handleClick() {
        this.toggleTodo(this.item.id);
    }
}
