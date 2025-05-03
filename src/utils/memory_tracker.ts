// utils/memory_tracker.ts

/**
 * A simple in-memory tracker to avoid showing the same images repeatedly
 * Uses an LRU (Least Recently Used) approach to track recently shown images
 */
export class ImageMemoryTracker {
    private recentImages: Map<string, number>;
    private maxSize: number;
    
    /**
     * Create a new ImageMemoryTracker
     * @param maxSize Maximum number of images to remember
     */
    constructor(maxSize = 5) {
      this.recentImages = new Map();
      this.maxSize = maxSize;
    }
    
    /**
     * Records that an image has been shown
     * @param imageName Name of the image file shown
     */
    recordShown(imageName: string): void {
      // If we have too many entries, remove the oldest one
      if (this.recentImages.size >= this.maxSize) {
        // Find the oldest entry (smallest timestamp)
        let oldestImage = "";
        let oldestTime = Date.now();
        
        for (const [image, timestamp] of this.recentImages.entries()) {
          if (timestamp < oldestTime) {
            oldestTime = timestamp;
            oldestImage = image;
          }
        }
        
        // Remove the oldest entry
        if (oldestImage) {
          this.recentImages.delete(oldestImage);
        }
      }
      
      // Add the new entry with current timestamp
      this.recentImages.set(imageName, Date.now());
    }
    
    /**
     * Checks if an image has been recently shown
     * @param imageName Name of the image file to check
     * @returns true if the image was recently shown
     */
    wasRecentlyShown(imageName: string): boolean {
      return this.recentImages.has(imageName);
    }
    
    /**
     * Gets a list of recently shown images
     * @returns Array of image filenames
     */
    getRecentImages(): string[] {
      return Array.from(this.recentImages.keys());
    }
  }