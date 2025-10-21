import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import LoginPage from '@/pages/LoginPage';
import DashboardLayout from '@/pages/DashboardLayout';
import DashboardOverviewPage from '@/pages/admin/DashboardOverviewPage';
import StudentsPage from '@/pages/admin/StudentsPage';
import StaffPage from '@/pages/admin/StaffPage';
import MyStudentsPage from '@/pages/staff/MyStudentsPage';
import ManageResultsPage from '@/pages/staff/ManageResultsPage';
import MyResultsPage from '@/pages/student/MyResultsPage';
import ProfilePage from '@/pages/ProfilePage';
import { useAuth } from './lib/auth';
import { RouteErrorBoundary } from "./components/RouteErrorBoundary";
export default function App() {
  const user = useAuth(s => s.user);
  const role = useAuth(s => s.role);
  const getDashboardRedirect = () => {
    switch (role) {
      case 'admin':
        return '/dashboard/overview';
      case 'staff':
        return '/dashboard/my-students';
      case 'student':
        return '/dashboard/my-results';
      default:
        return '/login';
    }
  };
  const router = createBrowserRouter([
    {
      path: "/login",
      element: user ? <Navigate to={getDashboardRedirect()} replace /> : <LoginPage />,
      errorElement: <RouteErrorBoundary />,
    },
    {
      path: "/",
      element: <Navigate to="/login" replace />,
      errorElement: <RouteErrorBoundary />,
    },
    {
      path: "/dashboard",
      element: user ? <DashboardLayout /> : <Navigate to="/login" replace />,
      errorElement: <RouteErrorBoundary />,
      children: [
        { index: true, element: <Navigate to={getDashboardRedirect()} replace /> },
        // Admin Routes
        { path: "overview", element: role === 'admin' ? <DashboardOverviewPage /> : <Navigate to={getDashboardRedirect()} /> },
        { path: "students", element: role === 'admin' ? <StudentsPage /> : <Navigate to={getDashboardRedirect()} /> },
        { path: "staff", element: role === 'admin' ? <StaffPage /> : <Navigate to={getDashboardRedirect()} /> },
        // Staff Routes
        { path: "my-students", element: role === 'staff' ? <MyStudentsPage /> : <Navigate to={getDashboardRedirect()} /> },
        { path: "results", element: role === 'staff' ? <ManageResultsPage /> : <Navigate to={getDashboardRedirect()} /> },
        // Student Routes
        { path: "my-results", element: role === 'student' ? <MyResultsPage /> : <Navigate to={getDashboardRedirect()} /> },
        // Common Routes
        { path: "profile", element: <ProfilePage /> },
      ]
    }
  ]);
  return <RouterProvider router={router} />;
}