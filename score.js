export async function onRequest(context) {
    const { request, env } = context;
    const { KV_SCORES } = env;

    const body = await request.json();
    const { username, score } = body;

    if (!username || !score) {
        return new Response(JSON.stringify({ error: "Missing data" }), { status: 400 });
    }

    const entry = {
        username,
        score,
        timestamp: Date.now()
    };

    await KV_SCORES.put(`score-${crypto.randomUUID()}`, JSON.stringify(entry));

    return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" }
    });
}
