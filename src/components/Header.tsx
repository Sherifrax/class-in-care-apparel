import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { LogIn, User, LogOut, Settings, Menu, X, ShoppingBag, ShoppingCart, Package, Heart, Search, Bell, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Auth } from "@/components/auth/Auth";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useIsMobile } from "@/hooks/use-mobile";
import auraLogo from "@/assets/aura-logo.jpg";

const Header = () => {
  const location = useLocation();
  const [showAuth, setShowAuth] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const { getTotalItems } = useCart();
  const isMobile = useIsMobile();
  const cartItemCount = getTotalItems();

  // Only run on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Clean, organized navigation structure - no duplicates
  const navigation = [
    { name: "Home", href: "/", icon: null },
    { name: "Products", href: "/products", icon: Package },
    { name: "About", href: "/about", icon: null },
    { name: "Contact", href: "/contact", icon: null }
  ];

  // Secondary navigation for user actions
  const userActions = [
    { name: "Favorites", href: "/favorites", icon: Heart },
    { name: "My Orders", href: "/my-orders", icon: Package },
    { name: "Settings", href: "/settings", icon: Settings }
  ];

  const isActive = (path: string) => location.pathname === path;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setMobileMenuOpen(false);
    } catch (error) {
      // Error is handled in the auth context
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Render a static version during SSR and initial hydration
  if (!isClient) {
    return (
      <header 
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{ 
          background: 'radial-gradient(ellipse at top, hsl(var(--medical-blue) / 0.1) 0%, hsl(var(--medical-blue) / 0.05) 100%)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid hsl(var(--medical-blue) / 0.2)',
          boxShadow: '0 4px 20px -2px hsl(var(--medical-blue) / 0.1)'
        }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-4 group">
              <div className="w-12 h-12 rounded-xl overflow-hidden group-hover:scale-110 transition-all duration-300 shadow-lg ring-2 ring-medical-blue/30 group-hover:ring-medical-blue/50">
                <img 
                  src={auraLogo} 
                  alt="AURA - Where Presence Becomes Power" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-medical-blue to-medical-blue-light bg-clip-text text-transparent">AURA</span>
                <div className="text-xs text-medical-blue/80 font-medium">MEDICAL • APPAREL • EXCELLENCE</div>
              </div>
            </Link>
            
            {/* Desktop Navigation - Centered */}
            <div className="hidden lg:flex items-center justify-center flex-1">
              <nav className="flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                    className={`text-sm font-medium transition-all duration-300 relative group px-4 py-2 rounded-lg ${
                      isActive(item.href) 
                        ? 'text-medical-blue bg-medical-blue/15 border border-medical-blue/30 shadow-sm' 
                        : 'text-foreground hover:text-medical-blue hover:bg-medical-blue/5 border border-transparent hover:border-medical-blue/20'
                    }`}
                >
                  {item.name}
                    <span className={`absolute -bottom-1 left-0 h-0.5 bg-medical-blue transition-all duration-300 ${
                      isActive(item.href) ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}></span>
                </Link>
              ))}
            </nav>
            </div>
            
            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-3">
              <Link to="/products">
                <Button 
                  size="sm" 
                  className="bg-gradient-to-r from-medical-blue to-medical-blue-light hover:from-medical-blue hover:to-medical-blue-light text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 border-0"
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Shop Now
                </Button>
              </Link>
              
              <Link to="/cart" className="relative">
                <Button variant="ghost" size="sm" className="relative p-2 hover:bg-medical-blue/10 border border-medical-blue/20 hover:border-medical-blue/40">
                  <ShoppingCart className="h-5 w-5" />
                  {cartItemCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center animate-pulse"
                    >
                      {cartItemCount}
                    </Badge>
                  )}
                </Button>
              </Link>
              
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 border-medical-blue/30 hover:border-medical-blue hover:bg-medical-blue/5"
              >
                <LogIn className="h-4 w-4" />
                Sign In
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center space-x-2">
              <Link to="/cart" className="relative">
                <Button variant="ghost" size="sm" className="relative p-2">
                  <ShoppingCart className="h-5 w-5" />
                  {cartItemCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-4 w-4 text-xs p-0 flex items-center justify-center"
                    >
                      {cartItemCount}
                    </Badge>
                  )}
                </Button>
              </Link>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-2"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header 
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: isScrolled 
            ? 'radial-gradient(ellipse at top, hsl(var(--medical-blue) / 0.15) 0%, hsl(var(--medical-blue) / 0.08) 100%)'
            : 'radial-gradient(ellipse at top, hsl(var(--medical-blue) / 0.1) 0%, hsl(var(--medical-blue) / 0.05) 100%)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: isScrolled 
            ? '1px solid hsl(var(--medical-blue) / 0.3)'
            : '1px solid hsl(var(--medical-blue) / 0.2)',
          boxShadow: isScrolled 
            ? '0 8px 32px -4px hsl(var(--medical-blue) / 0.15)'
            : '0 4px 20px -2px hsl(var(--medical-blue) / 0.1)'
        }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-4 group" onClick={closeMobileMenu}>
              <div className="w-12 h-12 rounded-xl overflow-hidden group-hover:scale-110 transition-all duration-300 shadow-lg ring-2 ring-medical-blue/30 group-hover:ring-medical-blue/50">
                <img 
                  src={auraLogo} 
                  alt="AURA - Where Presence Becomes Power" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-medical-blue to-medical-blue-light bg-clip-text text-transparent">AURA</span>
                <div className="text-xs text-medical-blue/80 font-medium">MEDICAL • APPAREL • EXCELLENCE</div>
              </div>
            </Link>
            
            {/* Desktop Navigation - Centered */}
            <div className="hidden lg:flex items-center justify-center flex-1">
              <nav className="flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                    className={`text-sm font-medium transition-all duration-300 relative group px-4 py-2 rounded-lg ${
                    isActive(item.href) 
                        ? 'text-medical-blue bg-medical-blue/15 border border-medical-blue/30 shadow-sm' 
                        : 'text-foreground hover:text-medical-blue hover:bg-medical-blue/5 border border-transparent hover:border-medical-blue/20'
                  }`}
                >
                  {item.name}
                    <span className={`absolute -bottom-1 left-0 h-0.5 bg-medical-blue transition-all duration-300 ${
                      isActive(item.href) ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}></span>
                </Link>
              ))}
            </nav>
            </div>
            
            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-3">
              <Link to="/products">
                <Button 
                  size="sm" 
                  className="bg-gradient-to-r from-medical-blue to-medical-blue-light hover:from-medical-blue hover:to-medical-blue-light text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 border-0"
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Shop Now
                </Button>
              </Link>
              
              <Link to="/cart" className="relative">
                <Button variant="ghost" size="sm" className="relative p-2 hover:bg-medical-blue/10 border border-medical-blue/20 hover:border-medical-blue/40">
                  <ShoppingCart className="h-5 w-5" />
                  {cartItemCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center animate-pulse"
                    >
                      {cartItemCount}
                    </Badge>
                  )}
                </Button>
              </Link>
              
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:bg-medical-blue/10 border border-medical-blue/20 hover:border-medical-blue/40">
                      <Avatar className="h-8 w-8 ring-2 ring-medical-blue/20">
                        <AvatarImage src={user.user_metadata?.avatar_url} />
                        <AvatarFallback className="text-xs bg-medical-blue/10 text-medical-blue">
                          {user.user_metadata?.full_name ? getInitials(user.user_metadata.full_name) : 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user.user_metadata?.full_name || 'User'}</p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    {userActions.map((action) => (
                      <DropdownMenuItem key={action.name} asChild>
                        <Link to={action.href} className="flex items-center">
                          <action.icon className="mr-2 h-4 w-4" />
                          <span>{action.name}</span>
                      </Link>
                    </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAuth(true)}
                  className="flex items-center gap-2 border-medical-blue/30 hover:border-medical-blue hover:bg-medical-blue/5"
                >
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center space-x-2">
              <Link to="/cart" className="relative">
                <Button variant="ghost" size="sm" className="relative p-2">
                  <ShoppingCart className="h-5 w-5" />
                  {cartItemCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-4 w-4 text-xs p-0 flex items-center justify-center"
                    >
                      {cartItemCount}
                    </Badge>
                  )}
                </Button>
              </Link>
              
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-2"
                onClick={() => setMobileMenuOpen(true)}
                  >
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open menu</span>
                  </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent 
          side="right" 
          className="w-[300px] sm:w-[400px] bg-background/95 backdrop-blur-md border-l border-medical-blue/20 flex flex-col max-h-screen overflow-hidden"
        >
          <SheetHeader className="flex-shrink-0">
            <SheetTitle className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-medical-blue/30">
                <img 
                  src={auraLogo} 
                  alt="AURA" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-medical-blue to-medical-blue-light bg-clip-text text-transparent">
                  AURA
                </span>
                <div className="text-xs text-medical-blue/80 font-medium">MEDICAL • APPAREL • EXCELLENCE</div>
              </div>
            </SheetTitle>
          </SheetHeader>
          
          <div className="flex-1 overflow-y-auto mt-6 space-y-6 pb-6">
            {/* Mobile Navigation Links */}
            <nav className="space-y-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={closeMobileMenu}
                  className={`flex items-center px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-medical-blue/15 text-medical-blue border border-medical-blue/30 shadow-sm'
                      : 'text-foreground hover:bg-medical-blue/5 hover:text-medical-blue border border-transparent hover:border-medical-blue/20'
                  }`}
                >
                  {item.icon && <item.icon className="mr-3 h-5 w-5" />}
                  {item.name}
                </Link>
              ))}
            </nav>

            <Separator />

            {/* Mobile User Actions */}
            <div className="space-y-4">
              {user ? (
                <div className="space-y-4">
                  {/* User Info */}
                  <div className="flex items-center space-x-3 p-4 rounded-lg bg-medical-blue/5 border border-medical-blue/20 shadow-sm">
                    <Avatar className="h-12 w-12 ring-2 ring-medical-blue/30">
                      <AvatarImage src={user.user_metadata?.avatar_url} />
                      <AvatarFallback className="bg-medical-blue/10 text-medical-blue font-semibold">
                        {user.user_metadata?.full_name ? getInitials(user.user_metadata.full_name) : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate text-foreground">{user.user_metadata?.full_name || 'User'}</p>
                      <p className="text-sm text-medical-blue/80 truncate">{user.email}</p>
                    </div>
                  </div>

                  {/* User Actions */}
                  <div className="space-y-2">
                    {userActions.map((action) => (
                      <Link
                        key={action.name}
                        to={action.href}
                        onClick={closeMobileMenu}
                        className="flex items-center px-4 py-3 rounded-lg text-base font-medium text-foreground hover:bg-medical-blue/5 hover:text-medical-blue transition-all duration-200 border border-transparent hover:border-medical-blue/20"
                      >
                        <action.icon className="mr-3 h-5 w-5" />
                        {action.name}
                      </Link>
                    ))}
                    <button
                      onClick={handleSignOut}
                      className="flex items-center w-full px-4 py-3 rounded-lg text-base font-medium text-destructive hover:bg-destructive/10 transition-all duration-200 border border-transparent hover:border-destructive/20"
                    >
                      <LogOut className="mr-3 h-5 w-5" />
                      Sign out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <Button
                    onClick={() => {
                      setShowAuth(true);
                      closeMobileMenu();
                    }}
                    className="w-full bg-gradient-to-r from-medical-blue to-medical-blue-light hover:from-medical-blue hover:to-medical-blue-light text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAuth(true);
                      closeMobileMenu();
                    }}
                    className="w-full border-medical-blue/30 hover:border-medical-blue hover:bg-medical-blue/5 transition-all duration-200"
                  >
                    Create Account
                  </Button>
                </div>
              )}
            </div>

            <Separator />

            {/* Mobile Quick Actions */}
            <div className="space-y-2">
              <Link
                to="/products"
                onClick={closeMobileMenu}
                className="flex items-center px-4 py-3 rounded-lg text-base font-medium text-foreground hover:bg-medical-blue/5 hover:text-medical-blue transition-all duration-200 border border-transparent hover:border-medical-blue/20"
              >
                <ShoppingBag className="mr-3 h-5 w-5" />
                Shop Now
              </Link>
              <Link
                to="/cart"
                onClick={closeMobileMenu}
                className="flex items-center px-4 py-3 rounded-lg text-base font-medium text-foreground hover:bg-medical-blue/5 hover:text-medical-blue transition-all duration-200 border border-transparent hover:border-medical-blue/20"
              >
                <ShoppingCart className="mr-3 h-5 w-5" />
                Cart
                {cartItemCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="ml-auto h-5 w-5 text-xs p-0 flex items-center justify-center animate-pulse"
                  >
                    {cartItemCount}
                  </Badge>
                )}
              </Link>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <Auth 
        isOpen={showAuth} 
        onClose={() => setShowAuth(false)} 
      />
    </>
  );
};

export default Header;