import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, AlertTriangle, Loader } from 'lucide-react';
import { useAppContext } from '../../store/AppContext';
import { getStationAIResponse } from '../../engine/SimulationBrain';

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Hi! I am your Dhanbad Station AI Assistant. How can I help you navigate the station today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { simulation } = useAppContext();
  const messagesEndRef = useRef(null);

  // Proactive suggestions based on simulation
  useEffect(() => {
    if (simulation.activeAlerts.length > 0 && !isOpen) {
       // Only pop once per alert session
       const proactiveMsg = `⚠️ Attention: ${simulation.activeAlerts[0]}`;
       if (!messages.some(m => m.text === proactiveMsg)) {
         setMessages(prev => [...prev, { type: 'bot', text: proactiveMsg }]);
       }
    }
  }, [simulation.activeAlerts]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isTyping) return;
    
    // Add user message
    const userMsg = inputValue;
    const newMessages = [...messages, { type: 'user', text: userMsg }];
    setMessages(newMessages);
    setInputValue('');
    setIsTyping(true);

    try {
      // Small simulated delay for "AI thinking" feel
      await new Promise(r => setTimeout(r, 600));

      if (simulation.isEvacuationMode) {
        setMessages(prev => [...prev, { type: 'bot', text: "🚨 EMERGENCY: Please drop your luggage and proceed to the nearest EXIT immediately. Ignore standard routing." }]);
        setIsTyping(false);
        return;
      }

      // Use internal simulation-aware logic (Security: No API keys exposed)
      const fallbackResponse = getStationAIResponse(userMsg, simulation);
      setMessages(prev => [...prev, { type: 'bot', text: fallbackResponse }]);
    } catch (error) {
      console.warn("AI Engine Error:", error.message);
      setMessages(prev => [...prev, { type: 'bot', text: "I'm having trouble processing that right now. Please check the live map for station status." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="glass-panel w-80 h-96 mb-4 rounded-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5">
          <div className="bg-primary/80 backdrop-blur-md p-3 flex justify-between items-center border-b border-white/10">
            <div className="flex items-center gap-2 font-bold text-white">
              <Bot className="w-5 h-5"/> Station AI
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:text-gray-300">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-2.5 rounded-xl text-sm ${msg.type === 'user' ? 'bg-primary text-white rounded-tr-sm' : 'bg-surface/80 border border-white/5 rounded-tl-sm'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-surface/80 border border-white/5 rounded-tl-sm rounded-xl p-2.5 flex items-center gap-2">
                  <Loader className="w-3 h-3 animate-spin text-gray-400" />
                  <span className="text-xs text-gray-400">AI is thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-t border-white/10 bg-surface/50 flex gap-2">
            <input 
              type="text" 
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask about a platform..."
              className="flex-1 bg-background rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary border border-white/5"
            />
            <button onClick={handleSend} className="bg-primary hover:bg-blue-600 p-2 rounded-full transition-colors">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 w-14 bg-primary rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)] flex items-center justify-center hover:scale-105 transition-transform relative"
      >
        {simulation.activeAlerts.length > 0 && !isOpen && (
           <span className="absolute -top-1 -right-1 flex h-4 w-4">
             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger opacity-75"></span>
             <span className="relative inline-flex rounded-full h-4 w-4 bg-danger text-[8px] items-center justify-center font-bold">1</span>
           </span>
        )}
        {isOpen ? <X className="text-white w-6 h-6" /> : <MessageSquare className="text-white w-6 h-6" />}
      </button>
    </div>
  );
}
