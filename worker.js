export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Serve the website
    if (request.method === "GET") {
      if (env.ASSETS) return env.ASSETS.fetch(request);
      return new Response("MOKSHA AI Backend Online");
    }

    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors });
    }

    if (url.pathname !== "/api/generate" || request.method !== "POST") {
      return new Response("Not found", { status: 404 });
    }

    try {
      const { prompt } = await request.json();

      if (!prompt) {
        return Response.json({ error: "Prompt is required" }, {
          status: 400, headers: cors
        });
      }

      const result = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": env.GEMINI_API_KEY
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      );

      const data = await result.json();

      return Response.json(data, {
        status: result.status,
        headers: cors
      });

    } catch (error) {
      return Response.json({ error: error.message }, {
        status: 500, headers: cors
      });
    }
  }
};
