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
    const randomBanner = await getRandomBanner(BANNERS_DIR, 0.6);
    
    // Get a random phrase
    const randomPhrase = getRandomPhrase();
    
    // Build the HTML response
    return new Response(
      `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
            max-width: 800px;
            margin: 0 auto;
            padding: 15px;
            background-color: #eeeeee;
            color: #000080;
            display: flex;
            flex-direction: column;
            height: 100vh;
            box-sizing: border-box;
          }
          h1 {
            text-align: center;
            margin-bottom: 1em;
            font-size: 2em;
          }
          .phrase {
            font-style: italic;
            text-align: center;
            margin: 10px 0;
            padding-top: 5px;
            font-size: 1.2em;
            color: #663399;
            flex-shrink: 0; /* Prevent phrase from being compressed */
          }
          .main-image {
            display: block;
            max-width: 100%;
            max-height: 50vh; /* Reduced from 70vh to make room for banner */
            width: auto;
            height: auto;
            object-fit: contain;
            margin: 10px auto;
            border: 5px solid #000080;
          }
          .reload-btn {
            background: #c0c0c0;
            border: outset 3px #c0c0c0;
            padding: 5px 10px;
            font-family: 'MS Sans Serif', sans-serif;
            cursor: pointer;
            display: block;
            margin: 0 auto;
          }
          .button-container {
            text-align: center;
            margin: 10px 0;
          }
          .content {
            flex: 1 0 auto;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            min-height: 0; /* Important for flexbox child to not overflow */
          }
          .image-container {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            min-height: 0; /* Important to prevent overflow */
          }
          footer {
            text-align: center;
            font-size: 0.8em;
            margin-top: 5px;
            flex-shrink: 0;
          }
          .banner-container {
            text-align: center;
            width: 100%;
            height: 60px; /* Fixed height for banner container */
            margin-top: 5px;
            margin-bottom: 5px;
            flex-shrink: 0;
          }
          .banner {
            max-width: 100%;
            max-height: 60px; /* Limit banner height */
            width: auto;
            height: auto;
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