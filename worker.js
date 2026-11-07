export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors });
    }

    if (url.pathname === "/api/generate" && request.method === "POST") {
      try {
        const { prompt } = await request.json();

        if (!prompt) {
          return Response.json({ error: "Prompt required" }, {
            status: 400,
            headers: cors
          });
        }

        const result = await env.AI.run(
          "@cf/meta/llama-3.1-8b-instruct",
          {
            messages: [
              {
                role: "system",
                content: "You are MOKSHA AI, a professional cinematic story and scene generator."
              },
              {
                role: "user",
                content: prompt
              }
            ]
          }
        );

        return Response.json(result, { headers: cors });

      } catch (error) {
        return Response.json(
          { error: error.message },
          { status: 500, headers: cors }
        );
      }
    }

    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response("MOKSHA AI Backend Online");
  }
};
