import { useState, useRef, useEffect } from "react";
import CreateNewPasswordPage from "./NewPassword";

export default function VerificationCode() {
  const [code, setCode] = useState(["", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const handleChange = (index, value) => {
    // Allow only digits
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value !== "" && index < 3) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Move focus to previous input on backspace if current input is empty
    if (e.key === "Backspace" && index > 0 && code[index] === "") {
      inputRefs[index - 1].current.focus();
    }
  };

  const handleVerify = () => {
    setIsLoading(true);
    // Simulate verification process
    setTimeout(() => {
      setIsLoading(false);
      setVerified(true);
    }, 1500);
  };

  const handleResend = () => {
    // Simulate resend process
    alert("New verification code sent!");
    // Reset the code fields
    setCode(["", "", "", ""]);
    inputRefs[0].current.focus();
  };

  // Check if all code fields are filled
  const isCodeComplete = code.every(digit => digit !== "");

  // Focus first input on component mount
  useEffect(() => {
    inputRefs[0].current.focus();
  }, []);

  // If verified, show the CreateNewPasswordPage
  if (verified) {
    return <CreateNewPasswordPage />;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Illustration */}
        <div className="flex justify-center mb-8">
          <img
            src="/assets/Auth/Password.png"
            alt="Verification Illustration"
            className="h-64 object-contain"
          />
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-center mb-8">Enter Your Verification Code</h1>

        {/* Code Input Fields */}
        <div className="flex justify-center gap-3 mb-6">
          {[0, 1, 2, 3].map((index) => (
            <input
              key={index}
              ref={inputRefs[index]}
              type="text"
              maxLength={1}
              value={code[index]}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-16 h-16 text-2xl text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>

        {/* Verification Message */}
        <p className="text-center text-gray-600 mb-6">
          We send a four digits verification code to your email <br />
          <span className="text-blue-500 font-medium">user@gmail.com</span>. You can check your inbox
        </p>

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          disabled={!isCodeComplete || isLoading}
          className={`w-full py-3 rounded-md text-white font-medium mb-4 ${
            isCodeComplete && !isLoading ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-400 cursor-not-allowed"
          }`}
        >
          {isLoading ? "Verifying..." : "Verify"}
        </button>

        {/* Resend Code Link */}
        <div className="text-center">
          <p className="text-gray-600">
            I didn't receive the code?{" "}
            <button
              onClick={handleResend}
              className="text-blue-500 ml-1 hover:underline focus:outline-none"
            >
              Send again
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}