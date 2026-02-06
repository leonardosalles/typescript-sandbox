class Task {
  constructor(title, priority) {
    this.title = title;
    this.priority = priority;
    this.id = crypto.randomUUID();
    this.completed = false;
  }

  complete() {
    this.completed = true;
  }
}
