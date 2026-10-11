// Находим контейнер, в котором будут отображаться задачи
const tasksContainer = document.querySelector("#tasks");

// Поле поиска
const searchInput = document.querySelector("#search");

// Все кнопки фильтрации
const tabs = document.querySelectorAll(".tab");

// Кнопка с иконкой карандаша
const fabButton = document.querySelector("#fab");

// Панель добавления задачи
const addPanel = document.querySelector("#addPanel");

// Форма добавления задачи
const addForm = document.querySelector("#addForm");

// Поле с названием задачи
const newTaskInput = document.querySelector("#newTask");

// Поле с датой задачи
const taskDateInput = document.querySelector("#taskDate");

// Кнопка отмены добавления
const cancelButton = document.querySelector("#cancelBtn");

// Заголовок с днём недели
const weekdayElement = document.querySelector("#weekday");

// Элемент с текущей датой
const currentDateElement = document.querySelector("#currentDate");

// Массив задач
let tasks = [
  {
    id: 1,
    title: "Покормить кошку",
    date: "2026-01-10",
    time: "11:30",
    completed: true,
  },
  {
    id: 2,
    title: "Изучить JavaScript",
    date: "2026-01-10",
    time: "12:00",
    completed: false,
  },
  {
    id: 3,
    title: "Сделать To-Do список",
    date: "2026-01-10",
    time: "14:00",
    completed: false,
  },
];

// Активный фильтр.
// Возможные значения: all, active, completed
let currentFilter = "all";

// --------------------------------------------------
// ФОРМАТИРОВАНИЕ ДАТЫ
// --------------------------------------------------

/*
  Преобразует дату из формата:

  2026-01-10

  в формат:

  10 января
*/
function formatDate(dateString) {
  if (!dateString) {
    return "Без даты";
  }

  const date = new Date(`${dateString}T00:00:00`);

  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
  }).format(date);
}

// --------------------------------------------------
// ОТОБРАЖЕНИЕ ТЕКУЩЕЙ ДАТЫ
// --------------------------------------------------

/*
  Показывает в верхней части приложения
  сегодняшний день недели и дату.
*/
function showCurrentDate() {
  const today = new Date();

  weekdayElement.textContent = new Intl.DateTimeFormat("ru-RU", {
    weekday: "long",
  }).format(today);

  currentDateElement.textContent = new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
  }).format(today);
}

// --------------------------------------------------
// СОЗДАНИЕ ОДНОЙ ЗАДАЧИ
// --------------------------------------------------

/*
  Создаёт HTML-элемент одной задачи.

  Функция получает объект task
  и возвращает готовый article.
*/
function createTaskElement(task) {
  const taskElement = document.createElement("article");

  // Класс done добавляется только выполненной задаче
  taskElement.className = task.completed ? "task done" : "task";

  // Сохраняем id задачи в data-атрибуте
  taskElement.dataset.id = task.id;

  // Чекбокс задачи
  const checkbox = document.createElement("input");

  checkbox.className = "task-check";
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;
  checkbox.setAttribute("aria-label", "Отметить задачу выполненной");

  // Контейнер для даты и названия
  const taskCopy = document.createElement("div");
  taskCopy.className = "task-copy";

  // Дата и время задачи
  const taskMeta = document.createElement("div");
  taskMeta.className = "task-meta";
  taskMeta.textContent = `${formatDate(task.date)}, ${task.time}`;

  // Название задачи
  const taskTitle = document.createElement("div");
  taskTitle.className = "task-title";
  taskTitle.textContent = task.title;

  // Кнопка удаления задачи
  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-task";
  deleteButton.type = "button";
  deleteButton.textContent = "×";
  deleteButton.setAttribute("aria-label", "Удалить задачу");

  // Собираем содержимое задачи
  taskCopy.append(taskMeta, taskTitle);
  taskElement.append(checkbox, taskCopy, deleteButton);

  return taskElement;
}

// --------------------------------------------------
// ОТОБРАЖЕНИЕ СПИСКА ЗАДАЧ
// --------------------------------------------------

/*
  Функция очищает контейнер и заново
  отображает задачи с учётом фильтра и поиска.
*/
function renderTasks() {
  const searchText = searchInput.value.trim().toLowerCase();

  // Очищаем старый список
  tasksContainer.innerHTML = "";

  // Фильтруем задачи
  const filteredTasks = tasks.filter((task) => {
    const matchesFilter =
      currentFilter === "all" ||
      (currentFilter === "active" && !task.completed) ||
      (currentFilter === "completed" && task.completed);

    const matchesSearch = task.title.toLowerCase().includes(searchText);

    return matchesFilter && matchesSearch;
  });

  // Если подходящих задач нет
  if (filteredTasks.length === 0) {
    const emptyElement = document.createElement("div");

    emptyElement.className = "empty";
    emptyElement.textContent = "Задач не найдено";

    // В CSS .empty скрыт через display: none,
    // поэтому показываем его непосредственно здесь
    emptyElement.style.display = "block";

    tasksContainer.append(emptyElement);

    return;
  }

  // Добавляем отфильтрованные задачи на страницу
  filteredTasks.forEach((task) => {
    tasksContainer.append(createTaskElement(task));
  });
}

// --------------------------------------------------
// ОТМЕТКА ЗАДАЧИ КАК ВЫПОЛНЕННОЙ
// --------------------------------------------------

/*
  Событие change срабатывает при изменении checkbox.

  После отметки задача перемещается
  между активными и завершёнными.
*/
tasksContainer.addEventListener("change", (event) => {
  if (!event.target.classList.contains("task-check")) {
    return;
  }

  const taskElement = event.target.closest(".task");
  const taskId = Number(taskElement.dataset.id);

  const task = tasks.find((item) => item.id === taskId);

  if (!task) {
    return;
  }

  // Меняем статус задачи
  task.completed = event.target.checked;

  // Перерисовываем список
  renderTasks();
});

// --------------------------------------------------
// УДАЛЕНИЕ ЗАДАЧИ
// --------------------------------------------------

/*
  При нажатии на × задача удаляется
  из массива tasks.
*/
tasksContainer.addEventListener("click", (event) => {
  if (!event.target.classList.contains("delete-task")) {
    return;
  }

  const taskElement = event.target.closest(".task");
  const taskId = Number(taskElement.dataset.id);

  // Удаляем задачу с нужным id
  tasks = tasks.filter((task) => task.id !== taskId);

  // Обновляем список
  renderTasks();
});

// --------------------------------------------------
// ПОИСК ЗАДАЧ
// --------------------------------------------------

/*
  При каждом вводе текста список обновляется,
  и показываются только подходящие задачи.
*/
searchInput.addEventListener("input", () => {
  renderTasks();
});

// --------------------------------------------------
// ФИЛЬТРАЦИЯ ЗАДАЧ
// --------------------------------------------------

/*
  Переключает фильтры:

  all — все задачи;
  active — активные задачи;
  completed — завершённые задачи.
*/
tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    // Сохраняем выбранный фильтр
    currentFilter = tab.dataset.filter;

    // Убираем active у всех кнопок
    tabs.forEach((item) => {
      item.classList.remove("active");
    });

    // Добавляем active выбранной кнопке
    tab.classList.add("active");

    // Перерисовываем список
    renderTasks();
  });
});

// --------------------------------------------------
// ОТКРЫТИЕ ПАНЕЛИ ДОБАВЛЕНИЯ
// --------------------------------------------------

/*
  В твоём CSS используется класс .open:

  .add-panel.open {
    display: flex;
  }

  Поэтому добавляем именно класс open.
*/
fabButton.addEventListener("click", () => {
  addPanel.classList.add("open");
  addPanel.setAttribute("aria-hidden", "false");

  // Ставим курсор в поле описания
  newTaskInput.focus();
});

// --------------------------------------------------
// ЗАКРЫТИЕ ПАНЕЛИ ДОБАВЛЕНИЯ
// --------------------------------------------------

/*
  Закрывает панель и очищает поля формы.
*/
function closeAddPanel() {
  addPanel.classList.remove("open");
  addPanel.setAttribute("aria-hidden", "true");

  addForm.reset();
}

// Закрытие по кнопке «Отмена»
cancelButton.addEventListener("click", () => {
  closeAddPanel();
});

// Закрытие по клику на затемнённый фон
addPanel.addEventListener("click", (event) => {
  // Если клик был именно по фоне,
  // а не внутри формы, закрываем панель
  if (event.target === addPanel) {
    closeAddPanel();
  }
});

// Закрытие клавишей Escape
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && addPanel.classList.contains("open")) {
    closeAddPanel();
  }
});

// --------------------------------------------------
// ДОБАВЛЕНИЕ НОВОЙ ЗАДАЧИ
// --------------------------------------------------

/*
  Срабатывает при нажатии кнопки «Добавить».
*/
addForm.addEventListener("submit", (event) => {
  // Не даём браузеру перезагрузить страницу
  event.preventDefault();

  const title = newTaskInput.value.trim();
  const date = taskDateInput.value;

  // Если название пустое, прекращаем выполнение
  if (!title) {
    return;
  }

  // Создаём объект новой задачи
  const newTask = {
    id: Date.now(),
    title: title,
    date: date,
    time: new Intl.DateTimeFormat("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date()),
    completed: false,
  };

  // Добавляем новую задачу в начало массива
  tasks.unshift(newTask);

  // После добавления показываем все задачи
  currentFilter = "all";

  // Делаем активной вкладку «Все»
  tabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.filter === "all");
  });

  // Обновляем список
  renderTasks();

  // Закрываем и очищаем форму
  closeAddPanel();
});

// --------------------------------------------------
// ПЕРВОНАЧАЛЬНЫЙ ЗАПУСК
// --------------------------------------------------

showCurrentDate();
renderTasks();
