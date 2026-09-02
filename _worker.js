export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    let pathname = url.pathname;

    // Roteamento amigável
    if (pathname === "/" || pathname === "/mural" || pathname === "/estrelinhas") {
      url.pathname = "/mural.html";
      return env.ASSETS ? env.ASSETS.fetch(new Request(url, request)) : fetch(request);
    }
    if (pathname === "/memorial") {
      url.pathname = "/memorial.html";
      return env.ASSETS ? env.ASSETS.fetch(new Request(url, request)) : fetch(request);
    }
    if (pathname === "/gerador") {
      url.pathname = "/gerador.html";
      return env.ASSETS ? env.ASSETS.fetch(new Request(url, request)) : fetch(request);
    }
    if (pathname === "/social") {
      url.pathname = "/social.html";
      return env.ASSETS ? env.ASSETS.fetch(new Request(url, request)) : fetch(request);
    }
    if (pathname === "/vendas") {
      url.pathname = "/vendas.html";
      return env.ASSETS ? env.ASSETS.fetch(new Request(url, request)) : fetch(request);
    }

    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }
    return fetch(request);
  }
};
