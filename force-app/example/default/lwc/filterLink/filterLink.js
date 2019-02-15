import { LightningElement, api, track } from 'lwc';
import { connect } from 'c/connect'
import { setVisibilityFilter } from 'c/actions'

const mapStateToProps = (state, ownProps) => ({
    variant: ownProps.filter === state.visibilityFilter ? 'brand' : 'neutral'
})

const mapDispatchToProps = (dispatch, ownProps) => ({
    handleClick: () => dispatch(setVisibilityFilter(ownProps.filter))
})

export default class TodoFooter extends LightningElement {
    @track variant
    @api label; 
    @api filter;
    
    connectedCallback() {
        connect(mapStateToProps, mapDispatchToProps)(this);
    }
}
