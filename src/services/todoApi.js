import API from "./api";

// GET all todos
export const getTodos = (status) =>
  API.get(status ? `/todos?status=${status}` : "/todos");

// GET single todo
export const getTodoById = (id) => API.get(`/todos/${id}`);

// GET stats
export const getStats = () => API.get("/todos/status");

// CREATE todo
export const createTodo = (data) =>
  API.post("/todos", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// UPDATE todo
export const updateTodo = (id, data) =>
  API.put(`/todos/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// DELETE todo
export const deleteTodo = (id) => API.delete(`/todos/${id}`);
