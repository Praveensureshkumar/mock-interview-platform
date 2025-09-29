import React, { useState, useEffect } from 'react';
import { FiMic, FiMicOff } from 'react-icons/fi';

const VoiceInput = ({ onTranscript, disabled }) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onstart = () => {
        setIsListening(true);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      recognitionInstance.onresult = (event) => {
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        
        if (finalTranscript) {
          onTranscript(finalTranscript);
        }
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognition) {
      alert('Speech recognition is not supported in your browser');
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
    return (
      <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800">
          Speech recognition is not supported in your browser. Please use the text input instead.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-2">
      <button
        onClick={toggleListening}
        disabled={disabled}
        className={`p-4 rounded-full transition-all duration-200 ${
          isListening
            ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isListening ? (
          <FiMicOff className="h-6 w-6" />
        ) : (
          <FiMic className="h-6 w-6" />
        )}
      </button>
      <p className="text-sm text-gray-600">
        {isListening ? 'Listening... Click to stop' : 'Click to start speaking'}
      </p>
    </div>
  );
};

export default VoiceInput;