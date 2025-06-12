import { useState } from 'react';
import LoginPage from '../Auth/Login';

export default function PasswordUpdateSuccess() {
  const [goToLogin, setGoToLogin] = useState(false);
  
  const handleLogin = () => {
    setGoToLogin(true);
  };
  
  // Redirect to login page if button was clicked
  if (goToLogin) {
    return <LoginPage />;
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <div className="max-w-md w-full space-y-8 flex flex-col items-center">
        {/* Success Icon - Using Bootstrap Icon via SVG */}
        <div className="mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100"
            height="100"
            fill="#0369a1"
            className="bi bi-patch-check-fill"
            viewBox="0 0 16 16"
          >
            <path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01-.622-.636zm.287 5.984-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708.708z"/>
          </svg>
        </div>
        
        {/* Heading */}
        <h1 className="text-3xl font-bold text-center text-gray-900">Password Update</h1>
        
        {/* Success Message */}
        <p className="text-center text-gray-600 mt-2 mb-8">
          Your password has been updated!
        </p>
        
        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Login
        </button>
      </div>
    </div>
  );
}