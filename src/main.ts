// main.ts

import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { join } from "https://deno.land/std@0.192.0/path/mod.ts";
import { getRandomImage } from "./utils/image.ts";
import { getRandomBanner } from "./utils/banner.ts";
import { getRandomPhrase } from "./utils/phrases.ts";

const PORT = 8000;
const IMAGES_DIR = join(Deno.cwd(), "public", "images");
const BANNERS_DIR = join(Deno.cwd(), "public", "banners");

// Simple handler function for HTTP requests
export async function handler(req: Request): Response {
  const url = new URL(req.url);
  const path = url.pathname;
  
  // Serve static files from the public directory
if (path.startsWith("/images/")) {
  // Extract just the filename from the path
  const filename = path.substring(path.lastIndexOf("/") + 1);
  const filePath = join(IMAGES_DIR, filename);
  
  try {
    const file = await Deno.open(filePath, { read: true });
    return new Response(file.readable);
  } catch (error) {
    console.error("Error serving image:", error);
    return new Response("File not found", { status: 404 });
  }
}

// Serve banner files
if (path.startsWith("/banners/")) {
  // Extract just the filename from the path
  const filename = path.substring(path.lastIndexOf("/") + 1);
  const filePath = join(BANNERS_DIR, filename);
  
  try {
    const file = await Deno.open(filePath, { read: true });
    return new Response(file.readable);
  } catch (error) {
    console.error("Error serving banner:", error);
    return new Response("File not found", { status: 404 });
  }
}
  
  // Serve the homepage with a non-repeating random image and random phrase
  if (path === "/" || path === "") {
    // Get a random image that hasn't been shown recently
    const randomImage = await getRandomImage(IMAGES_DIR);
    
    if (!randomImage) {
      return new Response("No images found in directory", { status: 500 });
    }
    
    // Get a random banner with 60% chance
    const randomBanner = await getRandomBanner(BANNERS_DIR, 0.8);
    
    // Get a random phrase
    const randomPhrase = getRandomPhrase();
    
    // Build the HTML response
    return new Response(
      `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <title>Dronenforever - Retro Image Viewer</title>
        <style>
          html, body {
            height: 100%;
            margin: 0;
            padding: 0;
            overflow: hidden;
          }
          body {
            font-family: 'Courier New', monospace;
            max-width: 100%;
            width: 800px;
            margin: 0 auto;
            padding: 5px 15px 2px; /* Extremely reduced top/bottom padding */
            background-color: #eeeeee;
            color: #000080;
            display: flex;
            flex-direction: column;
            height: 100vh;
            box-sizing: border-box;
            overflow-x: hidden; /* Prevent horizontal scroll */
          }
          h1 {
            text-align: center;
            margin-bottom: 1em;
            font-size: 2em;
          }
          .phrase {
            font-style: italic;
            text-align: center;
            margin: 0 0 2px; /* Minimal bottom margin */
            padding: 0; /* No padding */
            font-size: 1em; /* Smaller font */
            color: #663399;
            flex-shrink: 0; /* Prevent phrase from being compressed */
            line-height: 1.1; /* Tighter line height */
          }
          .main-image {
            display: block;
            max-width: 100%;
            max-height: 65vh; /* Increased significantly for more image space */
            width: auto;
            height: auto;
            object-fit: scale-down; /* Changed from contain to scale-down */
            margin: 1px auto; /* Minimal margin */
            border: 4px solid #000080; /* Slightly thinner border */
            box-sizing: border-box; /* Include border in size calculations */
            overflow: hidden; /* Hide overflow */
          }
          .reload-btn {
            background: #c0c0c0;
            border: outset 2px #c0c0c0; /* Thinner border */
            padding: 3px 8px; /* Smaller padding */
            font-family: 'MS Sans Serif', sans-serif;
            font-size: 0.9em; /* Smaller font */
            cursor: pointer;
            display: block;
            margin: 0 auto;
          }
          .button-container {
            text-align: center;
            margin: 0; /* No margins */
          }
          .content {
            flex: 1 0 auto;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            min-height: 0; /* Important for flexbox child to not overflow */
            margin-bottom: 0; /* No margin at bottom */
          }
          .image-container {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            min-height: 0; /* Important to prevent overflow */
            max-width: 100%;
            width: 100%;
            box-sizing: border-box;
            padding: 0 5px; /* Add a small padding */
            margin-bottom: 0; /* No margin at bottom */
          }
          footer {
            text-align: center;
            font-size: 0.7em; /* Smaller font */
            margin-top: 0; /* No margin */
            flex-shrink: 0;
            padding: 0;
            line-height: 1;
          }
          .banner-container {
            text-align: center;
            width: 100%;
            height: 40px; /* Even smaller height */
            margin: 0; /* No margins */
            flex-shrink: 0;
          }
          .banner {
            max-width: 100%;
            max-height: 40px; /* Further reduced height */
            width: auto;
            height: auto;
          }
          
          /* Mobile optimizations */
          @media (max-width: 600px) {
            body {
              padding: 2px 5px 1px; /* Minimal padding */
            }
            
            .main-image {
              max-height: 80vh; /* Maximized image height on mobile */
              border-width: 2px; /* Even thinner border on mobile */
            }
            
            .phrase {
              font-size: 0.9em; /* Smaller text */
              margin: 0 0 1px; /* Minimal margin */
              line-height: 1; /* Tight line height */
            }
            
            .button-container {
              margin: 0; /* No margin */
            }
            
            .reload-btn {
              padding: 1px 5px; /* Even smaller button */
              font-size: 0.8em;
              border-width: 1px;
            }
            
            .banner-container {
              height: 30px; /* Even smaller banner area */
              margin: 0;
              padding: 0;
            }
            
            .banner {
              max-height: 30px; /* Smaller banner */
            }
            
            footer {
              margin-top: 0;
              font-size: 0.6em; /* Tiny footer text */
              line-height: 1;
            }
          }
        </style>
      </head>
      <body>
        <div class="content">
          <div class="phrase">${randomPhrase}</div>
          
          <div class="image-container">
            <img class="main-image" src="/images/${randomImage}" alt="Random Image">
            
            <div class="button-container">
              <button class="reload-btn" onclick="location.reload()">Show Another Image</button>
            </div>
          </div>
        </div>
        
        <div class="banner-container">
          ${randomBanner ? `<img class="banner" src="/banners/${randomBanner}" alt="Advertisement Banner">` : ''}
        </div>
        
        <footer>
          <p>Best viewed with Netscape Navigator 2.0 or lower</p>
        </footer>
      </body>
      </html>`,
      {
        headers: { "content-type": "text/html; charset=utf-8" },
      }
    );
  }
  
  // Handle 404 for any other routes
  return new Response("Not found", { status: 404 });
}

// Start the server
console.log(`Server running on http://localhost:${PORT}`);
await serve(handler, { port: PORT });