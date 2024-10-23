import React, { useState, useEffect } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import Advisory from '../home/Advisory';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Financial = () => {
  const [newExpense, setNewExpense] = useState({ category: '', amount: 0 });
  const [monthlyExpenses, setMonthlyExpenses] = useState([]);
  const [upcomingBills, setUpcomingBills] = useState([]);
  const [financialGoals, setFinancialGoals] = useState({ goalAmount: 0, currentSavings: 0 });
  const [income, setIncome] = useState();
  const [goalProgress, setGoalProgress] = useState(0);
  const [riskTolerance, setRiskTolerance] = useState('');
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({ amount: 0, description: '', date: '' });

  // Load data from localStorage when the component mounts
  useEffect(() => {
    const storedExpenses = JSON.parse(localStorage.getItem('monthlyExpenses')) || [];
    const storedGoals = JSON.parse(localStorage.getItem('goals')) || [];
    const storedFinancialGoals = JSON.parse(localStorage.getItem('financialGoals')) || { goalAmount: 0, currentSavings: 0 };
    const storedUpcomingBills = JSON.parse(localStorage.getItem('upcomingBills')) || [];
    const storedNewExpense = JSON.parse(localStorage.getItem('newExpense')) || { category: '', amount: 0 };
    const storedNewGoal = JSON.parse(localStorage.getItem('newGoal')) || { amount: 0, description: '', date: '' };

    setMonthlyExpenses(storedExpenses);
    setGoals(storedGoals);
    setFinancialGoals(storedFinancialGoals);
    setUpcomingBills(storedUpcomingBills);
    setNewExpense(storedNewExpense);
    setNewGoal(storedNewGoal);
  }, []);

  // Store data in localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('monthlyExpenses', JSON.stringify(monthlyExpenses));
    localStorage.setItem('goals', JSON.stringify(goals));
    localStorage.setItem('financialGoals', JSON.stringify(financialGoals));
    localStorage.setItem('upcomingBills', JSON.stringify(upcomingBills));
    localStorage.setItem('newExpense', JSON.stringify(newExpense));
    localStorage.setItem('newGoal', JSON.stringify(newGoal));
  }, [monthlyExpenses, goals, financialGoals, upcomingBills, newExpense, newGoal]);

  const totalExpenses = monthlyExpenses.reduce((acc, expense) => acc + expense.amount, 0);
  const remainingBalance = financialGoals.goalAmount - financialGoals.currentSavings - totalExpenses;

  const barChartData = {
    labels: monthlyExpenses.map(expense => expense.category),
    datasets: [
      {
        label: 'Monthly Expenses',
        data: monthlyExpenses.map(expense => expense.amount),
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const doughnutChartData = {
    labels: ['Current Savings', 'Remaining to Goal'],
    datasets: [
      {
        label: 'Savings Progress',
        data: [
          financialGoals.currentSavings,
          financialGoals.goalAmount - financialGoals.currentSavings,
        ],
        backgroundColor: ['rgba(54, 162, 235, 0.7)', 'rgba(255, 99, 132, 0.7)'],
      },
    ],
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (newExpense.category && newExpense.amount > 0) {
      setMonthlyExpenses([...monthlyExpenses, newExpense]);
      setNewExpense({ category: '', amount: 0 });
    }
  };

  const handleDeleteExpense = (index) => {
    const updatedExpenses = monthlyExpenses.filter((_, i) => i !== index);
    setMonthlyExpenses(updatedExpenses);
  };

  const handleUpdateSavings = (e) => {
    const { name, value } = e.target;
    setFinancialGoals((prevGoals) => ({
      ...prevGoals,
      [name]: Number(value),
    }));
  };

  const handleAddBill = (e) => {
    e.preventDefault();
    const billDate = e.target.billDate.value;
    const billAmount = Number(e.target.billAmount.value);
    const billDescription = e.target.billDescription.value;

    if (billDate && billAmount > 0 && billDescription) {
      setUpcomingBills([...upcomingBills, { date: billDate, amount: billAmount, description: billDescription }]);
      e.target.reset();
    }
  };

  const handleDeleteBill = (index) => {
    const updatedBills = upcomingBills.filter((_, i) => i !== index);
    setUpcomingBills(updatedBills);
  };

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (newGoal.amount > 0 && newGoal.description && newGoal.date) {
      setGoals([...goals, newGoal]);
      setNewGoal({ amount: 0, description: '', date: '' });
    }
  };

  const handleDeleteGoal = (index) => {
    const updatedGoals = goals.filter((_, i) => i !== index);
    setGoals(updatedGoals);
  };

  return (
    <div className="flex flex-col items-center justify-start p-8 bg-gray-900 text-gray-200 h-screen overflow-y-auto my-3">
      <h1 className="text-5xl font-bold mb-6 text-white">Financials</h1>

      <div className="flex flex-col items-center bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-5xl mb-6 transition-shadow duration-300 hover:shadow-2xl">
        <h2 className="text-3xl font-semibold text-green-400">Remaining Balance: ₹{remainingBalance}</h2>
        <h2 className="text-2xl font-semibold text-white mt-2">Current Savings: ₹{financialGoals.currentSavings}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl mb-6">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 transition-shadow duration-300 hover:shadow-2xl">
          <h2 className="text-2xl font-semibold mb-4">Monthly Financials</h2>
          <div className="flex flex-col mb-4">
            <label>
              <strong>Monthly Income (INR):</strong>
              <input
                type="number"
                name="goalAmount"
                value={financialGoals.goalAmount}
                onChange={handleUpdateSavings}
                className="border border-gray-600 rounded-md p-2 mt-2 bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
              />
            </label>
            <label className="mt-2">
              <strong>Monthly Savings (INR):</strong>
              <input
                type="number"
                name="currentSavings"
                value={financialGoals.currentSavings}
                onChange={handleUpdateSavings}
                className="border border-gray-600 rounded-md p-2 mt-2 bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
              />
            </label>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg p-6 transition-shadow duration-300 hover:shadow-2xl">
          <h2 className="text-2xl font-semibold mb-4">Monthly Expenses</h2>
          <div className="h-64">
            <Bar
              data={barChartData}
              options={{
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Amount (INR)',
                      color: '#fff',
                    },
                    ticks: {
                      color: '#fff',
                    },
                  },
                },
                plugins: {
                  legend: {
                    position: 'top',
                    labels: {
                      color: '#fff',
                    },
                  },
                  title: {
                    display: true,
                    text: 'Monthly Expense Breakdown',
                    color: '#fff',
                  },
                },
              }}
              height={300}
            />
          </div>
          <ul className="mt-4">
            {monthlyExpenses.map((expense, index) => (
              <li key={index} className="flex justify-between items-center mb-2">
                <span>{expense.category}: ₹{expense.amount}</span>
                <button onClick={() => handleDeleteExpense(index)} className="text-red-500 hover:underline">Delete</button>
              </li>
            ))}
          </ul>
          <form onSubmit={handleAddExpense} className="mt-4 flex">
            <input
              type="text"
              placeholder="Category"
              value={newExpense.category}
              onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
              className="border border-gray-600 rounded-md p-2 mr-2 bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
            />
            <input
              type="number"
              placeholder="Amount"
              value={newExpense.amount}
              onChange={(e) => setNewExpense({ ...newExpense, amount: Number(e.target.value) })}
              className="border border-gray-600 rounded-md p-2 mr-2 bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
            />
            <button type="submit" className="bg-blue-500 text-white rounded-md p-2">Add Expense</button>
          </form>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-5xl mb-6 transition-shadow duration-300 hover:shadow-2xl">
        <h2 className="text-2xl font-semibold mb-4">Savings Goal Progress</h2>
        <div className="h-64">
          <Doughnut
            data={doughnutChartData}
            options={{
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top',
                  labels: {
                    color: '#fff',
                  },
                },
                title: {
                  display: true,
                  text: 'Savings Goal Progress',
                  color: '#fff',
                },
              },
            }}
            height={300}
          />
        </div>
        <ul className="mt-4">
          {goals.map((goal, index) => (
            <li key={index} className="flex justify-between items-center mb-2">
              <span>{goal.description}: ₹{goal.amount} by {goal.date}</span>
              <button onClick={() => handleDeleteGoal(index)} className="text-red-500 hover:underline">Delete</button>
            </li>
          ))}
        </ul>
        <form onSubmit={handleAddGoal} className="mt-4 flex flex-col">
          <input
            type="text"
            placeholder="Goal Description"
            value={newGoal.description}
            onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
            className="border border-gray-600 rounded-md p-2 mb-2 bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
          />
          <input
            type="number"
            placeholder="Goal Amount"
            value={newGoal.amount}
            onChange={(e) => setNewGoal({ ...newGoal, amount: Number(e.target.value) })}
            className="border border-gray-600 rounded-md p-2 mb-2 bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
          />
          <input
            type="date"
            value={newGoal.date}
            onChange={(e) => setNewGoal({ ...newGoal, date: e.target.value })}
            className="border border-gray-600 rounded-md p-2 mb-2 bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
          />
          <button type="submit" className="bg-blue-500 text-white rounded-md p-2">Add Goal</button>
        </form>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-5xl mb-6 transition-shadow duration-300 hover:shadow-2xl">
        <h2 className="text-2xl font-semibold mb-4">Upcoming Bills</h2>
        <ul className="mt-4">
          {upcomingBills.map((bill, index) => (
            <li key={index} className="flex justify-between items-center mb-2">
              <span>{bill.description}: ₹{bill.amount} due on {bill.date}</span>
              <button onClick={() => handleDeleteBill(index)} className="text-red-500 hover:underline">Delete</button>
            </li>
          ))}
        </ul>
        <form onSubmit={handleAddBill} className="mt-4 flex flex-col">
          <input
            type="text"
            name="billDescription"
            placeholder="Bill Description"
            className="border border-gray-600 rounded-md p-2 mb-2 bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
          />
          <input
            type="number"
            name="billAmount"
            placeholder="Bill Amount"
            className="border border-gray-600 rounded-md p-2 mb-2 bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
          />
          <input
            type="date"
            name="billDate"
            className="border border-gray-600 rounded-md p-2 mb-2 bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
          />
          <button type="submit" className="bg-blue-500 text-white rounded-md p-2">Add Bill</button>
        </form>
      </div>
    </div>
  );
};

export default Financial;
