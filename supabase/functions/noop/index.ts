import { serve } from "https://deno.land/std/http/server.ts";

// Responds with "OK" on any request — safe to ping
serve((_req) => new Response("OK", { status: 200 }));
