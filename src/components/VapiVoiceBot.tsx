import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

// Import Vapi types and client
declare global {
  interface Window {
    Vapi: any;
  }
}

interface VapiBotProps {
  assistantId?: string;
  className?: string;
}

const VapiVoiceBot = ({ assistantId, className = "" }: VapiBotProps) => {
  const [vapi, setVapi] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [vapiPublicKey, setVapiPublicKey] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // Load Vapi SDK
    const loadVapi = async () => {
      if (typeof window !== 'undefined' && !window.Vapi) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@vapi-ai/web@latest/dist/index.js';
        script.onload = () => {
          if (window.Vapi && vapiPublicKey) {
            const vapiInstance = new window.Vapi(vapiPublicKey);
            setVapi(vapiInstance);
            
            // Set up event listeners
            vapiInstance.on('call-start', () => {
              setIsCallActive(true);
              toast({
                title: "Voice Assistant Connected",
                description: "You can now speak with our AI assistant about Aura medical uniforms.",
              });
            });
            
            vapiInstance.on('call-end', () => {
              setIsCallActive(false);
              toast({
                title: "Call Ended",
                description: "Thank you for using our voice assistant!",
              });
            });
            
            vapiInstance.on('error', (error: any) => {
              console.error('Vapi error:', error);
              toast({
                title: "Connection Error",
                description: "Unable to connect to voice assistant. Please try again.",
                variant: "destructive",
              });
              setIsCallActive(false);
            });
          }
        };
        document.head.appendChild(script);
      } else if (window.Vapi && vapiPublicKey) {
        const vapiInstance = new window.Vapi(vapiPublicKey);
        setVapi(vapiInstance);
      }
    };

    if (vapiPublicKey) {
      loadVapi();
    }
  }, [vapiPublicKey, toast]);

  const startCall = async () => {
    if (!vapi) {
      toast({
        title: "Setup Required",
        description: "Please enter your Vapi public key first.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      await vapi.start(assistantId || "b2c0d644-eb09-4312-a92f-c8f4749811e5");
    } catch (error) {
      console.error('Error starting call:', error);
      toast({
        title: "Call Failed",
        description: "Unable to start voice call. Please check your microphone permissions.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const endCall = () => {
    if (vapi && isCallActive) {
      vapi.stop();
    }
  };

  return (
    <Card className={`p-2 sm:p-4 md:p-5 shadow-card w-full max-w-[320px] sm:max-w-[420px] md:max-w-md lg:max-w-lg mx-auto ${className}`}>
      <div className="text-center space-y-3 sm:space-y-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-primary to-accent rounded-full mx-auto flex items-center justify-center mb-3 sm:mb-4">
          <svg 
            className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary-foreground"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" 
            />
          </svg>
        </div>
        
        <h3 className="text-base sm:text-lg font-bold text-primary">
          Voice Assistant
        </h3>
        
        <p className="text-sm sm:text-base text-muted-foreground px-2">
          Speak with our AI assistant about Aura medical uniforms, sizing, and orders.
        </p>
        
        {!vapiPublicKey && (
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Enter your Vapi Public Key"
              value={vapiPublicKey}
              onChange={(e) => setVapiPublicKey(e.target.value)}
              className="w-full px-3 py-2 min-h-[44px] border border-border rounded-md text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            <p className="text-xs text-muted-foreground px-1">
              Get your public key from your Vapi dashboard
            </p>
          </div>
        )}
        
        {vapiPublicKey && (
          <div className="space-y-3">
            {!isCallActive ? (
              <Button 
                onClick={startCall} 
                disabled={isLoading || !vapi}
                className="w-full bg-primary hover:bg-primary/90 min-h-[44px] text-sm sm:text-base"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Connecting...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                    Start Voice Chat
                  </>
                )}
              </Button>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-center space-x-2 text-primary">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Voice call active</span>
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                </div>
                <Button 
                  onClick={endCall}
                  variant="destructive" 
                  size="lg"
                  className="w-full min-h-[44px] text-sm sm:text-base"
                >
                  End Call
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default VapiVoiceBot;