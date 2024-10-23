// src/components/FraudDetection.jsx
import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const FraudDetection = () => {
  const [transactionData, setTransactionData] = useState({
    amount: '',
    location: '',
    deviceType: '',
    timestamp: '',
    ipAddress: '',
    cardUsageFrequency: '',
  });

  const [fraudScore, setFraudScore] = useState(null);
  const [fraudFeedback, setFraudFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Example: Fraud risk thresholds
  const RISK_THRESHOLDS = {
    high: 80,   // Above 80 is considered high risk
    medium: 50, // Between 50 and 80 is medium risk
    low: 30,    // Between 30 and 50 is low risk
  };

  // Initialize the Gemini model when the component mounts
  useEffect(() => {
    const initializeGeminiModel = async () => {
      try {
        const apiKey = 'AIzaSyCRTKY1MItjr-xCVB41ptrJqlUTr5RX0o4'; // Replace with your real API key
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        setTransactionData((prevState) => ({ ...prevState, model }));
      } catch (err) {
        console.error('Error initializing Gemini model:', err);
      }
    };
    initializeGeminiModel();
  }, []);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTransactionData({ ...transactionData, [name]: value });
  };

  // Calculate risk score based on the transaction data
  const calculateRiskScore = () => {
    let riskScore = 0;

    // Simulate risk score based on amount
    if (transactionData.amount > 10000) riskScore += 30;
    if (transactionData.location === "Unusual Location") riskScore += 20;
    if (transactionData.deviceType !== "Trusted Device") riskScore += 20;
    if (transactionData.cardUsageFrequency === "High") riskScore += 20;
    
    return riskScore;
  };

  // Handle fraud detection submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFraudScore(null);
    setFraudFeedback('');

    const { model, amount, location, deviceType, timestamp, ipAddress, cardUsageFrequency } = transactionData;

    if (!model) {
      setError('Gemini model is not initialized.');
      setLoading(false);
      return;
    }

    // Calculate fraud risk score
    const riskScore = calculateRiskScore();
    setFraudScore(riskScore);

    const transactionPrompt = `
      Analyze this transaction for fraud based on the following data:
      - Transaction amount: ₹${amount}
      - Transaction location: ${location}
      - Device type: ${deviceType}
      - Transaction timestamp: ${timestamp}
      - IP Address: ${ipAddress}
      - Card usage frequency: ${cardUsageFrequency}

      Based on common fraud detection techniques, provide a risk score and analysis of whether this transaction is potentially fraudulent or not.
    `;

    try {
      const result = await model.generate({ prompt: transactionPrompt });
      const fraudAnalysis = result.response.text().trim();

      // Set fraud detection feedback
      setFraudFeedback(fraudAnalysis);
    } catch (err) {
      setError('Error detecting fraud: ' + err.message);
    }

    setLoading(false);
  };

  return (
    <div className='mt-10'>
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Fraud Detection System</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Transaction Amount</label>
          <input
            type="number"
            name="amount"
            value={transactionData.amount}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            name="location"
            value={transactionData.location}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Device Type</label>
          <input
            type="text"
            name="deviceType"
            value={transactionData.deviceType}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Transaction Timestamp</label>
          <input
            type="datetime-local"
            name="timestamp"
            value={transactionData.timestamp}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">IP Address</label>
          <input
            type="text"
            name="ipAddress"
            value={transactionData.ipAddress}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Card Usage Frequency</label>
          <select
            name="cardUsageFrequency"
            value={transactionData.cardUsageFrequency}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select Frequency</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
        >
          {loading ? 'Checking for Fraud...' : 'Check for Fraud'}
        </button>
      </form>

      {/* Display the result */}
      {fraudScore !== null && (
        <div className="mt-6 p-4 bg-gray-100 text-gray-800 rounded-md">
          <strong>Fraud Risk Score:</strong>
          <p>{fraudScore} / 100</p>
          <strong>Risk Level:</strong>
          <p>{fraudScore >= RISK_THRESHOLDS.high ? 'High Risk' : fraudScore >= RISK_THRESHOLDS.medium ? 'Medium Risk' : 'Low Risk'}</p>
        </div>
      )}

      {fraudFeedback && (
        <div className="mt-6 p-4 bg-green-100 text-green-700 rounded-md">
          <strong>Fraud Analysis Feedback:</strong>
          <p>{fraudFeedback}</p>
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 bg-red-100 text-red-700 rounded-md">
          <strong>Error:</strong>
          <p>{error}</p>
        </div>
      )}
    </div>
    </div>
  );
};

export default FraudDetection;
