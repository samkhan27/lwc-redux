
# LWC Redux
[Redux](https://redux.js.org/introduction/getting-started) bindings for Salesforces' propreteray [Lightning Web Components (LWC)](https://developer.salesforce.com/blogs/2018/12/introducing-lightning-web-components.html) framework. This project aims to bring predictable state management to apps written with LWC that live on Salesforce.  

NOTE: This project is still in very early stages and is likely to go through significant changes in design based on decisions and feedback from usage in more complex applications than the one provided in the example

## Installation
Just click on the deploy button below.

[![Deploy](https://deploy-to-sfdx.com/dist/assets/images/DeployToSFDX.svg)](https://deploy-to-sfdx.com)

Alternately you can just go into the `force-app/main` folder and copy the static resources and components you need. The provider component and the connect module are necessary along with the redux and reduxThunk static resources. 

## Documentation

The library provides two key modules. The connect module to manage the store interaction logic and the provider component to wrap the application with. If you've used [React Redux](https://react-redux.js.org/) most of this will seem familiar to you. It's worth taking a look at the documentation for React Redux since the first two arguments to connect(), `mapStateToAttributes` and `mapDispatchToAttributes` mimics the behavior of their corresponding analogues `mapStateToProps` and `mapDispatchToProps` in React Redux. 

However, there are key differences between how React and LWC works and consequently, the connect and provider modules in this project work and behave very differently from those in React Redux.

### Provider
In React Redux, the Provider component takes in the store as a prop and houses it there. It then allows any nested component to have access to it through the connect function.  

The Provider component in this project works differently. First, it loads the redux and redux thunk static resources and then calls redux methods to generate the store and makes it available to any component by making global stores. It does this by creating a field called `reduxStores` on the global window object and puts the created store there keyed by the name of the store (the name of the default store is 'redux'). This enables you to create multiple stores (although you probably shouldn't do that unless you have very good reasons to do so). 

For multiple apps to access the same store, each app needs to be wrapped in a provider component. Of these, only one can be a primary provider (this is the one that will create the store and hence will require the `reducers` attribute to be passsed in) while the rest are secondary (marked using the `secondary` flag). The secondary providers do not create a store. Rather they look for a global store that the primary provider generates and once the store is found, it renders that app it houses. This is done through polling. 

Because the stores are global they can be accessed from anywhere but you should only access them through the use of the connect module (Nothing is going to stop you from doing otherwise, of course. But then, nothing stops you from making mutations to the redux state either).

This decision to house the redux store on the global window object may seem like a bad practise; however, sice LWC doesn't have an equivalent of React's [Context Api](https://reactjs.org/docs/context.html), this is the only way to make the state available to the children, and grandchildren, of the Provider component without having to pass it down each level. Passing the state down multiple levels becomes extremely cumbersome in parctice as the app grows large.

Also the reason I've decided to place the store creation logic in the Provider component is that generally you only do this once on an app and third party libraries are loaded asynchrounously in salesforce through static resources. You can, of course, change the behaviour of this as you see fit or decide to do away with the provider component completely. You can just load up the Redux libabry and create a global store on one of your components and then just use the connect function in this library to access it. 

NOTE: This is also the part of the library that might go through the greatest amount of change in the coming days as I may decide there are better, more intuitive ways of doing this. 

##### Provider Attributes
`store-name` - Name of the redux store (defaults to 'redux')

`reducers` - A [reducing function](https://redux.js.org/glossary#reducer) that returns the next state tree or a map of reducer names and their corresponding reducing functions (if such a map is used, be sure to set the `use-combine-reducers` flag as the reducers will need to be combined using the combineReducers method on Redux)

`initial-state` - The initial state that you may optionally specify to preload the state

`secondary` - flag to indicate if the provider is secondary. If secondary, all the provider does is wait till it finds a store that's been generated by a primary (non secondary) provider, and then renders its children.

`use-combine-reducers` - flag to indicate if combineReducers need to be used

`use-thunk` - flag to indicate if [thunk](https://github.com/reduxjs/redux-thunk) middleware should be used

`use-logger` - flag to indicate if alogger middleware is to be used (currently the logger middelware is a simple one I've included in the library that just prints out the action dispatched and the resulting state from that action on the console)

##### Example Usage
Primary provider
```html
<c-provider reducers={reducers} use-combine-reducers use-thunk use-logger>
    <c-app></c-app>
</c-provider>
```
Secondary provider (here, c-app-two uses the same store as c-app)
```html
<c-provider secondary>
    <c-app-two></c-app-two>
</c-provider>
```

### Connect()

The connect() function connects a React component to a Redux store. It provides its connected component with the pieces of the data it needs from the store, and the functions it can use to dispatch actions to the store. In this way it is similar to the connect() function in React Redux. However it differs inthe following way.

In React Redux, connect() does not modify the component class passed to it; instead, it returns a new, connected component class that wraps the component you passed in. It does this by using a pattern called [higher-order components](https://reactjs.org/docs/higher-order-components.html), which emerges from React's compositional nature. I have not found any way to replicate this behaviour in LWC when hosted inside salesforce (there is no documentation on dynamically creating or passing attributes to components). Hence the connect() function returns a function that takes in the component that needs to be connected and **modifies** the component in question.

Also, the connect() assumes that by the time it's invoked, the redux library and the store have been instantiated on the window object. This means that it should be called from a component nested inside the provider component. That way the provider component would have made the global variables availabe for any of it children components that want to connect to the redux store. The ideal place to call it is from the connectedCallback() function of the [LWC component lifecycle hooks](https://developer.salesforce.com/docs/component-library/documentation/lwc/lwc.reference_lifecycle_hooks) which is called when the element is inserted into a document and this hook flows from parent to child. 

##### Connect() Parameters

`mapStateToAttributes` - a function that takes in the state and returns a map of the selected state keyed by names of the attributes they will be attached to in the component

`mapDispatchToAttributes` - a function that takes dispatch and returns a map of actions keyed by names of the attributes they will be attached to in the component

`storeName` - the name of the store to connect to (defaults to redux)

*Connect returns a function that takes in the component that is to be connected*

NOTE: I'll be adding more functionality and therefore potentially more arguments to the connect() function in the coming days. Also I plan to do some performance optimizations once I start thoroughly testing lwc-redux in production.

##### Example usage
```javascript
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
```

Check out the `force-app/examples` folder for more examples.
