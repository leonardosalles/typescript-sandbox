import { useState, useEffect } from "react";
import { AddTodo } from "../AddTodo";
import { TodoList } from "../TodoList";

const Container = () => {
  const TODO_LIST_KEY = "todoList";
  const TODO_COMPLETED_KEY = "todoCompleted";

  const [todoList, setTodoList] = useState<string[]>([]);
  const [todoCompleted, setTodoCompleted] = useState<string[]>([]);

  useEffect(() => {
    const savedTodoList = localStorage.getItem(TODO_LIST_KEY);
    const savedCompleted = localStorage.getItem(TODO_COMPLETED_KEY);

    if (savedTodoList) setTodoList(JSON.parse(savedTodoList));
    if (savedCompleted) setTodoCompleted(JSON.parse(savedCompleted));
  }, []);

  useEffect(() => {
    localStorage.setItem(TODO_LIST_KEY, JSON.stringify(todoList));
  }, [todoList]);

  useEffect(() => {
    localStorage.setItem(TODO_COMPLETED_KEY, JSON.stringify(todoCompleted));
  }, [todoCompleted]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-800 p-6">
      <div className="w-full max-w-2xl bg-gray-100 rounded-2xl shadow-xl p-8 flex flex-col gap-8 bg-gray-700">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2 text-white">
          📝 My To-Do List
        </h1>

        <AddTodo todoList={todoList} setTodoList={setTodoList} />

        <TodoList
          todoList={todoList}
          setTodoList={setTodoList}
          todoCompleted={todoCompleted}
          setTodoCompleted={setTodoCompleted}
        />
      </div>
    </div>
  );
};

export default Container;
