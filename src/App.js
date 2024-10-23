import React, { useState } from 'react';
import { useRoutes } from 'react-router-dom';

import Login from "./components/auth/login/login"; 
import Register from "./components/auth/register/register"; 
import Header from "./components/header";
import Financial from "./components/home/Financial"; 
import Advisory from "./components/home/Advisory"; 
import FraudDetection from "./components/home/FraudDetection"; 
import { AuthProvider } from "./contexts/authContext";

function App() {
  // State management for financial data
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [monthlySavings, setMonthlySavings] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState([]);
  const [financialGoals, setFinancialGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({ amount: 0, description: '', date: '' });

  const routesArray = [
    {
      path: "*",
      element: <Login />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/financial",
      element: (
        <Financial
          monthlyIncome={monthlyIncome}
          setMonthlyIncome={setMonthlyIncome}
          monthlySavings={monthlySavings}
          setMonthlySavings={setMonthlySavings}
          monthlyExpenses={monthlyExpenses}
          setMonthlyExpenses={setMonthlyExpenses}
          financialGoals={financialGoals}
          setFinancialGoals={setFinancialGoals}
          setNewGoal={setNewGoal}
          newGoal={newGoal}
        />
      ), // Added Financial route with props and state setters
    },
    {
      path: "/advisory",
      element: (
        <Advisory
          monthlyIncome={monthlyIncome}
          monthlySavings={monthlySavings}
          monthlyExpenses={monthlyExpenses}
          financialGoals={financialGoals}
          newGoal={newGoal}
        />
      ), // Added Advisory route with props
    },
    {
      path: "/fraud-detection",
      element: <FraudDetection />, // Added Fraud Detection route
    },
  ];

  let routesElement = useRoutes(routesArray);

  return (
    <AuthProvider>
      <Header />
      <div className="w-full h-screen flex flex-col">
        {routesElement}
      </div>
    </AuthProvider>
  );
}

export default App;
