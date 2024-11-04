import "./App.css";
import DashboardLayout from "./components/Dashboard/Dashboard";
import { AuthProvider, useAuth } from "./components/Security/AuthProvider";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import AddExpenseForm from "./components/Expenses/AddExpenseForm";
import AddIncomeForm from "./components/Expenses/AddIncomeForm";
import MainContent from "./components/Dashboard/Elements/MainContent";
import ViewTransactions from "./components/Transactions/ViewTransactions";
import Settings from "./components/SettingAndSupport/Settings";
import Support from "./components/SettingAndSupport/Support";
import { Report } from "./components/Report/Report";
import Trip from "./components/Trip/Trip";
import Expenses from "./components/Expenses/Expenses";
import Incomes from "./components/Expenses/Incomes";
import SignUpSignIn from "./components/Security/SignInAndSignUp";
import LogOut from "./components/Security/LogOut";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import BottomNavBar from "./components/Dashboard/BottomNavBar";

function PrivateRoute({ element }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? element : <Navigate to="/login" replace />;
}

// Define routes with route guards
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute element={<DashboardLayout name="Deepak Nishad" />} />
    ),
    children: [
      { path: "/", element: <MainContent /> },
      { path: "/nav", element: <BottomNavBar /> },
      { path: "/expense", element: <Expenses /> },
      { path: "/new-expense", element: <AddExpenseForm /> },
      { path: "/income", element: <Incomes /> },
      { path: "/new-income", element: <AddIncomeForm /> },
      { path: "/view-transactions", element: <ViewTransactions /> },
      { path: "/settings", element: <Settings /> },
      { path: "/support", element: <Support /> },
      { path: "/generate-report", element: <Report /> },
      { path: "/trip", element: <Trip /> },
      { path: "/logout", element: <LogOut /> },
    ],
  },
  {
    path: "/login",
    element: <SignUpSignIn />, // Render the full login page here
  },
]);

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <RouterProvider router={router} />
      </div>
    </AuthProvider>
  );
}

export default App;
