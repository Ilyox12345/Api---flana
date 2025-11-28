export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const path = url.pathname;

        // ────────────────────────────────
        // 1. COMPTEUR DE VUES
        // ────────────────────────────────
        if (path === "/api/views") {
            let views = await env.KV_VIEWS.get("total");
            if (!views) views = 0;

            views = parseInt(views) + 1;

            await env.KV_VIEWS.put("total", views.toString());

            return json({ views });
        }

        // ────────────────────────────────
        // 2. SAUVEGARDE SCORE (POST)
        // ────────────────────────────────
        if (path === "/api/score" && request.method === "POST") {
            const body = await request.json();

            if (!body.username || !body.score) {
                return json({ error: "Missing username or score" }, 400);
            }

            await env.KV_SCORES.put(
                "score-" + crypto.randomUUID(),
                JSON.stringify({
                    username: body.username,
                    score: body.score,
                    timestamp: Date.now(),
                })
            );

            return json({ success: true });
        }

        // ────────────────────────────────
        // 3. LEADERBOARD (GET)
        // ────────────────────────────────
        if (path === "/api/leaderboard") {
            const list = await env.KV_SCORES.list();
            const scores = [];

            for (const item of list.keys) {
                const data = await env.KV_SCORES.get(item.name);
                if (data) scores.push(JSON.parse(data));
            }

            scores.sort((a, b) => b.score - a.score);

            return json(scores.slice(0, 20));
        }

        // ────────────────────────────────
        // 4. ROUTE INVALIDE
        // ────────────────────────────────
        return json({ error: "Invalid endpoint" }, 404);
    }
};


// ────────────────────────────────
// Fonction utilitaire JSON
// ────────────────────────────────
function json(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { "Content-Type": "application/json" }
    });
}
