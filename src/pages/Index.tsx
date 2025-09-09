import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import AuroraCollection from "@/components/AuroraCollection";
import Features from "@/components/Features";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <About />
      <AuroraCollection />
      <Features />
      <CTA />
      <Footer />
      <ChatBot />
    </div>
  );
};

export default Index;
