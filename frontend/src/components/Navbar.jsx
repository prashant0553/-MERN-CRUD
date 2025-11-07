import React from 'react';
import { logout } from '../utils/auth';

export default function Navbar() {
  const auth = JSON.parse(localStorage.getItem('auth') || 'null');

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-md px-6 py-4 text-white flex justify-center items-center space-x-6">
      <span className="text-2xl font-extrabold tracking-wide"> MERN CRUD</span>
      {auth ? (
        <>
          <span className="text-sm font-medium">
            <span className="font-semibold">{auth.name || ''}</span>
          </span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-sm transition duration-200 ease-in-out transform hover:scale-105"
          >
            Logout
          </button>
        </>
      ) : (
        <span className="text-sm italic opacity-90"> </span>
      )}
    </nav>
  );
}
