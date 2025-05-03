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
            padding: 3px 10px 3px; /* Small padding at bottom for footer */
            background-color: #eeeeee;
            color: #000080;
            display: flex;
            flex-direction: column;
            height: 100vh;
            box-sizing: border-box;
            overflow-x: hidden; /* Prevent horizontal scroll */
            overflow-y: hidden; /* Prevent vertical scroll */
            position: relative; /* For absolute positioned elements if needed */
          }
          h1 {
            text-align: center;
            margin-bottom: 1em;
            font-size: 2em;
          }
          .phrase {
            font-style: italic;
            text-align: center;
            margin: 0 0 1px; /* Further reduced bottom margin */
            padding: 2px 0 0 0; /* 2px top padding */
            font-size: 0.9em; /* Even smaller font */
            color: #663399;
            flex-shrink: 0; /* Prevent phrase from being compressed */
            line-height: 1; /* Tightest line height */
            height: 20px; /* Fixed minimal height */
          }
          .main-image {
            display: block;
            max-width: 100%;
            max-height: 73vh; /* Further increased for even more image space */
            width: auto;
            height: auto;
            object-fit: scale-down; /* Changed from contain to scale-down */
            margin: 0 auto; /* No margin */
            border: 3px solid #000080; /* Even thinner border */
            box-sizing: border-box; /* Include border in size calculations */
            overflow: hidden; /* Hide overflow */
            flex: 1; /* Take up all available space */
          }
          .reload-btn {
            background: #c0c0c0;
            border: outset 1px #c0c0c0; /* Even thinner border */
            padding: 2px 6px; /* Smaller padding */
            font-family: 'MS Sans Serif', sans-serif;
            font-size: 0.8em; /* Smaller font */
            cursor: pointer;
            display: block;
            margin: 0 auto;
            height: 20px; /* Fixed compact height */
          }
          .button-container {
            text-align: center;
            margin: 2px 0 0 0; /* 2px top margin to create space after image */
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
            padding: 0; /* Remove all padding */
            margin: 0; /* No margins */
          }
          footer {
            text-align: center;
            font-size: 0.6em; /* Even smaller font */
            margin: 0; /* No margins */
            padding: 0;
            line-height: 1;
            min-height: 15px; /* Minimum height instead of fixed */
            flex-shrink: 0; /* Prevent footer from being compressed */
            display: block; /* Ensure it's rendered as a block */
            visibility: visible; /* Ensure it's visible */
            overflow: visible; /* Ensure text isn't cut */
          }
          .banner-container {
            text-align: center;
            width: 100%;
            height: 35px; /* Further reduced height */
            margin: 0; /* No margins */
            flex-shrink: 0;
            padding: 0;
          }
          .banner {
            max-width: none; /* Remove max-width constraint */
            max-height: 35px; /* Further reduced height */
            width: 468px; /* Standard banner width */
            height: auto;
            margin: 0;
            padding: 0;
          }
          
          /* Medium screen optimizations */
          @media (max-width: 600px) and (min-width: 481px) {
            .banner {
              width: 400px; /* Mid-size width */
            }
          }
          
          /* Small mobile optimizations */
          @media (max-width: 480px) {
            body {
              padding: 1px 3px 2px; /* Small bottom padding for footer */
            }
            
            .main-image {
              max-height: 85vh; /* Maximum possible image height on mobile */
              border-width: 2px; /* Even thinner border on mobile */
            }
            
            .phrase {
              font-size: 0.8em; /* Smaller text */
              margin: 0;
              padding: 2px 0 0 0; /* Keep 2px top padding */
              line-height: 1;
              height: 16px; /* Minimal height */
            }
            
            .button-container {
              margin: 2px 0 0 0; /* Keep 2px margin after image */
              height: 18px; /* Fixed minimal height */
            }
            
            .reload-btn {
              padding: 0 5px; /* Minimal padding */
              font-size: 0.7em; /* Tiny font */
              border-width: 1px;
              height: 18px; /* Match container height */
            }
            
            .banner-container {
              height: 25px; /* Smallest practical banner area */
              margin: 0;
              padding: 0;
              overflow: hidden; /* In case banner is too wide */
            }
            
            .banner {
              max-height: 25px; /* Smaller banner */
              width: 320px; /* Mobile banner size */
              max-width: none;
            }
            
            footer {
              margin: 0;
              padding: 0 0 2px 0; /* Small bottom padding */
              font-size: 0.5em; /* Minimum readable text */
              line-height: 1;
              min-height: 12px; /* Minimal height */
              display: block;
              visibility: visible;
              overflow: visible;
            }
            
            p {
              margin: 0;
              padding: 0;
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