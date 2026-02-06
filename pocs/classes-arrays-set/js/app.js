const newTask = new Task("Learn Map & Set", "high");
document.getElementById("class-output").textContent =
  `New task: ${newTask.title}, completed: ${newTask.completed}`;

document.getElementById("array-output").textContent =
  `High priority tasks: ${highPriorityTasks.map((t) => t.title).join(", ")}
First medium priority task: ${firstMedium.title}`;

document.getElementById("object-output").textContent = JSON.stringify(
  tasksObject,
  null,
  2,
);

document.getElementById("map-output").textContent = Array.from(
  tasksMap.entries(),
  ([id, task]) => `${id}: ${task.title}`,
).join("\n");

document.getElementById("set-output").textContent =
  Array.from(tasksSet).join(", ");

document.getElementById("json-output").textContent = tasksJSON;
