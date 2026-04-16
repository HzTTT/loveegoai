import React from 'react';
import { useNavigate } from 'react-router';

export const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center p-6 items-center">
      <h1 className="text-4xl font-display text-[#FF6B6B] mb-8">Login</h1>
      <input 
        type="email" 
        placeholder="Email" 
        className="w-full max-w-sm border p-3 rounded-lg mb-4 font-body"
      />
      <input 
        type="password" 
        placeholder="Password" 
        className="w-full max-w-sm border p-3 rounded-lg mb-6 font-body"
      />
      <button 
        onClick={() => navigate('/home')}
        className="w-full max-w-sm bg-[#FF6B6B] text-white py-3 rounded-lg font-bold font-body"
      >
        Sign In
      </button>
      <p className="mt-4 text-sm text-gray-500 cursor-pointer" onClick={() => navigate('/')}>
        Don't have an account? Sign up
      </p>
    </div>
  );
};
