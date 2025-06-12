import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PasswordReset() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Fungsi validasi email sederhana
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isValidEmail(email)) return;

    setIsLoading(true);
    console.log('Sending verification code to:', email);

    localStorage.setItem('resetEmail', email);

    setTimeout(() => {
      setIsLoading(false);
      navigate('/auth/VerificationCode');
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md p-6 flex flex-col items-center">
        
        {/* Illustration */}
        <div className="mb-6">
          <img
            src="/assets/Auth/ForgotPassword.png"
            alt="Forgot Password Illustration"
            className="w-64 h-64 object-contain"
          />
        </div>
        
        {/* Text content */}
        <h1 className="text-3xl font-bold text-center mb-4">Forgot Password?</h1>
        <p className="text-center text-gray-600 mb-6">
          Please enter your email address to receive a verification code
        </p>
        
        {/* Form */}
        <div className="w-full">
          {/* Email Input */}
          <div className="mb-2">
            <div className="flex border border-gray-300 rounded-md overflow-hidden">
              <div className="bg-gray-100 p-2 flex items-center justify-center">
                <i className="bi bi-envelope-fill text-gray-500 text-lg"></i>
              </div>
              <input
                type="email"
                placeholder="Enter Your Email"
                className="flex-1 p-2 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Error Message */}
          {email && !isValidEmail(email) && (
            <p className="text-sm text-red-500 mb-4">Please enter a valid email address.</p>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!email || !isValidEmail(email) || isLoading}
            className={`w-full ${
              email && isValidEmail(email) && !isLoading
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-400 cursor-not-allowed"
            } text-white py-2 px-4 rounded-md font-medium transition-colors`}
          >
            {isLoading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
