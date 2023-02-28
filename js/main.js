const form = document.getElementById("form");
const taskInput = document.getElementById("taskInput");
const tasksList = document.getElementById("tasksList");
const emptyList = document.getElementById("emptyList");

let tasks = [];

if (localStorage.getItem("tasks")) {
  tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks.forEach((task) => renderTask(task));
}

checkEmptyList();
//додаємо таску
form.addEventListener("submit", addTask);

//Видаляємо таску
tasksList.addEventListener("click", deleteTask);

//Таска виконана
tasksList.addEventListener("click", doneTask);

function addTask(event) {
  event.preventDefault();
  const taskText = taskInput.value;

  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false,
  };

  //Додаємо таску в масив.
  tasks.push(newTask);

  //Додаємо в Локал Сторедж.
  saveToLocalstorage();

  renderTask(newTask);

  //Очищаємо поле вводу та вертаємо на нього фокус.
  taskInput.value = "";
  taskInput.focus();

  checkEmptyList();
}

//Функція що видаляє таску
function deleteTask(event) {
  if (event.target.dataset.action !== "delete") return;

  const parentNode = event.target.closest(".list-group-item");

  //Визначаємо ID.
  const id = Number(parentNode.id);

  const index = tasks.findIndex((task) => task.id === id);

  saveToLocalstorage();

  tasks.splice(index, 1);

  //Видаляємо завдання з розмітки.
  parentNode.remove();
  checkEmptyList();
}

//Перевіряємо що клік був по кнопці DONE
function doneTask(event) {
  if (event.target.dataset.action !== "done") return;

  const parentNode = event.target.closest(".list-group-item");
  const id = Number(parentNode.id);
  const task = tasks.find((task) => task.id === id);
  task.done = !task.done;

  saveToLocalstorage();

  const taskTitle = parentNode.querySelector(".task-title");
  taskTitle.classList.toggle("task-title--done");
}

function checkEmptyList() {
  if (tasks.length === 0) {
    const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
    <img src="./img/leaf.png" alt="Empty" width="48" class="mt-3" />
    <div class="empty-list__title">To-do list is empty</div>
  </li>`;
    tasksList.insertAdjacentHTML("afterbegin", emptyListHTML);
  }
  if (tasks.length > 0) {
    const emptyListEl = document.querySelector("#emptyList");
    emptyListEl ? emptyListEl.remove() : null;
  }
}

function saveToLocalstorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTask(task) {
  //Формуємо css клас.
  const cssClass = task.done ? "task-title task-title--done" : "task-title";

  //Формуємо розмітку для нової таски.
  const taskHTML = `<li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
     <span class="${cssClass}">${task.text}</span>
     <div class="task-item__buttons">
       <button type="button" data-action="done" class="btn-action">
         <img src="./img/tick.svg" alt="Done" width="18" height="18" />
       </button>
       <button type="button" data-action="delete" class="btn-action">
         <img src="./img/cross.svg" alt="Cross" width="18" height="18" />
       </button>
     </div>
   </li>`;

  //Додаємо завдання на сторінку.
  tasksList.insertAdjacentHTML("beforeend", taskHTML);
}
