import React from 'react';
import FirebaseAuth from '../components/FirebaseAuth';

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Sign in</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Sign in with Google to continue.</p>
          <FirebaseAuth />
        </div>
      </div>
    </div>
  );
};

export default Login;
