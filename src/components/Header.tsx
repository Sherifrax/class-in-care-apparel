import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { LogIn, User, LogOut, Settings, Menu, X, ShoppingBag, ShoppingCart } from "lucide-react";
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
  const { user, signOut } = useAuth();
  const { getTotalItems } = useCart();
  const isMobile = useIsMobile();
  const cartItemCount = getTotalItems();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Products", href: "/products" },
    { name: "Features", href: "/features" },
    { name: "Contact", href: "/contact" }
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

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group" onClick={closeMobileMenu}>
              <div className="w-10 h-10 rounded-lg overflow-hidden group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <img 
                  src={auraLogo} 
                  alt="AURA - Where Presence Becomes Power" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xl font-bold text-primary">AURA</span>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8 overflow-x-auto whitespace-nowrap">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-sm font-medium transition-colors relative group px-2 py-1 ${
                    isActive(item.href) 
                      ? 'text-primary' 
                      : 'text-foreground hover:text-primary'
                  }`}
                >
                  {item.name}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
                    isActive(item.href) ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
                </Link>
              ))}
            </nav>
            
            {/* Desktop Authentication & CTA */}
            <div className="hidden lg:flex items-center space-x-4">
              <Link to="/products">
                <Button variant="default" size="sm" className="hover:scale-105 transition-transform">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Shop Now
                </Button>
              </Link>
              
              {/* Cart Icon */}
              <Link to="/cart" className="relative">
                <Button variant="ghost" size="sm" className="relative">
                  <ShoppingCart className="h-4 w-4" />
                  {cartItemCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center"
                    >
                      {cartItemCount}
                    </Badge>
                  )}
                </Button>
              </Link>
              
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.user_metadata?.avatar_url} />
                        <AvatarFallback className="text-xs">
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
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
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
                  className="flex items-center gap-2"
                >
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center space-x-2">
              <Link to="/products">
                <Button variant="default" size="sm" className="hover:scale-105 transition-transform">
                  <ShoppingBag className="h-4 w-4" />
                </Button>
              </Link>
              
              {/* Mobile Cart Icon */}
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
              
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-2">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px] max-h-[100dvh] overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg overflow-hidden">
                        <img 
                          src={auraLogo} 
                          alt="AURA" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-lg font-bold text-primary">
                        AURA
                      </span>
                    </SheetTitle>
                  </SheetHeader>
                  
                  <div className="mt-6 space-y-6">
                    {/* Mobile Navigation Links */}
                    <nav className="space-y-2">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          onClick={closeMobileMenu}
                          className={`flex items-center px-3 py-3 rounded-lg text-base font-medium transition-colors ${
                            isActive(item.href)
                              ? 'bg-primary/10 text-primary border-l-4 border-primary'
                              : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                          }`}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </nav>

                    <Separator />

                    {/* Mobile Authentication */}
                    <div className="space-y-4">
                      {user ? (
                        <div className="space-y-4">
                          {/* User Info */}
                          <div className="flex items-center space-x-3 p-3 rounded-lg bg-accent/50">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={user.user_metadata?.avatar_url} />
                              <AvatarFallback>
                                {user.user_metadata?.full_name ? getInitials(user.user_metadata.full_name) : 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{user.user_metadata?.full_name || 'User'}</p>
                              <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                            </div>
                          </div>

                          {/* User Actions */}
                          <div className="space-y-2">
                            <Link
                              to="/profile"
                              onClick={closeMobileMenu}
                              className="flex items-center px-3 py-3 rounded-lg text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                            >
                              <User className="mr-3 h-5 w-5" />
                              Profile
                            </Link>
                            <Link
                              to="/settings"
                              onClick={closeMobileMenu}
                              className="flex items-center px-3 py-3 rounded-lg text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                            >
                              <Settings className="mr-3 h-5 w-5" />
                              Settings
                            </Link>
                            <button
                              onClick={handleSignOut}
                              className="flex items-center w-full px-3 py-3 rounded-lg text-base font-medium text-destructive hover:bg-destructive/10 transition-colors"
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
                            className="w-full flex items-center justify-center gap-2"
                          >
                            <LogIn className="h-4 w-4" />
                            Sign In
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setShowAuth(true);
                              closeMobileMenu();
                            }}
                            className="w-full"
                          >
                            Create Account
                          </Button>
                        </div>
                      )}
                    </div>

                    <Separator />

                    {/* Additional Mobile Actions */}
                    <div className="space-y-2">
                      <Link
                        to="/products"
                        onClick={closeMobileMenu}
                        className="flex items-center px-3 py-3 rounded-lg text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                      >
                        <ShoppingBag className="mr-3 h-5 w-5" />
                        Shop Now
                      </Link>
                      <Link
                        to="/cart"
                        onClick={closeMobileMenu}
                        className="flex items-center px-3 py-3 rounded-lg text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                      >
                        <ShoppingCart className="mr-3 h-5 w-5" />
                        Cart
                        {cartItemCount > 0 && (
                          <Badge 
                            variant="destructive" 
                            className="ml-auto h-5 w-5 text-xs p-0 flex items-center justify-center"
                          >
                            {cartItemCount}
                          </Badge>
                        )}
                      </Link>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <Auth 
        isOpen={showAuth} 
        onClose={() => setShowAuth(false)} 
      />
    </>
  );
};

export default Header;