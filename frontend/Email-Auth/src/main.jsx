import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx';
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import SignUp from './components/SignUp.jsx';
import Login from './components/Login.jsx';
import Homepage from './components/Homepage.jsx';
import VerifyEmail from './components/VerifyEmail.jsx';
import ResetPassword from './components/ResetPassword.jsx';

const ProtectedRoute = ({ element, isAuthenticated }) => {
  return isAuthenticated ? element : <Navigate to="/login" />;
};
const isAuthenticated = localStorage.getItem("token");

const router = createBrowserRouter([
  {
    path: "/", element: <App />, children: [
      { path: "/", element: <Homepage /> },
      { path: "/signup", element: <SignUp /> },
      { path: "/login", element: <Login /> },
      { path: "/reset-password", element: <ResetPassword /> },
      {
        path: "/verify-email",
        element: (
          <ProtectedRoute
            element={<VerifyEmail />}
            isAuthenticated={isAuthenticated}
          />
        ),
      },
    ]
  },

])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
