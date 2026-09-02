// Cloudflare Pages Function: /api/pets
// Compatível com Cloudflare KV ou retorno seguro

const DEFAULT_PETS = [
  {
    "id": "thor",
    "status": "memorial",
    "tipo": "memorial",
    "nome": "Thor",
    "raca": "Golden Retriever",
    "nasc": "2012",
    "partida": "2026",
    "subtitulo": "Nosso leal companheiro e eterno anjo da família",
    "tutorNome": "Família Miranda",
    "tutorEmail": "familia.miranda@gmail.com",
    "cidade": "Montes Claros - MG",
    "fotoPrincipal": "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1200&q=95",
    "galeria": [
      "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=1200&q=95",
      "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1200&q=95",
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=1200&q=95"
    ],
    "historias": "Ele adorava correr pelo quintal com a bolinha amarela e quando eu chegava cansado do trabalho, vinha apoiar a cabecinha no meu colo. O apelido carinhoso dele era 'Gordinho' e ele roubava meias só para ver a gente correr atrás dele brincando.",
    "cartaPet": "Mãe, Pai... Por favor, não chorem com tristeza ao pensar em mim. Sei que o silêncio da casa parece grande agora, mas quero que saibam: eu parti sentindo todo o amor do mundo! Cada carinho atrás da orelha, cada caminhada no entardecer e cada noite quentinha aos pés da cama foram os capítulos mais preciosos da minha vida. Estou correndo livre no paraíso e guardando vocês para sempre no meu coração!",
    "velas": 142
  }
];

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const id = (url.searchParams.get("id") || url.searchParams.get("pet") || "").toLowerCase().trim();

  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  try {
    if (env && env.PETS_KV) {
      if (id) {
        const item = await env.PETS_KV.get(id);
        if (item) return new Response(item, { headers });
      } else {
        const list = await env.PETS_KV.list({ limit: 100 });
        const arr = [];
        for (const key of list.keys) {
          const val = await env.PETS_KV.get(key.name);
          if (val) arr.push(JSON.parse(val));
        }
        return new Response(JSON.stringify(arr), { headers });
      }
    }

    if (id) {
      const found = DEFAULT_PETS.find(p => p.id === id || p.nome.toLowerCase() === id);
      return new Response(JSON.stringify(found || null), { headers });
    }
    return new Response(JSON.stringify(DEFAULT_PETS), { headers });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
  }
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  try {
    const data = await request.json();
    if (!data || !data.nome) {
      return new Response(JSON.stringify({ error: "Nome é obrigatório" }), { status: 400, headers });
    }
    const id = data.id || data.nome.toLowerCase().replace(/[^a-z0-9]/g, "-");
    data.id = id;

    if (env && env.PETS_KV) {
      await env.PETS_KV.put(id, JSON.stringify(data));
    }

    return new Response(JSON.stringify({ success: true, id, pet: data }), { headers });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}
