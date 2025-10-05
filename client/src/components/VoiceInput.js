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

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognitionInstance = new SpeechRecognition();
    
    // Configure speech recognition
    recognitionInstance.continuous = true; // Changed to true for better capture
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
      console.log('🛑 Speech recognition ended');
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
          // Don't show alert for no-speech, just log it
          console.log('No speech detected, waiting for input...');
          break;
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
          
          if (retryCount < maxRetries) {
            console.log(`Retrying... (${retryCount + 1}/${maxRetries})`);
            setTimeout(() => {
              setRetryCount(prev => prev + 1);
              try {
                recognitionInstance.start();
              } catch (e) {
                console.error('Retry failed:', e);
              }
            }, 2000); // Wait 2 seconds before retry
          } else {
            alert('❌ Network connection issues detected. Please check your internet connection and try again later.');
            setRetryCount(0); // Reset retry count
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
          recognitionRef.current.stop();
        } catch (e) {
          console.log('Error stopping recognition:', e);
        }
      }
    };
  }, [handleTranscript]);

  // Handle online/offline status
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
  }, [isListening, recognition]);

  const toggleListening = async () => {
    if (!recognition) {
      alert('❌ Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (disabled) return;

    try {
      if (isListening) {
        console.log('🛑 Stopping speech recognition...');
        recognition.stop();
      } else {
        // Check network connectivity before starting
        if (!navigator.onLine || isOffline) {
          alert('❌ You appear to be offline. Speech recognition requires an internet connection.');
          return;
        }

        console.log('🎤 Starting speech recognition...');
        // Request microphone permission first
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          // Stop the stream immediately as we only needed permission
          stream.getTracks().forEach(track => track.stop());
          
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