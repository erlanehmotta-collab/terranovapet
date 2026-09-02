export async function onRequestGet(context) {
  const { env } = context;
  try {
    if (env.DB) {
      const { results } = await env.DB.prepare("SELECT email, nome, cargo, super_admin, created_at FROM acessos_mestres").all();
      return Response.json({ success: true, mestres: results });
    }
    return Response.json({ success: false, mestres: [] });
  } catch(e) {
    return Response.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function onRequestPost(context) {
  const { env, request } = context;
  try {
    const data = await request.json();
    const { tipo, email, senha, nome, cargo } = data;

    if (!email || !senha) {
      return Response.json({ success: false, error: "E-mail e senha são obrigatórios" }, { status: 400 });
    }

    if (env.DB) {
      if (tipo === "tutor") {
        await env.DB.prepare(`
          INSERT INTO tutores (email, senha, nome, pet_nome, pet_raca, pet_foto, cidade)
          VALUES (?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(email) DO UPDATE SET senha = excluded.senha, nome = excluded.nome
        `).bind(email.toLowerCase(), senha, nome || "Tutor", data.petNome || "Thor", data.petRaca || "Pet", data.petFoto || "", data.cidade || "Montes Claros - MG").run();
      } else {
        await env.DB.prepare(`
          INSERT INTO acessos_mestres (email, senha, nome, cargo, super_admin)
          VALUES (?, ?, ?, ?, ?)
          ON CONFLICT(email) DO UPDATE SET senha = excluded.senha, nome = excluded.nome, cargo = excluded.cargo
        `).bind(email.toLowerCase(), senha, nome || "Administrador", cargo || "Mestre", data.superAdmin ? 1 : 0).run();
      }

      return Response.json({ success: true, email: email.toLowerCase() });
    }

    return Response.json({ success: true, email: email.toLowerCase() });
  } catch(e) {
    return Response.json({ success: false, error: e.message }, { status: 500 });
  }
}
