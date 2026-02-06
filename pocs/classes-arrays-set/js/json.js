const tasksJSON = JSON.stringify(tasksArray, null, 2);

const loadedTasks = JSON.parse(tasksJSON).map((obj) =>
  Object.assign(new Task(), obj),
);
