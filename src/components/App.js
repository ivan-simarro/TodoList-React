import { useEffect, useState } from "react";
import "./App.scss";

export default function App() {
  const [input, setInput] = useState(sessionStorage.getItem("input") || "");
  const [todos, setTodos] = useState(
    JSON.parse(sessionStorage.getItem("todos")) || []
  );
  const initalState = {
    name: "",
    id: todos.length,
    isCompleted: false,
  };
  const [newTodo, setNewTodo] = useState(initalState);
  const [creating, setCreating] = useState(true);
  const [editTodo, setEditTodo] = useState({});

  function handleChange(e) {
    setInput(e.target.value);
  }

  function handleAdd(e) {
    setNewTodo({
      name: input,
      id: todos.length + 1,
      isCompleted: false,
    });
  }

  function handleInput(e, t) {
    setInput(t.name);
    setCreating(false);
    setEditTodo(t);
  }

  function handleEdit(e) {
    setTodos(
      todos.map((todo) => {
        return todo.id === editTodo.id ? { ...todo, name: input } : todo;
      })
    );
    setCreating(true);
    setInput("");
    setEditTodo({});
  }

  function handleDelete(e, t) {
    setTodos(todos.filter((todo) => todo.id !== t.id));
  }

  function handleComplete(e, t) {
    setTodos(
      todos.map((todo) => {
        return todo.id === t.id
          ? { ...todo, isCompleted: !todo.isCompleted }
          : todo;
      })
    );
  }

  useEffect(() => {
    if (newTodo.name !== "") {
      setTodos([...todos, newTodo]);
      setNewTodo(initalState);
      setInput("");
    }
  }, [newTodo]);

  useEffect(() => {
    sessionStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    sessionStorage.setItem("input", input);
  }, [input]);

  return (
    <section className="todo">
      <h1 className="todo__h1">Todo list</h1>
      <div className="todo__list">
        <input
          className="todo__list--input"
          placeholder="Introduce a todo..."
          value={input}
          onChange={(e) => handleChange(e)}
        />
        <button
          className="todo__list--button"
          onClick={(e) => (creating ? handleAdd(e) : handleEdit(e))}
        >
          {creating ? "Add" : "Edit"}
        </button>
      </div>
      <div className="todos">
        {todos.map((t) => {
          return (
            <div key={t.id} className="todos__todo">
              {!t.isCompleted ? (
                <p>{t.name}</p>
              ) : (
                <p style={{ textDecoration: "line-through" }}>{t.name}</p>
              )}
              <div key={t.id} className="todos__todo--btns">
                <button
                  className="todo__list--button"
                  style={{ width: "80px" }}
                  onClick={(e) => handleComplete(e, t)}
                >
                  {!t.isCompleted ? "Done!" : "Not Done"}
                </button>
              {!t.isCompleted && 
                <button
                  className="todo__list--button"
                  onClick={(e) => handleInput(e, t)}
                >
                  Edit
                </button>
              }
                <button
                  className="todo__list--button"
                  onClick={(e) => handleDelete(e, t)}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
