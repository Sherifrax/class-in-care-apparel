-- Add category_id to products and backfill based on existing data, then refresh category counts

-- 1) Add column and index
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS category_id uuid REFERENCES public.product_categories(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);

-- 2) Backfill category_id using product names/colors to map to existing categories
WITH mapped AS (
  SELECT
    p.id AS product_id,
    CASE
      WHEN lower(p.name) LIKE '%black%' THEN 'Black Professional'
      WHEN lower(p.name) LIKE '%blue%' OR EXISTS (
        SELECT 1 FROM unnest(p.colors) col WHERE lower(col) LIKE '%blue%'
      ) THEN 'Light Blue'
      WHEN lower(p.name) LIKE '%white%' OR EXISTS (
        SELECT 1 FROM unnest(p.colors) col WHERE lower(col) LIKE '%white%'
      ) THEN 'White Professional'
      WHEN lower(p.name) LIKE '%team%' THEN 'Team Uniforms'
      ELSE NULL
    END AS category_name
  FROM public.products p
), cats AS (
  SELECT id, name FROM public.product_categories
)
UPDATE public.products p
SET category_id = c.id
FROM mapped m
JOIN cats c ON c.name = m.category_name
WHERE p.id = m.product_id
  AND m.category_name IS NOT NULL
  AND (p.category_id IS NULL OR p.category_id <> c.id);

-- 3) Update product_categories.count to reflect actual totals
UPDATE public.product_categories c
SET count = COALESCE(sub.cnt, 0)
FROM (
  SELECT category_id, COUNT(*) AS cnt
  FROM public.products
  GROUP BY category_id
) sub
WHERE c.id = sub.category_id;