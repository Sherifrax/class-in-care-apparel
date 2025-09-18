import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Upload, Image as ImageIcon, Package } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { AdminRoute } from '@/components/admin/AdminRoute';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

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
  rating: number;
  reviews: number;
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
    image: null as File | null,
    rating: 0,
    reviews: 0
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      // Require an image file when creating a new product
      if (!editingProduct && !formData.image) {
        toast({
          title: "Image required",
          description: "Please upload a product image file.",
          variant: "destructive",
        });
        setUploading(false);
        return;
      }

      let imageUrl = editingProduct?.image_url || '';

      if (formData.image) {
        imageUrl = await uploadImage(formData.image);
      }

      const productData = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        original_price: formData.original_price || null,
        sizes: formData.sizes.split(',').map(s => s.trim()),
        colors: formData.colors.split(',').map(c => c.trim()),
        features: formData.features.split(',').map(f => f.trim()),
        badge: formData.badge || null,
        image_url: imageUrl,
        image: imageUrl, // Keep compatibility with existing image field
        rating: Number(formData.rating),
        reviews: Number(formData.reviews)
      };

      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Product updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Product created successfully",
        });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchProducts();
    } catch (error: any) {
      console.error('Error saving product:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save product",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      original_price: product.original_price || '',
      sizes: product.sizes.join(', '),
      colors: product.colors.join(', '),
      features: product.features.join(', '),
      badge: product.badge || '',
      image: null,
      rating: product.rating,
      reviews: product.reviews
    });
    setIsDialogOpen(true);
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
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      original_price: '',
      sizes: '',
      colors: '',
      features: '',
      badge: '',
      image: null,
      rating: 0,
      reviews: 0
    });
    setEditingProduct(null);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin/dashboard')}
              className="mb-4"
            >
              ← Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold">Product Management</h1>
            <p className="text-muted-foreground">Manage your product catalog</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="price">Price (AED)</Label>
                    <Input
                      id="price"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      placeholder="299.00"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="original_price">Original Price (Optional)</Label>
                    <Input
                      id="original_price"
                      value={formData.original_price}
                      onChange={(e) => setFormData({...formData, original_price: e.target.value})}
                      placeholder="399.00"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="badge">Badge (Optional)</Label>
                    <Input
                      id="badge"
                      value={formData.badge}
                      onChange={(e) => setFormData({...formData, badge: e.target.value})}
                      placeholder="Sale, New, Popular, etc."
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="sizes">Available Sizes (comma separated)</Label>
                  <Input
                    id="sizes"
                    value={formData.sizes}
                    onChange={(e) => setFormData({...formData, sizes: e.target.value})}
                    placeholder="XS, S, M, L, XL, XXL"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="colors">Available Colors (comma separated)</Label>
                  <Input
                    id="colors"
                    value={formData.colors}
                    onChange={(e) => setFormData({...formData, colors: e.target.value})}
                    placeholder="Black, Navy Blue, White"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="features">Features (comma separated)</Label>
                  <Input
                    id="features"
                    value={formData.features}
                    onChange={(e) => setFormData({...formData, features: e.target.value})}
                    placeholder="Antimicrobial fabric, 4-way stretch, Quick-dry"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="rating">Rating (0-5)</Label>
                    <Input
                      id="rating"
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={formData.rating}
                      onChange={(e) => setFormData({...formData, rating: parseFloat(e.target.value)})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="reviews">Number of Reviews</Label>
                    <Input
                      id="reviews"
                      type="number"
                      min="0"
                      value={formData.reviews}
                      onChange={(e) => setFormData({...formData, reviews: parseInt(e.target.value)})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="image">Product Image</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({...formData, image: e.target.files?.[0] || null})}
                  />
                  {editingProduct?.image_url && (
                    <div className="mt-2">
                      <img 
                        src={editingProduct.image_url} 
                        alt="Current product image" 
                        className="w-20 h-20 object-cover rounded"
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" onClick={handleDialogClose}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={uploading}>
                    {uploading ? (
                      <>
                        <Upload className="w-4 h-4 mr-2 animate-spin" />
                        {editingProduct ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      editingProduct ? 'Update Product' : 'Create Product'
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id}>
              <CardHeader className="p-4">
                <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden mb-4">
                  {product.image_url || product.image ? (
                    <img
                      src={product.image_url || product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  {product.badge && (
                    <Badge className="absolute top-2 left-2">
                      {product.badge}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg">{product.name}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm text-muted-foreground mb-2">
                  {product.description.length > 100 
                    ? `${product.description.substring(0, 100)}...` 
                    : product.description
                  }
                </p>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-primary">AED {product.price}</span>
                  {product.original_price && (
                    <span className="text-sm text-muted-foreground line-through">
                      AED {product.original_price}
                    </span>
                  )}
                </div>
                <div className="text-sm text-muted-foreground mb-4">
                  <div>Sizes: {product.sizes.join(', ')}</div>
                  <div>Colors: {product.colors.join(', ')}</div>
                  <div>Rating: {product.rating}/5 ({product.reviews} reviews)</div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(product)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {products.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No products yet</h3>
              <p className="text-muted-foreground">
                Start by adding your first product to the catalog
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

const AdminProducts: React.FC = () => {
  return (
    <AdminRoute>
      <AdminProductsContent />
    </AdminRoute>
  );
};

export default AdminProducts;