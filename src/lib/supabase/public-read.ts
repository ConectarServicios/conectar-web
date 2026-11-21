import { unstable_rethrow } from "next/navigation";
import { publicCache, type PublicCacheOptions } from "./public-cache.ts";

/** A public content outage is local to the section; never cache a fallback. */
export async function publicRead<T>(operation: string, fallback: T, read: () => Promise<T>, cache?: PublicCacheOptions<T>): Promise<T> {
  const execute = async () => {
    try {
      return await read();
    } catch (error) {
      // Preserve Next.js navigation and rendering control flow.
      unstable_rethrow(error);
      console.warn(JSON.stringify({ event: "public_content_unavailable", operation }));
      return fallback;
    }
  };
  return cache ? publicCache.read(cache, fallback, execute) : execute();
}
