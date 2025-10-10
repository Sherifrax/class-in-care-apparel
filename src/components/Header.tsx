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

  // Modern, organized navigation structure with futuristic grouping
  const primaryNavigation = [
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
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 navigation-container"
        style={{ 
          background: 'radial-gradient(ellipse at top, hsl(var(--medical-blue) / 0.15) 0%, hsl(var(--medical-blue) / 0.08) 100%)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid hsl(var(--medical-blue) / 0.3)',
          boxShadow: '0 8px 32px -4px hsl(var(--medical-blue) / 0.2)'
        }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Original AURA Logo with clean styling */}
            <Link to="/" className="flex items-center space-x-4 group">
              <div className="w-12 h-12 rounded-xl overflow-hidden group-hover:scale-110 transition-all duration-300 shadow-lg ring-2 ring-medical-blue/30 group-hover:ring-medical-blue/50">
                <img 
                  src={auraLogo} 
                  alt="AURA - Where Presence Becomes Power" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="futuristic-title-container">
                <span className="futuristic-title">AURA</span>
                <div className="futuristic-subtitle">AI • MEDICAL • FUTURE</div>
              </div>
            </Link>
            
            {/* Desktop Navigation - Centered with futuristic styling */}
            <div className="hidden lg:flex items-center justify-center flex-1">
              <nav className="flex items-center space-x-8">
                {primaryNavigation.map((item) => (
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
                    <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-medical-blue to-medical-teal transition-all duration-300 ${
                      isActive(item.href) ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}></span>
                  </Link>
                ))}
              </nav>
            </div>
            
            {/* Desktop Actions with futuristic styling */}
            <div className="hidden lg:flex items-center space-x-3">
              <Link to="/products">
                <Button 
                  size="sm" 
                  className="bg-gradient-to-r from-medical-blue to-medical-teal hover:from-medical-blue hover:to-medical-teal text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 border-0"
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
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 navigation-container"
        style={{
          background: isScrolled 
            ? 'linear-gradient(180deg, hsla(var(--background) / 0.98) 0%, hsla(var(--background) / 0.95) 100%)'
            : 'linear-gradient(180deg, hsla(var(--background) / 0.8) 0%, hsla(var(--background) / 0.6) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: isScrolled 
            ? '1px solid hsl(var(--border))'
            : '1px solid hsla(var(--medical-blue) / 0.2)',
          boxShadow: isScrolled 
            ? '0 4px 24px -4px hsla(var(--medical-blue) / 0.12)'
            : '0 4px 16px -4px hsla(var(--medical-blue) / 0.08)'
        }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Premium AURA Logo */}
            <Link to="/" className="flex items-center space-x-3 sm:space-x-4 group" onClick={closeMobileMenu}>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl overflow-hidden group-hover:scale-110 transition-all duration-500 shadow-lg ring-2 ring-medical-blue/20 group-hover:ring-medical-blue/40 group-hover:shadow-glow">
                <img 
                  src={auraLogo} 
                  alt="AURA - Where Presence Becomes Power" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden sm:block">
                <div className="text-xl md:text-2xl font-bold bg-gradient-to-r from-medical-blue via-medical-teal to-accent-mint bg-clip-text text-transparent tracking-tight">
                  AURA
                </div>
                <div className="text-[10px] font-semibold text-muted-foreground tracking-widest uppercase">
                  Medical Excellence
                </div>
              </div>
            </Link>
            
            {/* Premium Desktop Navigation */}
            <nav className="hidden lg:flex items-center justify-center flex-1">
              <div className="flex items-center gap-1">
                {primaryNavigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`relative px-5 py-2.5 text-sm font-semibold transition-all duration-300 rounded-xl group ${
                      isActive(item.href) 
                        ? 'text-white bg-gradient-to-r from-medical-blue to-medical-teal shadow-lg' 
                        : 'text-foreground hover:text-medical-blue hover:bg-soft-gray'
                    }`}
                  >
                    <span className="relative z-10">{item.name}</span>
                    {!isActive(item.href) && (
                      <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-medical-blue/10 to-medical-teal/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    )}
                  </Link>
                ))}
              </div>
            </nav>
            
            {/* Premium Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3">
              <Link to="/products">
                <Button 
                  size="sm" 
                  className="bg-gradient-to-r from-medical-blue to-medical-teal hover:from-medical-blue-light hover:to-medical-teal-light text-white shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 rounded-xl px-6"
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  <span className="font-semibold">Shop</span>
                </Button>
              </Link>
              
              <Link to="/cart" className="relative">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="relative p-2.5 hover:bg-soft-gray rounded-xl transition-all duration-300"
                >
                  <ShoppingCart className="h-5 w-5 text-foreground" />
                  {cartItemCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center animate-pulse rounded-full"
                    >
                      {cartItemCount}
                    </Badge>
                  )}
                </Button>
              </Link>
              
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="relative h-10 w-10 rounded-full hover:bg-soft-gray transition-all duration-300"
                    >
                      <Avatar className="h-9 w-9 ring-2 ring-medical-blue/30 hover:ring-medical-blue/50 transition-all">
                        <AvatarImage src={user.user_metadata?.avatar_url} />
                        <AvatarFallback className="text-xs font-semibold bg-gradient-to-br from-medical-blue to-medical-teal text-white">
                          {user.user_metadata?.full_name ? getInitials(user.user_metadata.full_name) : 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 mt-2 bg-background/98 backdrop-blur-md border border-border shadow-luxury rounded-xl" align="end" forceMount>
                    <div className="flex items-center gap-3 p-3 border-b border-border">
                      <Avatar className="h-10 w-10 ring-2 ring-medical-blue/20">
                        <AvatarImage src={user.user_metadata?.avatar_url} />
                        <AvatarFallback className="text-xs font-semibold bg-gradient-to-br from-medical-blue to-medical-teal text-white">
                          {user.user_metadata?.full_name ? getInitials(user.user_metadata.full_name) : 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-semibold">{user.user_metadata?.full_name || 'User'}</p>
                        <p className="text-xs text-muted-foreground truncate w-[160px]">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <div className="py-1">
                      {userActions.map((action) => (
                        <DropdownMenuItem key={action.name} asChild>
                          <Link to={action.href} className="flex items-center px-3 py-2 cursor-pointer hover:bg-soft-gray transition-colors rounded-lg mx-1">
                            <action.icon className="mr-3 h-4 w-4 text-medical-blue" />
                            <span className="font-medium">{action.name}</span>
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="mx-1 my-1 cursor-pointer hover:bg-soft-gray rounded-lg">
                      <LogOut className="mr-3 h-4 w-4 text-destructive" />
                      <span className="font-medium">Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAuth(true)}
                  className="flex items-center gap-2 border-2 border-medical-blue/30 hover:border-medical-blue hover:bg-medical-blue/5 rounded-xl px-6 font-semibold transition-all duration-300"
                >
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center gap-2">
              <Link to="/cart" className="relative">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="relative p-2.5 hover:bg-soft-gray rounded-xl transition-all"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartItemCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center rounded-full"
                    >
                      {cartItemCount}
                    </Badge>
                  )}
                </Button>
              </Link>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-2.5 hover:bg-soft-gray rounded-xl transition-all"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Premium Mobile Menu */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent 
          side="right" 
          className="w-[300px] sm:w-[380px] bg-background/98 backdrop-blur-xl border-l border-border shadow-2xl flex flex-col max-h-screen overflow-hidden"
        >
          <SheetHeader className="flex-shrink-0 border-b border-border pb-6">
            <SheetTitle className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl overflow-hidden ring-2 ring-medical-blue/30 shadow-lg">
                <img 
                  src={auraLogo} 
                  alt="AURA" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-2xl font-bold bg-gradient-to-r from-medical-blue via-medical-teal to-accent-mint bg-clip-text text-transparent">
                  AURA
                </span>
                <span className="text-xs font-semibold text-muted-foreground tracking-widest uppercase">Medical Excellence</span>
              </div>
            </SheetTitle>
          </SheetHeader>
          
          <div className="flex-1 overflow-y-auto mt-6 space-y-6 pb-6">
            {/* Premium Mobile Navigation */}
            <nav className="space-y-2">
              {primaryNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={closeMobileMenu}
                  className={`flex items-center px-4 py-3.5 rounded-xl text-base font-semibold transition-all duration-300 ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-medical-blue to-medical-teal text-white shadow-lg'
                      : 'text-foreground hover:bg-soft-gray'
                  }`}
                >
                  {item.icon && <item.icon className="mr-3 h-5 w-5" />}
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>

            <Separator className="my-6" />

            {/* Premium Mobile User Section */}
            <div className="space-y-4">
              {user ? (
                <div className="space-y-4">
                  {/* Premium User Profile Card */}
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-soft-gray to-premium-silver-light border border-border shadow-lg">
                    <Avatar className="h-14 w-14 ring-2 ring-medical-blue/30">
                      <AvatarImage src={user.user_metadata?.avatar_url} />
                      <AvatarFallback className="bg-gradient-to-br from-medical-blue to-medical-teal text-white font-bold text-lg">
                        {user.user_metadata?.full_name ? getInitials(user.user_metadata.full_name) : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold truncate text-lg">{user.user_metadata?.full_name || 'User'}</p>
                      <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>

                  {/* Premium User Actions */}
                  <div className="space-y-2">
                    {userActions.map((action) => (
                      <Link
                        key={action.name}
                        to={action.href}
                        onClick={closeMobileMenu}
                        className="flex items-center px-4 py-3.5 rounded-xl text-base font-semibold text-foreground hover:bg-soft-gray transition-all duration-300"
                      >
                        <action.icon className="mr-3 h-5 w-5 text-medical-blue" />
                        {action.name}
                      </Link>
                    ))}
                    <button
                      onClick={handleSignOut}
                      className="flex items-center w-full px-4 py-3.5 rounded-xl text-base font-semibold text-destructive hover:bg-destructive/10 transition-all duration-300"
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
                    className="w-full bg-gradient-to-r from-medical-blue to-medical-teal hover:from-medical-blue-light hover:to-medical-teal-light text-white shadow-lg hover:shadow-xl transition-all duration-300 py-6 text-base font-semibold rounded-xl"
                  >
                    <LogIn className="h-5 w-5 mr-2" />
                    Sign In
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAuth(true);
                      closeMobileMenu();
                    }}
                    className="w-full border-2 border-medical-blue/30 hover:border-medical-blue hover:bg-medical-blue/5 transition-all duration-300 py-6 text-base font-semibold rounded-xl"
                  >
                    Create Account
                  </Button>
                </div>
              )}
            </div>

            <Separator className="my-6" />

            {/* Premium Mobile Quick Actions */}
            <div className="space-y-2">
              <Link
                to="/products"
                onClick={closeMobileMenu}
                className="flex items-center px-4 py-3.5 rounded-xl text-base font-semibold bg-gradient-to-r from-medical-blue/10 to-medical-teal/10 hover:from-medical-blue/20 hover:to-medical-teal/20 text-foreground transition-all duration-300"
              >
                <ShoppingBag className="mr-3 h-5 w-5 text-medical-blue" />
                Shop Now
              </Link>
              <Link
                to="/cart"
                onClick={closeMobileMenu}
                className="flex items-center px-4 py-3.5 rounded-xl text-base font-semibold text-foreground hover:bg-soft-gray transition-all duration-300"
              >
                <ShoppingCart className="mr-3 h-5 w-5 text-medical-teal" />
                Cart
                {cartItemCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="ml-auto h-6 w-6 text-xs p-0 flex items-center justify-center animate-pulse rounded-full"
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