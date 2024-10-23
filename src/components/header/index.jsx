import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import { doSignOut } from '../../firebase/auth';
import Financial from '../home/Financial';
import Advisory from '../home/Advisory';
import FraudDetection from '../home/FraudDetection';

const Header = () => {
  const navigate = useNavigate();
  const { userLoggedIn } = useAuth();
  console.log('isUserLoggedIn',userLoggedIn)

  return (
    <nav className="flex justify-between w-full z-20 fixed top-0 left-0 h-12 border-b items-center bg-gray-900 px-4 py-2">
      {/* Left side: Navigation Tabs */}
      {userLoggedIn&&<div className="flex gap-x-4">
        <Link className="text-sm text-white hover:underline" to="/financial">Financial</Link>
        <Link className="text-sm text-white hover:underline" to="/advisory">Advisory</Link>
        <Link className="text-sm text-white hover:underline" to="/fraud-detection">Fraud Detection</Link>
      </div>}

      {/* Right side: Logout/Login/Register */}
      <div>
      
        {
          userLoggedIn ? (
            <button
              onClick={() => { doSignOut().then(() => { navigate('/login'); }) }}
              className="text-sm text-white hover:underline"
            >
              Logout
            </button>
          ) : (
            <>
              <Link className="text-sm text-blue-600 hover:underline mr-4" to="/login">Login</Link>
              <Link className="text-sm text-blue-600 hover:underline" to="/register">Register New Account</Link>
            </>
          )
        }
      </div>
    </nav>
  );
};

export default Header;
