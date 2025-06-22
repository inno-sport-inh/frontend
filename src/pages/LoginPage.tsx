import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { APP_CONFIG } from '../config';

const LoginPage: React.FC = () => {
  const { login } = useAppStore();

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {/* Logo */}
          <div className="flex items-center justify-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">IH</span>
            </div>
            <div className="text-2xl font-bold text-gray-100">
              InNoHassle <span className="text-primary-400">Sport</span>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-100 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-400 mb-8">
            Sign in to access your sport schedule and bookings
          </p>
          
          <div className="innohassle-card p-8">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-100 mb-2">
                  Continue with InNoHassle
                </h2>
                <p className="text-gray-400 text-sm">
                  Use your Innopolis University account to sign in
                </p>
              </div>
              
              <button
                onClick={login}
                className="innohassle-button-primary w-full py-3 px-6 text-base font-medium"
              >
                Sign in with InNoHassle SSO
              </button>
              
              <div className="text-center text-xs text-gray-500">
                <p>By signing in, you agree to our terms of service</p>
                <p className="mt-1">Part of the InNoHassle ecosystem</p>
              </div>
            </div>
          </div>
          
          {/* Features */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="space-y-2">
              <div className="w-8 h-8 bg-success-600 rounded-lg mx-auto flex items-center justify-center">
                <span className="text-white text-sm">📅</span>
              </div>
              <p className="text-xs text-gray-400">Easy Scheduling</p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg mx-auto flex items-center justify-center">
                <span className="text-white text-sm">📊</span>
              </div>
              <p className="text-xs text-gray-400">Progress Tracking</p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 bg-warning-600 rounded-lg mx-auto flex items-center justify-center">
                <span className="text-white text-sm">🏆</span>
              </div>
              <p className="text-xs text-gray-400">Achievement System</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;