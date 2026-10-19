const activeSupabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;

/** Repoint stored Supabase Storage URLs at the project this app is configured to use. */
export function resolveSupabaseStorageUrl(source: string | null | undefined): string | undefined {
  if (!source) return undefined;

  try {
    const imageUrl = new URL(source);
    const configuredSupabaseUrl = activeSupabaseUrl ? new URL(activeSupabaseUrl) : null;

    if (
      !configuredSupabaseUrl ||
      !imageUrl.hostname.endsWith(".supabase.co") ||
      !imageUrl.pathname.includes("/storage/v1/object/") ||
      imageUrl.host === configuredSupabaseUrl.host
    ) {
      return source;
    }

    imageUrl.protocol = configuredSupabaseUrl.protocol;
    imageUrl.host = configuredSupabaseUrl.host;
    return imageUrl.toString();
  } catch {
    return source;
  }
}
