const todoTemplate = (date, text, priority, id, completed) => {
    return `<div class="list-item flex flex-row padding-10" id="${id}">
                    <div class="item-container flex flex-row padding-5 ${completed ? '' : _getBackgroundColor(priority)} ${completed ? 'completed' : ''}">
                        <div class="item-left-container flex flex-row">
                            <div class="item-date padding-5">
                               ${ _parseDate(date)}
                            </div>
                            <div class="item-priority padding-5 ${priority}">
                                ${priority === 'low' ? '<i class="fas fa-arrow-down"></i>' : '<i class="fas fa-arrow-up"></i>'}
                            </div>
                        </div>
                        <div class="item-right-container flex flex-row">
                              <div class="item-text padding-lr-10 ${completed ? 'completed-text' : ''}">
                                  ${text}
                              </div>
                              <div class="item-icon-container">
                              ${completed ? '<i class="fas fa-undo-alt" data-undo="' + ${id} + '"></i>' :
                                            '<i class="fas fa-check" data-check="' + ${id} + '"></i>'}
                                 
                                  <i class="fas fa-pen" data-editModal="${id}"></i>
                                  <i class="fas fa-times" data-removeModal="${id}"></i>
                              </div>
                        </div>
                    </div>
                    <div class="modal-content">
                        <div class="modal-body">
                            Are you sure?
                        </div>
                        <div class="modal-footer">
                            <i class="fas fa-check low" data-remove="${id}"></i>
                            <i class="fas fa-times high" data-close="${id}"></i>
                        </div>
                    </div>
                    <div class="modal-edit-content" >
                        <div class="modal-edit-body">
                            <input type="text" class="edit-todo-input modal" value="${text}" placeholder="What needs to be done???">
                            <div class="add-todo-edit-checkbox-group modal" id="${id}" onclick="_handleEditCheckboxes(event, id)">
                                <input class="checkbox-edit" type="checkbox" checked id="edit-low-${id}" value="low">
                                <label class="modal" for="edit-low-${id}">Low<i class="fas fa-arrow-down low modal"></i></label>
                                <input class="checkbox-edit" type="checkbox" id="edit-medium-${id}" value="medium">
                                <label class="modal" for="edit-medium-${id}">Mid<i class="fas fa-arrow-up medium modal"></i></label>
                                <input class="checkbox-edit" type="checkbox" id="edit-high-${id}" value="high">
                                <label class="modal" for="edit-high-${id}">High<i class="fas fa-arrow-up high modal"></i></label>
                            </div>
                        </div>
                        <div class="modal-edit-footer">
                            <i class="fas fa-check low" data-edit="${id}"></i>
                            <i class="fas fa-times high" data-close="${id}"></i>
                        </div>
                    </div>
                </div>`
};

const generateUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

const debounce = (f, ms) => {

    let timer = null;

    return (...args) => {
        const onComplete = () => {
            f.apply(this, args);
            timer = null;
        };

        if (timer) {
            clearTimeout(timer);
        }

        timer = setTimeout(onComplete, ms);
    };
};

function _getBackgroundColor(priority) {
    return priority === 'low' ? 'status-low' : priority === 'high' ? 'status-high' : 'status-medium'
}

const _parseDate = (date) => {
    const today = moment();
    return moment(date).from(today);
};

window._handleEditCheckboxes = (event, id) => {
    const container = document.getElementById(id);
    const checkboxes = container.querySelectorAll('.checkbox-edit');

    if (event.target.nodeName === 'LABEL' && event.target.control.type === 'checkbox') {
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        event.target.control.checked = true;
    }
};
export {
    todoTemplate,
    debounce,
    generateUID
}