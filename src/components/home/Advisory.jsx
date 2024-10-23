// src/components/ChatBot.jsx
import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatSession, setChatSession] = useState(null);

  const [monthlyExpenses, setMonthlyExpenses] = useState([]);
  const [upcomingBills, setUpcomingBills] = useState([]);
  const [financialGoals, setFinancialGoals] = useState({ goalAmount: 0, currentSavings: 0 });
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    const storedExpenses = JSON.parse(localStorage.getItem('monthlyExpenses')) || [];
    const storedGoals = JSON.parse(localStorage.getItem('goals')) || [];
    const storedFinancialGoals = JSON.parse(localStorage.getItem('financialGoals')) || { goalAmount: 0, currentSavings: 0 };
    const storedUpcomingBills = JSON.parse(localStorage.getItem('upcomingBills')) || [];

    setMonthlyExpenses(storedExpenses);
    setGoals(storedGoals);
    setFinancialGoals(storedFinancialGoals);
    setUpcomingBills(storedUpcomingBills);
  }, []);

  useEffect(() => {
    localStorage.setItem('monthlyExpenses', JSON.stringify(monthlyExpenses));
    localStorage.setItem('goals', JSON.stringify(goals));
    localStorage.setItem('financialGoals', JSON.stringify(financialGoals));
    localStorage.setItem('upcomingBills', JSON.stringify(upcomingBills));
  }, [monthlyExpenses, goals, financialGoals, upcomingBills]);

  const generationConfig = {
    temperature: 0.7,
    topP: 0.9,
    topK: 40,
    maxOutputTokens: 500,
    responseMimeType: "text/plain",
  };

  useEffect(() => {
    const apiKey = 'AIzaSyCRTKY1MItjr-xCVB41ptrJqlUTr5RX0o4'; // Your provided API key
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const session = model.startChat({ generationConfig, history: [] });
    setChatSession(session);

    const advisoryOverview = `
      You are a Financial AI expert, You only question that will be related to Finance only.
      Given the following financial information, provide personalized insights, advice, and investment strategies to help the user achieve their financial goals. 

      **Monthly Income:** ₹${financialGoals.goalAmount}

      **Monthly Expenses:**
      ${monthlyExpenses.length > 0 ? monthlyExpenses.map(expense => `- ${expense.category}: ₹${expense.amount}`).join('\n') : 'No expenses available'}

      **Upcoming Bills:**
      ${upcomingBills.length > 0 ? upcomingBills.map(bill => `- ${bill.description}: ₹${bill.amount} due on ${bill.date}`).join('\n') : 'No upcoming bills'}

      **Financial Goals:**
      ${financialGoals.currentSavings > 0 ? `Current Savings: ₹${financialGoals.currentSavings}` : 'No financial goals set'}

      **Goals:**
      ${goals.length > 0 ? goals.map(goal => `- ${goal.description} - Target: ₹${goal.amount} by ${goal.date}`).join('\n') : 'No goals available'}

      Please analyze this information and generate a comprehensive financial plan with the following details:
      - Insights into monthly savings and expense management.
      - Recommended strategies for reaching financial goals, including savings targets and investment suggestions.
      - Investment opportunities suited to the user's goals and financial profile.
      - Any additional tips for optimizing overall financial health.

    `;

    const sendInitialMessage = async () => {
      try {
        const userMessage = { sender: 'User', message: advisoryOverview.trim() };
        setMessages([userMessage]);

        const result = await session.sendMessage(advisoryOverview);
        const botMessage = { sender: 'AI Expert', message: result.response.text().trim() };
        setMessages(prevMessages => [...prevMessages, botMessage]);
      } catch (error) {
        const errorMessage = { sender: 'AI Expert', message: 'Error: ' + error.message };
        setMessages(prevMessages => [...prevMessages, errorMessage]);
      }
    };

    sendInitialMessage();
  }, [financialGoals, monthlyExpenses, upcomingBills, goals]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatSession) return;

    const userMessage = { sender: 'User', message: newMessage };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setNewMessage('');

    try {
      const result = await chatSession.sendMessage(newMessage);
      const botMessage = { sender: 'AI Expert', message: result.response.text().trim() };
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      const errorMessage = { sender: 'AI Expert', message: 'Error: ' + error.message };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col p-4 mt-11">
      <div className="flex-1 overflow-y-auto mb-4 p-2 bg-gray-800 shadow-lg rounded-lg">
        {messages.map((msg, index) => (
          <div key={index} className={`my-2 p-2 rounded-lg ${msg.sender === 'User' ? 'bg-white text-black self-end' : 'bg-green-200 text-gray-800 self-start'}`}>
            <strong style={{ fontSize: '0.9rem' }}>{msg.sender}:</strong>
            <p style={{ fontSize: '0.9rem' }}>{msg.message}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="border border-gray-300 rounded-md p-2 flex-grow mr-2"
          style={{ fontSize: '0.9rem' }}
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">Send</button>
      </form>
    </div>
  );
};

export default ChatBot;
