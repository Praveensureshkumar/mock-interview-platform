import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { authAPI } from '../utils/api';
import { FiCheck, FiX, FiMail } from 'react-icons/fi';

const EmailVerificationPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setError('Invalid verification link');
        setLoading(false);
        return;
      }

      try {
        await authAPI.verifyEmail(token);
        setVerified(true);
      } catch (err) {
        setError(err.response?.data?.message || 'Verification failed');
      }
      setLoading(false);
    };

    verifyEmail();
  }, [token]);

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
                Your email has been successfully verified. You can now access all platform features.
              </p>
              <div className="mt-6">
                <Link
                  to="/"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Go to Dashboard
                </Link>
              </div>
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
                  <Link
                    to="/auth"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Sign In
                  </Link>
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