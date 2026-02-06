const tasksArray = [
  new Task("Study JS", "high"),
  new Task("Review POC", "medium"),
  new Task("Rest", "low"),
];

const highPriorityTasks = tasksArray.filter((t) => t.priority === "high");
const taskTitles = tasksArray.map((t) => t.title);
const firstMedium = tasksArray.find((t) => t.priority === "medium");
