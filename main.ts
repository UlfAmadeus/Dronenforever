import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { handler } from "./src/main.ts";

// Start the server using the handler from src/main.ts
const PORT = 8000;
console.log(`Server running on http://localhost:${PORT}`);
serve(handler, { port: PORT });