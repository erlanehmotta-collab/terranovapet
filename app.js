/**
 * Terranova Pet — Módulo Central de Segurança, Estabilidade e Ciclo de Vida do Pet
 * Suporta:
 * 1. MODO COLEIRA INTELIGENTE (PET VIVO): Identificação anti-perda, telefones, WhatsApp, endereço opcional e botão GPS.
 * 2. MODO MEMORIAL (PÓS-MORTE): Homenagem solene com vela virtual, cartas reconfortantes e áudio.
 */

const TerranovaApp = (function() {
  const STORAGE_KEY_MEMORIALS = "terranova_pets_store_v3";
  const STORAGE_KEY_CONFIG = "terranova_sec_cfg";
  const MAX_FAILED_ATTEMPTS = 5;
  const LOCKOUT_DURATION_MS = 5 * 60 * 1000;

  // --- 1. SEGURANÇA CRIPTOGRÁFICA (SHA-256) ---
  async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message.trim());
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  }

  function sanitize(str) {
    if (!str) return "";
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  // --- 2. CONTROLE DE TENTATIVAS & LOGIN DO CÓDIGO MESTRE ---
  function getSecurityState() {
    try {
      const cfg = JSON.parse(localStorage.getItem(STORAGE_KEY_CONFIG)) || {};
      return {
        masterHash: cfg.masterHash || null,
        failedAttempts: cfg.failedAttempts || 0,
        lockoutUntil: cfg.lockoutUntil || 0,
        sessionToken: sessionStorage.getItem("terranova_sess") || null
      };
    } catch(e) {
      return { failedAttempts: 0, lockoutUntil: 0, sessionToken: null };
    }
  }

  function saveSecurityState(state) {
    try {
      const current = JSON.parse(localStorage.getItem(STORAGE_KEY_CONFIG)) || {};
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify({ ...current, ...state }));
    } catch(e) {}
  }

  async function authenticateMaster(inputCode) {
    const state = getSecurityState();
    const now = Date.now();

    if (state.lockoutUntil && now < state.lockoutUntil) {
      const remainingSec = Math.ceil((state.lockoutUntil - now) / 1000);
      return {
        success: false,
        locked: true,
        remainingSec,
        message: `Acesso temporariamente bloqueado. Tente novamente em ${remainingSec} segundos.`
      };
    }

    const inputHash = await sha256(inputCode);
    const expectedHash = state.masterHash || (await sha256("TERRANOVA-3620"));

    if (inputHash === expectedHash) {
      saveSecurityState({ failedAttempts: 0, lockoutUntil: 0 });
      const token = "tn_sess_" + Math.random().toString(36).substring(2) + Date.now().toString(36);
      sessionStorage.setItem("terranova_sess", token);
      return { success: true };
    } else {
      const fails = (state.failedAttempts || 0) + 1;
      let lockoutUntil = 0;
      if (fails >= MAX_FAILED_ATTEMPTS) {
        lockoutUntil = now + LOCKOUT_DURATION_MS;
      }
      saveSecurityState({ failedAttempts: fails, lockoutUntil });

      return {
        success: false,
        locked: fails >= MAX_FAILED_ATTEMPTS,
        remainingAttempts: Math.max(0, MAX_FAILED_ATTEMPTS - fails),
        message: fails >= MAX_FAILED_ATTEMPTS
          ? "Muitas tentativas incorretas. Painel bloqueado por 5 minutos."
          : `Código incorreto. Mais ${MAX_FAILED_ATTEMPTS - fails} tentativas.`
      };
    }
  }

  function isSessionValid() {
    return !!sessionStorage.getItem("terranova_sess");
  }

  function logout() {
    sessionStorage.removeItem("terranova_sess");
  }

  async function updateMasterCode(currentCode, newCode) {
    const auth = await authenticateMaster(currentCode);
    if (!auth.success) return auth;

    if (!newCode || newCode.length < 6) {
      return { success: false, message: "O novo código deve ter no mínimo 6 dígitos." };
    }

    const newHash = await sha256(newCode);
    saveSecurityState({ masterHash: newHash });
    return { success: true, message: "Código Mestre atualizado com sucesso!" };
  }

  // --- 3. COMPRESSOR DE IMAGEM INTELIGENTE ---
  function compressImage(file, maxDimension = 1200, quality = 0.82) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = function(event) {
        const img = new Image();
        img.onerror = reject;
        img.onload = function() {
          let width = img.width;
          let height = img.height;

          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          resolve(canvas.toDataURL("image/jpeg", quality));
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  // --- 4. BANCO DE DADOS LOCAL COM DADOS PADRÃO ---
  const DEFAULT_PETS = [
    {
      id: "thor-3620",
      status: "memorial", // "vivo" ou "memorial"
      nome: "Thor",
      raca: "Golden Retriever",
      nasc: "2012",
      partida: "2026",
      nfcCode: "TN-THOR-3620",
      subtitulo: "Nosso leal companheiro e o coração da nossa casa",
      fotoPrincipal: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80",
      galeria: [
        "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=350&q=80",
        "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=350&q=80",
        "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=350&q=80"
      ],
      cartaPet: "Mãe, Pai... Por favor, não chorem com tristeza ao pensar em mim. Sei que o silêncio da casa parece grande agora e que vocês ainda esperam ouvir o barulhinho das minhas patinhas no chão ao acordar.\n\nMas quero que saibam: eu parti sentindo todo o amor do mundo. Cada carinho atrás da orelha, cada caminhada no final da tarde e cada noite quentinha aos pés da cama foram os capítulos mais preciosos da minha vida.\n\nAqui onde estou, não sinto cansaço nem dor. Estou livre, correndo por campinas ensolaradas e guardando o amor de vocês no meu peito. Até o nosso reencontro nas estrelas!",
      ponteArcoIris: "Existe um lugar sagrado, do outro lado do céu, chamado a Ponte do Arco-Íris. Quando um companheiro tão puro e leal se despede da Terra, ele chega a um vale verdejante onde o sol nunca se apaga e a água é sempre cristalina.\n\nLá, qualquer fragilidade é restaurada em vigor e alegria. Eles correm e brincam juntos em perfeita paz, até o momento abençoado em que um deles para, ergue as orelhas e olha para o horizonte... Ele avista você chegando, corre ao seu encontro e sela um reencontro que durará por toda a eternidade.",
      velas: 86,
      recados: [
        { autor: "Família Albuquerque", texto: "O Thor trouxe tantas alegrias e foi um verdadeiro protetor para vocês. Força e carinho!", data: "Hoje" }
      ],
      // Dados para quando estava vivo (Plano Pet)
      tutorNome: "Eduardo Silva",
      tutorTelefone: "(38) 99726-3620",
      tutorWhatsapp: "5538997263620",
      exibirEndereco: true,
      tutorEndereco: "Centro, Montes Claros - MG",
      cuidadosMedicos: "Castrado, dócil, vacinas em dia."
    },
    {
      id: "pipoca-4412",
      status: "vivo", // CÃO VIVO - COLEIRA INTELIGENTE DO PLANO TERRANOVA PET
      nome: "Pipoca",
      raca: "Beagle",
      nasc: "2021",
      partida: "",
      nfcCode: "TN-PIPOCA-4412",
      subtitulo: "Pet protegido pelo Plano de Assistência Terranova Pet",
      fotoPrincipal: "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=600&q=80",
      galeria: [],
      tutorNome: "Ana Flávia Miranda",
      tutorTelefone: "(38) 99812-4455",
      tutorWhatsapp: "5538998124455",
      exibirEndereco: false, // Tutor preferiu não exibir o endereço, só o telefone
      tutorEndereco: "Bairro Ibituruna, Montes Claros - MG",
      cuidadosMedicos: "Muito brincalhão e dócil. Tem alergia a frango. Se me encontrar, avise minha mamãe!",
      recompensa: "Gratifica-se com carinho quem encontrar!",
      velas: 0
    }
  ];

  function getPets() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_MEMORIALS);
      if (data) return JSON.parse(data);
      localStorage.setItem(STORAGE_KEY_MEMORIALS, JSON.stringify(DEFAULT_PETS));
      return DEFAULT_PETS;
    } catch(e) {
      return DEFAULT_PETS;
    }
  }

  function getPetById(id) {
    if (!id) return null;
    const list = getPets();
    const clean = id.toLowerCase().trim();
    return list.find(p => 
      p.id.toLowerCase() === clean || 
      p.nome.toLowerCase() === clean ||
      p.id.toLowerCase().startsWith(clean) ||
      (p.nfcCode && p.nfcCode.toLowerCase() === clean)
    ) || null;
  }

  async function savePet(petData) {
    const list = getPets();
    const idx = list.findIndex(p => p.id === petData.id);

    if (idx !== -1) {
      list[idx] = { ...list[idx], ...petData };
    } else {
      list.unshift(petData);
    }

    localStorage.setItem(STORAGE_KEY_MEMORIALS, JSON.stringify(list));

    try {
      fetch("/api/memorials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(petData)
      }).catch(() => {});
    } catch(e) {}

    return petData;
  }

  function deletePet(id) {
    let list = getPets();
    list = list.filter(m => m.id !== id);
    localStorage.setItem(STORAGE_KEY_MEMORIALS, JSON.stringify(list));
  }

  // Alternar entre Cão Vivo (Coleira) e Memorial (Pós-Morte)
  async function togglePetStatus(id) {
    const pet = getPetById(id);
    if (!pet) return null;

    pet.status = pet.status === "vivo" ? "memorial" : "vivo";
    if (pet.status === "memorial" && !pet.partida) {
      pet.partida = new Date().getFullYear().toString();
    }
    await savePet(pet);
    return pet;
  }

  // --- 5. ÁUDIO SUAVE ---
  let audioCtx = null;
  let musicLoop = null;

  function initAudio() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") audioCtx.resume();
  }

  function playBellTone(freq = 523.25, duration = 3.2) {
    try {
      initAudio();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.03, audioCtx.currentTime + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration + 0.1);
    } catch(e) {}
  }

  function toggleComfortMusic(onPlayStateChange) {
    initAudio();
    if (musicLoop) {
      clearInterval(musicLoop);
      musicLoop = null;
      if (onPlayStateChange) onPlayStateChange(false);
      return false;
    } else {
      const playChords = () => {
        const chord = [261.63, 329.63, 392.00, 493.88, 523.25];
        chord.forEach((note, idx) => {
          setTimeout(() => playBellTone(note, 3.5), idx * 280);
        });
      };
      playChords();
      musicLoop = setInterval(playChords, 4500);
      if (onPlayStateChange) onPlayStateChange(true);
      return true;
    }
  }

  return {
    sanitize,
    authenticateMaster,
    isSessionValid,
    logout,
    updateMasterCode,
    compressImage,
    getPets,
    getPetById,
    savePet,
    deletePet,
    togglePetStatus,
    playBellTone,
    toggleComfortMusic
  };
})();
