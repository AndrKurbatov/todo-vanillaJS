import { generateUID } from './helpers.js'

const initialState = {
    todos: [
        {
            date: moment(),
            text: 'Make some cool app',
            priority: 'low',
            status: {
                done: false
            },
            id: generateUID()
        },{
            date: moment().subtract(5, 'days'),
            text: 'Go to New Zealand',
            priority: 'high',
            status: {
                done: false
            },
            id: generateUID()
        },{
            date: moment().subtract(2, 'days'),
            text: 'Learn something new',
            priority: 'medium',
            status: {
                done: true
            },
            id: generateUID()
        }
    ]
};

export default class Store {

    constructor() {
        this._state = {
            todos: []
        };
    }

    set state(state) {
        this._state = state;
        localStorage.setItem('state', JSON.stringify(state));
    }

    get state() {
        return this._state
    }

    _initState() {
        let state = JSON.parse(localStorage.getItem('state'));
        if (state) {
            this.state = state;
        } else {
            this.state = initialState;
        }
    }

}
