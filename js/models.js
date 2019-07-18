import { generateUID } from "./helpers.js";

class TodoItem {

    constructor(text = 'Something you should to do :)', priority = 'low', status = {done: false}, date = moment()) {
        this.date = date;
        this.text = text;
        this.priority = priority;
        this.status = status;
        this.id = generateUID()
    }
}


export default TodoItem;
