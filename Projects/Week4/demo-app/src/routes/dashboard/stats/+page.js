// The load function runs BEFORE the page renders.
// Here we fetch data from an API endpoint.

export async function load({ fetch }) {
  // Call our own backend endpoint at /api/message
  const res = await fetch('/api/message');
  const data = await res.json();

  // Returning values here makes them available as "data"
  return { message: data.message };
}
