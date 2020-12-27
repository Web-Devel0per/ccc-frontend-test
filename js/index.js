document.getElementById("button").addEventListener("click", function () {
  document.querySelector(".popup").style.display = "flex";
});

document.querySelector("#close").addEventListener("click", function () {
  document.querySelector(".popup").style.display = "none";
});

document.querySelector(".popup").onclick = function (e) {
  if (
    e.target !== document.querySelector(".popup-content") &&
    e.target !== document.getElementById("todoInput") &&
    e.target !== document.querySelector(".popup-content h5") &&
    e.target !== document.querySelector(".popup button")
  ) {
    document.querySelector(".popup").style.display = "none";
  }
};

document.querySelector(".popup-edit").onclick = function (e) {
  if (
    e.target !== document.querySelector(".popup-content-edit") &&
    e.target !== document.getElementById("todoInput-edit") &&
    e.target !== document.querySelector(".popup-content-edit h5") &&
    e.target !== document.querySelector(".popup-edit button")
  ) {
    document.querySelector(".popup-edit").style.display = "none";
  }
};

// Tasks
let tasks = JSON.parse(localStorage.getItem('task-manager-test'))
  ? JSON.parse(localStorage.getItem('task-manager-test'))
  : [];

function renderTasks() {
  if(tasks) {
    const tasksCopy = tasks.filter(f => f.name.toLowerCase().trim().includes(document.getElementById('search').value.toLowerCase().trim()));
    document.getElementById("todoList").innerHTML = tasksCopy.reverse().map((t,i) => `
      <li class="${t.completed ? "completed" : ""}">
        <div>
          <input type="checkbox" ${t.completed ? "checked" : ""} class="checkbox-${tasksCopy.length - (i+1)}" />
          <span>${t.name}</span>
        </div>
        <div>
          <i class="fas fa-pen edit-${tasksCopy.length - (i+1)}" id="edit"></i>
          <i class="fas fa-trash delete-${tasksCopy.length - (i+1)}" id="delete"></i>
        </div>
      </li>
    `).join("");

    tasksCopy.forEach((t,i) => {
      document.querySelector(`.checkbox-${i}`).onclick = function() {
        tasks[i] = { ...tasks[i], completed: !tasks[i].completed };
        localStorage.setItem('task-manager-test', JSON.stringify(tasks));
        renderTasks();
      }

      document.querySelector(`.delete-${i}`).onclick = function() {
        tasks = tasks.filter((t, index) => i !== index);
        localStorage.setItem('task-manager-test', JSON.stringify(tasks));
        renderTasks();
      }

      document.querySelector(`.edit-${i}`).onclick = function() {
        document.querySelector('.popup-edit').style.display = 'flex';
        document.querySelector('#todoInput-edit').value = tasks[i].name;
        document.querySelector('.popup-edit button').onclick = function() {
          if(document.querySelector('#todoInput-edit').value) {
            tasks[i] = { ...tasks[i], name: document.querySelector('#todoInput-edit').value };
            document.querySelector('.popup-edit').style.display = 'none';
            localStorage.setItem('task-manager-test', JSON.stringify(tasks));
            renderTasks();
          }
        }
      }
    });

    document.getElementById('latest-tasks').innerHTML = tasks.filter((t,i) => i > tasks.length-4).reverse().map(t => `
      <li class="${t.completed ? "completed" : ""}">${t.name}</li>
    `).join('');

    console.log(tasks)

    document.querySelector('.chart').setAttribute('style', `background: conic-gradient(#3387d6 0% ${tasks.filter(t => t.completed).length/tasks.length*100}%, #ecf0f1 ${tasks.filter(t => t.completed).length/tasks.length*100}% 80%, #ecf0f1 80% 100%)`);
    document.getElementById('task-count').innerHTML = `${tasks.filter(t => t.completed).length}<sub>/${tasks.length}</sub>`;
  }
}

document.querySelector(".popup button").onclick = function () {
  const item = document.getElementById("todoInput").value;
  if (item.trim() !== "") {
    tasks.push({
      name: item,
      completed: false,
    });
    localStorage.setItem('task-manager-test', JSON.stringify(tasks));
    renderTasks();

    document.querySelector(".popup").style.display = "none";
    document.getElementById("todoInput").value = "";
  }
};

renderTasks();

document.getElementById('search').addEventListener('input', (event) =>{
  renderTasks();
});