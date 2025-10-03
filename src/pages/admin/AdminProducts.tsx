import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Upload, Image as ImageIcon, Package, Star, DollarSign, BarChart3, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { AdminRoute } from '@/components/admin/AdminRoute';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { ColorChipSelector } from '@/components/admin/ColorChipSelector';

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  original_price?: string;
  sizes: string[];
  colors: string[];
  features: string[];
  badge?: string;
  image?: string;
  image_url?: string;
  images?: string[];
  rating: number;
  reviews: number;
  stock_quantity: number;
  low_stock_threshold: number;
  track_stock: boolean;
}

const AdminProductsContent: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    original_price: '',
    sizes: '',
    colors: '',
    features: '',
    badge: '',
    images: [] as File[],
    rating: 0,
    reviews: 0,
    stock_quantity: 0,
    low_stock_threshold: 5,
    track_stock: true
  });

  const [imagesToRemove, setImagesToRemove] = useState<string[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const removeImage = async (imageUrl: string) => {
    try {
      const fileName = imageUrl.split('/').pop();
      if (fileName) {
        const { error } = await supabase.storage
          .from('product-images')
          .remove([`products/${fileName}`]);
        
        if (error) throw error;
      }
    } catch (error) {
      console.error('Error removing image:', error);
    }
  };

  const openDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        original_price: product.original_price || '',
        sizes: Array.isArray(product.sizes) ? product.sizes.join(', ') : '',
        colors: Array.isArray(product.colors) ? product.colors.join(', ') : '',
        features: Array.isArray(product.features) ? product.features.join(', ') : '',
        badge: product.badge || '',
        images: [],
        rating: product.rating,
        reviews: product.reviews,
        stock_quantity: product.stock_quantity,
        low_stock_threshold: product.low_stock_threshold,
        track_stock: product.track_stock
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        original_price: '',
        sizes: '',
        colors: '',
        features: '',
        badge: '',
        images: [],
        rating: 0,
        reviews: 0,
        stock_quantity: 0,
        low_stock_threshold: 5,
        track_stock: true
      });
    }
    setImagesToRemove([]);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrls: string[] = [];

      // Upload new images
      if (formData.images.length > 0) {
        imageUrls = await Promise.all(
          formData.images.map(file => uploadImage(file))
        );
      }

      // Process existing images for updates
      let finalImageUrls = imageUrls;
      if (editingProduct && editingProduct.images) {
        const existingImages = editingProduct.images.filter(url => !imagesToRemove.includes(url));
        finalImageUrls = [...existingImages, ...imageUrls];
      }

      const productData = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        original_price: formData.original_price || null,
        sizes: formData.sizes.split(',').map(s => s.trim()).filter(s => s),
        colors: formData.colors.split(',').map(c => c.trim()).filter(c => c),
        features: formData.features.split(',').map(f => f.trim()).filter(f => f),
        badge: formData.badge || null,
        images: finalImageUrls,
        image: finalImageUrls[0] || null,
        rating: formData.rating,
        reviews: formData.reviews,
        stock_quantity: formData.stock_quantity,
        low_stock_threshold: formData.low_stock_threshold,
        track_stock: formData.track_stock
      };

      let error;
      if (editingProduct) {
        // Remove old images
        for (const imageUrl of imagesToRemove) {
          await removeImage(imageUrl);
        }

        const { error: updateError } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('products')
          .insert([productData]);
        error = insertError;
      }

      if (error) throw error;

      toast({
        title: "Success",
        description: `Product ${editingProduct ? 'updated' : 'created'} successfully`,
      });

      setIsDialogOpen(false);
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Error",
        description: `Failed to ${editingProduct ? 'update' : 'create'} product`,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product deleted successfully",
      });

      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const getStockStatus = (product: Product) => {
    if (!product.track_stock) return null;
    
    if (product.stock_quantity <= 0) {
      return { status: 'Out of Stock', variant: 'destructive' as const, color: 'text-destructive' };
    } else if (product.stock_quantity <= product.low_stock_threshold) {
      return { status: 'Low Stock', variant: 'secondary' as const, color: 'text-orange-600' };
    } else {
      return { status: 'In Stock', variant: 'default' as const, color: 'text-green-600' };
    }
  };

  const stats = {
    totalProducts: products.length,
    inStock: products.filter(p => !p.track_stock || p.stock_quantity > 0).length,
    lowStock: products.filter(p => p.track_stock && p.stock_quantity <= p.low_stock_threshold && p.stock_quantity > 0).length,
    outOfStock: products.filter(p => p.track_stock && p.stock_quantity <= 0).length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-luxury-navy to-medical-blue bg-clip-text text-transparent">
            Product Management
          </h1>
          <p className="text-muted-foreground">Manage your product catalog and inventory</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => openDialog()}
              className="bg-gradient-to-r from-medical-blue to-medical-teal hover:from-medical-blue-light hover:to-medical-teal shadow-lg hover:shadow-glow transition-all duration-300 hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto glass border-medical-blue/20 bg-gradient-to-b from-white/95 to-white/90 backdrop-blur-xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-medical-blue to-medical-teal bg-clip-text text-transparent">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-sm font-semibold text-luxury-navy">Product Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="mt-1 border-2 border-medical-blue/20 focus:border-medical-blue rounded-xl"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-sm font-semibold text-luxury-navy">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="mt-1 border-2 border-medical-blue/20 focus:border-medical-blue rounded-xl min-h-[100px]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price" className="text-sm font-semibold text-luxury-navy">Price (AED)</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="mt-1 border-2 border-medical-blue/20 focus:border-medical-blue rounded-xl"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="original_price" className="text-sm font-semibold text-luxury-navy">Original Price (AED)</Label>
                      <Input
                        id="original_price"
                        type="number"
                        step="0.01"
                        value={formData.original_price}
                        onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                        className="mt-1 border-2 border-medical-blue/20 focus:border-medical-blue rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="sizes" className="text-sm font-semibold text-luxury-navy">Sizes (comma-separated)</Label>
                    <Input
                      id="sizes"
                      value={formData.sizes}
                      onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                      placeholder="S, M, L, XL"
                      className="mt-1 border-2 border-medical-blue/20 focus:border-medical-blue rounded-xl"
                    />
                  </div>

                  <div>
                    <Label htmlFor="colors" className="text-sm font-semibold text-luxury-navy">
                      Colors
                    </Label>
                    <p className="text-xs text-muted-foreground mb-2">Select available colors for this product</p>
                    <ColorChipSelector
                      selectedColors={formData.colors.split(',').map(c => c.trim()).filter(c => c)}
                      onColorSelect={(color) => {
                        const currentColors = formData.colors.split(',').map(c => c.trim()).filter(c => c);
                        const newColors = currentColors.includes(color)
                          ? currentColors.filter(c => c !== color)
                          : [...currentColors, color];
                        setFormData({ ...formData, colors: newColors.join(', ') });
                      }}
                    />
                  </div>

                  <div>
                    <Label htmlFor="features" className="text-sm font-semibold text-luxury-navy">Features (comma-separated)</Label>
                    <Input
                      id="features"
                      value={formData.features}
                      onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                      placeholder="Antimicrobial, Moisture-wicking"
                      className="mt-1 border-2 border-medical-blue/20 focus:border-medical-blue rounded-xl"
                    />
                  </div>

                  <div>
                    <Label htmlFor="badge" className="text-sm font-semibold text-luxury-navy">Badge (optional)</Label>
                    <Input
                      id="badge"
                      value={formData.badge}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      placeholder="New, Sale, Featured"
                      className="mt-1 border-2 border-medical-blue/20 focus:border-medical-blue rounded-xl"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="stock_quantity" className="text-sm font-semibold text-luxury-navy">Stock Quantity</Label>
                    <Input
                      id="stock_quantity"
                      type="number"
                      value={String(formData.stock_quantity)}
                      onChange={(e) => setFormData({ ...formData, stock_quantity: Number(e.target.value) })}
                      className="mt-1 border-2 border-medical-blue/20 focus:border-medical-blue rounded-xl"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="low_stock_threshold" className="text-sm font-semibold text-luxury-navy">Low Stock Threshold</Label>
                    <Input
                      id="low_stock_threshold"
                      type="number"
                      value={String(formData.low_stock_threshold)}
                      onChange={(e) => setFormData({ ...formData, low_stock_threshold: Number(e.target.value) })}
                      className="mt-1 border-2 border-medical-blue/20 focus:border-medical-blue rounded-xl"
                      required
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Input
                      id="track_stock"
                      type="checkbox"
                      checked={formData.track_stock}
                      onChange={(e) => setFormData({ ...formData, track_stock: e.target.checked })}
                      className="h-5 w-5 rounded-xl border-2 border-medical-blue/20 focus:border-medical-blue focus:ring-0"
                    />
                    <Label htmlFor="track_stock" className="text-sm font-semibold text-luxury-navy">Track Stock</Label>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="images" className="text-sm font-semibold text-luxury-navy">Images</Label>
                    <Input
                      id="images"
                      type="file"
                      multiple
                      onChange={(e) => {
                        if (e.target.files) {
                          setFormData({ ...formData, images: Array.from(e.target.files) });
                        }
                      }}
                      className="mt-1"
                    />
                  </div>

                  {editingProduct && editingProduct.images && editingProduct.images.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-luxury-navy">Existing Images</Label>
                      <div className="flex flex-wrap gap-2">
                        {editingProduct.images.map((imageUrl, index) => (
                          <div key={index} className="relative">
                            <img
                              src={imageUrl}
                              alt={`Product Image ${index + 1}`}
                              className="w-24 h-24 object-cover rounded-xl"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setImagesToRemove([...imagesToRemove, imageUrl]);
                              }}
                              className="absolute top-1 right-1 bg-white/80 hover:bg-white rounded-full shadow-md"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex gap-4 pt-6">
                <Button 
                  type="submit" 
                  disabled={uploading}
                  className="flex-1 bg-gradient-to-r from-medical-blue to-medical-teal hover:from-medical-blue-light hover:to-medical-teal shadow-lg hover:shadow-glow transition-all duration-300 hover:scale-[1.02]"
                >
                  {uploading ? 'Processing...' : (editingProduct ? 'Update Product' : 'Create Product')}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  className="px-8 border-2 border-medical-blue/20 hover:border-medical-blue"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass border-medical-blue/20 bg-gradient-to-br from-white/80 to-medical-blue/5 hover:shadow-glow transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                <p className="text-3xl font-bold text-luxury-navy">{stats.totalProducts}</p>
              </div>
              <div className="p-3 bg-medical-blue/10 rounded-xl">
                <Package className="w-6 h-6 text-medical-blue" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-green-200 bg-gradient-to-br from-white/80 to-green-50 hover:shadow-glow transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Stock</p>
                <p className="text-3xl font-bold text-green-700">{stats.inStock}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-orange-200 bg-gradient-to-br from-white/80 to-orange-50 hover:shadow-glow transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Low Stock</p>
                <p className="text-3xl font-bold text-orange-700">{stats.lowStock}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-xl">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-red-200 bg-gradient-to-br from-white/80 to-red-50 hover:shadow-glow transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Out of Stock</p>
                <p className="text-3xl font-bold text-red-700">{stats.outOfStock}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-xl">
                <Package className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => {
          const stockStatus = getStockStatus(product);
          
          return (
            <Card key={product.id} className="group glass border-medical-blue/20 bg-gradient-to-b from-white/90 to-white/80 hover:shadow-luxury transition-all duration-300 hover:scale-[1.02] overflow-hidden">
              <div className="relative">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-medical-blue/10 to-medical-teal/10 flex items-center justify-center">
                    <ImageIcon className="w-16 h-16 text-medical-blue/30" />
                  </div>
                )}
                
                {product.badge && (
                  <Badge className="absolute top-3 left-3 bg-gradient-to-r from-medical-blue to-medical-teal text-white shadow-lg">
                    {product.badge}
                  </Badge>
                )}
                
                {stockStatus && (
                  <Badge 
                    variant={stockStatus.variant}
                    className="absolute top-3 right-3 shadow-lg"
                  >
                    {stockStatus.status}
                  </Badge>
                )}
              </div>
              
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="font-bold text-lg text-luxury-navy group-hover:text-medical-blue transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {product.description}
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-luxury-navy">AED {product.price}</span>
                    {product.original_price && (
                      <span className="text-sm text-muted-foreground line-through">
                        AED {product.original_price}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{product.rating}</span>
                    <span className="text-xs text-muted-foreground">({product.reviews})</span>
                  </div>
                </div>
                
                {product.track_stock && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Stock: </span>
                    <span className={stockStatus?.color || 'text-foreground'}>
                      {product.stock_quantity} units
                    </span>
                  </div>
                )}
                
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openDialog(product)}
                    className="flex-1 border-medical-blue/30 hover:border-medical-blue hover:bg-medical-blue/5"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(product.id)}
                    className="border-red-300 hover:border-red-500 hover:bg-red-50 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {products.length === 0 && (
        <Card className="text-center py-16 glass border-medical-blue/20 bg-gradient-to-b from-white/90 to-white/80">
          <CardContent className="space-y-4">
            <div className="p-6 bg-medical-blue/10 rounded-full w-24 h-24 mx-auto flex items-center justify-center">
              <Package className="w-12 h-12 text-medical-blue" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-luxury-navy">No products yet</h3>
              <p className="text-muted-foreground">Create your first product to get started.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const AdminProducts: React.FC = () => {
  return (
    <AdminRoute>
      <AdminLayout>
        <AdminProductsContent />
      </AdminLayout>
    </AdminRoute>
  );
};

export default AdminProducts;
