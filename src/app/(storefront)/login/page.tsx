'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Paintbrush, ArrowRight, ShieldCheck, Lock, KeyRound, User, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'LOGIN' | 'REGISTER' | 'FORGOT'>('LOGIN');

  // Sign In State
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register State
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regDistrict] = useState('Kishoreganj');
  const [regThana] = useState('Pakundia');

  // Forgot Password State
  const [forgotPhone, setForgotPhone] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // Status & Feedback
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loginId, password: loginPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      setSuccessMsg('Authentication successful! Accessing portal...');
      setTimeout(() => {
        if (data.user?.role === 'ADMIN') {
          router.push('/admin');
        } else {
          router.push('/');
        }
        router.refresh();
      }, 1000);
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!regName.trim() || regName.trim().length < 2) {
      setError('Please provide your full name (min 2 characters).');
      return;
    }

    if (!/^(?:\+88)?01[3-9]\d{8}$/.test(regPhone.trim())) {
      setError('Please enter a valid 11-digit Bangladeshi mobile number (e.g. 01712345678).');
      return;
    }

    if (regPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName.trim(),
          phone: regPhone.trim(),
          password: regPassword,
          district: regDistrict,
          thana: regThana,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setSuccessMsg('Account created successfully! Redirecting...');
      setTimeout(() => {
        router.push('/');
        router.refresh();
      }, 1000);
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!forgotPhone.trim()) {
      setError('Please enter your registered phone number or User ID.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'request-otp', phone: forgotPhone.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate OTP code');
      }

      setOtpSent(true);
      setSuccessMsg('Security OTP verification code sent to your registered mobile number.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!forgotOtp.trim() || !newPassword) {
      setError('Please enter the 6-digit OTP code and your new password.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reset-password',
          phone: forgotPhone.trim(),
          otp: forgotOtp.trim(),
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to reset password');
      }

      setSuccessMsg('Password updated successfully! Switching to Sign In...');
      setTimeout(() => {
        setActiveTab('LOGIN');
        setLoginId(forgotPhone);
        setLoginPassword('');
        setOtpSent(false);
        setSuccessMsg('');
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Top Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 mx-auto font-black shadow-xl shadow-amber-500/20">
            <Paintbrush className="w-8 h-8 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Secure Access Portal</h1>
            <p className="text-xs text-slate-400 mt-1">
              M/S Rong Bahar • Encrypted Authentication
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setActiveTab('LOGIN');
              setError('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'LOGIN' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" /> Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('REGISTER');
              setError('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'REGISTER' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" /> Register
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('FORGOT');
              setError('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'FORGOT' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" /> Recovery
          </button>
        </div>

        {/* Feedback Alerts */}
        {error && (
          <div className="p-3.5 bg-red-950/90 border border-red-800 text-red-300 text-xs font-semibold rounded-2xl flex items-center gap-2 shadow-lg">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 bg-emerald-950/90 border border-emerald-800 text-emerald-300 text-xs font-semibold rounded-2xl flex items-center gap-2 shadow-lg">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 1. SIGN IN FORM */}
        {activeTab === 'LOGIN' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">User ID / Mobile Phone *</label>
              <input
                type="text"
                required
                placeholder="Enter User ID or Mobile Phone"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl py-2.5 px-3.5 text-sm text-slate-100 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-300">Password *</label>
                <button
                  type="button"
                  onClick={() => setActiveTab('FORGOT')}
                  className="text-[11px] text-amber-400 hover:underline font-medium"
                >
                  Forgot password?
                </button>
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl py-2.5 px-3.5 text-sm text-slate-100 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-sm shadow-xl transition flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Verifying Credentials...' : 'Sign In'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* 2. REGISTRATION FORM */}
        {activeTab === 'REGISTER' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Full Name *</label>
              <input
                type="text"
                required
                placeholder="Enter Full Name"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl py-2.5 px-3.5 text-sm text-slate-100 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Mobile Phone Number (11 Digits) *</label>
              <input
                type="tel"
                required
                placeholder="017XXXXXXXX"
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl py-2.5 px-3.5 text-sm text-slate-100 font-mono outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Password (Min 6 chars) *</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl py-2.5 px-3.5 text-sm text-slate-100 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-sm shadow-xl transition flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Creating Profile...' : 'Register Account'}
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* 3. FORGOT PASSWORD RECOVERY FORM */}
        {activeTab === 'FORGOT' && (
          <div className="space-y-4">
            {!otpSent ? (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Registered Mobile Phone / User ID *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter registered mobile number or User ID"
                    value={forgotPhone}
                    onChange={(e) => setForgotPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl py-2.5 px-3.5 text-sm text-slate-100 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-sm shadow-xl transition flex items-center justify-center gap-2"
                >
                  {isSubmitting ? 'Generating Security Code...' : 'Request Security OTP Code'}
                  <RefreshCw className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Enter 6-Digit Security OTP Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="123456"
                    value={forgotOtp}
                    onChange={(e) => setForgotOtp(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl py-2.5 px-3.5 text-sm text-white font-mono uppercase tracking-widest outline-none text-center"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Set New Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl py-2.5 px-3.5 text-sm text-slate-100 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-sm shadow-xl transition flex items-center justify-center gap-2"
                >
                  {isSubmitting ? 'Updating Password...' : 'Save New Password & Sign In'}
                  <ShieldCheck className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
