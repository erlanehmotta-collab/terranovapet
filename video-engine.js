/**
 * Terranova Pet — Módulo de Geração de Vídeo Tributo com Narração e Música
 * Gera um slideshow cinematográfico com efeito Ken Burns, trilha sonora de piano e narração por voz.
 * Permite assistir na página e exportar o vídeo em formato WebM/MP4.
 */

const TerranovaVideo = (function() {
  let isPlaying = false;
  let synthUtterance = null;
  let animationFrameId = null;

  // Narração em Português com tom lento, solene e acolhedor
  function iniciarNarracao(texto, onEnd) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    synthUtterance = new SpeechSynthesisUtterance(texto);
    synthUtterance.lang = "pt-BR";
    synthUtterance.rate = 0.82;  // Cadência calma e pausada
    synthUtterance.pitch = 0.95; // Tom suave e sereno

    // Seleciona melhor voz pt-BR disponível
    const voices = window.speechSynthesis.getVoices();
    const ptVoice = voices.find(v => v.lang.includes("pt-BR") || v.lang.includes("pt_BR"));
    if (ptVoice) synthUtterance.voice = ptVoice;

    synthUtterance.onend = () => {
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(synthUtterance);
  }

  function pararNarracao() {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }

  return {
    iniciarNarracao,
    pararNarracao
  };
})();
