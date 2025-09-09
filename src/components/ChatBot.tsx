import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm here to help you with Aura Medical Uniforms. Ask me about our Aurora Collection, sizing, or any questions about our luxury medical apparel!",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Simulate AI response - replace with actual Vapi/OpenAI API call
      const response = await simulateAIResponse(inputValue);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const simulateAIResponse = async (userInput: string): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const input = userInput.toLowerCase();
    
    if (input.includes('aurora') || input.includes('collection')) {
      return "The Aurora Collection is our flagship line of premium medical uniforms! It features breathable, wrinkle-resistant, and stretch-engineered fabrics designed for long shifts. We offer sleek full-sleeve sets that project authority and lightweight options for maximum flexibility. Would you like to know more about specific styles?";
    }
    
    if (input.includes('size') || input.includes('sizing')) {
      return "We offer comprehensive sizing from XS to 3XL with detailed size charts for the perfect fit. Our fabrics have four-way stretch for comfort and movement. Would you like me to help you find your size or would you prefer to speak with our sizing specialist?";
    }
    
    if (input.includes('fabric') || input.includes('material')) {
      return "Our premium fabrics are engineered for healthcare professionals! They're breathable for comfort during long shifts, wrinkle-resistant to maintain a professional appearance, and stretch-engineered for maximum mobility. The materials are also easy to care for and long-lasting.";
    }
    
    if (input.includes('order') || input.includes('buy') || input.includes('purchase')) {
      return "Ordering is easy! You can browse our collection, select your preferred style and size, and we offer hassle-free exchanges if needed. We also provide size guidance to ensure the perfect fit. Would you like help with placing an order?";
    }
    
    if (input.includes('price') || input.includes('cost')) {
      return "Our Aurora Collection represents luxury medical apparel with premium pricing that reflects the quality. Each piece is an investment in your professional appearance and comfort. For specific pricing, I'd recommend checking our latest collection or speaking with our sales team.";
    }
    
    if (input.includes('hello') || input.includes('hi')) {
      return "Hello! Welcome to Aura Medical Uniforms - where we bring CLASS to CARE! I'm here to help you discover our luxury medical apparel. What would you like to know about our Aurora Collection?";
    }
    
    return "Thank you for your question about Aura Medical Uniforms! Our Aurora Collection combines luxury design with professional functionality. We specialize in premium medical scrubs that are breathable, wrinkle-resistant, and tailored for healthcare professionals who refuse to compromise on style. How can I help you find the perfect uniform?";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-medical-blue hover:bg-medical-blue/90 shadow-luxury"
          size="icon"
        >
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          )}
        </Button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-96 h-96 z-40 shadow-luxury flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-luxury-navy to-medical-blue text-white p-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Aura Assistant</h3>
                <p className="text-xs text-white/80">Ask about our Aurora Collection</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 p-1 h-auto"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg text-sm ${
                    message.isUser
                      ? 'bg-medical-blue text-white rounded-br-none'
                      : 'bg-soft-gray text-luxury-navy rounded-bl-none'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-soft-gray text-luxury-navy p-3 rounded-lg rounded-bl-none">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-medical-blue rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-medical-blue rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-medical-blue rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t p-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about Aura uniforms..."
                className="flex-1 px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-medical-blue"
              />
              <Button
                onClick={sendMessage}
                disabled={!inputValue.trim() || isLoading}
                size="sm"
                className="bg-medical-blue hover:bg-medical-blue/90"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default ChatBot;