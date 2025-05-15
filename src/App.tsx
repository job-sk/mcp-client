import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
}

interface Tool {
  name: string;
  description: string;
  input_schema: any;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [tools, setTools] = useState<Tool[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const fetchTools = async () => {
    try {
      const response = await axios.get(`${API_BASE}/available-tools`);
      setTools(response.data.tools);
    } catch (error) {
      console.error('Error fetching tools:', error);
    }
  };

  useEffect(() => {
    const connectServer = async () => {
      try {
        await axios.post(`${API_BASE}/connect`, {
          scriptPath: "E:/MCP-client/weather/build/index.js", // update accordingly
        });
        alert("Connected to MCP Server");
        fetchTools();
      } catch (error) {
        alert("Connection failed");
      }
    };
    connectServer();
  }, []);
  

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessage: Message = { id: Date.now(), text: input, sender: 'user' };
    setMessages((prev) => [...prev, newMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE}/query`, { prompt: input });
      const aiMessage: Message = { id: Date.now() + 1, text: response.data.response, sender: 'ai' };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark', !darkMode);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen">
      <div className={`${sidebarOpen ? 'w-1/4 p-4' : 'w-0'} bg-gray-100 dark:bg-gray-800 overflow-y-auto transition-all duration-300 relative`}>
        <button onClick={toggleSidebar} className={`absolute top-2 right-2 p-2 rounded bg-gray-200 dark:bg-gray-700 dark:text-white ${!sidebarOpen ? 'left-2' : ''}`}>
          ☰
        </button>
        <h2 className="text-xl font-bold mb-4 dark:text-white">Available Tools</h2>
        <ul>
          {tools?.length > 0 ? (
            tools.map((tool) => (
              <li key={tool.name} className="mb-2 dark:text-white">
                <strong>{tool.name}</strong>: {tool.description}
              </li>
            ))
          ) : (
            <li className="mb-2 dark:text-white">No tools available</li>
          )}
        </ul>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-center p-4 bg-white dark:bg-gray-900 border-b">
          <div className="flex items-center">
            {!sidebarOpen && (
              <button onClick={toggleSidebar} className="p-2 rounded bg-gray-200 dark:bg-gray-700 dark:text-white mr-2">
                ☰
              </button>
            )}
            <h1 className="text-2xl font-bold dark:text-white">MCP Client</h1>
          </div>
          <button onClick={toggleDarkMode} className="p-2 rounded bg-gray-200 dark:bg-gray-700 dark:text-white">
            Toggle Dark Mode
          </button>
        </div>
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          {messages.map((message) => (
            <div key={message.id} className={`mb-4 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block p-3 rounded-lg ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-white'}`}>
                {message.text}
              </div>
            </div>
          ))}
          {loading && <div className="text-center dark:text-white">Loading...</div>}
        </div>
        <div className="p-4 bg-white dark:bg-gray-900 border-t">
          <div className="flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1 p-2 border rounded-l dark:bg-gray-800 dark:text-white"
              placeholder="Type your message..."
            />
            <button onClick={sendMessage} className="p-2 bg-blue-500 text-white rounded-r">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
