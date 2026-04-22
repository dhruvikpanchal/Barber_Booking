import React, { useState } from 'react';

export default function VerifyOTP() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 text-center">
        {/* Title */}
        <h2 className="text-3xl font-semibold text-gray-900">Verify Email</h2>
        <p className="text-sm text-gray-500 mt-2">Enter the 6-digit OTP sent to your email</p>

        {/* OTP Inputs */}
        <div className="flex justify-between mt-6 gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              className="w-12 h-12 text-center text-lg border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-black"
            />
          ))}
        </div>

        {/* Button */}
        <button className="mt-6 w-full h-11 rounded-lg bg-black text-white hover:bg-gray-800 transition">
          Verify OTP
        </button>

        {/* Resend */}
        <p className="text-sm text-gray-500 mt-4">
          Didn’t receive code? <button className="text-black hover:underline">Resend</button>
        </p>
      </div>
    </div>
  );
}
