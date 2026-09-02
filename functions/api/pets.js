export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const idParam = (url.searchParams.get("id") || url.searchParams.get("pet") || "").toLowerCase().trim();

  try {
    if (env.DB) {
      if (idParam) {
        const pet = await env.DB.prepare(
          "SELECT * FROM pets WHERE lower(id) = ? OR lower(tag_code) = ? OR lower(nfc_code) = ? OR lower(nome) = ?"
        ).bind(idParam, idParam, idParam, idParam).first();

        if (pet) {
          if (pet.galeria_json) {
            try { pet.galeria = JSON.parse(pet.galeria_json); } catch(e) {}
          }
          return Response.json({ success: true, pet });
        }
      } else {
        const { results } = await env.DB.prepare("SELECT * FROM pets ORDER BY created_at DESC LIMIT 100").all();
        return Response.json({ success: true, pets: results });
      }
    }
    return Response.json({ success: false, message: "DB indisponível ou pet não encontrado" }, { status: 404 });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function onRequestPost(context) {
  const { env, request } = context;

  try {
    const data = await request.json();
    if (!data || (!data.id && !data.nome)) {
      return Response.json({ success: false, error: "Dados inválidos" }, { status: 400 });
    }

    const id = (data.id || data.nome).toLowerCase().replace(/[^a-z0-9]/g, "-");
    const tagCode = data.tagCode || data.tag || data.nfcCode || data.id || "TN-" + id.toUpperCase() + "-3620";
    const nfcCode = data.nfcCode || data.nfc || tagCode;
    const nome = data.nome || id;
    const raca = data.raca || "Anjinho Amado";
    const tutorNome = data.tutorNome || data.tutor || "Família";
    const tutorEmail = data.tutorEmail || "";
    const cidade = data.cidade || "Montes Claros - MG";
    const status = data.status || "memorial";
    const nasc = data.nasc || "2012";
    const partida = data.partida || "2026";
    const subtitulo = data.subtitulo || "Nosso leal companheiro e eterno anjo da família";
    const historias = data.historias || data.frase || "";
    const cartaPet = data.cartaPet || "";
    const fotoPrincipal = data.fotoPrincipal || "";
    const galeriaJson = JSON.stringify(data.galeria || [fotoPrincipal]);
    const velas = data.velas || 1;

    if (env.DB) {
      await env.DB.prepare(`
        INSERT INTO pets (id, tag_code, nfc_code, nome, raca, tutor_nome, tutor_email, cidade, status, nasc, partida, subtitulo, historias, carta_pet, foto_principal, galeria_json, velas)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          tag_code = excluded.tag_code,
          nfc_code = excluded.nfc_code,
          nome = excluded.nome,
          raca = excluded.raca,
          tutor_nome = excluded.tutor_nome,
          tutor_email = excluded.tutor_email,
          cidade = excluded.cidade,
          status = excluded.status,
          nasc = excluded.nasc,
          partida = excluded.partida,
          subtitulo = excluded.subtitulo,
          historias = excluded.historias,
          carta_pet = excluded.carta_pet,
          foto_principal = excluded.foto_principal,
          galeria_json = excluded.galeria_json,
          velas = excluded.velas
      `).bind(id, tagCode, nfcCode, nome, raca, tutorNome, tutorEmail, cidade, status, nasc, partida, subtitulo, historias, cartaPet, fotoPrincipal, galeriaJson, velas).run();

      return Response.json({ success: true, id, tagCode });
    }

    return Response.json({ success: true, id, note: "Memória temporária" });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}
