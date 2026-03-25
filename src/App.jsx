import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import TaskDetails from "./pages/TaskDetails";
import EditTask from "./pages/EditTask";
import VitalTask from "./pages/VitalTask";
import MyTask from "./pages/MyTask";
import TaskCategories from "./pages/TaskCategories";
import Settings from "./pages/Settings";
import Help from "./pages/Help";

// Redirects to /login if not authenticated
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  return user ? children : <Navigate to="/login" replace />;
};

// Redirects logged-in users away from auth pages
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  return user ? <Navigate to="/" replace /> : children;
};

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

const App = () => (
  <AuthProvider>
    <Routes>
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <SignupPage />
          </PublicRoute>
        }
      />
      <Route
        path="/task/:id"
        element={
          <PrivateRoute>
            <TaskDetails />
          </PrivateRoute>
        }
      />
      <Route
        path="/edit/:id"
        element={
          <PrivateRoute>
            <EditTask />
          </PrivateRoute>
        }
      />
      <Route path="/vital"      element={<PrivateRoute><VitalTask /></PrivateRoute>} />
      <Route path="/tasks"      element={<PrivateRoute><MyTask /></PrivateRoute>} />
      <Route path="/categories" element={<PrivateRoute><TaskCategories /></PrivateRoute>} />
      <Route path="/settings"   element={<PrivateRoute><Settings /></PrivateRoute>} />
      <Route path="/help"       element={<PrivateRoute><Help /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </AuthProvider>
);

export default App;
