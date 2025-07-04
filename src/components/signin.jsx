import { FaEye, FaEyeSlash } from "react-icons/fa";
import React, { useState } from "react";

const SignIn = ({ switchToSignUp }) => {
  const [showPassword, setShowPassword] = useState(false);

  console.log("SignIn loaded");
  return (
    <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Sign in to your account
      </h2>

      <form className="space-y-5">
        <input
          type="email"
          placeholder="Email address"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>


        {/* Forgot Password */}
        <div className="text-right">
          <button
            type="button"
            className="text-sm text-blue-600 hover:underline"
            onClick={() => alert("Redirect to forgot password page or modal")}
          >
            Forgot Password?
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md"
        >
          Sign In
        </button>
      </form>

      {/* Sign Up Link */}
      <p className="mt-6 text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={switchToSignUp}
          className="text-blue-600 hover:underline font-medium"
        >
          Sign Up
        </button>
      </p>
    </div>
  );
};

export default SignIn;
