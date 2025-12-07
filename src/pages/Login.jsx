import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuth from '../hooks/useAuth';

const Login = () => {
  const { signIn, user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const from = location.state?.from?.pathname || '/';

  const handleSignIn = async () => {
    try {
      setIsSigningIn(true);
      await signIn();
      toast.success('Signed in successfully!');
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Sign-in failed', error);
      if (error.code === 'auth/popup-closed-by-user') {
        toast.error('Sign-in cancelled');
      } else if (error.code === 'auth/cancelled-popup-request') {
        toast.error('Another sign-in request in progress');
      } else {
        toast.error('Sign-in failed. Please try again.');
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    navigate(from, { replace: true });
    return null;
  }

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Tujitume</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <p className="text-sm text-gray-600 text-center mb-6">
              Sign in with Google to access your gigs and applications.
            </p>
          </div>

          {/* Google Sign-In Button */}
          <button
            onClick={handleSignIn}
            disabled={isSigningIn}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-70 disabled:cursor-not-allowed transition"
          >
            {isSigningIn ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Signing in...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </>
            )}
          </button>

          {/* Divider */}
          <div className="mt-6 mb-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>
          </div>

          {/* Back to Home Button */}
          <button
            onClick={() => navigate('/')}
            className="w-full px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            Back to Home
          </button>

          {/* Help Text */}
          <p className="text-xs text-gray-500 text-center mt-6">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
