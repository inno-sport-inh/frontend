import React from "react";
import { useAppStore } from "../store/useAppStore";

const LoginPage: React.FC = () => {
  const { login } = useAppStore();

  return (
    <div className="min-h-screen bg-pagebg flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {/* Logo */}
          <div className="flex items-center justify-center space-x-3 mb-8">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(90deg, #9A2EFF 0%, #9747FF 100%)" }}>
              <span className="text-white font-bold text-lg">IH</span>
            </div>
            <div className="text-2xl font-bold text-contrast">
              InNoHassle <span className="selected">Sport</span>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-contrast mb-2">Welcome Back</h1>
          <p className="text-inactive mb-8">Sign in to access your sport schedule and bookings</p>

          <div className="innohassle-card p-8">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-contrast mb-2">Continue with InNoHassle</h2>
                <p className="text-inactive text-sm">Use your Innopolis University account to sign in</p>
              </div>

              <button onClick={login} className="innohassle-button-primary w-full py-3 px-6 text-base font-medium">
                Sign in with InNoHassle SSO
              </button>

              <div className="text-center text-xs text-inactive">
                <p>By signing in, you agree to our terms of service</p>
                <p className="mt-1">Part of the InNoHassle ecosystem</p>
              </div>
            </div>
          </div>

          {/* Features */}
          <section aria-labelledby="features-heading" className="mt-8">
            <h2 id="features-heading" className="sr-only">
              Features
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              {/* Feature: Easy Scheduling – book and manage your sports sessions with just a few clicks */}
              <article className="space-y-2" aria-label="Easy Scheduling">
                <div className="w-8 h-8 bg-success-600 rounded-lg mx-auto flex items-center justify-center">
                  <span className="text-white text-sm">📅</span>
                </div>
                <p className="text-xs text-inactive">Easy Scheduling</p>
              </article>
              {/* Feature: Progress Tracking – monitor your performance and improvements over time */}
              <article className="space-y-2" aria-label="Progress Tracking">
                <div className="w-8 h-8 rounded-lg mx-auto flex items-center justify-center" style={{ background: "linear-gradient(90deg, #9A2EFF 0%, #9747FF 100%)" }}>
                  <span className="text-white text-sm">📊</span>
                </div>
                <p className="text-xs text-inactive">Progress Tracking</p>
              </article>
              {/* Feature: Achievement System – earn rewards and recognition for your milestones */}
              <article className="space-y-2" aria-label="Achievement System">
                <div className="w-8 h-8 bg-warning-600 rounded-lg mx-auto flex items-center justify-center">
                  <span className="text-white text-sm">🏆</span>
                </div>
                <p className="text-xs text-inactive">Achievement System</p>
              </article>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
