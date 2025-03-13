import React, { useState, useRef, useEffect } from 'react';

const ChatInput = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');
  const [isReasonSelected, setIsReasonSelected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);

  // Adjust textarea height based on content
  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to auto to get the correct scrollHeight
      textareaRef.current.style.height = 'auto';
      
      // Calculate new height (with a maximum height)
      const maxHeight = 150; // Maximum height in pixels
      const scrollHeight = textareaRef.current.scrollHeight;
      const newHeight = Math.min(scrollHeight, maxHeight);
      
      textareaRef.current.style.height = `${newHeight}px`;
      
      // Enable scrolling if content exceeds maximum height
      textareaRef.current.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden';
    }
  }, [message]);

  // Initialize speech recognition once on component mount
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
    } else if ('SpeechRecognition' in window) {
      recognitionRef.current = new window.SpeechRecognition();
    } else {
      console.warn('Speech recognition not supported in this browser');
      return;
    }

    if (recognitionRef.current) {
      // Configure recognition
      recognitionRef.current.continuous = false; // Changed to false for better reliability
      recognitionRef.current.interimResults = false; // Changed to false for final results only
      recognitionRef.current.lang = 'en-US'; // Set language explicitly
      
      // Handle results
      recognitionRef.current.onresult = (event) => {
        const last = event.results.length - 1;
        const transcript = event.results[last][0].transcript;
        console.log('Recognized text:', transcript);
        
        // Append to existing message rather than replace
        setMessage(prevMessage => {
          const newMessage = prevMessage ? `${prevMessage} ${transcript}` : transcript;
          return newMessage;
        });
      };
      
      // Handle end of speech recognition
      recognitionRef.current.onend = () => {
        console.log('Speech recognition ended');
        setIsListening(false);
      };
      
      // Handle errors
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }
    
    // Cleanup on unmount
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (err) {
          // Ignore errors on cleanup
        }
      }
    };
  }, []);

  // Handle toggling voice recognition
  const toggleListening = () => {
    if (!recognitionRef.current) return;
    
    if (isListening) {
      try {
        recognitionRef.current.stop();
        setIsListening(false);
      } catch (err) {
        console.error('Error stopping speech recognition:', err);
      }
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Error starting speech recognition:', err);
      }
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      // Stop listening if active
      if (isListening && recognitionRef.current) {
        try {
          recognitionRef.current.stop();
          setIsListening(false);
        } catch (err) {
          // Ignore errors when stopping
        }
      }
      
      const finalMessage = isReasonSelected
        ? `${message}\nDiscuss in Details or Show in Tabular form or give reasoning`
        : message;
        
      // Call the passed callback function
      onSendMessage(finalMessage);
      
      // Clear the message
      setMessage('');
      setIsReasonSelected(false);
    }
  };

  // Handle clearing the input
  const handleClear = () => {
    setMessage('');
    setIsReasonSelected(false);
    textareaRef.current.focus();
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && document.activeElement === textareaRef.current) {
        handleClear();
        if (isListening && recognitionRef.current) {
          try {
            recognitionRef.current.stop();
            setIsListening(false);
          } catch (err) {
            // Ignore errors when stopping
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isListening]);

  // Handle manual typing
  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="relative">
        <textarea
          ref={textareaRef}
          className="w-full p-3 pb-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          placeholder="Type your message here..."
          value={message}
          onChange={handleInputChange}
          disabled={isLoading}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />

        <div className="absolute bottom-3 right-3 flex space-x-2">
          <button
            type="button"
            onClick={toggleListening}
            className={`p-2 rounded-lg ${
              isListening 
                ? 'bg-red-500 text-white animate-pulse' 
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            } transition-colors`}
            disabled={isLoading}
            title={isListening ? "Stop listening" : "Start voice input"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
            </svg>
          </button>

          <button
            type="submit"
            className={`p-2 rounded-lg ${
              isLoading || !message.trim() ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-primary text-white hover:bg-secondary'
            } transition-colors`}
            disabled={isLoading || !message.trim()}
            title="Send message"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div className="absolute left-3 bottom-3 flex space-x-2">
          {message && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-md bg-gray-200 text-gray-500 hover:bg-gray-300 hover:text-gray-700 transition-colors flex items-center"
              title="Clear message (ESC)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <span className="text-xs ml-1">Clear</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsReasonSelected(!isReasonSelected)}
            className={`py-1 px-2 rounded-md transition-colors flex items-center text-xs font-medium ${
              isReasonSelected 
                ? 'bg-gradient-to-r from-blue-300 to-blue-400 text-white' 
                : 'bg-gray-200 text-gray-500 hover:bg-gray-300 hover:text-gray-700'
            }`}
            title="Toggle detailed reasoning"
          >
            Detailed
          </button>
        </div>
      </div>
      
      {isListening && (
        <div className="mt-1 text-xs text-white flex items-center">
          <div className="w-2 h-2 rounded-full bg-red-500 mr-1 animate-pulse"></div>
          Listening... (speak clearly)
        </div>
      )}
    </form>
  );
};

export default ChatInput;