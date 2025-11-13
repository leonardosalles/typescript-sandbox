import { type ReactElement } from "react";
import { DeleteTodo } from "../DeleteTodo";

interface ITodoListProps {
  todoList: string[];
  setTodoList: (list: string[]) => void;
  todoCompleted: string[];
  setTodoCompleted: (list: string[]) => void;
}

const TodoList = ({
  todoList,
  setTodoList,
  todoCompleted,
  setTodoCompleted,
}: ITodoListProps): ReactElement => {
  const removeTodoFromList = (todo: string, list: string[]): string[] =>
    list.filter((t) => t !== todo);

  const handleDelete = (todo: string) =>
    setTodoList(removeTodoFromList(todo, todoList));
  const handleDeleteCompleted = (todo: string) =>
    setTodoCompleted(removeTodoFromList(todo, todoCompleted));
  const handleCompleted = (todo: string) => {
    setTodoList(removeTodoFromList(todo, todoList));
    setTodoCompleted([...todoCompleted, todo]);
  };
  const handleList = (todo: string) => {
    setTodoCompleted(removeTodoFromList(todo, todoCompleted));
    setTodoList([...todoList, todo]);
  };

  return (
    <div className="w-full max-w-lg mx-auto p-6 bg-gray-900 rounded-2xl shadow-lg text-white">
      <h4 className="text-xl font-semibold mb-3 border-b border-gray-700 pb-2">
        Tasks
      </h4>

      <div className="space-y-2">
        {todoList?.map((todo, index) => (
          <div
            key={`todo-${index}`}
            className="flex items-center justify-between bg-gray-800 rounded-xl px-4 py-2 hover:bg-gray-750 transition"
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={false}
                onChange={() => handleCompleted(todo)}
                className="h-5 w-5 text-indigo-500 accent-indigo-500 rounded cursor-pointer"
              />
              <span className="text-sm">{todo}</span>
            </div>

            <button
              onClick={() => handleDelete(todo)}
              className="p-2 hover:bg-gray-700 rounded-full transition"
            >
              <DeleteTodo />
            </button>
          </div>
        ))}

        {(!todoList || !todoList.length) && (
          <p className="text-sm text-gray-400 text-center mt-2">
            🎉 No tasks to complete
          </p>
        )}
      </div>

      <h4 className="text-xl font-semibold mt-6 mb-3 border-b border-gray-700 pb-2">
        Completed
      </h4>

      <div className="space-y-2">
        {todoCompleted?.map((todo, index) => (
          <div
            key={`todo-completed-${index}`}
            className="flex items-center justify-between bg-gray-800 rounded-xl px-4 py-2 opacity-70 hover:opacity-100 transition"
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked
                onChange={() => handleList(todo)}
                className="h-5 w-5 text-indigo-500 accent-indigo-500 rounded cursor-pointer"
              />
              <span className="text-sm line-through">{todo}</span>
            </div>

            <button
              onClick={() => handleDeleteCompleted(todo)}
              className="p-2 hover:bg-gray-700 rounded-full transition"
            >
              <DeleteTodo />
            </button>
          </div>
        ))}

        {(!todoCompleted || !todoCompleted.length) && (
          <p className="text-sm text-gray-500 text-center mt-2">
            No completed tasks yet
          </p>
        )}
      </div>
    </div>
  );
};

export default TodoList;
