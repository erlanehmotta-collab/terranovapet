/**
 * Terranova Pet — Motor Cinematográfico Estilo CapCut "Heaven / Run Free"
 * Efeitos celestiais:
 * - Raios solares divinos (God Rays)
 * - Partículas de luz dourada flutuantes (Sparkles / Fairy Dust)
 * - Nuvens celestiais e névoa etérea
 * - Auréola dourada brilhante sobre o anjinho
 * - Transições suaves com zoom (Ken Burns) e flash branco angelical
 * - Legendas no estilo CapCut com brilho dourado
 * - Narração com voz meiga de anjinho + Trilha de piano orquestral
 */

class TerranovaHeavenVideo {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.width = canvas.width = options.width || 720;
    this.height = canvas.height = options.height || 1280; // 9:16 Vertical CapCut
    this.fotos = options.fotos || [];
    this.nomePet = options.nomePet || "Anjinho";
    this.isPlaying = false;
    this.startTime = 0;
    this.currentSlideIndex = 0;
    this.particles = [];
    this.initParticles(60);

    this.historias = options.historias || "";

    // Frases estilo "Run Free / Heaven" adaptadas com as histórias do pet
    if (this.historias) {
      this.frases = [
        { texto: `Corra livre no paraíso, doce ${this.nomePet}...`, tempo: 0, duracao: 6 },
        { texto: `Lembra das nossas histórias? ${this.historias.substring(0, 85)}...`, tempo: 6, duracao: 9 },
        { texto: "Obrigado por cada abraço, carinho e por tanto amor.", tempo: 15, duracao: 6 },
        { texto: "Serei sua estrelinha protetora para sempre. Até o nosso reencontro!", tempo: 21, duracao: 8 }
      ];
    } else {
      this.frases = [
        { texto: `Corra livre no paraíso, doce ${this.nomePet}...`, tempo: 0, duracao: 6 },
        { texto: "Aqui não sinto cansaço nem dor...", tempo: 6, duracao: 6 },
        { texto: "Obrigado por cada abraço e por tanto amor.", tempo: 12, duracao: 6 },
        { texto: "Serei sua estrelinha protetora para sempre. Até o nosso reencontro!", tempo: 18, duracao: 8 }
      ];
    }

    this.imagesLoaded = [];
    this.loadImages();
  }

  initParticles(count) {
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 3 + 1,
        speedY: Math.random() * 0.8 + 0.3,
        speedX: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.8 + 0.2,
        pulseSpeed: Math.random() * 0.03 + 0.01
      });
    }
  }

  loadImages() {
    this.imagesLoaded = [];
    this.fotos.forEach(src => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = src;
      this.imagesLoaded.push(img);
    });
  }

  start() {
    this.isPlaying = true;
    this.startTime = performance.now();
    this.narrarComVozAnjinho();
    this.loop();
  }

  stop() {
    this.isPlaying = false;
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  }

  narrarComVozAnjinho() {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    let scriptCompleto;
    if (this.historias) {
      scriptCompleto = [
        `Mãezinha... Paizinho... Eu cheguei ao céu!`,
        `Eu nunca vou esquecer tudo o que a gente viveu... ${this.historias}`,
        `Obrigado por cada abraço, cada carinho na barriguinha e por me amarem tanto.`,
        `O céu ganhou a estrelinha mais feliz. Eu vou cuidar de vocês lá de cima para sempre!`
      ];
    } else {
      scriptCompleto = [
        `Mãezinha... Paizinho... Eu cheguei ao céu!`,
        `Corro livre no paraíso... Não sintam dor nem tristeza, porque eu estou em paz.`,
        `Obrigado por cada abraço, cada carinho na barriguinha e por me amarem tanto.`,
        `O céu ganhou a estrelinha mais feliz. Eu vou cuidar de vocês lá de cima para sempre!`
      ];
    }

    let idx = 0;
    const falar = () => {
      if (!this.isPlaying || idx >= scriptCompleto.length) return;
      const utter = new SpeechSynthesisUtterance(scriptCompleto[idx]);
      utter.lang = "pt-BR";
      utter.rate = 0.83;  // Tom calmo e carinhoso
      utter.pitch = 1.38; // Voz meiga de anjinho/criança

      const voices = window.speechSynthesis.getVoices();
      const ptVoice = voices.find(v => (v.lang.includes("pt-BR") || v.lang.includes("pt_BR")) && 
        (v.name.includes("Luciana") || v.name.includes("Maria") || v.name.includes("Francisca") || v.name.includes("Google") || v.name.includes("Yara")));
      if (ptVoice) utter.voice = ptVoice;

      utter.onend = () => {
        idx++;
        setTimeout(falar, 1200);
      };
      window.speechSynthesis.speak(utter);
    };
    falar();
  }

  loop() {
    if (!this.isPlaying) return;
    const now = performance.now();
    const elapsed = (now - this.startTime) / 1000;

    this.render(elapsed);
    requestAnimationFrame(() => this.loop());
  }

  render(elapsed) {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    // 1. Fundo Celestial (Gradiente Dourado & Céu Eéreo)
    const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
    skyGrad.addColorStop(0, "#FCE7C8");    // Céu dourado de sol
    skyGrad.addColorStop(0.3, "#E89F67");  // Âmbar suave
    skyGrad.addColorStop(0.7, "#D97724");  // Terracota suave Terranova
    skyGrad.addColorStop(1, "#4A2810");    // Base aconchegante
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h);

    // 2. Desenha Raios de Sol Divinos (God Rays)
    ctx.save();
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = "#FFF7E6";
    const rayAngle = Math.sin(elapsed * 0.2) * 0.05;
    for (let r = 0; r < 7; r++) {
      ctx.beginPath();
      ctx.moveTo(w / 2, -50);
      const angle = (r - 3) * 0.22 + rayAngle;
      ctx.lineTo(w / 2 + Math.tan(angle) * h - 80, h);
      ctx.lineTo(w / 2 + Math.tan(angle) * h + 80, h);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();

    // 3. Foto do Pet em Moldura Celestial com Efeito Ken Burns
    const slideDuration = 6.5;
    const slideIdx = Math.floor(elapsed / slideDuration) % Math.max(1, this.imagesLoaded.length);
    const slideProgress = (elapsed % slideDuration) / slideDuration;
    const img = this.imagesLoaded[slideIdx];

    if (img && img.complete) {
      ctx.save();
      
      // Flash branco celestial na transição
      if (slideProgress < 0.12) {
        const flashAlpha = 1 - (slideProgress / 0.12);
        ctx.fillStyle = `rgba(255, 255, 255, ${flashAlpha * 0.6})`;
      }

      // Máscara Oval / Portal Celestial
      const centerX = w / 2;
      const centerY = h * 0.44;
      const photoRadiusX = w * 0.38;
      const photoRadiusY = h * 0.26;

      // Auréola Dourada Pulsante em volta da foto
      ctx.save();
      const haloGlow = Math.sin(elapsed * 2.5) * 8 + 20;
      ctx.shadowColor = "#FFD700";
      ctx.shadowBlur = haloGlow;
      ctx.strokeStyle = "rgba(255, 240, 180, 0.85)";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, photoRadiusX + 6, photoRadiusY + 6, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Recorte da Foto
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, photoRadiusX, photoRadiusY, 0, 0, Math.PI * 2);
      ctx.clip();

      // Zoom lento (Ken Burns 1.0 -> 1.1)
      const scale = 1.0 + slideProgress * 0.1;
      const drawW = photoRadiusX * 2 * scale;
      const drawH = photoRadiusY * 2 * scale;
      ctx.drawImage(img, centerX - drawW / 2, centerY - drawH / 2, drawW, drawH);
      ctx.restore();

      // Asas de Anjo / Auréola Flutuante Acima da Foto
      ctx.save();
      ctx.font = "40px sans-serif";
      ctx.textAlign = "center";
      const haloY = centerY - photoRadiusY - 20 + Math.sin(elapsed * 2) * 5;
      ctx.shadowColor = "#FFD700";
      ctx.shadowBlur = 15;
      ctx.fillText("✨ 🕊️ ✨", centerX, haloY);
      ctx.restore();
    }

    // 4. Partículas Douradas (Fairy Dust / Sparkles)
    ctx.save();
    this.particles.forEach(p => {
      p.y -= p.speedY;
      p.x += p.speedX;
      p.alpha += Math.sin(elapsed * 3) * p.pulseSpeed;

      if (p.y < 0) {
        p.y = h;
        p.x = Math.random() * w;
      }

      ctx.fillStyle = `rgba(255, 245, 200, ${Math.max(0.1, Math.min(0.9, p.alpha))})`;
      ctx.shadowColor = "#FFF";
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();

    // 5. Nuvens Celestiais na Base (Efeito Névoa Suave)
    ctx.save();
    const cloudGrad = ctx.createLinearGradient(0, h * 0.72, 0, h);
    cloudGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
    cloudGrad.addColorStop(0.4, "rgba(255, 250, 240, 0.6)");
    cloudGrad.addColorStop(1, "rgba(255, 255, 255, 0.95)");
    ctx.fillStyle = cloudGrad;
    ctx.fillRect(0, h * 0.72, w, h * 0.28);
    ctx.restore();

    // 6. Tipografia e Legendas Estilo CapCut ("Run Free")
    ctx.save();
    ctx.textAlign = "center";

    // Nome do Pet em destaque dourado
    ctx.font = "bold 44px 'Playfair Display', serif";
    ctx.fillStyle = "#FFFFFF";
    ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
    ctx.shadowBlur = 12;
    ctx.fillText(this.nomePet, w / 2, h * 0.16);

    ctx.font = "italic 20px 'Playfair Display', serif";
    ctx.fillStyle = "#FFE8B8";
    ctx.fillText("Run Free in Heaven • Descanse em Paz", w / 2, h * 0.19);

    // Legenda Narrada Sincronizada (com fundo elegante tipo CapCut)
    const fraseAtual = this.frases.find(f => elapsed >= f.tempo && elapsed < f.tempo + f.duracao) || this.frases[this.frases.length - 1];
    if (fraseAtual) {
      const boxY = h * 0.82;
      ctx.font = "italic 24px 'Playfair Display', serif";
      ctx.fillStyle = "#384852";
      ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
      ctx.shadowBlur = 4;
      
      // Quebra texto em 2 linhas se necessário
      this.wrapText(ctx, `"${fraseAtual.texto}"`, w / 2, boxY, w * 0.82, 32);
    }

    // Selo Terranova Pet no Rodapé
    ctx.font = "bold 15px 'Plus Jakarta Sans', sans-serif";
    ctx.fillStyle = "#A85D1A";
    ctx.shadowBlur = 0;
    ctx.fillText("🐾 Terranova Pet Memorial", w / 2, h * 0.96);

    ctx.restore();
  }

  wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(" ");
    let line = "";
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, x, y);
        line = words[n] + " ";
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y);
  }
}

window.TerranovaHeavenVideo = TerranovaHeavenVideo;
