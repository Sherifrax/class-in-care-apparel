import VapiVoiceBot from "./VapiVoiceBot";

const VoiceAssistantSection = () => {
  return (
    <section className="py-20 bg-soft-gray">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-luxury-navy mb-6">
              Speak with Our AI Assistant
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Get instant answers about our Aurora Collection, sizing, ordering, and more. 
              Our voice-powered assistant is here to help you find the perfect Aura uniforms.
            </p>
          </div>
          
          <div className="max-w-md mx-auto">
            <VapiVoiceBot />
          </div>
          
          <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-medical-blue/10 rounded-full mx-auto flex items-center justify-center">
                <svg className="w-6 h-6 text-medical-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-luxury-navy">Product Questions</h4>
              <p className="text-sm text-muted-foreground">Ask about Aurora Collection features and materials</p>
            </div>
            
            <div className="space-y-2">
              <div className="w-12 h-12 bg-medical-teal/10 rounded-full mx-auto flex items-center justify-center">
                <svg className="w-6 h-6 text-medical-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="font-semibold text-luxury-navy">Sizing Help</h4>
              <p className="text-sm text-muted-foreground">Get personalized sizing recommendations</p>
            </div>
            
            <div className="space-y-2">
              <div className="w-12 h-12 bg-medical-blue/10 rounded-full mx-auto flex items-center justify-center">
                <svg className="w-6 h-6 text-medical-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h4 className="font-semibold text-luxury-navy">Order Support</h4>
              <p className="text-sm text-muted-foreground">Help with ordering, shipping, and returns</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VoiceAssistantSection;