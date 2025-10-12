import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import { FiCheck, FiX, FiLoader } from 'react-icons/fi';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const EmailVerificationPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const token = searchParams.get('token');
  
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [countdown, setCountdown] = useState(5);
  const [autoLoginSuccess, setAutoLoginSuccess] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setError('Invalid verification link');
        setLoading(false);
        return;
      }

      try {
        const response = await authAPI.verifyEmail(token);
        setVerified(true);
        setUserInfo(response.data.user);
        
        console.log('Verification response:', response.data); // Debug log
        
        // Auto-login after successful verification
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
          
          // Decode token and set user in AuthContext
          const decoded = jwtDecode(response.data.token);
          setUser(decoded);
          
          setAutoLoginSuccess(true);
          console.log('Auto-login successful'); // Debug log
        } else {
          // If no token, still show success but without auto-login
          setAutoLoginSuccess(false);
          console.log('No token received, auto-login failed'); // Debug log
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Verification failed');
      }
      setLoading(false);
    };

    verifyEmail();
  }, [token, setUser]);

  // Countdown and auto-redirect effect
  useEffect(() => {
    if (verified && autoLoginSuccess) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            navigate('/');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [verified, autoLoginSuccess, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Verifying your email...
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please wait while we verify your email address.
          </p>
        </div>
      </div>
    );
  }

  // Success Modal/Popup - Show for any successful verification
  if (verified) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4 text-center transform transition-all duration-300 ease-in-out scale-100 opacity-100">
          <div className="mb-6">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4 animate-pulse">
              <FiCheck className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              🎉 Congratulations!
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
              {autoLoginSuccess ? 'Your login successful!' : 'Email verified successfully!'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {autoLoginSuccess 
                ? 'Email verified successfully. You are now logged in.' 
                : 'Your email has been verified. Please sign in to continue.'}
            </p>
          </div>
          
          {autoLoginSuccess ? (
            <>
              <div className="mb-4">
                <div className="flex items-center justify-center space-x-2 text-blue-600 dark:text-blue-400">
                  <FiLoader className="animate-spin h-4 w-4" />
                  <span className="text-sm">Redirecting to home in {countdown} seconds...</span>
                </div>
              </div>
              
              <button
                onClick={() => navigate('/')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Go to Home Now
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate('/auth')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Sign In Now
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className={`p-3 rounded-full ${
            verified 
              ? 'bg-green-100 dark:bg-green-900/30' 
              : 'bg-red-100 dark:bg-red-900/30'
          }`}>
            {verified ? (
              <FiCheck className="h-8 w-8 text-green-600 dark:text-green-400" />
            ) : (
              <FiX className="h-8 w-8 text-red-600 dark:text-red-400" />
            )}
          </div>
        </div>

        <div className="mt-6 text-center">
          {verified ? (
            <>
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                Email Verified!
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Your email has been successfully verified. Processing login...
              </p>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                Verification Failed
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {error}
              </p>
              <div className="mt-6 space-y-3">
                <div>
                  <button
                    onClick={() => navigate('/auth')}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Sign In
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  You can request a new verification email from your profile after signing in.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;