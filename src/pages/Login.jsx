import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Login = () => {
  const { signIn, user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || '/';

  const handleSignIn = async () => {
    try {
      await signIn();
      navigate(from, { replace: true });
    } catch (e) {
      console.error('Sign-in failed', e);
      // keep user on login page; optionally show toast
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  if (user) {
    // Already signed in - redirect to origin
    navigate(from, { replace: true });
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Sign in</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">Sign in with Google to continue.</p>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleSignIn}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Continue with Google
            </button>

            <button
              onClick={() => navigate('/')}
              className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
