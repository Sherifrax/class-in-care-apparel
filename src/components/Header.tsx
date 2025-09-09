import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-medical-blue to-medical-teal rounded-lg"></div>
            <span className="text-xl font-bold text-luxury-navy">Aura Medical</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#about" className="text-sm font-medium text-foreground hover:text-medical-blue transition-colors">
              About
            </a>
            <a href="#collection" className="text-sm font-medium text-foreground hover:text-medical-blue transition-colors">
              Aurora Collection
            </a>
            <a href="#features" className="text-sm font-medium text-foreground hover:text-medical-blue transition-colors">
              Features
            </a>
            <Button variant="default" size="sm">
              Shop Now
            </Button>
          </nav>
          
          <Button variant="outline" size="sm" className="md:hidden">
            Menu
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;