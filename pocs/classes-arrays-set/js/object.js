const tasksObject = {};
tasksArray.forEach((task) => {
  if (!tasksObject[task.priority]) tasksObject[task.priority] = [];
  tasksObject[task.priority].push(task.title);
});
