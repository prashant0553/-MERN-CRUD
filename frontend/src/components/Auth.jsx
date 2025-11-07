import React, { useState } from 'react';
import { postJSON } from '../lib/api';
import { saveAuth } from '../utils/auth';

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', gender: 'other' });
  const [err, setErr] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    const res = await postJSON('/auth/register', form);
    if (res.token) {
      saveAuth(res);
      window.location.reload();
    } else setErr(res.message || JSON.stringify(res));
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Create Account</h3>
      <form onSubmit={submit} className="space-y-3">
        <input
          className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Full Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Email Address"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <select
          className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={form.gender}
          onChange={(e) => setForm({ ...form, gender: e.target.value })}
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <button
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200"
        >
          Register
        </button>
        {err && <div className="text-red-600 text-sm mt-2 text-center">{err}</div>}
      </form>
    </div>
  );
}

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [err, setErr] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    const res = await postJSON('/auth/login', form);
    if (res.token) {
      saveAuth(res);
      window.location.reload();
    } else setErr(res.message || JSON.stringify(res));
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Sign In</h3>
      <form onSubmit={submit} className="space-y-3">
        <input
          className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
          placeholder="Email Address"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button
          className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all duration-200"
        >
          Login
        </button>
        {err && <div className="text-red-600 text-sm mt-2 text-center">{err}</div>}
      </form>
    </div>
  );
}

export default function Auth() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full">
        <Login />
        <Register />
      </div>
    </div>
  );
}
