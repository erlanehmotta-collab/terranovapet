// Cloudflare Pages Functions API: Gerenciador Seguro de Memoriais Terranova Pet
// Compatível com Cloudflare KV ou retorno estático

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  try {
    // Se o KV estiver vinculado (env.MEMORIALS_KV)
    if (env && env.MEMORIALS_KV) {
      if (id) {
        const item = await env.MEMORIALS_KV.get(id);
        if (!item) {
          return new Response(JSON.stringify({ error: "Memorial não encontrado" }), {
            status: 404,
            headers: { "Content-Type": "application/json" }
          });
        }
        return new Response(item, {
          headers: { "Content-Type": "application/json" }
        });
      }

      // Listar todos
      const list = await env.MEMORIALS_KV.list({ limit: 100 });
      const memorials = [];
      for (const key of list.keys) {
        const data = await env.MEMORIALS_KV.get(key.name);
        if (data) memorials.push(JSON.parse(data));
      }
      return new Response(JSON.stringify(memorials), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // Resposta padrão caso o KV não esteja configurado ainda
    return new Response(JSON.stringify({
      status: "online",
      message: "API ativa. Modo local/fallback habilitado."
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const data = await request.json();
    if (!data || !data.id || !data.nome) {
      return new Response(JSON.stringify({ error: "Dados incompletos" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (env && env.MEMORIALS_KV) {
      await env.MEMORIALS_KV.put(data.id, JSON.stringify(data));
      return new Response(JSON.stringify({ success: true, id: data.id }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ success: true, localOnly: true }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
