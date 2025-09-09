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
    <Card className={`p-6 shadow-card ${className}`}>
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-br from-medical-blue to-medical-teal rounded-full mx-auto flex items-center justify-center mb-4">
          <svg 
            className="w-8 h-8 text-white" 
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
        
        <h3 className="text-xl font-bold text-luxury-navy">
          Voice Assistant
        </h3>
        
        <p className="text-muted-foreground">
          Speak with our AI assistant about Aura medical uniforms, sizing, and orders.
        </p>
        
        {!vapiPublicKey && (
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Enter your Vapi Public Key"
              value={vapiPublicKey}
              onChange={(e) => setVapiPublicKey(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md text-sm"
            />
            <p className="text-xs text-muted-foreground">
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
                className="w-full bg-medical-blue hover:bg-medical-blue/90"
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
                <div className="flex items-center justify-center space-x-2 text-medical-blue">
                  <div className="w-2 h-2 bg-medical-blue rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Voice call active</span>
                  <div className="w-2 h-2 bg-medical-blue rounded-full animate-pulse"></div>
                </div>
                <Button 
                  onClick={endCall}
                  variant="destructive" 
                  size="lg"
                  className="w-full"
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