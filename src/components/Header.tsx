import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import auraLogo from "@/assets/aura-logo.jpg";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Products", href: "/products" },
    { name: "Features", href: "/features" },
    { name: "Contact", href: "/contact" }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-lg overflow-hidden group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <img 
                src={auraLogo} 
                alt="AURA - Where Presence Becomes Power" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-luxury-gold to-luxury-gold-light bg-clip-text text-transparent">AURA</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors relative group px-2 py-1 ${
                  isActive(item.href) 
                    ? 'text-medical-blue' 
                    : 'text-foreground hover:text-medical-blue'
                }`}
              >
                {item.name}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-medical-blue transition-all duration-300 ${
                  isActive(item.href) ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </Link>
            ))}
            <Link to="/products">
              <Button variant="default" size="sm" className="ml-4 hover:scale-105 transition-transform">
                Shop Now
              </Button>
            </Link>
          </nav>
          
          {/* Mobile Menu Button */}
          <Button 
            variant="outline" 
            size="sm" 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="mt-4 pb-4 bg-background/95 backdrop-blur-sm border-t border-border">
            <nav className="flex flex-col space-y-4 pt-4">
              {navigation.map((item, index) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-sm font-medium transition-all duration-200 px-4 py-2 rounded-lg ${
                    isActive(item.href) 
                      ? 'text-medical-blue bg-medical-blue/10' 
                      : 'text-foreground hover:text-medical-blue hover:bg-muted'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-4">
                <Link to="/products" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="default" size="sm" className="w-full hover:scale-105 transition-transform">
                    Shop Now
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;