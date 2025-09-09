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
      text: "Hi there! This is Dr. Bayan from Aura Medical Uniforms customer support. I'm here to help you with any questions about our Aurora Collection, sizing, orders, or returns. How can I assist you today?",
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
    
    // Handle greetings with Dr Bayan persona
    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      return "Hi there! This is Dr. Bayan from Aura Medical Uniforms customer support. I'm here to help you with any questions about our Aurora Collection, sizing, orders, or returns. How can I assist you today?";
    }
    
    // Aurora Collection inquiries
    if (input.includes('aurora') || input.includes('collection')) {
      return "Our Aurora Collection is the heart of what we do! It features premium medical apparel with wrinkle-resistant, breathable fabrics designed specifically for long shifts. We offer sleek full-sleeve sets that project authority and lightweight options for maximum flexibility. The fabric combines performance with luxury - think of it as performance sportswear styled for the clinic. What specific style interests you?";
    }
    
    // Sizing assistance
    if (input.includes('size') || input.includes('sizing') || input.includes('fit')) {
      return "I'd be happy to help with sizing! Our uniforms come in multiple fits and sizes, designed with tailored precision. Could you tell me your height and preferred fit style? I can guide you through our size chart to ensure the perfect fit. We also offer free exchanges for size adjustments within 14 days.";
    }
    
    // Fabric and care questions
    if (input.includes('fabric') || input.includes('material') || input.includes('care') || input.includes('wash')) {
      return "Our fabrics are engineered for healthcare professionals - breathable for comfort during long shifts, wrinkle-resistant to maintain that professional appearance, and durable for repeated washing. For care: gentle cycle, low heat keeps the fabric sleek and extends its life. The performance-driven materials are designed to look great shift after shift.";
    }
    
    // Order and shipping inquiries
    if (input.includes('order') || input.includes('ship') || input.includes('delivery') || input.includes('track')) {
      return "Orders typically ship within 2-5 business days depending on your location, and you'll receive email and text tracking updates. If you have an order number, I can help you track its progress. Is there a specific order you'd like me to check on?";
    }
    
    // Returns and exchanges
    if (input.includes('return') || input.includes('exchange') || input.includes('refund')) {
      return "We accept returns and exchanges within 14 days - items need to be unworn with tags attached. Exchanges for size or color are completely free of charge. The process is simple: repack in original packaging, schedule a pickup, and you'll receive a confirmation email. Would you like me to help you start a return?";
    }
    
    // Pricing inquiries
    if (input.includes('price') || input.includes('cost') || input.includes('payment')) {
      return "Our Aurora Collection represents premium medical apparel with pricing that reflects the luxury quality and performance features. For specific pricing and payment options, I'd recommend checking our latest collection. We believe in bringing class to care, and our pricing reflects that commitment to quality.";
    }
    
    // Product availability
    if (input.includes('available') || input.includes('stock') || input.includes('color')) {
      return "Let me check our current stock for you. We offer the Aurora Collection in multiple colors and sizes. If a specific color isn't currently available, I can suggest alternatives that might suit your needs. What particular style and color are you looking for?";
    }
    
    // General support
    if (input.includes('help') || input.includes('support') || input.includes('problem') || input.includes('issue')) {
      return "I'm here to help resolve any concerns you might have. Whether it's about sizing, orders, product care, or anything else related to your Aura uniforms, we'll get it sorted out together. Could you tell me a little more about what's happening?";
    }
    
    // Default response with Dr Bayan's warmth
    return "Thank you for reaching out to Aura Medical Uniforms! I want to make sure I give you the most helpful information. Could you tell me a bit more about what you're looking for? Whether it's about our Aurora Collection, sizing guidance, or any other questions - I'm here to help you find exactly what you need.";
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
                <h3 className="font-semibold">Dr. Bayan - Aura Support</h3>
                <p className="text-xs text-white/80">Customer service & product expert</p>
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