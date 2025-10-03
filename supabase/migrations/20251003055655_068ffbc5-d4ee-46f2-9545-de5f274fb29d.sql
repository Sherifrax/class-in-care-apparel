-- Clean up duplicate and old color names from products
-- Remove duplicates and only keep standardized medical colors
UPDATE products 
SET colors = (
  SELECT ARRAY(
    SELECT DISTINCT color
    FROM unnest(products.colors) AS color
    WHERE color IN (
      'Ceil Blue', 'Navy Blue', 'Royal Blue', 'Caribbean Blue',
      'Turquoise', 'Teal', 'Surgical Green', 
      'Black', 'White', 'Gray', 'Charcoal'
    )
  )
)
WHERE colors IS NOT NULL;