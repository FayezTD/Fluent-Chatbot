import React, { useEffect, useRef, useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import ChatMessage from '../components/chat/ChatMessage';
import ChatInput from '../components/chat/ChatInput';
import StarterQuestions from '../components/chat/StarterQuestions';
import { useChat } from '../hooks/useChat';
import Header from '../components/layout/Header';
import { useAuth } from '../components/auth/AuthProvider';
import ModelSelector from '../components/chat/ModelSelector';
import backgroundImage from '../assets/bg0006.jpg';

const ChatPage = () => {
  const { 
    messages, 
    isLoading, 
    error, 
    sendMessage, 
    handleStarterQuestion, 
    clearChat,
    starterQuestions 
  } = useChat();

  const { isAuthenticated, login } = useAuth();
  const [selectedModel, setSelectedModel] = useState('GPT-4o');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isAuthenticated) {
    return (
      <div className="h-screen flex justify-center items-center px-4 text-center">
        <div>
          <h2 className="text-2xl font-semibold">You must be signed in to chat.</h2>
          <button 
            onClick={login} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Sign in with Microsoft
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div 
        className="flex-1 flex overflow-hidden bg-cover bg-center" 
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <Sidebar 
          onNewChat={clearChat} 
          activeChatId="current" 
          starterQuestions={starterQuestions.slice(0, 4)} 
          onSelectQuestion={handleStarterQuestion}
          questionStyle="text-white font-bold"
          className="hidden md:block w-1/4 lg:w-1/5 bg-gray-800"
        />
        <main className="flex-1 flex flex-col relative h-full">
          <div className="absolute top-4 right-4">
            <ModelSelector selectedModel={selectedModel} onSelectModel={setSelectedModel} />
          </div>

          <div className="flex-1 overflow-y-auto pt-16 pb-32 px-4 sm:px-6 lg:px-8">
            {messages.length === 0 && (
              <div className="text-center py-4">
                <h1 className="text-3xl font-bold text-gray-900">AI Design Wins Assistant</h1>
                <p className="mt-3 text-lg text-black font-semibold">
                  I can help you with AI-driven workplace solutions.
                </p>
              </div>
            )}
            
            {messages.length > 0 && (
              <div className="max-w-5xl mx-auto space-y-8">
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                {isLoading && (
                  <div className="text-center text-white">Wait...</div>
                )}
                {error && (
                  <div className="p-4 bg-red-50 text-red-700 rounded-lg">
                    <p className="font-medium">Error</p>
                    <p>{error}</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/30 to-transparent">
            <div className="max-w-5xl mx-auto">
              <ChatInput onSendMessage={sendMessage} isLoading={isLoading} className="w-full" />

              {messages.length === 0 && (
                <div className="mt-6 flex justify-center space-x-4">
                  <div className="p-4 bg-white bg-opacity-10 rounded-lg">
                    <StarterQuestions 
                      questions={starterQuestions.slice(0, 4)} 
                      onSelectQuestion={handleStarterQuestion} 
                      questionStyle="text-white font-bold"
                    />
                  </div>
                </div>
              )}
              <p className="text-xs text-center text-white mt-3">
                AI generated content may be incomplete or factually incorrect.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChatPage;