import React, { useState } from "react";
import "./BottomNavBar.css";
import { useNavigate } from "react-router-dom";
import { CreditCard, Home, Settings, Users, Banknote } from "lucide-react";
import { transactions } from "../../utils/Icon";

const BottomNavBar = () => {
  const naviagte = useNavigate();
  const [activeTab, setActiveTab] = useState("home");

  const handleTabClick = (tab) => {
    setActiveTab(tab);

    switch (tab) {
        case "home":
            naviagte("/");
            break;

        case "transactions":
            naviagte("/view-transactions");
            break;

        case "incomes":
            naviagte("/income");
            break;
            
        case "expenses":
            naviagte("/expense");
            break;
            
        case "settings":
            naviagte("/settings");
            break;

        default:
            break;
    }
  };

  return (
    <div className="tabbar tab-style2">
      <ul className="flex-center">
        <li
          className={`home ${activeTab === "home" ? "active" : ""}`}
          onClick={() => handleTabClick("home")}
          data-where="home"
        >
          <span>{<Home />}</span>
        </li>
        <li
          className={`transactions ${activeTab === "transactions" ? "active" : ""}`}
          onClick={() => handleTabClick("transactions")}
          data-where="transactions"
        >
          <span className="material-icons-outlined">{transactions}</span>
        </li>
        <li
          className={`incomes ${activeTab === "incomes" ? "active" : ""}`}
          onClick={() => handleTabClick("incomes")}
          data-where="incomes"
        >
          <span className="material-icons-outlined">{<Banknote/>}</span>
        </li>
        <li
          className={`expenses ${activeTab === "expenses" ? "active" : ""}`}
          onClick={() => handleTabClick("expenses")}
          data-where="expenses"
        >
          <span className="material-icons-outlined">{<CreditCard/>}</span>
        </li>
        <li
          className={`settings ${activeTab === "settings" ? "active" : ""}`}
          onClick={() => handleTabClick("settings")}
          data-where="settings"
        >
          <span className="material-icons-outlined">{<Settings/>}</span>
        </li>
      </ul>
    </div>
  );
};

export default BottomNavBar;
