import {todoTemplate, debounce} from './helpers.js';
import TodoItem from './models.js'
import Store from './store.js'

const list = document.querySelector('.todos-list');
const search = document.querySelector('.search-container');
const addTodoInput = document.querySelector('.add-todo-input');
const addTodoBtn = document.querySelector('.add-todo-btn');
const store = new Store();
const addTodoInputGroup = document.querySelector('.add-todo-container');
const checkboxes = document.querySelectorAll(".checkbox");

// filter buttons

const filterDate = document.querySelector('.filter-date');
const filterLow = document.querySelector('.filter-low');
const filterMedium = document.querySelector('.filter-medium');
const filterHigh = document.querySelector('.filter-high');
const filterCompleted = document.querySelector('.filter-completed');
const filterAll = document.querySelector('.filter-all');

let activeModal = null;
let priority = 'low';

store._initState();
renderList();

function renderList(todos = store.state.todos) {
    let template = '';
    todos.forEach(todo => {
        template += todo.status.done ?
            todoTemplate(todo.date, todo.text, todo.priority, todo.id, true) :
            todoTemplate(todo.date, todo.text, todo.priority, todo.id);
    });
    list.innerHTML = template;
}

search.onkeyup = (event) => {
    handleSearch(event.target.value);
};

addTodoInput.onkeyup = (event) => {
    if (event.target.value.trim() !== '' && event.key === "Enter") {
        _handleAddTodo(event.target.value);
        event.target.value = '';
    }
};

addTodoInputGroup.onclick = (event) => {
    if (event.target.nodeName === 'LABEL' && event.target.control.type === 'checkbox') {
        _handlePriorityChanged(event.target.control)
    }
};

addTodoBtn.onclick = () => {
    if (addTodoInput.value.trim() !== '') {
        _handleAddTodo(addTodoInput.value);
    }
    addTodoInput.value = '';
};

list.onclick = (event) => {
    event.preventDefault();
    const elem = event.target;
    if (elem.dataset.removemodal) {
        _handleRemove(elem.dataset.removemodal);
    }
    if (elem.dataset.remove) {
        _removeTodo(elem.dataset.remove)
    }
    if (elem.dataset.check) {
        _handleCheck(elem.dataset.check);
    }
    if (elem.dataset.undo) {
        _handleUndoCheck(elem.dataset.undo);
    }
    if (elem.dataset.close) {
        _closeModal();
    }
    if (elem.dataset.editmodal) {
        _handleEdit(elem.dataset.editmodal);
    }
    if (elem.dataset.edit) {
        _editTodo(elem.dataset.edit);
    }
};

// Handlers

function _handleEdit(id) {
    event.preventDefault();
    const container = document.getElementById(id);
    const modal = container.querySelector('.modal-edit-content');
    if (activeModal) {
        activeModal.classList.remove('active-modal');
    }
    activeModal = modal;
    modal.classList.add('active-modal');
}

function _editTodo(id) {
    if (activeModal) {
        const input = activeModal.querySelector('.edit-todo-input');
        const checkboxGroup = activeModal.querySelectorAll('.add-todo-edit-checkbox-group input[type=\'checkbox\']');
        let priority;
        if (!input.value) return;
        checkboxGroup.forEach(checkbox => {
            if (checkbox.checked) {
                priority = checkbox.value;
            }
        });

        store.state = {
            todos: store.state.todos.map(todo => {
                if (todo.id === id) {
                    return {
                        ...todo,
                        text: input.value,
                        priority
                    }
                }
                return todo;
            })
        };
        activeModal.classList.remove('active-modal');
        setTimeout(renderList, 300);
    }
}

function _handleRemove(id) {
    event.preventDefault();
    const container = document.getElementById(id);
    const modal = container.querySelector('.modal-content');
    if (activeModal) {
        activeModal.classList.remove('active-modal');
    }
    activeModal = modal;
    modal.classList.add('active-modal');
}

function _removeTodo(id) {
    store.state = {
        todos: store.state.todos.filter(todo => todo.id !== id)
    };
    renderList();
}

function _handleCheck(id) {
    store.state = {
        todos: store.state.todos.map(todo => {
            if (todo.id === id) todo.status.done = true;
            return todo;
        })
    };
    renderList();
}

function _handleUndoCheck(id) {
    store.state = {
        todos: store.state.todos.map(todo => {
            if (todo.id === id) todo.status.done = false;
            return todo;
        })
    };
    renderList();
}

function _handleSearch(query) {
    query = query.toLowerCase();
    const todos = store.state.todos.filter(todo => todo.text.toLowerCase().includes(query));
    renderList(todos);
}

function _handlePriorityChanged(elem) {
    priority = elem.value;
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    elem.checked = true;
}

function _handleAddTodo(text) {
    const todo = new TodoItem(text, priority);
    const result = store.state.todos;

    result.unshift(todo);
    store.state = {
        todos: result
    };
    renderList();
}

function _closeModal() {
    activeModal.classList.remove('active-modal');
}

const handleSearch = debounce(_handleSearch, 400);

document.onclick = function (event) {
    event.preventDefault();
    const elem = event.target;
    if (!elem.className.includes('fas') && !elem.className.includes('modal')) {
        activeModal && activeModal.classList.remove('active-modal');
    }
};

// Filters

filterDate.onclick = (event) => {
    if (event.target.className.includes('arrow-alt-up')) {
        store.state = {
            todos: store.state.todos.sort((a, b) => {
                return moment.utc(b.date).diff(moment.utc(a.date));
            })
        };
        renderList();
    }
    if (event.target.className.includes('arrow-alt-down')) {
        store.state = {
            todos: store.state.todos.sort((a, b) => {
                return moment.utc(a.date).diff(moment.utc(b.date));
            })
        };
        renderList();
    }
};

filterLow.onclick = () => {
    event.preventDefault();
    event.stopPropagation();
    const filtered = store.state.todos.filter(todo => todo.priority === 'low');
    renderList(filtered);
};
filterMedium.onclick = () => {
    event.preventDefault();
    event.stopPropagation();
    const filtered = store.state.todos.filter(todo => todo.priority === 'medium');
    renderList(filtered);
};
filterHigh.onclick = () => {
    event.preventDefault();
    event.stopPropagation();
    const filtered = store.state.todos.filter(todo => todo.priority === 'high');
    renderList(filtered);
};
filterCompleted.onclick = () => {
    event.preventDefault();
    event.stopPropagation();
    const filtered = store.state.todos.filter(todo => todo.status.done);
    renderList(filtered);
};
filterAll.onclick = () => {
    event.preventDefault();
    event.stopPropagation();
    renderList();
};
