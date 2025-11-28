export async function onRequest(context) {
    const { KV_SCORES } = context.env;

    const list = await KV_SCORES.list();
    const scores = [];

    for (const item of list.keys) {
        const data = await KV_SCORES.get(item.name);
        if (data) scores.push(JSON.parse(data));
    }

    scores.sort((a, b) => b.score - a.score);

    return new Response(JSON.stringify(scores.slice(0, 20)), {
        headers: { "Content-Type": "application/json" }
    });
}
