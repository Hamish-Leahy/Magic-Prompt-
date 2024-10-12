import React, { useState } from 'react';
import { PlusCircle, Wand2, Send } from 'lucide-react';
import axios from 'axios';

const App = () => {
  const [prompt, setPrompt] = useState('');
  const [upLeveledPrompt, setUpLeveledPrompt] = useState('');
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [followUpQuestion, setFollowUpQuestion] = useState('');
  const [isUpLeveling, setIsUpLeveling] = useState(false);

  const handleInsertPrompt = () => {
    console.log('Inserting prompt:', prompt);
  };

  const handleUpLevelPrompt = async () => {
    setIsUpLeveling(true);
    try {
      const response = await axios.post('/api/uplevel', { prompt });
      const improvedPrompt = response.data.improvedPrompt;
      setUpLeveledPrompt(improvedPrompt);
      const newChat = { id: Date.now(), prompt, improvedPrompt, messages: [] };
      setChats([newChat, ...chats]);
      setCurrentChat(newChat);
      setShowChat(true);
    } catch (error) {
      console.error('Error upleveling prompt:', error);
      // Handle error (e.g., show an error message to the user)
    } finally {
      setIsUpLeveling(false);
    }
  };

  const handleNewChat = () => {
    setPrompt('');
    setUpLeveledPrompt('');
    setCurrentChat(null);
    setShowChat(false);
  };

  const handleSendFollowUp = () => {
    if (followUpQuestion.trim() !== '') {
      const updatedChat = {
        ...currentChat,
        messages: [...currentChat.messages, { text: followUpQuestion, sender: 'user' }],
      };
      setCurrentChat(updatedChat);
      setChats(chats.map((chat) => (chat.id === updatedChat.id ? updatedChat : chat)));
      setFollowUpQuestion('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 p-4 flex flex-col">
        <button onClick={handleNewChat} className="mb-4 bg-blue-600 hover:bg-blue-700 p-2 rounded">
          <PlusCircle className="inline-block mr-2 h-4 w-4" /> New Chat
        </button>
        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => {
                setCurrentChat(chat);
                setShowChat(true);
              }}
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
      <div className="flex-1 p-4 flex flex-col items-center justify-center">
        {!showChat ? (
          <>
            <h1 className="text-4xl font-bold mb-8 text-blue-400">Magic Prompt</h1>
            <div className="w-full max-w-md bg-gray-800 border-gray-700 p-4 rounded">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your prompt here..."
                className="w-full h-32 bg-gray-700 border-gray-600 text-white resize-none p-2 rounded mb-4"
              />
              <div className="flex space-x-2">
                <button onClick={handleInsertPrompt} className="flex-1 bg-blue-600 hover:bg-blue-700 p-2 rounded">
                  <PlusCircle className="inline-block mr-2 h-4 w-4" /> Insert
                </button>
                <button 
                  onClick={handleUpLevelPrompt} 
                  className="flex-1 bg-purple-600 hover:bg-purple-700 p-2 rounded"
                  disabled={isUpLeveling}
                >
                  {isUpLeveling ? (
                    'Upleveling...'
                  ) : (
                    <>
                      <Wand2 className="inline-block mr-2 h-4 w-4" /> Up-level
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full max-w-2xl">
            <div className="bg-gray-800 p-4 rounded mb-4">
              <h2 className="text-xl font-bold text-white mb-2">Original Prompt</h2>
              <p className="text-white">{currentChat?.prompt}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded mb-4">
              <h2 className="text-xl font-bold text-white mb-2">Improved Prompt</h2>
              <p className="text-white">{currentChat?.improvedPrompt}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded">
              <h2 className="text-xl font-bold text-white mb-2">Chat</h2>
              <div className="space-y-4 mb-4">
                {currentChat?.messages.map((message, index) => (
                  <div key={index} className={`p-2 rounded ${message.sender === 'user' ? 'bg-blue-600' : 'bg-gray-700'}`}>
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
                <button onClick={handleSendFollowUp} className="bg-green-600 hover:bg-green-700 p-2 rounded">
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
