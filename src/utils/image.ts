// utils/image.ts
import { ImageMemoryTracker } from "./memory_tracker.ts";

// Create a singleton tracker for the application lifetime
const imageTracker = new ImageMemoryTracker(5); // Remember last 5 images

/**
 * Gets a list of all image files in a directory
 */
export async function getImageList(directory: string): Promise<string[]> {
  try {
    const images: string[] = [];
    
    for await (const entry of Deno.readDir(directory)) {
      if (entry.isFile) {
        // Filter for image files by extension
        const filename = entry.name.toLowerCase();
        if (isImageFile(filename)) {
          images.push(entry.name);
        }
      }
    }
    
    return images;
  } catch (error) {
    console.error(`Error reading directory ${directory}:`, error);
    return [];
  }
}

/**
 * Gets a random image from a directory, avoiding recently shown images if possible
 */
export async function getRandomImage(directory: string): Promise<string | null> {
  const images = await getImageList(directory);
  
  if (images.length === 0) {
    return null;
  }
  
  // Filter out recently shown images
  const freshImages = images.filter(img => !imageTracker.wasRecentlyShown(img));
  
  // If we have fresh images, pick one of those
  // Otherwise, fall back to any image if we've shown them all recently
  const availableImages = freshImages.length > 0 ? freshImages : images;
  
  const randomIndex = Math.floor(Math.random() * availableImages.length);
  const selectedImage = availableImages[randomIndex];
  
  // Record that we've shown this image
  imageTracker.recordShown(selectedImage);
  
  console.log(`Selected image: ${selectedImage}`);
  console.log(`Recent images: ${imageTracker.getRecentImages().join(', ')}`);
  
  return selectedImage;
}

/**
 * Determines if a file is a potential image by its extension
 */
export function isImageFile(filename: string): boolean {
  const lowercased = filename.toLowerCase();
  return (
    lowercased.endsWith('.jpg') || 
    lowercased.endsWith('.jpeg') || 
    lowercased.endsWith('.png') || 
    lowercased.endsWith('.gif')
  );
}