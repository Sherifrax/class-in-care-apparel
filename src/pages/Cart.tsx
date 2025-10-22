import React from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ColorSwatch } from '@/components/ColorSwatch';

const Cart = () => {
  const { items, loading, updateQuantity, removeFromCart, getTotalPrice, getTotalItems } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-medical-blue/5 via-medical-teal/5 to-luxury-navy/10 flex items-center justify-center px-4">
        <Card className="w-full max-w-md glass border-medical-blue/20 shadow-luxury backdrop-blur-xl bg-gradient-to-b from-white/90 to-white/80 animate-scale-in">
          <CardContent className="p-8 text-center space-y-6">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-medical-blue to-medical-teal p-4 shadow-glow">
              <ShoppingBag className="w-full h-full text-white" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-medical-blue to-medical-teal bg-clip-text text-transparent">
                Sign in to view cart
              </h2>
              <p className="text-muted-foreground">
                Please sign in to access your shopping cart
              </p>
            </div>
            <Button 
              onClick={() => navigate('/')}
              className="w-full bg-gradient-to-r from-medical-blue to-medical-teal hover:from-medical-blue-light hover:to-medical-teal shadow-lg hover:shadow-glow transition-all duration-300 hover:scale-[1.02]"
            >
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-medical-blue/5 via-medical-teal/5 to-luxury-navy/10 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-medical-blue"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-medical-blue/5 via-medical-teal/5 to-luxury-navy/10 pt-20 pb-12">
        <div className="container mx-auto px-4 py-8">
          <Card className="w-full max-w-md mx-auto glass border-medical-blue/20 shadow-luxury backdrop-blur-xl bg-gradient-to-b from-white/90 to-white/80 animate-scale-in">
            <CardContent className="p-8 text-center space-y-6">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-medical-blue/10 to-medical-teal/10 p-4">
                <ShoppingBag className="w-full h-full text-medical-blue/60" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-luxury-navy">Your cart is empty</h2>
                <p className="text-muted-foreground">
                  Add some items to your cart to get started
                </p>
              </div>
              <Button 
                onClick={() => navigate('/products')}
                className="w-full bg-gradient-to-r from-medical-blue to-medical-teal hover:from-medical-blue-light hover:to-medical-teal shadow-lg hover:shadow-glow transition-all duration-300 hover:scale-[1.02]"
              >
                Shop Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-blue/5 via-medical-teal/5 to-luxury-navy/10 pt-20 pb-12">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate('/products')}
              className="border-2 border-medical-blue/30 hover:border-medical-blue hover:bg-medical-blue/5 rounded-xl"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-luxury-navy to-medical-blue bg-clip-text text-transparent">
                Shopping Cart
              </h1>
              <p className="text-muted-foreground">{getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'} in your cart</p>
            </div>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={item.id} className="group glass border-medical-blue/20 bg-gradient-to-r from-white/90 to-white/80 hover:shadow-luxury transition-all duration-300 hover:scale-[1.01] rounded-2xl">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-6">
                      <div className="relative overflow-hidden rounded-xl">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-20 h-20 sm:w-24 sm:h-24 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <h3 className="font-bold text-lg text-luxury-navy group-hover:text-medical-blue transition-colors">
                          {item.product.name}
                        </h3>
                      <p className="text-muted-foreground">Size: {item.size}</p>
                      {item.color && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Color:</span>
                          <ColorSwatch color={item.color} size="sm" showLabel />
                        </div>
                      )}
                      <p className="font-bold text-xl text-medical-blue">AED {item.product.price}</p>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 glass bg-medical-blue/10 rounded-xl p-2 border border-medical-blue/20 shadow-soft">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="h-8 w-8 hover:bg-medical-blue/20 rounded-lg transition-all"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-10 text-center font-bold text-medical-blue">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-8 w-8 hover:bg-medical-blue/20 rounded-lg transition-all"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.id)}
                          className="h-10 w-10 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 glass border-medical-blue/20 shadow-luxury backdrop-blur-xl bg-gradient-to-b from-white/90 to-white/80">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-medical-blue to-medical-teal bg-clip-text text-transparent">
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal ({getTotalItems()} items):</span>
                      <span className="font-medium">AED {getTotalPrice().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Delivery:</span>
                      <span className="font-medium">AED 25.00</span>
                    </div>
                    <div className="border-t border-medical-blue/20 pt-3">
                      <div className="flex justify-between">
                        <span className="font-bold text-lg text-luxury-navy">Total:</span>
                        <span className="font-bold text-2xl bg-gradient-to-r from-medical-blue to-medical-teal bg-clip-text text-transparent">
                          AED {(getTotalPrice() + 25).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Button 
                      className="w-full h-12 bg-gradient-to-r from-medical-blue to-medical-teal hover:from-medical-blue-light hover:to-medical-teal text-white font-semibold rounded-xl shadow-lg hover:shadow-glow transition-all duration-300 hover:scale-[1.02]" 
                      onClick={handleCheckout}
                    >
                      <CreditCard className="w-5 h-5 mr-2" />
                      Proceed to Checkout
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full h-12 border-2 border-medical-blue/30 hover:border-medical-blue hover:bg-medical-blue/5 text-medical-blue font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02]"
                      onClick={() => navigate('/products')}
                    >
                      Continue Shopping
                    </Button>
                  </div>
                  
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;