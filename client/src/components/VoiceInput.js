import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FiMic, FiMicOff } from 'react-icons/fi';

const VoiceInput = ({ onTranscript, disabled }) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [interimTranscript, setInterimTranscript] = useState('');
  const recognitionRef = useRef(null);

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
    recognitionInstance.continuous = false; // Changed to false for better control
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = 'en-US';
    recognitionInstance.maxAlternatives = 1;

    recognitionInstance.onstart = () => {
      console.log('Speech recognition started');
      setIsListening(true);
      setInterimTranscript('');
    };

    recognitionInstance.onend = () => {
      console.log('Speech recognition ended');
      setIsListening(false);
    };

    recognitionInstance.onresult = (event) => {
      let finalTranscript = '';
      let interimText = '';
      
      for (let i = 0; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimText += transcript;
        }
      }
      
      setInterimTranscript(interimText);
      
      if (finalTranscript) {
        console.log('Final transcript:', finalTranscript);
        handleTranscript(finalTranscript);
        setInterimTranscript('');
      }
    };

    recognitionInstance.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      setInterimTranscript('');
      
      // Handle different error types
      switch (event.error) {
        case 'no-speech':
          alert('No speech detected. Please try again.');
          break;
        case 'audio-capture':
          alert('No microphone found. Please check your microphone.');
          break;
        case 'not-allowed':
          alert('Microphone access denied. Please allow microphone access and try again.');
          break;
        case 'network':
          alert('Network error. Please check your internet connection.');
          break;
        default:
          alert(`Speech recognition error: ${event.error}`);
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

  const toggleListening = async () => {
    if (!recognition) {
      alert('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (disabled) return;

    try {
      if (isListening) {
        recognition.stop();
      } else {
        // Request microphone permission
        try {
          await navigator.mediaDevices.getUserMedia({ audio: true });
          recognition.start();
        } catch (error) {
          console.error('Microphone permission error:', error);
          alert('Please allow microphone access to use voice input.');
        }
      }
    } catch (error) {
      console.error('Speech recognition toggle error:', error);
      setIsListening(false);
    }
  };

  // Check if speech recognition is supported
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    return (
      <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800">
          Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari for voice input.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-3">
      <button
        onClick={toggleListening}
        disabled={disabled}
        className={`p-4 rounded-full transition-all duration-200 ${
          isListening
            ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse shadow-lg'
            : 'bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        title={isListening ? 'Click to stop recording' : 'Click to start recording'}
      >
        {isListening ? (
          <FiMicOff className="h-6 w-6" />
        ) : (
          <FiMic className="h-6 w-6" />
        )}
      </button>
      
      <div className="text-center">
        <p className="text-sm font-medium text-gray-700">
          {isListening ? '🎙️ Listening...' : '🎤 Click to start speaking'}
        </p>
        {interimTranscript && (
          <p className="text-xs text-gray-500 mt-1 italic">
            "{interimTranscript}"
          </p>
        )}
      </div>
      
      {/* Instructions */}
      <div className="text-xs text-gray-500 text-center max-w-xs">
        {isListening ? (
          <span>Speak clearly and click stop when finished</span>
        ) : (
          <span>Make sure your microphone is enabled</span>
        )}
      </div>
    </div>
  );
};

export default VoiceInput;