export async function onRequest(context) {
    const { KV_VIEWS } = context.env;

    let views = await KV_VIEWS.get("total");
    if (!views) views = 0;

    views = parseInt(views) + 1;

    await KV_VIEWS.put("total", views.toString());

    return new Response(JSON.stringify({ views }), {
        headers: { "Content-Type": "application/json" }
    });
}
