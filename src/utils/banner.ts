// utils/banner.ts
import { ImageMemoryTracker } from "./memory_tracker.ts";
import { isImageFile } from "./image.ts";

// Create a singleton tracker for the application lifetime
const bannerTracker = new ImageMemoryTracker(3); // Remember last 3 banners

/**
 * Gets a list of all banner files in a directory
 */
export async function getBannerList(directory: string): Promise<string[]> {
  try {
    const banners: string[] = [];
    
    for await (const entry of Deno.readDir(directory)) {
      if (entry.isFile) {
        // Filter for image files by extension
        const filename = entry.name.toLowerCase();
        if (isImageFile(filename)) {
          banners.push(entry.name);
        }
      }
    }
    
    return banners;
  } catch (error) {
    console.error(`Error reading directory ${directory}:`, error);
    return [];
  }
}

/**
 * Gets a random banner from the banners directory with a specified chance
 * @param directory The directory containing banner images
 * @param chance The chance (0-1) of returning a banner
 * @returns A banner filename or null if no banner should be shown
 */
export async function getRandomBanner(directory: string, chance = 0.6): Promise<string | null> {
  // Determine if we should show a banner based on the chance
  if (Math.random() > chance) {
    console.log("Banner skipped due to probability check");
    return null;
  }
  
  const banners = await getBannerList(directory);
  
  if (banners.length === 0) {
    console.log("No banners found in directory");
    return null;
  }
  
  // Filter out recently shown banners
  const freshBanners = banners.filter(banner => !bannerTracker.wasRecentlyShown(banner));
  
  // If we have fresh banners, pick one of those
  // Otherwise, fall back to any banner if we've shown them all recently
  const availableBanners = freshBanners.length > 0 ? freshBanners : banners;
  
  const randomIndex = Math.floor(Math.random() * availableBanners.length);
  const selectedBanner = availableBanners[randomIndex];
  
  // Record that we've shown this banner
  bannerTracker.recordShown(selectedBanner);
  
  console.log(`Selected banner: ${selectedBanner}`);
  
  return selectedBanner;
}