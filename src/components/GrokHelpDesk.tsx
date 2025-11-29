import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Minimize2, Maximize2 } from 'lucide-react';

export default function GrokHelpDesk() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Array<{ text: string; sender: 'user' | 'grok' }>>([
    { text: "Hello! I'm Grok, your 24/7 AI assistant for MandaStrong's Studio. How can I help you today?", sender: 'grok' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateGrokResponse(userMessage);
      setMessages(prev => [...prev, { text: response, sender: 'grok' }]);
      setIsTyping(false);
    }, 1000);
  };

  const generateGrokResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return "Hello! Welcome to MandaStrong's Studio. I'm here to help you create amazing movies. What would you like to know?";
    }

    if (lowerMessage.includes('doxy') || lowerMessage.includes('movie')) {
      return "The Doxy: The School Bully movie is available on Page 10! It's a powerful 120-minute film about transformation and standing up against bullying. Would you like to know more about it?";
    }

    if (lowerMessage.includes('video') || lowerMessage.includes('upload')) {
      return "You can upload videos on Page 3. We support various video formats and you can organize your clips for your movie project. Need help with video uploads?";
    }

    if (lowerMessage.includes('builder') || lowerMessage.includes('create')) {
      return "The Movie Builder is available on Page 4. You can arrange your clips, add transitions, text overlays, and create a complete movie. Want tips on using the builder?";
    }

    if (lowerMessage.includes('tutorial') || lowerMessage.includes('guide') || lowerMessage.includes('help')) {
      return "We have comprehensive tutorials starting from Page 5! The Beginner Tutorial walks you through everything step-by-step. Would you like me to guide you to specific features?";
    }

    if (lowerMessage.includes('ai') || lowerMessage.includes('tool')) {
      return "MandaStrong's Studio includes AI-powered tools for video editing, text generation, transitions, and more. You can explore these on Page 7 (AI Tool Interface). What AI feature interests you?";
    }

    if (lowerMessage.includes('page') && lowerMessage.match(/\d+/)) {
      const pageNum = lowerMessage.match(/\d+/)?.[0];
      return `Page ${pageNum} contains specific features. Navigate there using the Quick Nav menu in the top-right corner. Need help finding something specific?`;
    }

    if (lowerMessage.includes('thanks') || lowerMessage.includes('thank you')) {
      return "You're welcome! I'm here 24/7/365 if you need anything else. Happy movie making!";
    }

    return "I'm here to help with any questions about MandaStrong's Studio! Ask me about video uploads, the movie builder, AI tools, tutorials, or the Doxy movie. What would you like to know?";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-orange-600 to-orange-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 hover:shadow-orange-500/50 animate-pulse"
        title="Grok Help Desk - 24/7 Support"
      >
        <MessageCircle className="w-8 h-8" />
        <span className="absolute -top-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></span>
      </button>
    );
  }

  return (
    <div
      className={`fixed z-50 bg-neutral-900 border-2 border-orange-500 rounded-2xl shadow-2xl transition-all duration-300 ${
        isMinimized ? 'bottom-6 right-6 w-80' : 'bottom-6 right-6 w-96 h-[600px]'
      }`}
    >
      <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white p-4 rounded-t-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MessageCircle className="w-6 h-6" />
          <div>
            <h3 className="font-bold text-lg">Grok Help Desk</h3>
            <p className="text-xs opacity-90">Online 24/7/365</p>
          </div>
          <span className="bg-green-500 w-3 h-3 rounded-full animate-pulse"></span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="hover:bg-orange-700 p-2 rounded-lg transition-colors"
          >
            {isMinimized ? <Maximize2 className="w-5 h-5" /> : <Minimize2 className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="hover:bg-orange-700 p-2 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div className="h-[440px] overflow-y-auto p-4 space-y-3 bg-black/30">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-orange-600 text-white'
                      : 'bg-neutral-800 text-orange-200 border border-orange-500/30'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-neutral-800 text-orange-200 border border-orange-500/30 p-3 rounded-lg">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-orange-500/30">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask Grok anything..."
                className="flex-1 bg-neutral-800 text-white border border-orange-500/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-orange-300/50"
              />
              <button
                onClick={handleSendMessage}
                className="bg-orange-600 hover:bg-orange-500 text-white p-2 rounded-lg transition-colors"
                disabled={!inputMessage.trim()}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-orange-300/70 mt-2 text-center">
              Available 24/7/365 for instant support
            </p>
          </div>
        </>
      )}
    </div>
  );
}
