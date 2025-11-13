import { useState } from "react";

interface AddTodoProps {
  todoList: string[];
  setTodoList: (list: string[]) => void;
}

interface TargetValue {
  value: string;
}

interface Target {
  target: TargetValue;
}

const AddTodo = ({ todoList, setTodoList }: AddTodoProps) => {
  const [inputValue, setInputValue] = useState<string>("");

  const handleKeyPressed = ({ key }: { key: string }) => {
    if (key === "Enter") {
      handleInputChange();
    }
  };

  const handleInputChange = () => {
    if (!inputValue.trim()) return;

    const newTodoList = [...todoList, inputValue.trim()];
    setTodoList(newTodoList);
    setInputValue("");
  };

  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-lg mx-auto bg-gray-900 text-white rounded-2xl p-6 shadow-lg">
      <h4 className="text-xl font-semibold mb-2 border-b border-gray-700 pb-2 w-full text-center">
        Add your task
      </h4>

      <div className="flex w-full items-center gap-2">
        <input
          className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 text-sm"
          type="text"
          name="task"
          placeholder="Type your next task..."
          onChange={({ target }: Target) => setInputValue(target.value)}
          value={inputValue}
          onKeyDown={handleKeyPressed}
        />

        <button
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium transition active:scale-95"
          onClick={handleInputChange}
        >
          Add Task
        </button>
      </div>
    </div>
  );
};

export default AddTodo;
