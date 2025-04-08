document.addEventListener("DOMContentLoaded", function () {
  const todoInput = document.getElementById("todo-input");
  const addButton = document.getElementById("add-button");
  const todoList = document.getElementById("todo-list");
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = themeToggle.querySelector(".material-icons");

  let draggedItem = null;

  // Theme toggle functionality
  themeToggle.addEventListener("click", function () {
    const html = document.documentElement;
    const currentTheme = html.getAttribute("data-theme");

    if (currentTheme === "dark") {
      html.setAttribute("data-theme", "light");
      themeIcon.textContent = "dark_mode"; // Moon icon
    } else {
      html.setAttribute("data-theme", "dark");
      themeIcon.textContent = "light_mode"; // Sun icon
    }
  });

  // Function to add a new task
  function addTask() {
    const taskText = todoInput.value.trim();

    if (taskText !== "") {
      // Create new list item
      const li = document.createElement("li");
      li.className = "todo-item";
      li.draggable = true;

      // Create drag handle icon
      const dragHandle = document.createElement("div");
      dragHandle.className = "drag-handle";
      const dragIcon = document.createElement("span");
      dragIcon.className = "material-icons";
      dragIcon.textContent = "drag_indicator";
      dragHandle.appendChild(dragIcon);

      // Create check button
      const checkButton = document.createElement("button");
      checkButton.className = "check-button";
      const checkIcon = document.createElement("span");
      checkIcon.className = "material-icons";
      checkIcon.textContent = "check";
      checkButton.appendChild(checkIcon);

      // Create task text
      const taskTextSpan = document.createElement("span");
      taskTextSpan.className = "todo-text";
      taskTextSpan.textContent = taskText;

      // Create delete button
      const deleteButton = document.createElement("button");
      deleteButton.className = "delete-button";
      const deleteIcon = document.createElement("span");
      deleteIcon.className = "material-icons";
      deleteIcon.textContent = "delete";
      deleteButton.appendChild(deleteIcon);

      // Append elements to list item
      li.appendChild(dragHandle);
      li.appendChild(checkButton);
      li.appendChild(taskTextSpan);
      li.appendChild(deleteButton);

      // Add the new task to the list
      todoList.appendChild(li);

      // Clear input field
      todoInput.value = "";

      // Add event listener to toggle completion
      checkButton.addEventListener("click", function () {
        checkButton.classList.toggle("completed");
        li.classList.toggle("completed");
      });

      // Add event listener to delete task
      deleteButton.addEventListener("click", function () {
        todoList.removeChild(li);
      });

      // Add drag event listeners
      li.addEventListener("dragstart", handleDragStart);
      li.addEventListener("dragover", handleDragOver);
      li.addEventListener("drop", handleDrop);
      li.addEventListener("dragend", handleDragEnd);
    }
  }

  // Event listener for Add button click
  addButton.addEventListener("click", addTask);

  // Event listener for Enter key press
  todoInput.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      addTask();
    }
  });

  // Drag and drop handlers
  function handleDragStart(e) {
    draggedItem = this;
    setTimeout(() => this.classList.add("dragging"), 0);

    // Set data for drag operation
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", this.outerHTML);
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    const targetItem = e.target.closest(".todo-item");

    if (targetItem && targetItem !== draggedItem) {
      // Determine whether to place the dragged item before or after the target
      const boundingRect = targetItem.getBoundingClientRect();
      const offset = boundingRect.y + boundingRect.height / 2;

      if (e.clientY - offset > 0) {
        todoList.insertBefore(draggedItem, targetItem.nextSibling);
      } else {
        todoList.insertBefore(draggedItem, targetItem);
      }
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }

  function handleDragEnd() {
    this.classList.remove("dragging");
    draggedItem = null;
  }
});
