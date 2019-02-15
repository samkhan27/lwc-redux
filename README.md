
# LWC Redux
[Redux](https://redux.js.org/introduction/getting-started) bindings for Salesforces' propreteray [Lightning Web Components (LWC)](https://developer.salesforce.com/blogs/2018/12/introducing-lightning-web-components.html) framework. This project aims to bring predictable state management to apps written with LWC that live on Salesforce.  

NOTE: This project is still in very early stages and is likely to go through significant changes in design and based on decisions and feedback from usage in more complex applications than the one provided in the example

## Installation
Just click on the deploy button below.

[![Deploy](https://deploy-to-sfdx.com/dist/assets/images/DeployToSFDX.svg)](https://deploy-to-sfdx.com)

Alternately you can just go into the `force-app/main` folder and copy the static resources and components you need. The provider component and the connect module are necessary along with the redux and reduxThunk static resources. 

## Documentation

The library provides two key modules. The connect module to manage the store interaction logic and the provider component to wrap the application with. If you've used [React Redux] (https://react-redux.js.org/) most of this will seem familiar to you. It's worth taking a look at the documentation for React Redux since the first two arguments to connect(), `mapStateToAttributes` and `mapDispatchToAttributues` mimics the behavior of their corresponding analogues `mapStateToProps` and `mapDispatchToProps` in React Redux. 

However, there are key differences between how React and LWC works and consequently, the connect and provider modules in this project work and behave very differently from those in React Redux.

### Provider

In React Redux, the Provider component takes in the store as a prop and houses it there. It then allows any nested component to have access to it through the connect function.  

The Provider component in this project works differently. First, it loads the redux and redux thunk static resources and then calls redux methods to generate the store and makes it available to any component by making global stores. It does this by creating a field called `reduxStores` on the global window object and puts the created store there keyed by the name of the store (the name of the default store is 'redux'). This enables you to create multiple stores (although you probably shouldn't do that unless you have very good reasons to do so). 

Because the stores are global they can be accessed from anywhere but you should only access them through the use of the connect module (Nothing is going to stop you from doing otherwise, of course. But then, nothing stops you from making mutations to the redux state either).

This decision to house the redux store on the global window object may seem like a bad practise but sice LWC doesn't have an equivalent of React's [Context Api](https://reactjs.org/docs/context.html), this is the only way to make the store available to the children, and grandchildren, of the Provider component without having to pass it down each level.

Also the reason I've decided to place the store creation logic in the Provider component is that generally you only do this once on an app and third party libraries are loaded asynchrounously in slaesforce through static resources. You can, of course, change the behaviour of this as you see fit or decide to do away with the provider component completely. You can just load up the Redux libabry and create a global store on one of your components and then just use the connect function in this library to access it. This is also the part of the library that might go through the greatest amount of change in the coming days as I may decide there are better, more intuitive ways of doing this and implement those.

#### Provider Attributes
`store-name` - Name of the redux store (defaults to 'redux')

`reducers` - A [reducing function](https://redux.js.org/glossary#reducer) that returns the next state tree or a map of reducer names and their corresponding reducing functions (if such a map is used, be sure to set the `use-combine-reducers` flag as the reducers will need to be combined using the combineReducers method on Redux)

`initial-state` - The initial state that you may optionally specify to preload the state

`use-combine-reducers` - flag to indicate if combineReducers need to be used

`use-thunk` - flag to indicate if [thunk](https://github.com/reduxjs/redux-thunk) middleware should be used

`use-logger` - flag to indicate if alogger middleware is to be used (currently the logger middelware is a simple one I've included in the library that just prints out the action dispatched and the resulting state from that action on the console)


### Connect


## Todo
- optimize performance
- document
