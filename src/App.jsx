import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import TaskDetails from "./pages/TaskDetails";
import EditTask from "./pages/EditTask";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/task/:id" element={<TaskDetails />} />
      <Route path="/edit/:id" element={<EditTask />} />
    </Routes>
  );
}

export default App;