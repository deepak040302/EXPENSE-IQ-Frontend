import { transactions } from "./Icon";
import { CreditCard, Home, Settings, Users} from "lucide-react";
export const NavItems = [
  {
    id: 1,
    title: "Home",
    icon: <Home />,
    link: "/",
  },
  {
    id: 2,
    title: "View Transactions",
    icon: transactions,
    link: "/view-transactions",
  },
  {
    id: 3,
    title: "Incomes",
    icon: <CreditCard />,
    link: "/income",
  },
  {
    id: 4,
    title: "Expenses",
    icon: <CreditCard />,
    link: "/expense",
  },
  {
    id: 5,
    title: "Settings",
    icon: <Settings />,
    link: "/settings",
  },
  {
    id: 6,
    title: "Support",
    icon: <Users />,
    link: "/support",
  },
];
