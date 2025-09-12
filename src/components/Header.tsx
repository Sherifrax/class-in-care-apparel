import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import auraLogo from "@/assets/aura-logo.jpg";

const Header = () => {
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
          
          {/* Navigation */}
          <nav className="flex items-center space-x-8">
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
        </div>
      </div>
    </header>
  );
};

export default Header;