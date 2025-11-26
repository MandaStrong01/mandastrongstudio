import { MessageCircle, Send, Bot, HelpCircle } from 'lucide-react';
import { useState } from 'react';

interface Page19Props {
  onNext: () => void;
  onBack: () => void;
}

export default function Page19({ onNext, onBack }: Page19Props) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'Grok',
      text: 'Hello! I\'m Grok, your 24/7 AI assistant. How can I help you with MandaStrong Studio today?',
      time: 'Just now'
    }
  ]);

  const handleSend = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      sender: 'You',
      text: message,
      time: 'Just now'
    };

    setMessages([...messages, newMessage]);
    setMessage('');

    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        sender: 'Grok',
        text: 'I understand your question! Let me help you with that. What specific aspect of MandaStrong Studio would you like assistance with?',
        time: 'Just now'
      }]);
    }, 1000);
  };

  const quickQuestions = [
    'How do I save my project?',
    'Export options explained',
    'AI tool not working',
    'Video rendering help',
    'Timeline editor guide'
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-purple-400 flex items-center gap-3">
          <Bot className="w-10 h-10" />
          24/7 Grok Help Desk - AI Support
        </h1>

        <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-2 border-purple-500 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <Bot className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-purple-300">Grok AI Assistant</h2>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-400">Online & Ready</span>
              </div>
            </div>
          </div>
          <p className="text-purple-200">
            Get instant help with any questions about MandaStrong Studio. Available 24/7 to assist you!
          </p>
        </div>

        <div className="bg-purple-900/30 border-2 border-purple-500 rounded-xl overflow-hidden mb-6">
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-lg ${
                    msg.sender === 'You'
                      ? 'bg-blue-600 text-white'
                      : 'bg-purple-600 text-white'
                  }`}
                >
                  <div className="font-bold text-sm mb-1">{msg.sender}</div>
                  <div>{msg.text}</div>
                  <div className="text-xs opacity-70 mt-1">{msg.time}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t-2 border-purple-500 p-4 bg-black/50">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your question here..."
                className="flex-1 bg-black border border-purple-500 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <button
                onClick={handleSend}
                className="bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
                Send
              </button>
            </div>
          </div>
        </div>

        <div className="bg-purple-900/30 border-2 border-purple-500 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-purple-300">
            <HelpCircle className="w-6 h-6" />
            Quick Questions
          </h2>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => setMessage(q)}
                className="bg-black border border-purple-500 hover:bg-purple-600 px-4 py-2 rounded-lg text-sm transition-all"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={onBack}
            className="bg-purple-600 text-white px-8 py-3 rounded-lg text-lg font-bold hover:bg-purple-500 transition-all hover:scale-105"
          >
            Back
          </button>
          <button
            onClick={onNext}
            className="bg-purple-600 text-white px-8 py-3 rounded-lg text-lg font-bold hover:bg-purple-500 transition-all hover:scale-105"
          >
            Next
          </button>
        </div>

        <footer className="border-t-2 border-purple-500 pt-6 mt-8 text-center text-white text-sm">
          <p>MandaStrong1 2025 ~ Author Of Doxy The School Bully ~ Also Find Me On MandaStrong1.Etsy.com</p>
        </footer>
      </div>
    </div>
  );
}
