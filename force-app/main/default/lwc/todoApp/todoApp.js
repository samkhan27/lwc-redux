import { LightningElement } from 'lwc';
import todoReducer from 'c/reducers';

export default class TodoApp extends LightningElement {
    reducer = todoReducer;
}



