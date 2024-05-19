// Dom Elements
const addBtnSelector = document.querySelector(`.add-btn`);
const removeBtnSelector = document.querySelector(`.remove-btn`);
const todoListWrapperSelector = document.querySelector(`#todo-wrapper`);

// Defining Class
class Todo {
  // Static Vars & Funcs
  static #_todoArray;
  static #_getCalculateTimeDifference(todoDate, currentTime) {
    let difference = Math.abs(currentTime - todoDate);

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    difference -= days * (1000 * 60 * 60 * 24);
    const hours = Math.floor(difference / (1000 * 60 * 60));
    difference -= hours * (1000 * 60 * 60);

    let timeMessage = "";
    if (days === 0 && hours > 0) {
      timeMessage = `${hours} hours`;
    } else if (hours === 0) {
      timeMessage = `less than 1 hours`;
    } else {
      timeMessage = `recently`;
    }

    return timeMessage;
  }
  static _loadTodoOfLocal() {
    let todo = localStorage.getItem(`todo`);
    if (todo?.length)
      try {
        return JSON.parse(todo);
      } catch (error) {
        console.warn(error);
      }

    return null;
  }
  static _setTodoInLocal(newTodo) {
    let todo = JSON.parse(localStorage.getItem(`todo`)) || [];
    todo.push(newTodo);
    localStorage.setItem(`todo`, JSON.stringify(todo));
  }
  static _ShowDomTodo() {
    todoListWrapperSelector.innerHTML = null;
    if (Todo.#_todoArray.length)
      Todo.#_todoArray.forEach((el) => {
        let date = new Date(el.date);
        let month = date.toLocaleString("default", { month: "long" });
        let day = date.getDate();

        let todoPeriod = Todo.#_getCalculateTimeDifference(
          el.date,
          date.getTime()
        );
        todoListWrapperSelector.insertAdjacentHTML(
          `afterbegin`,
          `<div class="list-item">
              <div class="checkbox-wrapper">
                <p>${el.message}</p>
              </div>
              <small class="due-date muted">By ${month} ${day}th <blt>•</blt> ${todoPeriod}</small>
           </div>`
        );
      });
  }
  static set _addTodo(newTodo) {
    Todo.#_todoArray.push(newTodo);
  }
  static _deleteTodoAll() {
    Todo.#_todoArray = [];
    Todo._ShowDomTodo();
    localStorage.clear();
  }

  static {
    Todo.#_todoArray = [];
    let todo = Todo._loadTodoOfLocal();
    if (todo) Todo.#_todoArray = [...todo];
  }

  // Cons & Methods
  message = "";
  date = "";
  isDone = false;
  id;
  constructor(message) {
    let date = new Date();
    this.date = date.getTime();
    this.message = message;
    this.id = Todo.#_todoArray.length + 1;
    this.isDone;
  }
}

// Events
window.addEventListener(`load`, Todo._ShowDomTodo);
addBtnSelector.addEventListener(`click`, () => {
  let todoText = prompt(`Enter Todo: `);
  if (todoText) {
    let newTodo = new Todo(todoText.trim());
    Todo._addTodo = newTodo;
    Todo._setTodoInLocal(newTodo);
    Todo._ShowDomTodo();
  } else {
    return false;
  }
});
removeBtnSelector.addEventListener(`click`, () => {
  Todo._deleteTodoAll();
});
