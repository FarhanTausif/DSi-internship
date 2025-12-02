// This handles GET requests to /api/message

export async function GET() {
  // Simple mock response
  const payload = { message: "Hello from the server!" };

  // Return JSON manually (per the current SvelteKit docs)
  return new Response(JSON.stringify(payload), {
    headers: { "Content-Type": "application/json" }
  });
}
