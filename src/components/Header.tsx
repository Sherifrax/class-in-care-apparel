import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

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
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-medical-blue to-medical-teal rounded-lg group-hover:scale-110 transition-transform duration-300"></div>
            <span className="text-xl font-bold text-luxury-navy">Aura Medical</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors relative group ${
                  isActive(item.href) 
                    ? 'text-medical-blue' 
                    : 'text-foreground hover:text-medical-blue'
                }`}
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-medical-blue transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
            <Link to="/products">
              <Button variant="default" size="sm" className="hover:scale-105 transition-transform">
                Shop Now
              </Button>
            </Link>
          </nav>
          
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
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 animate-fade-in">
            <nav className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-sm font-medium transition-colors ${
                    isActive(item.href) 
                      ? 'text-medical-blue' 
                      : 'text-foreground hover:text-medical-blue'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <Link to="/products" onClick={() => setIsMenuOpen(false)}>
                <Button variant="default" size="sm" className="w-full">
                  Shop Now
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;