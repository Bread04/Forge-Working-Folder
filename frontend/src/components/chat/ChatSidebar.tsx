"use client";

import { useState } from 'react';
import { Send, User, Bot } from 'lucide-react';

export default function ChatSidebar() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Neural link established. I am your Scholar AI Agent. How can I facilitate your forge session today?' }
  ]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    
    // API call placeholder
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Analyzing source vectors... Based on page 14 of your document, the concept of entropy is central to this mechanism.' }]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full bg-[#1a0b06]/80 backdrop-blur-2xl border-l border-[#43261a] w-80">
      <div className="p-6 border-b border-[#43261a]">
        <h2 className="text-white font-black flex items-center gap-3 uppercase tracking-tighter italic">
          <div className="p-2 bg-[#f9a84d]/20 rounded-lg text-[#f9a84d]">
            <Bot size={18} />
          </div>
          Scholar Agent
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((m, i) => (
          <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
              m.role === 'user' 
                ? 'bg-[#f9a84d] text-[#1a0b06] font-bold' 
                : 'bg-[#2d150d] text-[#f9e8d2] border border-[#43261a]'
            }`}>
              {m.content}
            </div>
            {m.role === 'assistant' && (
              <div className="mt-2 flex items-center gap-2 px-2">
                <div className="w-1 h-1 bg-[#f9a84d] rounded-full" />
                <span className="text-[10px] font-black text-[#f9a84d] uppercase hover:underline cursor-pointer">
                  Source: PDF Pg. 14, Para 3
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-white/10">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask Scholar..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-light"
          />
          <button 
            onClick={sendMessage}
            className="absolute right-2 top-1.5 p-2 text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
