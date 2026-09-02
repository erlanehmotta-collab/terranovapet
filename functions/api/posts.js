export async function onRequestGet(context) {
  const { env } = context;
  try {
    if (env.DB) {
      const { results } = await env.DB.prepare("SELECT * FROM posts ORDER BY created_at DESC LIMIT 50").all();
      return Response.json({ success: true, posts: results });
    }
    return Response.json({ success: true, posts: [] });
  } catch(e) {
    return Response.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function onRequestPost(context) {
  const { env, request } = context;
  try {
    const data = await request.json();
    if (!data.id || !data.petNome) {
      return Response.json({ success: false, error: "Dados inválidos" }, { status: 400 });
    }

    if (env.DB) {
      await env.DB.prepare(`
        INSERT INTO posts (id, pet_nome, tutor, pet_foto, midia_url, legenda, patinhas, horario, cidade, comentarios_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET patinhas = excluded.patinhas, comentarios_json = excluded.comentarios_json
      `).bind(data.id, data.petNome, data.tutor || "", data.petFoto || "", data.midiaUrl || "", data.legenda || "", data.patinhas || 0, data.horario || "Agora", data.cidade || "Montes Claros - MG", JSON.stringify(data.comentarios || [])).run();

      return Response.json({ success: true, id: data.id });
    }

    return Response.json({ success: true, id: data.id });
  } catch(e) {
    return Response.json({ success: false, error: e.message }, { status: 500 });
  }
}
