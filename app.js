document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("task-input");
  const addtaskBtn = document.getElementById("add-task-btn");
  const taskList = document.getElementById("task-list");
  const emptyImage = document.querySelector(".empty-image");

  // 🔹 Bo‘sh holatni ko‘rsatish yoki yashirish funksiyasi
  const toggleEmptyState = () => {
    emptyImage.style.display =
      taskList.children.length === 0 ? "block" : "none";
  };

  // 🔹 Yangi task qo‘shish funksiyasi
  const addTask = (event) => {
    event.preventDefault();

    // ❌ Noto‘g‘ri edi: taskInput.ariaValueMax
    // ✅ To‘g‘risi:
    const taskText = taskInput.value.trim();

    if (!taskText) {
      return;
    }

    const li = document.createElement("li");
    li.innerHTML = `
      <input type="checkbox" class="checkbox">
      <span>${taskText}</span>
      <div class="task-buttons">
        <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
        <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
      </div>
    `;

    taskList.append(li);
    taskInput.value = "";
    toggleEmptyState();
  };

  addtaskBtn.addEventListener("click", addTask);

  taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addTask(e);
    }
  });

  toggleEmptyState();
});
