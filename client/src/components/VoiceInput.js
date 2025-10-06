import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FiMic, FiMicOff } from 'react-icons/fi';

const VoiceInput = ({ onTranscript, disabled, shouldReadQuestion, questionText }) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [networkError, setNetworkError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [speechNotSupported, setSpeechNotSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastSpokenQuestion, setLastSpokenQuestion] = useState('');
  const recognitionRef = useRef(null);
  const speechSynthesisRef = useRef(null);
  const maxRetries = 3;

  // Memoize the onTranscript callback to prevent unnecessary re-renders
  const handleTranscript = useCallback((transcript) => {
    if (onTranscript && transcript.trim()) {
      onTranscript(transcript);
    }
  }, [onTranscript]);

  // Text-to-Speech function for reading questions
  const startSpeaking = useCallback((text) => {
    setIsSpeaking(true);
    setLastSpokenQuestion(text);
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure voice settings
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1.0;
    utterance.volume = 0.8;
    
    // Set voice after voices are loaded
    const setVoiceAndSpeak = () => {
      const voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        // Try to use a professional voice
        const preferredVoice = voices.find(voice => 
          voice.name.includes('Microsoft') || 
          voice.name.includes('Google') ||
          voice.lang.startsWith('en')
        );
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
      }
      
      speechSynthesis.speak(utterance);
      speechSynthesisRef.current = utterance;
    };

    utterance.onstart = () => {
      console.log('🔊 Started reading question');
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      console.log('✅ Finished reading question');
      setIsSpeaking(false);
    };

    utterance.onerror = (event) => {
      console.error('❌ Text-to-speech error:', event.error);
      setIsSpeaking(false);
      // Reset the last spoken question if there was an error
      setLastSpokenQuestion('');
    };

    // Handle voices loading
    if (speechSynthesis.getVoices().length === 0) {
      // Voices not loaded yet, wait for them
      speechSynthesis.onvoiceschanged = () => {
        speechSynthesis.onvoiceschanged = null; // Remove listener
        setVoiceAndSpeak();
      };
    } else {
      // Voices already loaded
      setVoiceAndSpeak();
    }
  }, []);

  const speakQuestion = useCallback((text) => {
    if (!text || !('speechSynthesis' in window)) {
      console.log('❌ Text-to-speech not supported or no text provided');
      return;
    }

    // Prevent speaking the same question multiple times
    if (text === lastSpokenQuestion && isSpeaking) {
      console.log('🚫 Already speaking this question, skipping...');
      return;
    }

    // Stop any current speech
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
      // Wait a bit for the cancellation to take effect
      setTimeout(() => {
        startSpeaking(text);
      }, 100);
    } else {
      startSpeaking(text);
    }
  }, [lastSpokenQuestion, isSpeaking, startSpeaking]);

  // Auto-read question when it changes (only in voice mode)
  useEffect(() => {
    if (shouldReadQuestion && questionText && !isSpeaking && !isListening && questionText !== lastSpokenQuestion) {
      console.log('🔊 Auto-reading question in voice mode');
      // Small delay to ensure UI is ready and prevent rapid re-triggers
      const timeoutId = setTimeout(() => {
        // Double-check conditions before speaking
        if (shouldReadQuestion && questionText && !isSpeaking && !isListening && questionText !== lastSpokenQuestion) {
          speakQuestion(questionText);
        }
      }, 1500);
      
      // Cleanup timeout if component unmounts or dependencies change
      return () => clearTimeout(timeoutId);
    }
  }, [shouldReadQuestion, questionText, speakQuestion, isSpeaking, isListening, lastSpokenQuestion]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    
    // Configure speech recognition with more basic settings
    recognitionInstance.continuous = false; // Start with false for better compatibility
    recognitionInstance.interimResults = false; // Start with false to get only final results
    recognitionInstance.lang = 'en-US';
    recognitionInstance.maxAlternatives = 1;
    
    // Add more specific settings for better reliability
    if (recognitionInstance.serviceURI) {
      console.log('🔧 Using service URI:', recognitionInstance.serviceURI);
    }

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
      console.log('🎯 Speech recognition result event triggered:', event);
      console.log('📊 Results length:', event.results.length);
      console.log('📋 Result index:', event.resultIndex);
      
      let finalTranscript = '';
      let interimText = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;
        console.log(`🔍 Result ${i}: "${transcript}" (final: ${result.isFinal})`);
        
        if (result.isFinal) {
          finalTranscript += transcript;
          console.log('✅ Final transcript detected:', transcript);
        } else {
          interimText += transcript;
          console.log('⏳ Interim transcript:', transcript);
        }
      }
      
      // Update interim transcript for display
      if (interimText) {
        setInterimTranscript(interimText);
        console.log('🔄 Setting interim transcript:', interimText);
      }
      
      // Handle final transcript
      if (finalTranscript.trim()) {
        console.log('📝 Processing final transcript:', finalTranscript);
        console.log('🔄 Calling handleTranscript with:', finalTranscript);
        
        // Clear interim transcript when we get final result
        setInterimTranscript('');
        
        // Send transcript immediately
        handleTranscript(finalTranscript);
        
        // For non-continuous mode, manually restart if still listening
        setTimeout(() => {
          if (isListening && recognitionRef.current) {
            console.log('🔄 Restarting recognition for next phrase...');
            try {
              recognitionRef.current.start();
            } catch (e) {
              console.error('Error restarting recognition:', e);
            }
          }
        }, 100);
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
          console.log('🌐 Checking network connectivity...');
          
          // Check if we have internet connection
          if (navigator.onLine) {
            console.log('✅ Device is online, but speech service is unavailable');
            setNetworkError(true);
            
            // Only retry if the user was actively trying to use voice recognition
            if (retryCount < maxRetries && isListening) {
              console.log(`🔄 Retrying speech recognition... (${retryCount + 1}/${maxRetries})`);
              setTimeout(() => {
                // Check if we should still retry (user might have stopped manually)
                if (isListening && !isOffline && navigator.onLine && recognitionRef.current) {
                  setRetryCount(prev => prev + 1);
                  try {
                    console.log('🎤 Attempting to restart speech recognition...');
                    recognitionRef.current.start();
                  } catch (e) {
                    console.error('❌ Retry failed:', e);
                    setIsListening(false);
                    setNetworkError(false);
                    alert('❌ Speech recognition service is temporarily unavailable. Please try again later or use text input.');
                  }
                }
              }, 3000); // Wait 3 seconds before retry (longer delay for network issues)
            } else {
              // Reset states if max retries reached or not listening
              setNetworkError(false);
              setIsListening(false);
              setRetryCount(0);
              
              if (retryCount >= maxRetries) {
                console.error('❌ Speech recognition service failed after maximum retries');
                setSpeechNotSupported(true);
                alert('❌ Speech recognition service is experiencing connectivity issues. Please try again later or use text input instead.\n\n💡 Tip: You can type your answer manually in the text area below.');
              }
            }
          } else {
            console.log('❌ Device is offline');
            setIsOffline(true);
            setIsListening(false);
            setNetworkError(false);
            alert('❌ You appear to be offline. Speech recognition requires an internet connection.');
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
      
      // Stop any ongoing speech synthesis
      if (speechSynthesis && speechSynthesis.speaking) {
        speechSynthesis.cancel();
        setIsSpeaking(false);
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
    // Dependencies intentionally limited to avoid unnecessary re-registration of event listeners
  }, []);

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

        // Additional network test - try to reach Google's servers
        console.log('🌐 Testing internet connectivity to speech service...');
        try {
          await fetch('https://www.google.com/favicon.ico', { 
            method: 'HEAD', 
            mode: 'no-cors',
            cache: 'no-cache'
          });
          console.log('✅ Internet connectivity confirmed');
        } catch (networkTest) {
          console.warn('⚠️ Network test failed, but proceeding anyway:', networkTest);
          // Don't block the user, just warn them
        }

        // Prevent multiple simultaneous starts
        if (recognitionRef.current && recognitionRef.current.started) {
          console.log('🚫 Recognition already started, ignoring request');
          return;
        }

        console.log('🎤 Starting speech recognition...');
        
        // Test speech recognition service availability first
        console.log('🔍 Testing speech recognition service availability...');
        
        // First, test if we can access the microphone at all
        console.log('🎤 Testing microphone access...');
        
        // Request microphone permission first
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          // Stop the stream immediately as we only needed permission
          stream.getTracks().forEach(track => track.stop());
          console.log('✅ Microphone access granted');
          
          // Reset states before starting
          setNetworkError(false);
          setRetryCount(0);
          setInterimTranscript('');
          
          // Start recognition with error handling
          console.log('🚀 Starting speech recognition service...');
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
        <p className="text-yellow-700 dark:text-yellow-300 text-xs mt-2">
          💡 You can still use the text input area to type your answers.
        </p>
      </div>
    );
  }

  // Show if speech recognition is having persistent issues
  if (speechNotSupported) {
    return (
      <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <p className="text-red-800 dark:text-red-200 font-medium">
          ❌ Speech Recognition Unavailable
        </p>
        <p className="text-red-700 dark:text-red-300 text-sm mt-1">
          The speech recognition service is currently not working.
        </p>
        <p className="text-red-600 dark:text-red-400 text-xs mt-2">
          💡 Please use the text input area below to type your answers.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Read Question Button (only in voice mode) */}
      {shouldReadQuestion && questionText && (
        <div className="text-center">
          <button
            onClick={() => speakQuestion(questionText)}
            disabled={isSpeaking}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isSpeaking 
                ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 cursor-not-allowed'
                : 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800/30'
            }`}
          >
            {isSpeaking ? '🔊 Reading Question...' : '🔊 Read Question Aloud'}
          </button>
        </div>
      )}

      {/* Test Speech Recognition Button (only show if having issues) */}
      {(networkError || retryCount > 0) && (
        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg mb-2">
          <p className="text-blue-800 dark:text-blue-200 text-sm font-medium mb-2">
            🧪 Speech Recognition Test
          </p>
          <button
            onClick={() => {
              console.log('🧪 Testing basic speech recognition...');
              if (window.webkitSpeechRecognition || window.SpeechRecognition) {
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                const testRecognition = new SpeechRecognition();
                testRecognition.continuous = false;
                testRecognition.interimResults = false;
                testRecognition.lang = 'en-US';
                
                testRecognition.onresult = (event) => {
                  const result = event.results[0][0].transcript;
                  console.log('✅ Test speech recognition worked:', result);
                  alert(`✅ Speech recognition test successful!\nYou said: "${result}"`);
                };
                
                testRecognition.onerror = (event) => {
                  console.error('❌ Test speech recognition failed:', event.error);
                  alert(`❌ Speech recognition test failed: ${event.error}`);
                };
                
                testRecognition.start();
                console.log('🎤 Test recognition started - say something...');
              }
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
          >
            🧪 Test Speech Recognition
          </button>
          <p className="text-blue-600 dark:text-blue-400 text-xs mt-1">
            Click to test if basic speech recognition works
          </p>
        </div>
      )}

      <button
        onClick={toggleListening}
        disabled={disabled || isOffline || isSpeaking}
        className={`relative p-4 rounded-full transition-all duration-300 transform hover:scale-105 ${
          isSpeaking
            ? 'bg-yellow-500 text-white animate-pulse shadow-lg ring-4 ring-yellow-200 dark:ring-yellow-800'
            : isListening
            ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse shadow-lg ring-4 ring-red-200 dark:ring-red-800'
            : 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
        } ${disabled || isOffline || isSpeaking ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        title={
          isSpeaking
            ? 'AI is speaking - please wait'
            : isOffline 
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
          {isSpeaking ? '🔊 AI is speaking... Please wait' : 
           isListening ? '🎙️ Listening... Click to stop' : 
           '🎤 Click to start speaking'}
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
        {isSpeaking ? (
          <span className="text-yellow-600 dark:text-yellow-400 font-medium">🔊 AI is reading the question - Please wait</span>
        ) : isOffline ? (
          <span className="text-red-600 dark:text-red-400 font-medium">📡 Offline - Speech recognition unavailable</span>
        ) : networkError ? (
          <span className="text-orange-600 dark:text-orange-400 font-medium">⚠️ Speech service issues - Use text input instead</span>
        ) : isListening ? (
          <span className="text-red-600 dark:text-red-400 font-medium">🔴 Recording in progress - Speak clearly</span>
        ) : (
          <span>💡 Make sure your microphone is enabled and working</span>
        )}
      </div>
      
      {/* Network status indicator */}
      {networkError && !isOffline && (
        <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
          <p className="text-orange-800 dark:text-orange-200 text-sm font-medium mb-1">
            🌐 Speech Service Unavailable
          </p>
          <p className="text-orange-700 dark:text-orange-300 text-xs">
            Google's speech recognition service is temporarily unavailable. Retrying automatically...
          </p>
          <p className="text-orange-600 dark:text-orange-400 text-xs mt-1">
            💡 You can use text input instead while we retry
          </p>
          <p className="text-orange-500 dark:text-orange-500 text-xs mt-1">
            🔧 This is usually a temporary Google service issue
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