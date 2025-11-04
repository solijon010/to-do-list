document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("task-input");
  const addtaskBtn = document.getElementById("add-task-btn");
  const taskList = document.getElementById("task-list");
  const emptyImage = document.querySelector(".empty-image");
  const todosContainer = document.querySelector(".todos-container");
  const progressBar = document.getElementById("progress");
  const progressNumber = document.getElementById("numbers");

  // Bo'sh holatni toggle qilish
  const toggleEmptyState = () => {
    emptyImage.style.display =
      taskList.children.length === 0 ? "block" : "none";
    todosContainer.style.width = taskList.children.length > 0 ? "100%" : "50%";
  };

  // Progress barni yangilash
  const updateProgress = () => {
    const totalTasks = taskList.children.length;
    const completedTasks =
      taskList.querySelectorAll(".checkbox:checked").length;

    const percent = totalTasks ? (completedTasks / totalTasks) * 100 : 0;
    progressBar.style.width = `${percent}%`;
    progressNumber.textContent = `${completedTasks}/${totalTasks}`;

    // Agar barcha tasklar bajarilgan bo'lsa, confetti ishga tushadi
    if (totalTasks > 0 && completedTasks === totalTasks) {
      Confetti();
    }
  };

  // Tasklarni localStorage ga saqlash
  const saveTasks = () => {
    const tasks = [];
    taskList.querySelectorAll("li").forEach(li => {
      tasks.push({
        text: li.querySelector("span").textContent,
        completed: li.querySelector(".checkbox").checked
      });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };

  // Task qo'shish funksiyasi
  const addTask = (text, completed = false) => {
    const taskText = text || taskInput.value.trim();
    if (!taskText) return;

    const li = document.createElement("li");
    li.innerHTML = `
      <input type="checkbox" class="checkbox" ${completed ? "checked" : ""}/>
      <span>${taskText}</span>
      <div class="task-buttons">
        <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
        <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
      </div>
    `;

    const checkbox = li.querySelector(".checkbox");
    const editBtn = li.querySelector(".edit-btn");

    if (completed) {
      li.classList.add("completed");
      editBtn.disabled = true;
      editBtn.style.opacity = "0.5";
      editBtn.style.pointerEvents = "none";
    }

    // Checkbox holatini o'zgartirish
    checkbox.addEventListener("change", () => {
      const isChecked = checkbox.checked;
      li.classList.toggle("completed", isChecked);
      editBtn.disabled = isChecked;
      editBtn.style.opacity = isChecked ? "0.5" : "1";
      editBtn.style.pointerEvents = isChecked ? "none" : "auto";
      updateProgress();
      saveTasks();
    });

    // Edit button
    editBtn.addEventListener("click", () => {
      if (!checkbox.checked) {
        taskInput.value = li.querySelector("span").textContent;
        li.remove();
        toggleEmptyState();
        updateProgress();
        saveTasks();
      }
    });

    // Delete button
    li.querySelector(".delete-btn").addEventListener("click", () => {
      li.remove();
      toggleEmptyState();
      updateProgress();
      saveTasks();
    });

    taskList.append(li);
    taskInput.value = "";
    toggleEmptyState();
    updateProgress();
    saveTasks();
  };

  // Saqlangan tasklarni yuklash
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  savedTasks.forEach(task => addTask(task.text, task.completed));

  // Add task tugmasi
  addtaskBtn.addEventListener("click", () => addTask());

  // Enter tugmasi bilan qo'shish
  taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTask();
    }
  });

  toggleEmptyState();
  updateProgress();
});

// Confetti funksiyasi
const Confetti = () => {
  const count = 200,
    defaults = { origin: { y: 0.7 } };

  function fire(particleRatio, opts) {
    confetti(
      Object.assign({}, defaults, opts, {
        particleCount: Math.floor(count * particleRatio),
      })
    );
  }

  fire(0.25, { spread: 26, startVelocity: 55 });
  fire(0.2, { spread: 60 });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
  fire(0.1, { spread: 120, startVelocity: 45 });
};
