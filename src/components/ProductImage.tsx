import type { ComponentProps } from "react";
import { resolveSupabaseStorageUrl } from "@/lib/supabase-storage";

type ProductImageProps = ComponentProps<"img">;

const ProductImage = ({ src, ...props }: ProductImageProps) => (
  <img {...props} src={resolveSupabaseStorageUrl(src)} />
);

export default ProductImage;
