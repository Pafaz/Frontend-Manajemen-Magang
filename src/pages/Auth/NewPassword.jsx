import { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import PasswordUpdateSuccess from '../Auth/Succes';

export default function CreateNewPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const isPasswordValid = (pwd) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(pwd);
  };

  const getPasswordStrength = (pwd) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[a-z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[\W_]/.test(pwd)) strength++;

    if (strength <= 2) return { label: 'Weak', color: 'bg-red-500' };
    if (strength === 3 || strength === 4) return { label: 'Moderate', color: 'bg-yellow-500' };
    return { label: 'Strong', color: 'bg-green-500' };
  };

  const handleSubmit = () => {
    if (!isPasswordValid(password)) {
      setError(
        'Password must be at least 8 characters long and contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.'
      );
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    setError('');
    setIsSuccess(true);
  };

  if (isSuccess) {
    return <PasswordUpdateSuccess />;
  }

  const passwordStrength = getPasswordStrength(password);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <div className="max-w-md w-full space-y-8 flex flex-col items-center">
        {/* Image/Illustration */}
        <div className="w-64 h-64 mb-6">
          <img
            src="/assets/Auth/ForgotPassword.png"
            alt="Person setting up new password on device"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-center text-gray-900">Create New Password</h1>

        {/* Subheading */}
        <p className="text-center text-gray-600 mt-2 mb-6">
          Your New Password must be different from previous used password
        </p>

        {/* Password Fields */}
        <div className="mt-8 space-y-4 w-full">
          {/* Password Field */}
          <div className="relative">
            <div className="flex items-center border border-gray-300 rounded-md">
              <span className="pl-3 text-gray-500">
                <Lock size={18} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full px-3 py-2 border-0 focus:ring-0 focus:outline-none rounded-md"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="pr-3 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Password Strength Indicator */}
          {password && (
            <div className="w-full">
              <div className="h-2 rounded-full w-full bg-gray-200 mt-1">
                <div
                  className={`h-2 rounded-full ${passwordStrength.color}`}
                  style={{ width: `${(getPasswordStrength(password).label === 'Weak' ? 33 : getPasswordStrength(password).label === 'Moderate' ? 66 : 100)}%` }}
                ></div>
              </div>
              <p className={`text-sm mt-1 ${passwordStrength.color === 'bg-red-500' ? 'text-red-600' : passwordStrength.color === 'bg-yellow-500' ? 'text-yellow-600' : 'text-green-600'}`}>
                Strength: {passwordStrength.label}
              </p>
            </div>
          )}

          {/* Confirm Password Field */}
          <div className="relative">
            <div className="flex items-center border border-gray-300 rounded-md">
              <span className="pl-3 text-gray-500">
                <Lock size={18} />
              </span>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                className="w-full px-3 py-2 border-0 focus:ring-0 focus:outline-none rounded-md"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                className="pr-3 text-gray-500"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && <p className="text-sm text-red-500">{error}</p>}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
