import React, { useState, useCallback } from 'react';
import { PlusCircle, Wand2, Send, Loader2 } from 'lucide-react';
import useApi from './hooks/useApi';

const App = () => {
  const [prompt, setPrompt] = useState('');
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [followUpQuestion, setFollowUpQuestion] = useState('');

  const { isLoading, error, sendRequest } = useApi();

  const handleUpLevelPrompt = useCallback(async () => {
    if (!prompt.trim()) return;

    try {
      const improvedPrompt = await sendRequest('/api/uplevel', { prompt });
      const newChat = { id: Date.now(), prompt, improvedPrompt, messages: [] };
      setChats(prevChats => [newChat, ...prevChats]);
      setCurrentChat(newChat);
      setPrompt('');
    } catch (err) {
      // Error is handled in the useApi hook
    }
  }, [prompt, sendRequest]);

  const handleSendFollowUp = useCallback(async () => {
    if (!followUpQuestion.trim() || !currentChat) return;

    try {
      const response = await sendRequest('/api/chat', { 
        message: followUpQuestion,
        chatHistory: currentChat.messages
      });

      const updatedChat = {
        ...currentChat,
        messages: [
          ...currentChat.messages,
          { text: followUpQuestion, sender: 'user' },
          { text: response, sender: 'ai' }
        ],
      };

      setCurrentChat(updatedChat);
      setChats(prevChats => 
        prevChats.map(chat => chat.id === updatedChat.id ? updatedChat : chat)
      );
      setFollowUpQuestion('');
    } catch (err) {
      // Error is handled in the useApi hook
    }
  }, [followUpQuestion, currentChat, sendRequest]);

  const handleNewChat = () => {
    setPrompt('');
    setCurrentChat(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 p-4 flex flex-col">
        <button 
          onClick={handleNewChat} 
          className="mb-4 bg-blue-600 hover:bg-blue-700 p-2 rounded flex items-center justify-center"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> New Chat
        </button>
        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setCurrentChat(chat)}
              className={`p-2 mb-2 rounded cursor-pointer transition-colors duration-200 ${
                currentChat && currentChat.id === chat.id ? 'bg-gray-600' : 'bg-gray-700 hover:bg-gray-650'
              }`}
            >
              {chat.prompt.substring(0, 30)}...
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 flex flex-col">
        {!currentChat ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold mb-8 text-blue-400">Magic Prompt</h1>
            <div className="w-full max-w-md space-y-4">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your prompt here..."
                className="w-full h-32 bg-gray-700 border-gray-600 text-white resize-none p-2 rounded"
              />
              <button 
                onClick={handleUpLevelPrompt} 
                className="w-full bg-purple-600 hover:bg-purple-700 p-2 rounded flex items-center justify-center"
                disabled={isLoading || !prompt.trim()}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                {isLoading ? 'Upleveling...' : 'Up-level'}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            <div className="bg-gray-800 p-4 rounded mb-4 flex-shrink-0">
              <h2 className="text-xl font-bold text-white mb-2">Original Prompt</h2>
              <p className="text-white">{currentChat.prompt}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded mb-4 flex-shrink-0">
              <h2 className="text-xl font-bold text-white mb-2">Improved Prompt</h2>
              <p className="text-white">{currentChat.improvedPrompt}</p>
            </div>
            <div className="flex-1 bg-gray-800 p-4 rounded flex flex-col">
              <h2 className="text-xl font-bold text-white mb-2">Chat</h2>
              <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                {currentChat.messages.map((message, index) => (
                  <div 
                    key={index} 
                    className={`p-2 rounded ${message.sender === 'user' ? 'bg-blue-600' : 'bg-gray-700'}`}
                  >
                    <p className="text-white">{message.text}</p>
                  </div>
                ))}
              </div>
              <div className="flex space-x-2">
                <input
                  value={followUpQuestion}
                  onChange={(e) => setFollowUpQuestion(e.target.value)}
                  placeholder="Ask a follow-up question..."
                  className="flex-1 bg-gray-700 border-gray-600 text-white p-2 rounded"
                />
                <button 
                  onClick={handleSendFollowUp} 
                  className="bg-green-600 hover:bg-green-700 p-2 rounded flex items-center justify-center"
                  disabled={isLoading || !followUpQuestion.trim()}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {error && (
        <div className="absolute bottom-4 right-4 bg-red-500 text-white p-2 rounded">
          Error: {error}
        </div>
      )}
    </div>
  );
};

export default App;

export default App;
