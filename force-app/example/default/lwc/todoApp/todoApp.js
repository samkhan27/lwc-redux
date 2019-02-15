import { LightningElement } from 'lwc';
import reducers from 'c/reducers';

export default class TodoApp extends LightningElement {
    reducers = reducers;
}



