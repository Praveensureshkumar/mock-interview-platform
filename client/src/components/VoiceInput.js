import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FiMic, FiMicOff } from 'react-icons/fi';

const VoiceInput = ({ onTranscript, disabled }) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [networkError, setNetworkError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const recognitionRef = useRef(null);
  const maxRetries = 3;

  // Memoize the onTranscript callback to prevent unnecessary re-renders
  const handleTranscript = useCallback((transcript) => {
    if (onTranscript && transcript.trim()) {
      onTranscript(transcript);
    }
  }, [onTranscript]);

  useEffect(() => {
    // Check for speech recognition support
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      return;
    }

    // Clean up any existing recognition instance
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      } catch (e) {
        console.log('Error cleaning up existing recognition:', e);
      }
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognitionInstance = new SpeechRecognition();
    
    // Configure speech recognition
    recognitionInstance.continuous = true; // Changed back to true for continuous listening
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = 'en-US';
    recognitionInstance.maxAlternatives = 1;

    recognitionInstance.onstart = () => {
      console.log('🎤 Speech recognition started');
      setIsListening(true);
      setInterimTranscript('');
      setNetworkError(false); // Reset network error state
      setRetryCount(0); // Reset retry count on successful start
    };

    recognitionInstance.onend = () => {
      console.log('🛑 Speech recognition ended - isListening state:', isListening);
      setIsListening(false);
      setInterimTranscript('');
    };

    recognitionInstance.onresult = (event) => {
      let finalTranscript = '';
      let interimText = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimText += transcript;
        }
      }
      
      setInterimTranscript(interimText);
      
      if (finalTranscript.trim()) {
        console.log('📝 Final transcript:', finalTranscript);
        console.log('🔄 Calling handleTranscript with:', finalTranscript);
        
        // Send transcript immediately without debouncing for better responsiveness
        handleTranscript(finalTranscript);
      }
    };

    recognitionInstance.onerror = (event) => {
      console.error('🚨 Speech recognition error:', event.error);
      setIsListening(false);
      setInterimTranscript('');
      
      // Handle different error types with more user-friendly messages
      switch (event.error) {
        case 'no-speech':
          // Don't show alert for no-speech, but log it and keep listening
          console.log('⚠️ No speech detected, but keeping recognition active...');
          // Don't set isListening to false for no-speech - let it continue
          return; // Exit early to avoid setting isListening to false
          
        case 'audio-capture':
          alert('❌ No microphone found. Please check your microphone connection and try again.');
          break;
        case 'not-allowed':
          alert('❌ Microphone access denied. Please allow microphone access in your browser settings and refresh the page.');
          break;
        case 'network':
          // Handle network errors with retry logic
          console.log('Network error - speech recognition service unavailable');
          setNetworkError(true);
          
          // Only retry if the user was actively trying to use voice recognition
          if (retryCount < maxRetries && isListening) {
            console.log(`Retrying... (${retryCount + 1}/${maxRetries})`);
            setTimeout(() => {
              // Check if we should still retry (user might have stopped manually)
              if (isListening && !isOffline && navigator.onLine) {
                setRetryCount(prev => prev + 1);
                try {
                  recognitionInstance.start();
                } catch (e) {
                  console.error('Retry failed:', e);
                  setIsListening(false);
                  setNetworkError(false);
                }
              }
            }, 2000); // Wait 2 seconds before retry
          } else {
            // Reset states if max retries reached or not listening
            setNetworkError(false);
            setIsListening(false);
            setRetryCount(0);
            
            if (retryCount >= maxRetries) {
              alert('❌ Network connection issues detected. Please check your internet connection and try again later.');
            }
          }
          break;
        case 'service-not-allowed':
          console.log('Speech recognition service not available');
          break;
        case 'aborted':
          console.log('Speech recognition was aborted');
          break;
        default:
          console.error(`Speech recognition error: ${event.error}`);
          // Only show alert for unexpected errors
          if (event.error !== 'network') {
            alert(`❌ Speech recognition error: ${event.error}. Please try again.`);
          }
      }
    };

    recognitionInstance.onnomatch = () => {
      console.log('No match found');
      setInterimTranscript('');
    };

    setRecognition(recognitionInstance);
    recognitionRef.current = recognitionInstance;

    // Cleanup function
    return () => {
      if (recognitionRef.current) {
        try {
          // Remove event listeners to prevent memory leaks
          recognitionRef.current.onstart = null;
          recognitionRef.current.onend = null;
          recognitionRef.current.onresult = null;
          recognitionRef.current.onerror = null;
          recognitionRef.current.onnomatch = null;
          
          // Stop recognition if it's running
          if (recognitionRef.current.stop) {
            recognitionRef.current.stop();
          }
          
          recognitionRef.current = null;
        } catch (e) {
          console.log('Error cleaning up recognition:', e);
        }
      }
    };
  }, [handleTranscript]);

  // Handle online/offline status
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setNetworkError(false);
      console.log('🌐 Back online');
    };

    const handleOffline = () => {
      setIsOffline(true);
      setNetworkError(false);
      if (isListening && recognition) {
        recognition.stop();
      }
      console.log('📡 Gone offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);  // Intentionally minimal dependencies

  const toggleListening = async () => {
    if (!recognition) {
      alert('❌ Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (disabled) return;

    try {
      if (isListening) {
        console.log('🛑 Stopping speech recognition...');
        // Reset states immediately to prevent multiple stops
        setIsListening(false);
        setInterimTranscript('');
        setNetworkError(false);
        setRetryCount(0);
        
        if (recognition && recognition.stop) {
          recognition.stop();
        }
      } else {
        // Check network connectivity before starting
        if (!navigator.onLine || isOffline) {
          alert('❌ You appear to be offline. Speech recognition requires an internet connection.');
          return;
        }

        // Prevent multiple simultaneous starts
        if (recognition.started) {
          console.log('🚫 Recognition already started, ignoring request');
          return;
        }

        console.log('🎤 Starting speech recognition...');
        // Request microphone permission first
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          // Stop the stream immediately as we only needed permission
          stream.getTracks().forEach(track => track.stop());
          
          // Reset states before starting
          setNetworkError(false);
          setRetryCount(0);
          setInterimTranscript('');
          
          // Start recognition
          recognition.start();
        } catch (error) {
          console.error('❌ Microphone permission error:', error);
          if (error.name === 'NotAllowedError') {
            alert('❌ Microphone access denied. Please allow microphone access and try again.');
          } else if (error.name === 'NotFoundError') {
            alert('❌ No microphone found. Please connect a microphone and try again.');
          } else {
            alert('❌ Error accessing microphone. Please check your microphone settings.');
          }
        }
      }
    } catch (error) {
      console.error('❌ Speech recognition toggle error:', error);
      setIsListening(false);
      setInterimTranscript('');
      setNetworkError(false);
      alert('❌ Error starting speech recognition. Please try again.');
    }
  };

  // Check if speech recognition is supported
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    return (
      <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <p className="text-yellow-800 dark:text-yellow-200">
          🚫 Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari for voice input.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <button
        onClick={toggleListening}
        disabled={disabled || isOffline}
        className={`relative p-4 rounded-full transition-all duration-300 transform hover:scale-105 ${
          isListening
            ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse shadow-lg ring-4 ring-red-200 dark:ring-red-800'
            : 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
        } ${disabled || isOffline ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        title={
          isOffline 
            ? 'Voice input unavailable - you are offline' 
            : isListening 
              ? 'Click to stop recording' 
              : 'Click to start recording'
        }
      >
        {isListening ? (
          <FiMicOff className="h-6 w-6" />
        ) : (
          <FiMic className="h-6 w-6" />
        )}
        
        {/* Recording indicator */}
        {isListening && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-300 rounded-full animate-ping"></div>
        )}
      </button>
      
      <div className="text-center">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {isListening ? '🎙️ Listening... Click to stop' : '🎤 Click to start speaking'}
        </p>
        {interimTranscript && (
          <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
            <p className="text-xs text-blue-700 dark:text-blue-300 italic">
              "&gt;{interimTranscript}"
            </p>
          </div>
        )}
      </div>
      
      {/* Instructions */}
      <div className="text-xs text-gray-500 dark:text-gray-400 text-center max-w-xs">
        {isOffline ? (
          <span className="text-red-600 dark:text-red-400 font-medium">📡 Offline - Speech recognition unavailable</span>
        ) : networkError ? (
          <span className="text-red-600 dark:text-red-400 font-medium">⚠️ Network issues detected - Retrying...</span>
        ) : isListening ? (
          <span className="text-red-600 dark:text-red-400 font-medium">🔴 Recording in progress - Speak clearly</span>
        ) : (
          <span>💡 Make sure your microphone is enabled and working</span>
        )}
      </div>
      
      {/* Network status indicator */}
      {networkError && !isOffline && (
        <div className="text-center p-2 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
          <p className="text-orange-800 dark:text-orange-200 text-xs">
            🌐 Experiencing connectivity issues. Retrying automatically...
          </p>
        </div>
      )}
      
      {/* Offline indicator */}
      {isOffline && (
        <div className="text-center p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-200 text-xs">
            📡 You're offline. Speech recognition requires an internet connection.
          </p>
        </div>
      )}
    </div>
  );
};

export default VoiceInput;